# SALTY / saltworks

Electrolytes for people who actually do things. Your body is a leaky vessel of electrolytes. Deal with it.

## Overview

SALTY is a premium electrolyte brand built on the principle that your body is equipment, not a temple. This is the official website for the saltworks facility.

**Brand Hierarchy:**
- Primary: SALTY (all caps, bold, dominant)
- Secondary: saltworks (lowercase, supporting)

## Project Structure

```
Saltyworks/
├── src/
│   ├── index.html      # Main site structure
│   ├── styles.css      # Premium dark theme styling
│   └── nav.js          # Mobile navigation functionality
├── tools/
│   └── saltlint.py     # Quality gate compliance checker
└── CONTENT.md          # Content reference
```

## Running Locally

### Method 1: Python HTTP Server

```bash
# Navigate to project root
cd Saltyworks

# Start a local server on port 8000
python -m http.server 8000 --directory src

# Open in browser
# http://localhost:8000
```

### Method 2: Node.js HTTP Server

```bash
# Install http-server globally (one time)
npm install -g http-server

# Start server
http-server src -p 8000

# Open in browser
# http://localhost:8000
```

### Method 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `src/index.html`
3. Select "Open with Live Server"

## Quality Gates

### Running saltlint

Before deploying, always run the brand compliance checker:

```bash
# From project root
python tools/saltlint.py
```

**What it does:**
- Scans all files in `src/` directory
- Detects forbidden words (case-insensitive):
  - sweat
  - sweaty
  - perspire
  - perspiration
- Reports file locations and line numbers
- Exits with error code if violations found

**Example output (passing):**
```
saltlint: Scanning for forbidden words...
Target: C:\Path\To\Saltyworks\src
Forbidden words: sweat, sweaty, perspire, perspiration

[PASS] No forbidden words found. Site is compliant.
```

**Example output (failing):**
```
[FAIL] FORBIDDEN WORDS DETECTED

Total violations: 2
Files affected: 1

File: src/index.html
  Line 45: 'sweaty' found
    ...post-workout sweaty mess...

Brand compliance FAILED. Remove all forbidden words before deploying.
```

### Pre-Deployment Checklist

1. Run `python tools/saltlint.py` - must pass
2. Test all navigation links work
3. Verify mobile responsiveness
4. Check all anchor IDs match nav hrefs
5. Ensure brand hierarchy is maintained (SALTY primary, saltworks secondary)

## Site Sections

All content is sourced verbatim from CONTENT.md. Section order:

1. **Hero** - Main value proposition, CTA to "Why Humans Won"
2. **What Is This** - Origin story, salty super powers, the mech metaphor
3. **The MVP** - Appreciation of the headband as flood control infrastructure
4. **Why Humans Won** - The biological advantage story (endurance cooling system)
5. **The Basics** - Practical electrolyte information (when, what, how, safety)
6. **Field Reports** - Real stories from the facility (Field Report 001: BUS OF SHAME)
7. **Contact** - Email contact information

## Navigation Structure

**Header Nav:**
- What Is This
- The MVP
- Why Humans Won
- The Basics
- Field Reports
- Contact

**Footer Nav:**
- Mirrors header navigation
- Maintains consistency

## Brand Voice Guidelines

- **Direct, no nonsense** - We tell it like it is
- **Equipment mindset** - Your body is a machine that needs maintenance
- **Anti-wellness culture** - No vibes, no toxic positivity
- **Functional focus** - Biology over marketing fluff
- **Signature tagline** - "ur welcome" (lowercase, casual dismissal)

### Forbidden Language

Never use these terms (enforced by saltlint):
- sweat/sweaty
- perspire/perspiration

**Instead use:**
- "saltworks" (the process)
- "mineral loss"
- "sodium output"
- "cooling system operation"

## Styling

- **Theme:** Dark, premium, technical
- **Colors:**
  - Primary accent: `#79d7ff` (cyan)
  - Secondary accent: `#b7ffcf` (mint)
  - Background: Dark gradient with subtle color radials
- **Typography:** System UI fonts, responsive sizing via clamp()
- **Effects:** Subtle hover states, smooth transitions, premium shadows

## Development Notes

- Pure vanilla JavaScript, no frameworks
- No external dependencies (keeps it fast)
- Responsive mobile-first design
- Accessibility features included (skip links, ARIA labels, keyboard nav)
- CSP headers configured in HTML

## License

Proprietary. SALTY / saltworks. All rights reserved.

---

**Stay Salty.**

ur welcome
