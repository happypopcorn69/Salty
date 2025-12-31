/**
 * SALTWORKS - Salinity Index Widget
 *
 * A client-side calculator for estimating sodium loss based on
 * activity duration, temperature, intensity, and humidity.
 *
 * No external API calls. No analytics. No tracking.
 * Pure vanilla JavaScript.
 */

(function() {
    'use strict';

    /**
     * Debounce utility function for performance optimization
     */
    function debounce(fn, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Configuration for the sliders
    const SLIDER_CONFIG = {
        duration: {
            min: 15,
            max: 180,
            step: 15,
            default: 60,
            unit: 'min',
            label: 'Duration'
        },
        temperature: {
            min: 40,
            max: 110,
            step: 5,
            default: 75,
            unit: '\u00B0F',
            label: 'Temperature'
        },
        intensity: {
            min: 1,
            max: 10,
            step: 1,
            default: 5,
            unit: '/10',
            label: 'Intensity'
        },
        humidity: {
            min: 0,
            max: 100,
            step: 10,
            default: 50,
            unit: '%',
            label: 'Humidity'
        }
    };

    // Salinity status messages based on sodium loss level
    const STATUS_MESSAGES = {
        minimal: {
            level: 'MINIMAL',
            levelClass: 'status-minimal',
            messages: [
                "You're barely working. Your body is probably fine.",
                "Light activity detected. Your sodium levels remain unimpressed.",
                "This is more of a warm-up than a workout. Salt can wait."
            ]
        },
        low: {
            level: 'LOW',
            levelClass: 'status-low',
            messages: [
                "Some effort detected. Your minerals are mildly concerned.",
                "Starting to heat up? Good. Stay hydrated.",
                "Your body is beginning to notice. Don't ignore it."
            ]
        },
        moderate: {
            level: 'MODERATE',
            levelClass: 'status-moderate',
            messages: [
                "Now we're talking. Your sodium is leaving the building.",
                "Solid effort. Your electrolytes are working overtime.",
                "This is the zone where preparation pays off."
            ]
        },
        high: {
            level: 'HIGH',
            levelClass: 'status-high',
            messages: [
                "You're hemorrhaging minerals. Replenish or regret it.",
                "Your body is dumping sodium like it's going out of style.",
                "This is not a drill. Your electrolytes need backup."
            ]
        },
        extreme: {
            level: 'EXTREME',
            levelClass: 'status-extreme',
            messages: [
                "You absolute unit. Your body is a sodium evacuation zone.",
                "Peak mineral loss achieved. Recovery is now mandatory.",
                "Congratulations on trying to become completely depleted."
            ]
        }
    };

    // Recommendation templates
    const RECOMMENDATIONS = {
        minimal: "A glass of water will do. Save the salt for when you actually need it.",
        low: "Light hydration recommended. One serving before or after should suffice.",
        moderate: "Pre-load before activity. Consider mid-session replenishment if going longer.",
        high: "Full protocol recommended: Pre-flight, Loadout, and Reset. No shortcuts.",
        extreme: "Deploy all countermeasures. Pre-load heavily, replenish during, and recover aggressively."
    };

    /**
     * Physiological constants for sodium loss calculation
     * Based on general thermoregulation and exercise physiology
     */
    const SODIUM_CALC_CONSTANTS = {
        // Base sodium loss rate: ~500-700mg per hour of moderate exercise
        BASE_LOSS_PER_HOUR_MG: 600,

        // Temperature thresholds and factors (Fahrenheit)
        TEMP_THRESHOLD_MODERATE: 70,  // Where increased cooling begins
        TEMP_THRESHOLD_HIGH: 85,       // Where significant heat stress occurs
        TEMP_FACTOR_MODERATE: 0.02,    // 2% increase per degree above 70F
        TEMP_FACTOR_HIGH: 0.03,        // Additional 3% increase per degree above 85F

        // Intensity factors (exponential relationship to effort)
        INTENSITY_BASE_FACTOR: 0.3,    // Baseline multiplier for low intensity
        INTENSITY_SCALE_FACTOR: 1.4,   // Scaling factor for intensity 1-10

        // Humidity thresholds and factors (percentage)
        HUMIDITY_THRESHOLD_MODERATE: 40,  // Where evaporative cooling becomes harder
        HUMIDITY_THRESHOLD_HIGH: 70,      // Where humidity significantly impairs cooling
        HUMIDITY_FACTOR_MODERATE: 0.01,   // 1% increase per % humidity above 40%
        HUMIDITY_FACTOR_HIGH: 0.015       // Additional 1.5% increase per % above 70%
    };

    /**
     * Calculate estimated sodium loss in milligrams
     * This is a simplified model based on general physiological principles.
     * Not medical advice.
     */
    function calculateSodiumLoss(duration, temperature, intensity, humidity) {
        const CALC = SODIUM_CALC_CONSTANTS;

        // Duration factor (linear with time)
        const durationHours = duration / 60;

        // Temperature factor (increases loss above thresholds)
        let tempFactor = 1;
        if (temperature > CALC.TEMP_THRESHOLD_MODERATE) {
            tempFactor += (temperature - CALC.TEMP_THRESHOLD_MODERATE) * CALC.TEMP_FACTOR_MODERATE;
        }
        if (temperature > CALC.TEMP_THRESHOLD_HIGH) {
            tempFactor += (temperature - CALC.TEMP_THRESHOLD_HIGH) * CALC.TEMP_FACTOR_HIGH;
        }

        // Intensity factor (exponential relationship)
        const intensityFactor = CALC.INTENSITY_BASE_FACTOR + (intensity / 10) * CALC.INTENSITY_SCALE_FACTOR;

        // Humidity factor (higher humidity = harder to cool)
        let humidityFactor = 1;
        if (humidity > CALC.HUMIDITY_THRESHOLD_MODERATE) {
            humidityFactor += (humidity - CALC.HUMIDITY_THRESHOLD_MODERATE) * CALC.HUMIDITY_FACTOR_MODERATE;
        }
        if (humidity > CALC.HUMIDITY_THRESHOLD_HIGH) {
            humidityFactor += (humidity - CALC.HUMIDITY_THRESHOLD_HIGH) * CALC.HUMIDITY_FACTOR_HIGH;
        }

        // Calculate total loss
        const totalLoss = CALC.BASE_LOSS_PER_HOUR_MG * durationHours * tempFactor * intensityFactor * humidityFactor;

        return Math.round(totalLoss);
    }

    /**
     * Sodium loss thresholds for status classification (in mg)
     * Based on typical electrolyte depletion during exercise
     */
    const STATUS_THRESHOLDS = {
        MINIMAL_MAX: 300,   // Light activity, minimal replenishment needed
        LOW_MAX: 600,       // Some effort, basic hydration recommended
        MODERATE_MAX: 1000, // Active session, pre/post protocol advised
        HIGH_MAX: 1500      // Intense activity, full protocol required
        // Above HIGH_MAX = EXTREME
    };

    /**
     * Determine salinity status based on sodium loss
     */
    function getSalinityStatus(sodiumLoss) {
        if (sodiumLoss < STATUS_THRESHOLDS.MINIMAL_MAX) {
            return STATUS_MESSAGES.minimal;
        } else if (sodiumLoss < STATUS_THRESHOLDS.LOW_MAX) {
            return STATUS_MESSAGES.low;
        } else if (sodiumLoss < STATUS_THRESHOLDS.MODERATE_MAX) {
            return STATUS_MESSAGES.moderate;
        } else if (sodiumLoss < STATUS_THRESHOLDS.HIGH_MAX) {
            return STATUS_MESSAGES.high;
        } else {
            return STATUS_MESSAGES.extreme;
        }
    }

    /**
     * Get recommendation based on status level
     */
    function getRecommendation(level) {
        const levelKey = level.toLowerCase();
        return RECOMMENDATIONS[levelKey] || RECOMMENDATIONS.moderate;
    }

    /**
     * Get a random message from the status messages array
     */
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Format sodium loss for display
     */
    function formatSodiumLoss(mg) {
        if (mg >= 1000) {
            return (mg / 1000).toFixed(1) + 'g';
        }
        return mg + 'mg';
    }

    /**
     * Initialize the widget
     */
    function initWidget() {
        const widgetContainer = document.getElementById('salinity-widget');
        if (!widgetContainer) {
            console.warn('Salinity widget container not found');
            return;
        }

        try {
            // Build the widget DOM (XSS-safe)
            const widgetDOM = buildWidgetDOM();
            widgetContainer.innerHTML = ''; // Clear placeholder
            widgetContainer.appendChild(widgetDOM);
            widgetContainer.classList.remove('widget-placeholder');
            widgetContainer.classList.add('widget-active');

        // Get references to elements
        const sliders = {
            duration: document.getElementById('slider-duration'),
            temperature: document.getElementById('slider-temperature'),
            intensity: document.getElementById('slider-intensity'),
            humidity: document.getElementById('slider-humidity')
        };

        const valueDisplays = {
            duration: document.getElementById('value-duration'),
            temperature: document.getElementById('value-temperature'),
            intensity: document.getElementById('value-intensity'),
            humidity: document.getElementById('value-humidity')
        };

        const outputElements = {
            sodiumLoss: document.getElementById('sodium-loss-value'),
            statusLevel: document.getElementById('status-level'),
            statusMessage: document.getElementById('status-message'),
            recommendation: document.getElementById('recommendation-text'),
            statusCard: document.getElementById('status-card')
        };

        // Store last status for message cycling
        let lastStatus = null;

        /**
         * Clamp a value between min and max, with fallback to default
         */
        function clampValue(value, min, max, defaultVal) {
            if (isNaN(value)) return defaultVal;
            return Math.min(Math.max(value, min), max);
        }

        // Update function
        function updateCalculation() {
            const values = {
                duration: clampValue(parseInt(sliders.duration.value, 10),
                                    SLIDER_CONFIG.duration.min,
                                    SLIDER_CONFIG.duration.max,
                                    SLIDER_CONFIG.duration.default),
                temperature: clampValue(parseInt(sliders.temperature.value, 10),
                                       SLIDER_CONFIG.temperature.min,
                                       SLIDER_CONFIG.temperature.max,
                                       SLIDER_CONFIG.temperature.default),
                intensity: clampValue(parseInt(sliders.intensity.value, 10),
                                     SLIDER_CONFIG.intensity.min,
                                     SLIDER_CONFIG.intensity.max,
                                     SLIDER_CONFIG.intensity.default),
                humidity: clampValue(parseInt(sliders.humidity.value, 10),
                                    SLIDER_CONFIG.humidity.min,
                                    SLIDER_CONFIG.humidity.max,
                                    SLIDER_CONFIG.humidity.default)
            };

            // Update value displays
            valueDisplays.duration.textContent = values.duration + ' ' + SLIDER_CONFIG.duration.unit;
            valueDisplays.temperature.textContent = values.temperature + SLIDER_CONFIG.temperature.unit;
            valueDisplays.intensity.textContent = values.intensity + SLIDER_CONFIG.intensity.unit;
            valueDisplays.humidity.textContent = values.humidity + SLIDER_CONFIG.humidity.unit;

            // Calculate sodium loss
            const sodiumLoss = calculateSodiumLoss(
                values.duration,
                values.temperature,
                values.intensity,
                values.humidity
            );

            // Get status
            const status = getSalinityStatus(sodiumLoss);

            // Update outputs
            outputElements.sodiumLoss.textContent = formatSodiumLoss(sodiumLoss);
            outputElements.statusLevel.textContent = status.level;

            // Only change message if status level changed
            if (!lastStatus || lastStatus.level !== status.level) {
                outputElements.statusMessage.textContent = getRandomMessage(status.messages);
                outputElements.recommendation.textContent = getRecommendation(status.level);
            }

            // Update status card class
            outputElements.statusCard.className = 'status-card ' + status.levelClass;

            lastStatus = status;
        }

        // Debounced update for performance (16ms = ~1 frame)
        const debouncedUpdate = debounce(updateCalculation, 16);

        // Attach event listeners to all sliders
        Object.keys(sliders).forEach(function(key) {
            const slider = sliders[key];

            // Update on input with debounce (real-time as slider moves)
            slider.addEventListener('input', debouncedUpdate);

            // Immediate update on change for accessibility
            slider.addEventListener('change', updateCalculation);
        });

        // Initial calculation
        updateCalculation();
        } catch (error) {
            console.error('Widget initialization failed:', error);
            const container = document.getElementById('salinity-widget');
            if (container) {
                container.innerHTML = '';
                const errorMsg = document.createElement('p');
                errorMsg.className = 'widget-error';
                errorMsg.textContent = 'Calculator temporarily unavailable. Please refresh the page.';
                container.appendChild(errorMsg);
            }
        }
    }

    /**
     * Build the widget HTML structure using DOM methods (XSS-safe)
     */
    function buildWidgetDOM() {
        const descriptions = {
            duration: 'How long you\'ll be at it',
            temperature: 'How much the air hates you',
            intensity: '1 = leisurely stroll, 10 = questioning life choices',
            humidity: 'The thickness of said hate'
        };

        // Create main container
        const widgetContent = document.createElement('div');
        widgetContent.className = 'widget-content';

        // Build inputs section
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'widget-inputs';

        const title = document.createElement('h3');
        title.className = 'widget-inputs-title';
        title.textContent = 'Your Activity Profile';
        inputsDiv.appendChild(title);

        // Build each slider
        Object.keys(SLIDER_CONFIG).forEach(function(key) {
            const config = SLIDER_CONFIG[key];
            const sliderGroup = document.createElement('div');
            sliderGroup.className = 'slider-group';

            const label = document.createElement('label');
            label.htmlFor = 'slider-' + key;
            label.className = 'slider-label';

            const labelText = document.createElement('span');
            labelText.className = 'slider-label-text';
            labelText.textContent = config.label;

            const valueSpan = document.createElement('span');
            valueSpan.id = 'value-' + key;
            valueSpan.className = 'slider-value';
            valueSpan.setAttribute('aria-live', 'polite');
            valueSpan.textContent = config.default + (key === 'duration' ? ' ' : '') + config.unit;

            label.appendChild(labelText);
            label.appendChild(valueSpan);

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'slider-' + key;
            slider.className = 'widget-slider';
            slider.min = config.min;
            slider.max = config.max;
            slider.step = config.step;
            slider.value = config.default;
            slider.setAttribute('aria-describedby', 'desc-' + key);

            const description = document.createElement('span');
            description.id = 'desc-' + key;
            description.className = 'slider-description';
            description.textContent = descriptions[key];

            sliderGroup.appendChild(label);
            sliderGroup.appendChild(slider);
            sliderGroup.appendChild(description);
            inputsDiv.appendChild(sliderGroup);
        });

        // Build output section
        const outputDiv = document.createElement('div');
        outputDiv.className = 'widget-output';

        const statusCard = document.createElement('div');
        statusCard.id = 'status-card';
        statusCard.className = 'status-card status-moderate';

        const statusHeader = document.createElement('div');
        statusHeader.className = 'status-header';

        const statusLabel = document.createElement('span');
        statusLabel.className = 'status-label';
        statusLabel.textContent = 'Salinity Status';

        const statusLevel = document.createElement('span');
        statusLevel.id = 'status-level';
        statusLevel.className = 'status-level';
        statusLevel.textContent = 'MODERATE';

        statusHeader.appendChild(statusLabel);
        statusHeader.appendChild(statusLevel);

        const sodiumDisplay = document.createElement('div');
        sodiumDisplay.className = 'sodium-display';

        const sodiumLabel = document.createElement('span');
        sodiumLabel.className = 'sodium-label';
        sodiumLabel.textContent = 'Estimated Sodium Loss';

        const sodiumValue = document.createElement('span');
        sodiumValue.id = 'sodium-loss-value';
        sodiumValue.className = 'sodium-value';
        sodiumValue.textContent = '600mg';

        sodiumDisplay.appendChild(sodiumLabel);
        sodiumDisplay.appendChild(sodiumValue);

        const statusMessage = document.createElement('p');
        statusMessage.id = 'status-message';
        statusMessage.className = 'status-message';
        statusMessage.setAttribute('aria-live', 'polite');
        statusMessage.setAttribute('aria-atomic', 'true');
        statusMessage.textContent = 'Calculating your salt situation...';

        const recommendationDiv = document.createElement('div');
        recommendationDiv.className = 'recommendation';

        const recommendationLabel = document.createElement('span');
        recommendationLabel.className = 'recommendation-label';
        recommendationLabel.textContent = 'The Verdict';

        const recommendationText = document.createElement('p');
        recommendationText.id = 'recommendation-text';
        recommendationText.className = 'recommendation-text';
        recommendationText.textContent = 'Adjust the sliders to see your personalized assessment.';

        recommendationDiv.appendChild(recommendationLabel);
        recommendationDiv.appendChild(recommendationText);

        statusCard.appendChild(statusHeader);
        statusCard.appendChild(sodiumDisplay);
        statusCard.appendChild(statusMessage);
        statusCard.appendChild(recommendationDiv);

        outputDiv.appendChild(statusCard);

        widgetContent.appendChild(inputsDiv);
        widgetContent.appendChild(outputDiv);

        return widgetContent;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

})();
