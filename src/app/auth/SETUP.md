# Authentication Setup Guide

Complete setup guide to integrate the login component into your Angular application.

## 🔧 Installation Steps

### 1. Import HttpClientModule

Update your `app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthTokenInterceptor } from './auth/services/auth-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }
  ]
};
```

### 2. Setup Routing

Update your `app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(
      m => m.DashboardComponent
    ),
    // Add canActivate: [authGuard] when ready
  },
  // Other routes...
];
```

### 3. Configure API Endpoint

Edit `src/app/auth/services/auth.service.ts`:

```typescript
export class AuthService {
  private apiUrl = 'https://your-api-domain.com/api/auth';
  // ...
}
```

### 4. Update Backend API Expectations

Your backend API should handle:

#### Login Endpoint
- **URL**: `POST /api/auth/login`
- **Request Body**:
```json
{
  "userId": "user@example.com",
  "password": "user_password"
}
```

- **Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://api.example.com/avatars/user123.jpg"
  }
}
```

- **Error Response (401/400)**:
```json
{
  "message": "Invalid credentials",
  "status": 401
}
```

#### Refresh Token Endpoint
- **URL**: `POST /api/auth/refresh`
- **Request Header**: `Authorization: Bearer <current_token>`
- **Response**: Same as login response with new token

## 🛡️ Authentication Guard (Optional)

Create `src/app/auth/guards/auth.guard.ts`:

```typescript
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
```

Then use it in your routes:

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

## 🎨 Customization

### Logo and Branding

Edit `login.component.html` (lines 6-18):

```html
<div class="logo-badge">
  <!-- Replace SVG with your company logo -->
  <img src="assets/logo.svg" alt="Company Logo" class="logo-icon" />
</div>
<h1 class="logo-text">
  YourCompany<span class="highlight">Name</span>
</h1>
<p class="subtitle">Your Company Tagline Here</p>
```

### Color Theme

Update gradients in `login.component.scss`:

```scss
// Change primary color scheme
.logo-badge {
  background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
}

.submit-button {
  @apply bg-gradient-to-r from-YOUR_COLOR_1 to-YOUR_COLOR_2;
}
```

### Form Labels and Placeholders

Edit in `login.component.html`:

```html
<input
  id="userId"
  type="text"
  placeholder="Enter your username or email"
  <!-- Customize placeholder here -->
/>
```

## 📱 Testing

### Mock API Response (For Development)

Update `auth.service.ts` to mock responses:

```typescript
login(userId: string, password: string): Observable<AuthResponse> {
  // Mock response for testing
  if (userId === 'test@example.com' && password === 'password') {
    const mockResponse: AuthResponse = {
      token: 'mock-token-123',
      user: {
        id: 'user-123',
        name: 'Test User',
        email: userId,
        avatar: 'assets/avatar.jpg'
      }
    };
    return of(mockResponse).pipe(tap(response => {
      this.setAuthData(response.token, response.user);
    }));
  }

  return throwError(() => ({
    message: 'Invalid credentials'
  }));
}
```

## 🔐 Security Best Practices

1. **Use HTTPS**: Always use HTTPS in production
2. **Secure Token Storage**: Consider using HttpOnly cookies for tokens
3. **CSRF Protection**: Implement CSRF tokens if needed
4. **Input Validation**: Validate on both client and server
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks
6. **Error Handling**: Don't expose sensitive info in error messages
7. **Password Requirements**: Enforce strong password policies

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module '@app/auth'"
**Solution**: Ensure your TypeScript paths are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["src/app/*"]
    }
  }
}
```

### Issue: Tailwind styles not applying
**Solution**: Ensure Tailwind CSS is properly configured:
1. Check `tailwind.config.js` includes `src/**/*.{html,ts,scss}`
2. Verify `styles.scss` imports Tailwind directives
3. Rebuild the application

### Issue: CORS errors when calling API
**Solution**: Configure CORS on your backend:
```typescript
// Example: Express.js backend
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Issue: Token not being sent in requests
**Solution**: Verify `AuthTokenInterceptor` is registered in `app.config.ts`:
```typescript
{
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true
}
```

## 📚 Integration with Existing Services

If you have existing services, you can inject `AuthService`:

```typescript
import { AuthService } from '@app/auth/services/auth.service';

export class YourService {
  constructor(private authService: AuthService) {}

  getData() {
    const user = this.authService.getCurrentUser();
    console.log('Current user:', user);
  }
}
```

## 🚀 Production Deployment Checklist

- [ ] Update API endpoint to production URL
- [ ] Test with real backend API
- [ ] Implement HTTPS
- [ ] Add error logging/monitoring
- [ ] Test on target browsers
- [ ] Test responsive design on mobile devices
- [ ] Add unit tests
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline
- [ ] Review security practices

## 📖 Related Files

- [Login Component Documentation](./README.md)
- [Auth Service](./services/auth.service.ts)
- [Auth Token Interceptor](./services/auth-token.interceptor.ts)

---

**Setup Version**: 1.0.0
**Last Updated**: 2024
