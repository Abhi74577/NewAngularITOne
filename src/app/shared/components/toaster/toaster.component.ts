import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToasterService, Toast } from '../../services/toaster.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(400px)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="toaster-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast" 
        [class]="'toast-' + toast.type"
        [@toastAnimation]
      >
        <div class="toast-content">
          <span class="toast-icon">
            <ng-container [ngSwitch]="toast.type">
              <span *ngSwitchCase="'success'" class="icon-success">✓</span>
              <span *ngSwitchCase="'error'" class="icon-error">✕</span>
              <span *ngSwitchCase="'warning'" class="icon-warning">⚠</span>
              <span *ngSwitchCase="'info'" class="icon-info">ℹ</span>
            </ng-container>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <button 
          class="toast-close" 
          (click)="close(toast.id)"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toaster-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideIn 0.3s ease-in-out;
      pointer-events: auto;
      font-size: 14px;
      font-weight: 500;
      min-height: 48px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    .toast-success {
      background-color: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }

    .toast-error {
      background-color: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }

    .toast-warning {
      background-color: #fff3cd;
      color: #856404;
      border-left: 4px solid #ffc107;
    }

    .toast-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }

    .toast-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 24px;
      height: 24px;
      font-weight: bold;
      font-size: 16px;
    }

    .icon-success {
      color: #28a745;
    }

    .icon-error {
      color: #dc3545;
    }

    .icon-warning {
      color: #ffc107;
    }

    .icon-info {
      color: #17a2b8;
    }

    .toast-message {
      word-break: break-word;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 24px;
      color: inherit;
      opacity: 0.7;
      padding: 0;
      margin-left: 12px;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 1;
    }

    @media (max-width: 640px) {
      .toaster-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .toast {
        padding: 12px 14px;
        min-height: 44px;
      }

      .toast-icon {
        min-width: 20px;
        font-size: 14px;
      }

      .toast-message {
        font-size: 13px;
      }
    }
  `]
})
export class ToasterComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();

  constructor(private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.toasterService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  close(id: string): void {
    this.toasterService.removeToast(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
