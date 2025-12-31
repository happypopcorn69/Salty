# SALTY Brand Hierarchy Implementation

## Brand System

**Primary brand**: **SALTY** (the attitude, the flag, the sticker on the laptop)
**Secondary descriptor**: **saltworks** (the facility, the doctrine, the system)

This gives us:
- A punchy "what is it" word (**SALTY**)
- A solid "what kind of thing is it" word (**saltworks**)
- Flexibility for future expansion (SALTY/field-manual, SALTY/loadout, SALTY/dr1pprint)

---

## Implementation Details

### 1. Browser Title
```html
<title>SALTY | saltworks</title>
```

### 2. Meta Description
```html
<meta name="description" content="SALTY - Electrolytes for people who actually do things...">
```

### 3. Logo Lockup (Header)
```html
<a href="#hero" class="logo">
    <span class="logo-primary">SALTY</span>
    <span class="logo-secondary">saltworks</span>
</a>
```

**Desktop**: Horizontal layout with baseline alignment
```
SALTY saltworks
```

**Mobile (< 400px)**: Stacks vertically
```
SALTY
saltworks
```

### 4. Footer Copyright
```html
<p class="copyright">&copy; 2025 SALTY / saltworks. All rights reserved.</p>
```

### 5. Legal Text
```html
<p class="legal-text">SALTY is not medical advice...</p>
```

---

## CSS Implementation

### Logo Styles
```css
.logo {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    text-decoration: none;
    line-height: 1;
}

.logo-primary {
    font-size: var(--text-xl);      /* Large, bold */
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--color-black);
}

.logo-secondary {
    font-size: var(--text-sm);      /* Smaller, lighter */
    font-weight: 400;
    letter-spacing: 0.05em;
    color: var(--color-text-light); /* Muted gray */
}

.logo:hover .logo-primary,
.logo:hover .logo-secondary {
    color: var(--color-primary);    /* Both turn ocean blue on hover */
}
```

### Mobile Responsive (< 400px)
```css
@media (max-width: 400px) {
    .logo {
        flex-direction: column;     /* Stack vertically */
        align-items: flex-start;
        gap: 0.15rem;
    }

    .logo-secondary {
        font-size: 0.7rem;          /* Even smaller on tiny screens */
    }
}
```

---

## Visual Hierarchy

| Element | Size | Weight | Color | Role |
|---------|------|--------|-------|------|
| **SALTY** | XL (1.5rem+) | 800 (Extra Bold) | Black | Primary identifier |
| **saltworks** | SM (0.875rem) | 400 (Regular) | Gray | Context/descriptor |

---

## Why This Works

1. **Memorable**: SALTY is short, punchy, and sticks in your head
2. **Clear hierarchy**: The visual difference makes it obvious which is the brand and which is the category
3. **Scalable**: SALTY can grow into other offerings without confusion
4. **Intentional**: The two-part lockup looks designed, not accidental
5. **Mobile-friendly**: Gracefully stacks on tiny screens without looking weird

---

## Future Expansion Examples

- **SALTY | field-manual** (dedicated page for protocols)
- **SALTY | loadout** (product recommendations)
- **SALTY | dr1pprint** (sweat testing tracker)
- **SALTY | endurance-lab** (research/science section)

The brand system supports both standalone **SALTY** (for merch, social, stickers) and qualified **SALTY / [descriptor]** (for specific offerings).

---

**ur welcome**
