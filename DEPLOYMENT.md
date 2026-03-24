# Production Deployment Guide

## Pre-Deployment Checklist

### Code Quality
- [ ] Run linter: `ng lint` (if configured)
- [ ] Run tests: `ng test`
- [ ] Run E2E tests: `ng e2e`
- [ ] Check for console.log() statements
- [ ] Verify no hardcoded API URLs
- [ ] Review CSS for unused styles

### Performance
- [ ] Run production build: `ng build`
- [ ] Check bundle size: < 500KB for main bundle
- [ ] Analyze with Lighthouse: score > 90
- [ ] Test on real device/network conditions
- [ ] Verify lazy loading works
- [ ] Check Core Web Vitals

### Functionality
- [ ] Test all routes work correctly
- [ ] Verify theme switching persists
- [ ] Test sidebar on mobile/desktop
- [ ] Check dropdown menus work properly
- [ ] Verify responsive design on multiple devices
- [ ] Test touch interactions on mobile
- [ ] Check keyboard navigation

### Accessibility
- [ ] Run axe DevTools scan
- [ ] Validate HTML structure
- [ ] Check color contrast (WCAG AA minimum)
- [ ] Verify focus indicators visible
- [ ] Test with screen reader
- [ ] Check alternative text on images

### Security
- [ ] Update dependencies for vulnerabilities: `npm audit fix`
- [ ] Use HTTPS in production
- [ ] Set Security headers (CSP, X-Frame-Options, etc.)
- [ ] Validate environment variables
- [ ] Remove debug/development code
- [ ] Enable CORS properly if needed

---

## Build Optimization

### Production Build
```bash
ng build --configuration production
```

This includes:
- TypeScript compilation to JavaScript
- Angular AOT (Ahead-of-Time) compilation
- Minification of CSS and JavaScript
- Tree-shaking to remove unused code
- Source maps for debugging

### Build Output Analysis
```bash
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/angular-dashboard/stats.json
```

### Optimize Bundle Size

```typescript
// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// Lazy load routes
{
  path: 'feature',
  loadComponent: () => import('./feature/feature.component')
    .then(m => m.FeatureComponent)
}

// Import only what you need
import { map } from 'rxjs/operators';  // NOT: import * as rxjs from 'rxjs'
```

---

## Deployment Options

### 1. Vercel (Recommended for Beginners)

#### Installation & Setup
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Features
- ✅ Free SSL/HTTPS
- ✅ Automatic deployments from Git
- ✅ Global CDN
- ✅ Environment variables support
- ✅ Analytics dashboard

#### Configuration (vercel.json)
```json
{
  "buildCommand": "ng build",
  "outputDirectory": "dist/angular-dashboard",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

### 2. Netlify

#### Installation & Setup
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist/angular-dashboard
```

#### Features
- ✅ Continuous deployment from Git
- ✅ Built-in redirects and rewrites
- ✅ Form handling
- ✅ Edge Functions for serverless logic
- ✅ Split testing

#### Configuration (netlify.toml)
```toml
[build]
  command = "ng build"
  publish = "dist/angular-dashboard"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

### 3. Firebase Hosting

#### Installation & Setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
ng build
firebase deploy
```

#### Features
- ✅ Free SSL/HTTPS
- ✅ Global CDN
- ✅ Cloud Functions integration
- ✅ Realtime database
- ✅ Authentication services

#### Configuration (firebase.json)
```json
{
  "hosting": {
    "public": "dist/angular-dashboard",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### 4. GitHub Pages

#### Setup
```bash
# Set base href for GitHub Pages
ng build --base-href="/repo-name/"

# Create gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
cd dist/angular-dashboard
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

#### Features
- ✅ Free hosting for public repos
- ✅ GitHub Actions for automation
- ✅ Custom domain support

#### GitHub Actions Workflow (.github/workflows/deploy.yml)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build -- --base-href="/repo-name/"

      - name: Deploy
        run: |
          git config --global user.email "action@github.com"
          git config --global user.name "GitHub Action"
          npx gh-pages -d dist/angular-dashboard
```

---

### 5. AWS Amplify

#### Installation & Setup
```bash
npm install -g @aws-amplify/cli
amplify init
amplify hosting add
ng build
amplify publish
```

#### Features
- ✅ Continuous deployment
- ✅ Pull request previews
- ✅ Custom domain support
- ✅ Serverless backend integration
- ✅ Authentication options

---

### 6. Docker Deployment

#### Dockerfile
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built app from builder
COPY --from=builder /app/dist/angular-dashboard /usr/share/nginx/html

# Remove default nginx index
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```

