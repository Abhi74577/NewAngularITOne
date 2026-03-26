# Login Component - Visual Reference Guide

## 🎨 Component Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│  ╔═════════════════════════════════════╗   │
│  ║                                     ║   │
│  ║          ┌─────────────┐           ║   │
│  ║          │   📌 LOGO   │           ║   │ Loading Screen
│  ║          └─────────────┘           ║   │
│  ║                                     ║   │
│  ║      ITOne Remote IT Support       ║   │
│  ║                                     ║   │
│  ╠─────────────────────────────────────╣   │
│  ║                                     ║   │
│  ║  User ID / Email                    ║   │
│  ║  ┌─────────────────────────────────┐ ║  │
│  ║  │ 👤 email@example.com           │ ║  │ Form Fields
│  ║  └─────────────────────────────────┘ ║  │
│  ║                                     ║   │
│  ║  Password                           ║   │
│  ║  ┌─────────────────────────────────┐ ║  │
│  ║  │ 🔒 ••••••••••••••••••••••• 👁  │ ║  │ Password with
│  ║  └─────────────────────────────────┘ ║  │ toggle button
│  ║                                     ║   │
│  ║  ☐ Remember me                      ║   │ Checkbox
│  ║                                     ║   │
│  ║  ┌─────────────────────────────────┐ ║  │
│  ║  │      ✓ Sign In                 │ ║  │ Submit button
│  ║  └─────────────────────────────────┘ ║  │
│  ║                                     ║   │
│  ║       Forgot your password?         ║   │ Links
│  ║                                     ║   │
│  ╠─────────────────────────────────────╣   │
│  ║  Don't have an account? Sign up     ║   │
│  ║                                     ║   │
│  ╚═════════════════════════════════════╝   │
│                                             │
│         Floating decorative shapes         │
└─────────────────────────────────────────────┘
```

## 🎭 Color Palette

### Primary Colors
```
Blue (Primary):      #3b82f6 (RGB: 59, 130, 246)
Blue (Dark):         #1e40af (RGB: 30, 64, 175)
Purple (Accent):     #9333ea (RGB: 147, 51, 234)
```

### Neutral Colors
```
White:               #ffffff (RGB: 255, 255, 255)
Gray (50):           #f9fafb (RGB: 249, 250, 251)
Gray (100):          #f3f4f6 (RGB: 243, 244, 246)
Gray (200):          #e5e7eb (RGB: 229, 231, 235)
Gray (700):          #374151 (RGB: 55, 65, 81)
Gray (800):          #1f2937 (RGB: 31, 41, 55)
Gray (900):          #111827 (RGB: 17, 24, 39)
```

### Status Colors
```
Error/Red:           #ef4444 (RGB: 239, 68, 68)
Error/Dark Red:      #dc2626 (RGB: 220, 38, 38)
Error Background:    #fee2e2 (RGB: 254, 226, 226)
Error Border:        #fecaca (RGB: 254, 202, 202)
```

## 📐 Spacing & Sizing

### Card Dimensions
```
Desktop:
  Max Width:         28rem (448px)
  Padding:           2rem (32px)
  Border Radius:     1rem (16px)
  Box Shadow:        0 20px 25px -5px rgba(0, 0, 0, 0.1)

Mobile:
  Max Width:         calc(100% - 2rem)
  Padding:           1.5rem (24px)
  Border Radius:     1.5rem (24px)
```

### Form Elements
```
Label:
  Font Size:         0.875rem (14px)
  Font Weight:       600
  Margin Bottom:     0.5rem (8px)

Input Field:
  Height:            2.75rem (44px)
  Padding Left:      3rem (48px) - icon space
  Padding Right:     3rem (48px) - toggle space
  Border Width:      2px
  Border Radius:     0.5rem (8px)
  Font Weight:       500

Button:
  Height:            2.75rem (44px)
  Font Weight:       600
  Border Radius:     0.5rem (8px)
  Padding:           0.75rem (12px) vertical
```

### Icons
```
Logo Badge:          4rem × 4rem (64px)
Input Icon:          1.25rem × 1.25rem (20px)
Toggle Button:       1.25rem × 1.25rem (20px)
Error Icon:          1.25rem × 1.25rem (20px)
```

## ✨ Animation Specifications

### Card Entry Animation
```
Name:                slideUp
Duration:            600ms
Easing:              cubic-bezier(0.16, 1, 0.3, 1)
Start:               opacity: 0, translateY(40px)
End:                 opacity: 1, translateY(0)
```

### Floating Shapes Animation
```
Name:                float
Duration Shape 1:    6000ms (6s)
Duration Shape 2:    8000ms (8s) - reverse
Duration Shape 3:    7000ms (7s)
Easing:              ease-in-out infinite
Start:               translateY(0) rotate(0deg)
Middle:              translateY(-30px) rotate(180deg)
End:                 translateY(0) rotate(360deg)
```

### Form Fields Fade-In
```
Name:                fadeInUp
Duration:            600ms
Easing:              ease
Stagger Delay:       100ms per field
Start:               opacity: 0, translateY(10px)
End:                 opacity: 1, translateY(0)
```

### Button Hover State
```
Transform Offset:    -0.125rem (-2px) translateY
Shadow Expansion:    0 20px 25px -5px rgba(59, 130, 246, 0.3)
Transition:          300ms all ease
```

### Loading Spinner
```
Name:                spin
Duration:            800ms
Animation:           360deg rotation
Style:               2px border, transparent top
```

### Error Alert Slide
```
Name:                slideInDown
Duration:            300ms
Easing:              cubic-bezier(0.16, 1, 0.3, 1)
Start:               opacity: 0, translateY(-10px)
End:                 opacity: 1, translateY(0)
```

## 🎯 Typography

### Font Stack
```
Font Family:         -apple-system, BlinkMacSystemFont, 'Segoe UI',
                     'Roboto Oxide', 'Oxygen', 'Ubuntu',
                     'Cantarell', sans-serif
