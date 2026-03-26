# Authentication Module - Login Component

A modern, corporate-styled login page component built with Angular, Tailwind CSS, and TypeScript. Features a clean paper design with smooth animations and password visibility toggle.

## 📁 Project Structure

```
src/auth/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   ├── login.component.scss
│   └── README.md
├── services/
│   └── auth.service.ts
├── index.ts
└── README.md
```

## 🎯 Features

### User Interface
- **Modern Corporate Design**: Clean, professional card-based layout
- **Tailwind CSS**: Fully responsive and customizable
- **Smooth Animations**: 
  - Floating background shapes
  - Gradient shifts
  - Slide-in effects for form elements
  - Button hover and active states
  - Loading spinner animation

### Form Fields
- **User ID/Email Input**:
  - Icon indicator
  - Real-time validation
  - Error messaging
  - Autocomplete support

- **Password Input**:
  - Hide/show toggle with eye icon
  - Real-time validation
  - Error messaging
  - Secure input handling

### Additional Features
- **Remember Me Checkbox**: Store user preferences
- **Error Display**: Alert box with smooth animation
- **Loading State**: Spinner animation during authentication
- **Forgot Password Link**: Navigation placeholder
- **Sign Up Link**: User registration navigation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark mode detection and styling

## 🚀 Usage

### Import the Component

```typescript
import { LoginComponent } from '@app/auth';

// In your routing module or app component
const routes: Routes = [
  { path: 'login', component: LoginComponent }
];
```

### Using as Standalone Component

```typescript
import { LoginComponent } from '@app/auth';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [LoginComponent, RouterOutlet]
})
export class AppComponent {}
```

### Configure API Endpoint

Update the `authService` in `auth.service.ts`:

```typescript
private apiUrl = 'https://your-api.com/api/auth'; // Your API endpoint
```

### API Expected Response

```typescript
interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
```

## 📝 Form Validation

### User ID
- **Required**: Must not be empty
- **Min Length**: At least 3 characters
- **Error Message**: "User ID is required" or "User ID must be at least 3 characters"

### Password
- **Required**: Must not be empty
- **Min Length**: At least 6 characters
- **Error Message**: "Password is required" or "Password must be at least 6 characters"

## 🎨 Customization

### Color Scheme

Edit the gradient colors in `login.component.scss`:

```scss
// Primary gradient (Blue to Purple)
from-blue-500 to-blue-600
from-blue-600 to-blue-700

// Accent colors
#3b82f6 // Blue
#9333ea // Purple
```

### Logo

Replace the SVG logo in `login.component.html`:

```html
<svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <!-- Your custom SVG path -->
</svg>
```

### Company Name

Update the branding text:

```html
<h1 class="logo-text">
  YourCompany<span class="highlight">Name</span>
</h1>
<p class="subtitle">Your Company Tagline</p>
```

### Animation Durations

Modify animation timings in the SCSS:

```scss
.login-card {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); // Change duration here
}

.floating-shape {
  animation: float 6s ease-in-out infinite; // Adjust shape animation
}

@keyframes spin {
  // Modify loading spinner speed
}
```

## 🔐 Security Features

- **Password Masking**: Securely hide passwords by default
- **Show/Hide Toggle**: User-controlled password visibility
- **HTTPS Ready**: Works with secure API endpoints
- **Token Storage**: Secure token management in localStorage
- **Session Management**: Validates and refreshes tokens automatically
- **CSRF Protection Ready**: Can be integrated with CSRF tokens

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with all elements visible
- **Tablet (≤ 768px)**: Adjusted spacing and font sizes
- **Mobile (≤ 640px)**: Optimized card size, hidden dividers, compact buttons

## 🌓 Dark Mode

Automatically adapts to system theme preference:

```css
@media (prefers-color-scheme: dark) {
  /* Dark mode styles applied automatically */
}
```

## 🔄 Authentication Flow

```
User Input
    ↓
Form Validation
    ↓
Submit Request (Show Loading State)
    ↓
API Authentication
    ↓
Save Token & User Data
    ↓
Navigate to Dashboard
    ↓
On Error: Display Error Message
```

## 📦 Dependencies

- **@angular/core**: Core Angular framework
- **@angular/common**: Common Angular directives
- **@angular/forms**: Reactive forms support
- **@angular/router**: Routing navigation
- **tailwindcss**: Utility-first CSS framework

## ⚙️ Component Properties

### Form Controls
- `userId`: User ID or email field
- `password`: Password field
- `rememberMe`: Remember me checkbox

### Component State
- `loginForm`: FormGroup containing all form controls
- `showPassword`: Boolean to toggle password visibility
- `isLoading`: Boolean to track API request status
- `errorMessage`: String to display error messages
- `rememberMe`: Boolean to track remember me state

## 🎬 Animation Details

### Entrance Animations
- **Card**: Slides up from bottom (0.6s)
- **Header**: Fades down (0.8s)
- **Form Elements**: Fade up with staggered delays
- **Button**: Slide up with 0.5s delay

### Interaction Animations
- **Floating Shapes**: Continuous float and rotate (6-8s)
- **Button Hover**: Lifts up and increases shadow
- **Input Focus**: Border color change and shadow expansion
- **Loading Spinner**: 0.8s rotation loop

### Responsive Animations
- Background gradient shifts subtly
- Shapes opacity reduces on mobile
- Smooth transitions on all state changes

## 📋 Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (modern Angular)

## 🐛 Troubleshooting

### Animations Not Working
- Ensure `--webkit-` prefixes are supported
- Check browser animation settings
- Verify CSS is properly imported

### Styling Issues
- Confirm Tailwind CSS is configured in `tailwind.config.js`
- Check for conflicting CSS rules
- Ensure SCSS is properly compiled

### API Connection Error
- Verify API endpoint URL in `auth.service.ts`
- Check CORS settings on backend
- Ensure API response matches `AuthResponse` interface

## 📚 Additional Resources

- [Angular Forms Documentation](https://angular.io/guide/forms)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Reactive Forms Guide](https://angular.io/guide/reactive-forms)
- [Angular HTTP Client](https://angular.io/guide/http)

## 📄 License

This component is part of the ITOne Angular project.

## 🤝 Contributing

For improvements or bug fixes, follow the project's contribution guidelines.

---

**Last Updated**: 2024
**Component Version**: 1.0.0