#### Build & Run Docker Image
```bash
# Build image
docker build -t angular-dashboard:latest .

# Run container
docker run -p 8080:80 angular-dashboard:latest

# Push to Docker Hub
docker tag angular-dashboard:latest username/angular-dashboard:latest
docker push username/angular-dashboard:latest
```

---

### 7. Traditional Web Hosting

#### Upload Files
1. Build project: `ng build`
2. Upload `dist/angular-dashboard/*` to hosting via FTP/SFTP

#### Configure Server (Apache)
Add `.htaccess` to root directory:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Configure Server (Nginx)
```nginx
server {
  listen 80;
  server_name example.com www.example.com;
  
  root /var/www/angular-dashboard;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  error_page 404 /index.html;
}
```

---

## Production Environment Setup

### Environment Configuration
Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  logLevel: 'error',
};
```

### Build with Environment
```bash
ng build --configuration production
```

### Secure Secrets Management

**Never commit secrets to Git**

#### Option 1: Environment Variables
```bash
# Set on deployment platform
export API_KEY=secret-key-here

# Access in app
const apiKey = process.env['API_KEY'];
```

#### Option 2: ConfigMap (Kubernetes)
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  API_URL: "https://api.example.com"
  LOG_LEVEL: "info"
```

#### Option 3: .env Files (Local Development Only)
Create `.env.local` (never commit):
```
API_URL=https://api.example.com
API_KEY=secret-key
```

---

## Security Headers

### Set HTTP Headers

#### Nginx
```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

#### Apache
```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Content Security Policy (CSP)

```typescript
// Add to index.html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' https:;">
```

---

## Monitoring & Analytics

### Performance Monitoring

#### Google Analytics
```typescript
// Add to app.config.ts
import { AfterViewInit } from '@angular/core';

declare var gtag: Function;

gtag('config', 'GA_MEASUREMENT_ID');
```

#### Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Error Tracking

#### Sentry Integration
```bash
npm install @sentry/angular @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/project",
  integrations: [
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

---

## Continuous Integration / Continuous Deployment

### GitHub Actions Example
```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install
        run: npm ci
      
      - name: Lint
        run: npm run lint --if-present
      
      - name: Test
        run: npm test -- --watch=false --code-coverage
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        if: github.ref == 'refs/heads/main'
        run: npm run deploy
```

---

## Post-Deployment Checklist

- [ ] Verify site loads on production URL
- [ ] Test all routes work
- [ ] Verify theme switching works
- [ ] Check theme persists after refresh
- [ ] Test sidebar on mobile
- [ ] Verify dropdowns work
- [ ] Check footer links
- [ ] Test with different browsers
- [ ] Run Lighthouse audit
- [ ] Check Real User Monitoring
- [ ] Verify analytics tracking
- [ ] Monitor error tracking (Sentry)
- [ ] Check CDN performance
- [ ] Test HTTPS certificate
- [ ] Verify security headers present

---

## Rollback Plan

### If Issues Found After Deployment

1. **Immediate Actions**
   ```bash
   # Rollback to previous version
   git revert HEAD
   npm run build
   # Redeploy
   ```

2. **Vercel Rollback**
   - Go to Deployments
   - Click on previous successful deployment
   - Click "Promote to Production"

3. **Netlify Rollback**
   - Go to Deploys
   - Select previous successful deploy
   - Click "Publish deploy"

4. **Firebase Rollback**
   ```bash
   firebase deploy --only hosting
   ```

---

## Performance Optimization Tips

### Lazy Load Images
```html
<img src="image.jpg" loading="lazy" alt="Lazy loaded image">
```

### Compress Images
```bash
# Using imagemin
npx imagemin src/assets/images/* --out-dir=dist/assets/images
```

### Enable Gzip Compression
```bash
# All major hosting providers support this by default
# For custom servers:
# Nginx: add `gzip on;` to http block
# Apache: mod_deflate should be enabled
```

### Use Service Workers
```bash
ng add @angular/pwa
```

### Implement Caching Strategy
```typescript
// Add cache headers to long-lived assets
Cache-Control: public, max-age=31536000, immutable  // for hash-named files
Cache-Control: public, max-age=3600                 // for index.html
```

---

## Conclusion

Your Angular dashboard is now ready for production deployment! Choose the hosting option that best fits your needs, follow the checklist, and monitor your application's performance.

**Happy Deploying! 🚀**
