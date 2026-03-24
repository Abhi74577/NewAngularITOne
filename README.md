# Angular Dashboard Application

A modern, responsive dashboard web application built with **Angular 19**, **Tailwind CSS**, and a complete **Theme System** with advanced sidebar behavior.

## Features

### ✨ Core Features
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Theme System** - Complete theme switching with CSS variables
- **Advanced Sidebar** - Collapsible sidebar with logo adaptation and hover-based submenus
- **Modern Header** - Theme toggle, user profile dropdown, sidebar toggle
- **Interactive UI** - Smooth animations and transitions throughout
- **Standalone Components** - Built with Angular 19+ standalone components

### 🎯 Sidebar Features
- **Logo Branding** - Adaptive logo (full on expanded, icon-only on collapsed)
- **Nested Navigation** - Parent-child menu items with inline expansion
- **Hover Submenus** - Floating submenu panels in collapsed mode
- **Active State Highlighting** - Visual feedback for active menu items
- **Smooth Animations** - Transition effects for all state changes
- **Mobile Responsive** - Becomes a drawer on mobile devices

### 🎨 Theme System
- **CSS Variables** - Dynamic color theming
- **Light & Dark Modes** - Complete dark mode support
- **localStorage Persistence** - Theme preference saved locally
- **System Preference Detection** - Auto-detects OS dark mode setting
- **Smooth Transitions** - Color changes animate smoothly

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── theme.service.ts      # Theme management
│   │       └── menu.service.ts        # Menu data & state
│   ├── layout/
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.scss
│   │   ├── sidebar/
│   │   │   ├── sidebar.component.ts
│   │   │   ├── sidebar.component.html
│   │   │   └── sidebar.component.scss
│   │   ├── footer/
│   │   │   ├── footer.component.ts
│   │   │   ├── footer.component.html
│   │   │   └── footer.component.scss
│   │   ├── layout.component.ts
│   │   ├── layout.component.html
│   │   └── layout.component.scss
│   ├── pages/
│   │   └── dashboard/
│   │       ├── dashboard.component.ts
│   │       ├── dashboard.component.html
│   │       └── dashboard.component.scss
│   ├── shared/
│   │   └── directives/
│   │       └── click-outside.directive.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles.scss                        # Global styles & CSS variables
├── main.ts                            # Application bootstrap
└── index.html                         # HTML entry point

Configuration Files:
├── angular.json                       # Angular CLI configuration
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.app.json                  # App-specific TypeScript config
├── tailwind.config.js                 # Tailwind CSS configuration
├── postcss.config.js                  # PostCSS configuration
└── package.json                       # Dependencies & scripts
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 19

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm start
# or
ng serve
```

3. **Open in Browser**
```
http://localhost:4200
```

4. **Build for Production**
```bash
npm run build
# output in dist/angular-dashboard
```

## Configuration

### Tailwind CSS
The application uses Tailwind CSS with custom color variables. Configuration is in `tailwind.config.js`:

```javascript
// Custom color spaces using CSS variables
colors: {
  primary: { 50: 'rgba(var(--color-primary-50) / <alpha-value>)', ... },
  secondary: { 50: 'rgba(var(--color-secondary-50) / <alpha-value>)', ... },
  surface: 'rgba(var(--color-surface) / <alpha-value>)',
  // ... more colors
}
```

### Theme System
Themes are managed by `ThemeService` in `src/app/core/services/theme.service.ts`:

```typescript
// Get current theme
const currentTheme = themeService.getTheme(); // 'light' | 'dark'

// Set theme
themeService.setTheme('dark');

// Toggle theme
themeService.toggleTheme();
```

**CSS Variables** are automatically applied:
- Light theme uses bright colors
- Dark theme uses darker colors
- All variables in `:root` for light mode
- All variables in `html.dark` for dark mode

### Sidebar Behavior

#### Expanded Mode
- Shows full logo + company name
- Menu labels always visible
- Child items inline in expandable sections
- Click menu item to toggle children

#### Collapsed Mode
- Shows only logo icon
- Labels hidden
- **Hover submenu**: Floating panel appears on hover over parent with children
- Submenu positioned with absolute positioning to the right

## Usage Examples

### Adding Menu Items
Edit `src/app/core/services/menu.service.ts`:

```typescript
private menuItems = signal<MenuItem[]>([
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    route: '/dashboard',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    route: '/analytics',
    children: [
      {
        id: 'reports',
        label: 'Reports',
        icon: '📄',
        route: '/analytics/reports',
      },
      // Add more child items...
    ],
  },
]);
```

### Customizing Theme Colors
Edit `src/styles.scss` CSS variables:

```scss
:root {
  --color-primary-50: 248, 245, 255;
  --color-primary-100: 243, 232, 255;
  // ... customize all primary colors
  
  --color-secondary-50: 250, 245, 250;
  // ... customize all secondary colors
  
  --color-surface: 255, 255, 255;
  --color-surface-variant: 245, 245, 245;
  --color-on-surface: 31, 31, 31;
  --color-on-surface-variant: 79, 79, 79;
}
```

### Adding New Routes
Edit `src/app/app.routes.ts`:

```typescript
export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'your-new-route',
        component: YourComponent,
      },
    ],
  },
];
```

## Responsive Breakpoints

- **Mobile** (max-width: 480px) - Sidebar becomes drawer, single-column layouts
- **Tablet** (max-width: 768px) - Adjusted spacing, responsive grid
- **Desktop** (max-width: 1024px) - Full layout with sidebar
- **Large Desktop** (1024px+) - Optimized for wide screens

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- ✅ Standalone components (reduced bundle size)
- ✅ Lazy loaded routes
- ✅ CSS variables for theming (no extra CSS)
- ✅ Angular animations optimized
- ✅ OnPush change detection ready
- ✅ Tree-shakeable imports

## Accessibility

- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Focus indicators on all buttons
- ✅ Color contrast compliance (WCAG AA)
- ✅ Screen reader friendly

## Scripts

```bash
npm start          # Start dev server
npm run build      # Build for production
npm run watch      # Watch mode build
npm test           # Run tests
```

## Customization Tips

### Change Logo
Update `sidebar.component.ts`:
```typescript
getLogoText(): string {
  return this.isExpanded() ? 'Your Company' : 'YC';
}
```
And update the icon in `sidebar.component.html`.

### Modify Color Scheme
1. Edit CSS variables in `src/styles.scss`
2. Update `tailwind.config.js` if adding new colors
3. Adjust theme colors in `theme.service.ts`

### Add Animations
Add to `src/styles.scss`:
```scss
@keyframes customAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.your-element {
  animation: customAnimation 300ms ease-out;
}
```

## Troubleshooting

### Sidebar not responsive
- Check media queries in `sidebar.component.scss`
- Verify layout margins in `layout.component.scss`

### Theme not persisting
- Check browser localStorage
- Verify ThemeService is initialized in app.config.ts

### Styling issues
- Clear node_modules and reinstall: `npm ci`
- Rebuild Tailwind CSS
- Check Tailwind config `content` paths

## Production Checklist

Before deploying:
- [ ] Run `npm run build` successfully
- [ ] Check bundle size: `ng build --stats-json`
- [ ] Test all routes
- [ ] Test theme switching
- [ ] Test responsive design on mobile
- [ ] Verify accessibility (axe DevTools)
- [ ] Test performance (Lighthouse)

## License

MIT License - Feel free to use this in your projects!

## Support & Documentation

- [Angular Documentation](https://angular.io)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org)

---

**Built with ❤️ using Angular 19 & Tailwind CSS**
