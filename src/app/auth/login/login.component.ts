import { CommonModule } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '@app/shared/services/baseService.service';
import { storageConst, Encryption } from '@app/shared/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  // Static Admin Credentials for demonstration
  readonly ADMIN_EMAIL = 'admin@example.com';
  readonly ADMIN_PASSWORD = 'admin123';

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  private messageListener!: (event: MessageEvent) => void;
  constructor(
    private fb: FormBuilder,

    private router: Router, private baseService: BaseService, private zone: NgZone
  ) {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }


  ngOnInit(): void {

  // ✅ If nothing was passed via window.name, stop safely
  if (!window.name) {
    console.warn('❌ window.name is empty – nothing to process');
    return;
  }

  try {
    // ✅ Parse payload
    const data = JSON.parse(window.name);
    console.log('✅ Data received from window.name:', data);

    // ✅ USER DATA
    if (data?.userData) {
      const decryptedUserData = Encryption.decrypt(data.userData);
      console.log('✅ Decrypted userData:', decryptedUserData);

      // ✅ Store decrypted data (NOT encrypted)
      localStorage.setItem(
        storageConst.userProfile,
        data.userData
      );
    }

    // ✅ MENU PERMISSIONS
    if (data?.menuPermission) {
      localStorage.setItem(
        storageConst.menuPermission,
        data.menuPermission
      );
    }

    // ✅ SOURCE URL
    if (data?.sourceUrl) {
      localStorage.setItem('sourceUrl', data.sourceUrl);
    }

    // ✅ IMPORTANT: Clear window.name BEFORE navigation
    window.name = '';

    // ✅ ROUTING
    if (data?.routerName) {
      setTimeout(() => {
        this.router.navigate([`/${data.routerName}`]);
      }, 100); // small delay is safer
    }

  } catch (error) {
    console.error('❌ Failed to parse window.name:', error);

    // ✅ Always clear to prevent loop
    window.name = '';

    // ✅ Fallback navigation
    this.router.navigate(['/login']);
  }
}

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageListener);
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

    const body = {
      userName: formData.userId,
      password: formData.password
    };

    // Authenticate using the auth service
    this.baseService.callAPI('POST', '/Authenticate/AuthUser', body)
      .pipe(
        switchMap((data: any) => {
          const res = this.baseService.GetResponse(data, true);

          if (!res || res.systemUserId <= 0) {
            throw new Error('Invalid response or authentication failed');
          }

          // Store user profile
          this.baseService.setJSONData(storageConst.userProfile, res);

          // Get permissions for the user
          return this.baseService.callAPI('POST', `/Authenticate/GetPermission`, res.roleId);
        })
      )
      .subscribe(
        (dataLocal: any) => {
          const resLocal = this.baseService.GetResponse(dataLocal, false);
          this.baseService.setJSONData(storageConst.menuPermission, resLocal.filter((e: any) => e.isView));

          this.isLoading = false;
          this.successMessage = 'Login successful! Redirecting...';

          // Redirect to dashboard
          setTimeout(() => {
  const ReturnURL: any = localStorage.getItem('sourceUrl')?.toString()
            const userData = localStorage.getItem(storageConst.userProfile);
            const menuPermission = localStorage.getItem(storageConst.menuPermission);

            const payload = {
              userData: userData, menuPermission: menuPermission, routerName: 'dashboard',
            }
            window.name = JSON.stringify(payload);

          


            console.log(ReturnURL)
            window.open(ReturnURL, '_self')
            // this.router.navigate(['/dashboard']);
          }, 500);
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMessage = error?.message || 'Authentication failed. Please check your credentials.';
          console.error('Login error:', error);
        }
      );
  }
}