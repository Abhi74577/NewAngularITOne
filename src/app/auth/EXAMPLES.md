# Login Component - Usage Examples

Complete examples of how to use the login component in your Angular application.

## 🎯 Basic Setup

### 1. Standalone Component Usage

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
```

### 2. Route Configuration

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard, publicGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
  // Public routes
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [publicGuard] // Prevent logged-in users from accessing
  },
  
  // Protected routes
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard] // Require authentication
  },
  
  // Catch-all
  { path: '**', redirectTo: 'dashboard' }
];
```

## 🚀 Usage Patterns

### Pattern 1: Direct Import and Use

```typescript
import { LoginComponent } from '@app/auth';

// Create a standalone app component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, RouterModule],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
```

### Pattern 2: With Layout

```typescript
// Layout with authentication-aware header
@Component({
  selector: 'app-layout',
  template: `
    <div class="layout">
      <app-header *ngIf="isAuthenticated"></app-header>
      <router-outlet></router-outlet>
      <app-footer *ngIf="isAuthenticated"></app-footer>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent]
})
export class LayoutComponent {
  isAuthenticated$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService) {}
}
```

### Pattern 3: Using AuthService in Components

```typescript
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div *ngIf="currentUser">
      <h1>{{ currentUser.name }}</h1>
      <p>{{ currentUser.email }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class ProfileComponent {
  currentUser = this.authService.getCurrentUser();

  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout();
    // Navigate to login - handled by auth guard
  }
}
```

## 🔄 Authentication Flow Examples

### Example 1: Successful Login Flow

```typescript
// User enters credentials and submits
// Forms validates input
// AuthService.login() is called
// API returns token and user data
// Token is stored in localStorage and headers
// User is redirected to dashboard
// Auth guard allows access to protected routes
```

### Example 2: Failed Login & Retry

```typescript
// User enters wrong credentials
// API returns 401 error
// Error message is displayed
// User can correct credentials and try again
// No token is stored until success
```

### Example 3: Session Expiration

```typescript
// User is on dashboard (token still valid)
// User makes an API call
// API returns 401 (token expired)
// AuthTokenInterceptor catches this
// Intercepts attempts token refresh
// If refresh succeeds, retries original request
// If refresh fails, logs user out
// User is redirected to login
```

## 🧪 Testing Examples

### Unit Test: Form Validation

```typescript
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RunnerComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();

    form.get('userId')?.setValue('test@example.com');
    form.get('password')?.setValue('password123');
    expect(form.valid).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalsy();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTruthy();
  });
});
```

### Unit Test: AuthService

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpClient.verify();
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'mock-token',
      user: { id: '1', name: 'John', email: 'john@example.com' }
    };

    service.login('john@example.com', 'password').subscribe({
      next: (response) => {
        expect(response.token).toBe('mock-token');
        expect(service.isAuthenticated()).toBeTruthy();
      }
    });

    const req = httpClient.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('wrong@example.com', 'wrong').subscribe({
      error: (error) => {
        expect(error.message).toContain('Invalid credentials');
      }
    });

    const req = httpClient.expectOne('/api/auth/login');
    req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });
});
```

## 📦 Integration with Backend

### Express.js Backend Example

```javascript
// Backend: POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;

  // Validate credentials (pseudo-code)
  const user = validateUser(userId, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
  });
});

// Middleware: Verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};
```

### ASP.NET Core Backend Example

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await _userService.ValidateUserAsync(request.UserId, request.Password);
    
    if (user == null)
        return Unauthorized(new { message = "Invalid credentials" });

    var token = _tokenService.GenerateToken(user.Id);

    return Ok(new AuthResponse
    {
        Token = token,
        User = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Avatar = user.Avatar
        }
    });
}
```

## 🎨 Customization Examples

### Custom Error Message Styling

```html
<!-- In login.component.html -->
<div 
  *ngIf="errorMessage" 
  class="error-alert custom-error"
  [@fadeIn]
>
  <span class="error-icon"></span>
  {{ errorMessage }}
</div>
```

```scss
// In login.component.scss
.error-alert.custom-error {
  background-color: #fee;
  border-left: 4px solid #f00;
  border-radius: 0 4px 4px 0;
}
```

### Remember Me Implementation

```typescript
// In login.component.ts
onRememberMeChange(event: any): void {
  this.rememberMe = event.target.checked;
}

onSubmit(): void {
  // ... login logic ...
  if (this.rememberMe) {
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('userId', userId);
  }
}

// On component init
ngOnInit(): void {
  this.initializeForm();
  
  // Pre-fill username if remember me was checked
  if (localStorage.getItem('rememberMe') === 'true') {
    this.loginForm.patchValue({
      userId: localStorage.getItem('userId'),
      rememberMe: true
    });
  }
}
```

## 📲 Mobile Optimization Examples

```typescript
// Detect if running on mobile
@Component({
  selector: 'app-login',
  template: `
    <div [class.mobile-view]="isMobileView">
      <!-- Login content -->
    </div>
  `
})
export class LoginComponent {
  isMobileView = window.innerWidth < 640;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = event.target.innerWidth < 640;
  }
}
```

## 🔐 Enhanced Security Examples

### 2FA (Two-Factor Authentication)

```typescript
// After login, if 2FA is enabled
login(userId: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
    userId,
    password
  }).pipe(
    switchMap((response) => {
      if (response.requiresTwoFactor) {
        this.setTempAuthData(response.tempToken);
        // Navigate to 2FA page
        return throwError(() => ({ requiresTwoFactor: true }));
      }
      this.setAuthData(response.token, response.user);
      return of(response);
    })
  );
}
```

## 📊 Usage Statistics & Analytics

```typescript
// Track login attempts
export class AuthService {
  private loginAttempts = 0;

  login(userId: string, password: string): Observable<AuthResponse> {
    this.loginAttempts++;
    
    // Log analytics
    if (this.loginAttempts > 5) {
      this.analyticsService.logEvent('multiple_login_attempts', {
        attempts: this.loginAttempts,
        userId
      });
    }

    // ... rest of login logic
  }
}
```

---

**Examples Version**: 1.0.0
**Last Updated**: 2024
