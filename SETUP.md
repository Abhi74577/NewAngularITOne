# Setup & Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
ng serve
# or
npm start
```

The application will be available at `http://localhost:4200`

### 3. Build for Production
```bash
ng build
# or
npm run build
```

Output will be in `dist/angular-dashboard`

---

## Project Configuration

### Angular Configuration (angular.json)
- Configured for Angular 19+
- SCSS inline style language
- Tailwind CSS integration via PostCSS
- Dev server on port 4200
- Production optimizations enabled

### TypeScript Configuration (tsconfig.json)
- Target: ES2022
- Module: ES2022
- Strict mode enabled
- Path aliases configured:
  - `@app/*` → `src/app/*`
  - `@core/*` → `src/app/core/*`
  - `@layout/*` → `src/app/layout/*`
  - `@pages/*` → `src/app/pages/*`
  - `@shared/*` → `src/app/shared/*`

### Tailwind CSS (tailwind.config.js)
- Dark mode enabled with `class` strategy
- Custom color spaces using CSS variables
- Custom spacing for sidebar widths
- Extended transitions for smooth animations

### PostCSS (postcss.config.js)
- Tailwind CSS plugin
- Autoprefixer for browser compatibility

---

## Development Workflow

### File Structure Best Practices

```
src/app/
├── core/                          # Core application logic
│   └── services/
│       ├── theme.service.ts       # Theme management
│       └── menu.service.ts        # Menu data & state
├── layout/                        # Layout components
│   ├── header/
│   ├── sidebar/
│   ├── footer/
│   └── layout.component.ts
├── pages/                         # Page components
│   └── dashboard/
├── shared/                        # Shared utilities
│   ├── directives/
│   └── services/
├── app.component.ts              # Root component
├── app.config.ts                 # App configuration
└── app.routes.ts                 # Route definitions
```

### Adding New Routes

1. Create component in `src/app/pages/`
```bash
ng generate component pages/new-page --standalone
```

2. Add route to `src/app/app.routes.ts`
```typescript
{
  path: 'new-page',
  component: NewPageComponent,
}
```

3. Add menu item to `src/app/core/services/menu.service.ts`
```typescript
{
  id: 'new-page',
  label: 'New Page',
  icon: '📄',
  route: '/new-page',
}
```

### Adding Shared Components

Create in `src/app/shared/components/`:
```bash
ng generate component shared/components/card --standalone
```

### Creating Services

Create in `src/app/core/services/`:
```bash
ng generate service core/services/api --standalone
```

---

## Theme System Usage

### Accessing Theme Service

```typescript
import { Component } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-example',
  standalone: true,
})
export class ExampleComponent {
  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getCurrentTheme() {
    return this.themeService.getTheme();
  }
}
```

### CSS Variables in Styles

Use CSS variables in your SCSS files:
```scss
.my-element {
  color: rgba(var(--color-on-surface));
  background-color: rgba(var(--color-surface));
  border: 1px solid rgba(var(--color-surface-variant));
}
```

### Tailwind Classes with Custom Colors

```html
<div class="bg-primary-600 text-on-surface">
  Content with custom themed colors
</div>
```

---

## Sidebar Development

### Menu Item Structure

```typescript
export interface MenuItem {
  id: string;                    // Unique identifier
  label: string;                 // Display text
  icon: string;                  // Emoji or icon character
  route?: string;                // Angular route
  children?: MenuItem[];         // Sub-menu items
  isExpanded?: boolean;          // Expanded state
}
```

### Menu Service Methods

```typescript
// Get all menu items
const items = menuService.getMenuItems();

// Toggle menu expand state
menuService.toggleMenuExpand(itemId);
```

### Sidebar Component Signals

```typescript
- isExpanded        // Boolean: sidebar expanded state
- menuItems         // Signal<MenuItem[]>: current menu data
- hoveredMenuId     // Signal<string | null>: hovered item
- hoveredSubmenuId  // Signal<string | null>: hovered submenu
```

---

## Styling & Theming

### Global Styles (src/styles.scss)

Contains:
- CSS variables definition (light & dark modes)
- Global reset and typography
- Scrollbar styling
- Animation keyframes
- Utility classes

