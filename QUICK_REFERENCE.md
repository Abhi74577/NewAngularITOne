# 🚀 Quick Reference Guide

## Getting Started (30 seconds)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
http://localhost:4200
```

---

## Common Tasks

### 🎨 Change Theme Colors
**File**: `src/styles.scss`
```scss
:root {
  --color-primary-600: 138, 43, 226;    /* Purple */
  --color-secondary-600: 186, 52, 186;  /* Magenta */
}
```

### 🏢 Change Company Logo
**File**: `src/app/layout/sidebar/sidebar.component.ts`
```typescript
getLogoText(): string {
  return this.isExpanded() ? 'Your Company' : 'YC';
}
```

### ➕ Add Menu Item
**File**: `src/app/core/services/menu.service.ts`
```typescript
{
  id: 'new-item',
  label: 'New Item',
  icon: '📄',
  route: '/new-item',
  children: [/* optional submenu items */]
}
```

### ➕ Add New Page
1. Create component: `ng generate component pages/new-page --standalone`
2. Add route in `app.routes.ts`
3. Add menu item in `menu.service.ts`

### 🚀 Deploy to Production
```bash
# Build
npm run build

# Choose hosting:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - Firebase: firebase deploy
```

---

## File Locations Quick Map

| Need to... | Go to... | File |
|-----------|----------|------|
| Change colors | Styles | `src/styles.scss` |
| Change logo | Sidebar | `src/app/layout/sidebar/sidebar.component.ts` |
| Add menu items | Services | `src/app/core/services/menu.service.ts` |
| Add routes | App | `src/app/app.routes.ts` |
| Style header | Header | `src/app/layout/header/header.component.scss` |
| Style sidebar | Sidebar | `src/app/layout/sidebar/sidebar.component.scss` |
| Change layout | Layout | `src/app/layout/layout.component.ts` |
| Setup config | Config | `app.config.ts` |
| Global styles | Styles | `src/styles.scss` |
| Tailwind config | Config | `tailwind.config.js` |

---

## Component Tree

```
app.component
└── app-layout
    ├── app-header
    │   ├── Sidebar Toggle (Left)
    │   └── Theme Toggle + Profile Dropdown (Right)
    │
    ├── app-sidebar
    │   ├── Logo Section
    │   └── Menu Items
    │       ├── Parent Item
    │       └── Child Items (inline when expanded)
    │
    ├── main-content (router-outlet)
    │   └── app-dashboard (or other pages)
    │       ├── Stats Cards
    │       ├── Chart Section
    │       ├── Activity Section
    │       └── Features Grid
    │
    └── app-footer
        ├── Copyright
        └── Links
```

---

## Key Services

### ThemeService
```typescript
// In any component
constructor(private themeService: ThemeService) {}

// Methods
getTheme()           // Returns 'light' | 'dark'
setTheme(theme)     // Set specific theme
toggleTheme()       // Toggle between light/dark
```

### MenuService
```typescript
// In any component
constructor(private menuService: MenuService) {}

// Methods
getMenuItems()              // Get all menu items
toggleMenuExpand(itemId)    // Toggle expand state
```

---

## Tailwind CSS Classes

### Common Classes Used
```html
<!-- Spacing -->
<div class="p-4 m-2">Padding & Margin</div>

<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">Layout</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">Grid Layout</div>

<!-- Colors -->
<div class="bg-primary-600 text-on-surface">Themed Colors</div>

<!-- Responsive -->
<div class="md:block sm:hidden">Hidden on small screens</div>

<!-- Transitions -->
<div class="transition-all duration-300 hover:bg-gray-100">Animation</div>
```

---

## CSS Variables Available

### Primary Colors (10 shades)
```css
--color-primary-50, 100, 200, 300, 400, 500, 600, 700, 800, 900
```

### Secondary Colors (10 shades)
```css
--color-secondary-50, 100, 200, 300, 400, 500, 600, 700, 800, 900
```

### Surface Colors
```css
--color-surface              /* Main background */
--color-surface-variant      /* Secondary background */
--color-on-surface           /* Main text */
--color-on-surface-variant   /* Secondary text */
```

### Usage
```scss
.my-element {
  color: rgba(var(--color-on-surface));
  background: rgba(var(--color-surface));
  border: 1px solid rgba(var(--color-surface-variant));
}
```

---

## Keyboard Shortcuts

While using the app:
- `Tab` - Navigate through interactive elements
- `Enter` - Activate buttons/links
- `Space` - Toggle buttons
- `Escape` - Close dropdowns (when implemented)

---

## Responsive Breakpoints

```scss
Mobile:        max-width: 480px
Tablet:        max-width: 768px
Desktop:       max-width: 1024px
Large Desktop: 1024px+
```

### How to Use
```scss
@media (max-width: 768px) {
  // Mobile styles
}

