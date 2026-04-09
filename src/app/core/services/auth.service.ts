import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthUser {
  id: string;
  role: 'admin' | 'user';
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Static admin credentials
  private readonly ADMIN_ID = 'admin@example.com';
  private readonly ADMIN_PASSWORD = 'admin123';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkStoredAuth());
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Login with static admin credentials
   */
  login(userId: string, password: string): Observable<{ success: boolean; message: string }> {
    return new Observable((observer) => {
      setTimeout(() => {
        if (userId === this.ADMIN_ID && password === this.ADMIN_PASSWORD) {
          const user: AuthUser = {
            id: this.ADMIN_ID,
            email: this.ADMIN_ID,
            role: 'admin'
          };

          // Store auth state in localStorage
          localStorage.setItem('auth_token', 'static_admin_token_' + Date.now());
          localStorage.setItem('current_user', JSON.stringify(user));

          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);

          observer.next({ success: true, message: 'Login successful!' });
          observer.complete();
        } else {
          observer.next({ 
            success: false, 
            message: 'Invalid credentials. Use admin@example.com / admin123' 
          });
          observer.complete();
        }
      }, 800);
    });
  }

  /**
   * Logout the current user
   */
  logout(): void {
  localStorage.clear();
    // this.isAuthenticatedSubject.next(false);
    // this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check stored auth from localStorage
   */
  private checkStoredAuth(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get stored user from localStorage
   */
  private getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