### Component Styles

Each component has its own SCSS file with:
- BEM naming convention
- Mobile-first responsive design
- Animation definitions
- Theme-aware colors using CSS variables

### Color Variables Available

**Primary Colors**: `--color-primary-50` to `--color-primary-900`
**Secondary Colors**: `--color-secondary-50` to `--color-secondary-900`
**Surface Colors**:
- `--color-surface` (main background)
- `--color-surface-variant` (secondary background)
- `--color-on-surface` (main text)
- `--color-on-surface-variant` (secondary text)

### Responsive Design

Mobile-first approach using:
- `max-width: 480px` - Mobile
- `max-width: 768px` - Tablet
- `max-width: 1024px` - Small Desktop
- `1024px+` - Large Desktop

---

## Build & Deployment

### Development Build
```bash
ng build --configuration development
```

### Production Build
```bash
ng build --configuration production
```

Features:
- Code optimization and minification
- Tree-shaking of unused code
- Ahead-of-Time (AOT) compilation
- Source maps for debugging
- CSS and JS bundling

### Build Output

```
dist/angular-dashboard/
├── index.html           # Main HTML file
├── main.js              # Main application bundle
├── styles.css           # Global styles
├── favicon.ico          # Site icon
└── assets/              # Static assets
```

### Analyzing Bundle Size

```bash
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/angular-dashboard/stats.json
```

### Deployment

#### On Vercel
```bash
npm install -g vercel
vercel
```

#### On Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/angular-dashboard
```

#### On GitHub Pages
```bash
ng build --base-href="/repo-name/"
# Push dist/angular-dashboard to gh-pages branch
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/angular-dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

### Coverage Report
```bash
ng test --code-coverage
# Coverage in coverage/angular-dashboard/
```

---

## Performance Optimization

### Angular Optimizations

1. **OnPush Change Detection**
```typescript
@Component({
  selector: 'app-card',
  // ... other config
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

2. **Lazy Loading Routes**
```typescript
{
  path: 'feature',
  loadComponent: () => import('./feature/feature.component')
    .then(m => m.FeatureComponent),
}
```

3. **TrackBy in ngFor**
```html
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

### CSS Optimizations

1. Use CSS variables instead of generating multiple CSS files
2. Minimize animations usage
3. Use `transform` and `opacity` for animations (GPU accelerated)
4. Lazy load images with loading="lazy"

### Network Optimizations

1. Enable gzip compression
2. Cache static assets
3. Use service workers for offline support
4. Preload critical resources

---

## Debugging

### Using Angular DevTools

1. Install [Angular DevTools](https://angular.io/tools#browser-extensions)
2. Open Chrome DevTools
3. Navigate to "Angular" tab
4. Inspect components, change detection, and dependency injection

### VS Code Debugging

Add to `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ng serve",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "sourceMap": true,
      "pathMapping": {
        "/": "${workspaceFolder}/",
        "/*": "${workspaceFolder}/*"
      }
    }
  ]
}
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4200
kill -9 <PID>
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Rebuild Tailwind CSS
```bash
npx tailwindcss -i ./src/styles.scss -o ./dist/output.css
```

### Clear Angular Cache
```bash
rm -rf .angular
ng cache clean
```

### Theme Not Applying
1. Check localStorage for `theme` key
2. Verify CSS variables in DevTools
3. Check if `html.dark` class exists on document root
4. Clear browser cache and hard reload

---

## Environment Variables

Currently using in-browser configuration. For API endpoints, create `src/environments/`:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
};
```

---

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/sidebar-enhancement
```

### Commit Changes
```bash
git add .
git commit -m "feat: add hover submenu animation"
git push origin feature/sidebar-enhancement
```

### Create Pull Request
On GitHub/GitLab: Create PR from your feature branch

---

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Style Guide](https://angular.io/guide/styleguide)

---

## Support

For issues or questions:
1. Check the README.md for feature documentation
2. Review component comments in source code
3. Check Angular documentation for framework-specific issues
4. Review Tailwind CSS docs for styling questions

---

**Happy Coding! 🚀**
