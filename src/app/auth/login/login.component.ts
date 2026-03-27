import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  // Static Admin Credentials for demonstration
  readonly ADMIN_EMAIL = 'admin@example.com';
  readonly ADMIN_PASSWORD = 'admin123';

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  get userIdError() {
    const control = this.loginForm.get('userId');
    if (control?.touched && control.invalid) {
      return 'Valid email is required';
    }
    return '';
  }

  get passwordError() {
    const control = this.loginForm.get('password');
    if (control?.touched && control.invalid) {
      return 'Password is required';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRememberMeChange(event: any) {
    console.log('Remember Me:', event.target.checked);
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fix errors before submitting';
      return;
    }

    this.isLoading = true;
    const formData = this.loginForm.value;

    // Authenticate using the auth service
    this.authService.login(formData.userId, formData.password).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          this.successMessage = 'Login successful! Redirecting...';
          // Redirect to dashboard after successful login
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        } else {
          this.errorMessage = response.message;
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}