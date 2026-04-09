import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toasts.asObservable();

  constructor() { }

  /**
   * Show a toast message
   * @param type - Type of message (success, error, warning, info)
   * @param message - Message content
   * @param duration - Duration to show in milliseconds (default: 3000)
   */
  showMessage(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number = 3000): void {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, message, duration };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }

  /**
   * Show success message
   */
  success(message: string, duration?: number): void {
    this.showMessage('success', message, duration);
  }

  /**
   * Show error message
   */
  error(message: string, duration?: number): void {
    this.showMessage('error', message, duration);
  }

  /**
   * Show warning message
   */
  warning(message: string, duration?: number): void {
    this.showMessage('warning', message, duration);
  }

  /**
   * Show info message
   */
  info(message: string, duration?: number): void {
    this.showMessage('info', message, duration);
  }

  /**
   * Remove a specific toast
   */
  removeToast(id: string): void {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(t => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toasts.next([]);
  }
}