@media (min-width: 1024px) {
  // Desktop styles
}
```

---

## Sidebar Behavior

### Expanded (280px)
- Full logo + company name
- All menu labels visible
- Click parent → toggle children inline
- Width transition: 300ms

### Collapsed (80px)
- Logo icon only
- Labels hidden
- **Hover parent → floating submenu** (popover style)
- Submenu animation: 200ms

---

## Theme Colors (RGB Format)

### Light Mode (Default)
```
Primary:      177, 73, 255 (Purple)
Secondary:    207, 91, 207 (Magenta)
Surface:      255, 255, 255 (White)
Text:         31, 31, 31 (Dark Gray)
```

### Dark Mode
```
Primary:      177, 73, 255 (Purple)
Secondary:    207, 91, 207 (Magenta)
Surface:      31, 31, 31 (Dark Gray)
Text:         245, 245, 245 (Light Gray)
```

---

## Performance Tips

### Optimize Bundle
```bash
# Analyze bundle
ng build --stats-json
webpack-bundle-analyzer dist/angular-dashboard/stats.json
```

### Monitor Performance
- Use Chrome DevTools (Lighthouse)
- Target: 90+ scores
- Check Core Web Vitals

### Lazy Load Routes
```typescript
// app.routes.ts
{
  path: 'feature',
  loadComponent: () => import('./feature/feature.component')
    .then(m => m.FeatureComponent)
}
```

---

## Common Issues & Fixes

### Issue: Sidebar not responsive
```
Fix: Check media queries in sidebar.component.scss
     Verify layout margins in layout.component.scss
```

### Issue: Theme not applying
```
Fix: Clear browser cache (Ctrl+Shift+Delete)
     Check localStorage for 'theme' key
     Verify CSS variables in DevTools
```

### Issue: Styles not updating
```
Fix: Save files and wait for rebuild
     Hard refresh (Ctrl+Shift+R)
     Check Tailwind config paths
```

### Issue: Menu not expanding
```
Fix: Check menu.service.ts toggleMenuExpand()
     Verify signal updates trigger change detection
     Check template *ngIf conditions
```

---

## Git Workflow

```bash
# Start feature
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: description"

# Push
git push origin feature/my-feature

# Create PR on GitHub
```

---

## Testing Commands

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Build
ng build

# Build for production
ng build --configuration production

# Serve production build
npm run build && python -m http.server
```

---

## Dependencies Quick View

| Package | Purpose | Version |
|---------|---------|---------|
| @angular/core | Core framework | 19.0.0 |
| @angular/common | Common utilities | 19.0.0 |
| @angular/router | Routing | 19.0.0 |
| rxjs | Reactive library | 7.8.0 |
| tailwindcss | Styling | 3.3.0 |
| typescript | Language | 5.6.0 |

---

## Script Commands

```bash
npm start              # Dev server
npm run build         # Production build
npm run watch         # Watch mode build
npm test              # Run tests
npm run lint          # Check code (if configured)
```

---

## Useful Links

- [Angular Docs](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RxJS Docs](https://rxjs.dev/api)
- [MDN Web Docs](https://developer.mozilla.org)

---

## Feature Cheat Sheet

```
✅ Stands out features:
   • Sidebar with hover submenus (collapsed mode)
   • CSS variables for theming
   • Responsive from mobile to desktop
   • Dark/light mode switching
   • localStorage persistence
   • Smooth 300ms animations
   • Production-ready code
   • Comprehensive documentation
```

---

## Project Stats

```
Files:               39
TypeScript:          13
Templates:           7
Styles (SCSS):       7
Config Files:        7
Documentation:       5

Lines of Code:       ~2,500 (excluding node_modules)
Bundle Size:         ~200 KB (gzipped)
Build Time:          ~10 seconds
```

---

## Next Actions

### Immediate
1. ✅ Run `npm install`
2. ✅ Run `npm start`
3. ✅ Open http://localhost:4200
4. ✅ Explore the app

### Short Term
1. [ ] Customize colors in `src/styles.scss`
2. [ ] Change logo in sidebar component
3. [ ] Modify menu items in menu service
4. [ ] Add your first custom page

### Deploy
1. [ ] Run `npm run build`
2. [ ] Choose hosting (Vercel, Netlify, Firebase)
3. [ ] Follow DEPLOYMENT.md guide
4. [ ] Monitor with Lighthouse

---

## Need Help?

1. **Setup**: See SETUP.md
2. **Features**: See FEATURES.md
3. **Deployment**: See DEPLOYMENT.md
4. **Overview**: See PROJECT_OVERVIEW.md
5. **Quick issues**: Check COMPLETION_CHECKLIST.md

---

**Happy Coding! 🎉**

**Last Updated**: March 23, 2026  
**Version**: 1.0.0