```

### Font Sizes & Weights
```
Logo Text:           1.875rem (30px), Bold (font-weight: 700)
Subtitle:            0.875rem (14px), Medium (font-weight: 500)
Label:               0.875rem (14px), Semi-bold (font-weight: 600)
Input Text:          1rem (16px), Medium (font-weight: 500)
Input Placeholder:   1rem (16px), Normal (font-weight: 400)
Link:                0.875rem (14px), Medium (font-weight: 500)
Error Message:       0.875rem (14px), Medium (font-weight: 500)
Button Text:         1rem (16px), Semi-bold (font-weight: 600)
```

## 🔗 Interactive States

### Input Focus State
```
Border Color:        from-gray-200 (#e5e7eb) → to #3b82f6 (blue)
Background:          from-gray-50 (#f9fafb) → to white
Box Shadow:          0 0 0 4px rgba(59, 130, 246, 0.1)
Icon Color:          #9ca3af (#gray-400) → #3b82f6
Transition:          300ms all ease
```

### Input Hover State
```
Border Color:        #d1d5db (gray-300)
Background:          white
Transition:          300ms all ease
```

### Button Hover State
```
Gradient:            from-blue-600 (#2563eb) to-blue-700 (#1d4ed8)
Box Shadow:          0 25px 25px -5px rgba(59, 130, 246, 0.3)
Transform:           translateY(-0.125rem)
Transition:          300ms all ease
```

### Button Active State
```
Transform:           translateY(0.125rem)
Box Shadow:          unchanged
```

### Checkbox Checked State
```
Background:          #3b82f6 (blue)
Border:              #3b82f6 (blue)
Checkmark:           white SVG image
Transition:          200ms all ease
```

## 📊 Responsive Behavior

### Desktop (≥ 1024px)
```
Card Width:          448px (max-w-md)
Card Position:       Center screen
Header Padding:      3rem vertical, 2rem horizontal
Form Padding:        2rem
Font Sizes:          Standard
Shapes Opacity:      0.1
Button:              Full width
```

### Tablet (641px - 1023px)
```
Card Width:          calc(100% - 2rem)
Card Position:       Center with padding
Header Padding:      1.5rem vertical, 1.5rem horizontal
Form Padding:        1.5rem
Font Sizes:          Slightly adjusted
Shapes Opacity:      0.08
Layout:              Responsive adjustments
Profile Name:        Hidden (hidden with @media)
Divider:             Removed
```

### Mobile (≤ 640px)
```
Card Width:          100% with 1rem padding
Card Position:       Full screen with margins
Card Radius:         1.5rem (rounded-xl)
Card Shadow:         0 10px 15px -3px rgba(0,0,0,0.1)
Header Padding:      2rem vertical, 1.5rem horizontal
Form Padding:        1.5rem
Gap Between Fields:  1.25rem (gap-5)
Font Sizes:          Compact
Shapes Opacity:      0.05
Button Height:       2.5rem (py-2.5)
Input Height:        2.5rem (py-2.5)
Profile Button:      Compact padding (6px 8px)
```

## 🎬 State Transitions Timeline

```
Page Load
    ↓
0ms    - Background gradient animates
        - Floating shapes begin float animation
0.2s   - Card slides up
0.4s   - Header fades in
0.6s   → Card fully visible
0.8s   - Form fields begin fade-in
0.9s   - Field 1 (User ID) appears
1.0s   - Field 2 (Password) appears
1.1s   - Field 3 (Remember) appears
1.2s   - Field 4 (Button) appears with glow
1.4s   → All content fully loaded and interactive
```

## 🌓 Dark Mode Adjustments

### Color Shifts
```
Background:          Light gradient → Dark gradient (#1a1a2e to #16213e)
Card:                White (#ffffff) → Dark Gray (#111827)
Text:                Gray-800 → Gray-100
Input BG:            Gray-50 → Gray-800
Input Border:        Gray-200 → Gray-700
```

### Appearance Changes
```
Border Colors:       Lighter → Darker with reduced opacity
Shadows:             More pronounced
Icon Colors:         Adjusted for visibility
Links:               Color adjusted for contrast
```

## 📋 Accessibility Considerations

### Color Contrast
```
Text on White:       Gray-800 (#1f2937) - WCAG AA compliant
Links:               Blue (#3b82f6) with underline on hover
Error Text:          Red (#dc2626) - WCAG AA compliant
Labels:              Gray-700 (#374151) - High contrast
```

### Focus States
```
Outline:             2px solid blue (#3b82f6)
Outline Offset:      0-2px
Ring:                4px shadow with opacity 30%
Visible on keyboard: Yes
Visible on mouse:    Yes maintained for accessibility
```

### Keyboard Navigation
```
Tab Order:           User ID → Password → Remember Me → Login Button
Enter:               Submits form
Space:               Toggles checkbox
Escape:              Could select to clear error
Eye Icon:            Tab accessible, clickable with keyboard
```

---

**Reference Version**: 1.0.0
**Last Updated**: 2024
