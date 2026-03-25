import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalConfig, ModalData } from '../../services/modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="modalData$ | async as modalData" class="modal-overlay">
      <div class="modal-backdrop" (click)="onBackdropClick(modalData.config)"></div>
      <div class="modal-content" [ngClass]="'modal-' + (modalData.config.size || 'md')">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">{{ modalData.config.title }}</h2>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p *ngIf="modalData.config.content">{{ modalData.config.content }}</p>
          <ng-content></ng-content>
        </div>

        <!-- Modal Footer -->
        <div *ngIf="modalData.config.showFooter !== false" class="modal-footer">
          <button (click)="closeModal()" class="btn btn-secondary">
            {{ modalData.config.cancelButtonText || 'Cancel' }}
          </button>
          <button (click)="submitModal()" class="btn btn-primary">
            {{ modalData.config.submitButtonText || 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }

    .modal-content {
      position: relative;
      background-color: rgb(var(--color-surface));
      border-radius: 0.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-height: 90vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease-out;
    }

    .modal-sm {
      width: 90%;
      max-width: 28rem;
    }

    .modal-md {
      width: 90%;
      max-width: 36rem;
    }

    .modal-lg {
      width: 90%;
      max-width: 48rem;
    }

    .modal-xl {
      width: 90%;
      max-width: 56rem;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid rgb(var(--color-on-surface-variant) / 0.1);
    }

    .modal-title {
      margin: 0;
      color: rgb(var(--color-on-surface));
      font-size: 1.25rem;
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 2rem;
      color: rgb(var(--color-on-surface-variant));
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;

      &:hover {
        color: rgb(var(--color-on-surface));
      }
    }

    .modal-body {
      padding: 1.5rem;
      color: rgb(var(--color-on-surface));

      p {
        margin: 0 0 1rem 0;
        line-height: 1.5;
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid rgb(var(--color-on-surface-variant) / 0.1);
    }

    .btn {
      padding: 0.625rem 1.25rem;
      border-radius: 0.375rem;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:focus {
        outline: none;
      }
    }

    .btn-primary {
      background-color: rgb(var(--color-primary-600));
      color: white;

      &:hover {
        background-color: rgb(var(--color-primary-700));
      }
    }

    .btn-secondary {
      background-color: rgb(var(--color-surface-variant));
      color: rgb(var(--color-on-surface));

      &:hover {
        background-color: rgb(var(--color-on-surface-variant) / 0.15);
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
})
export class ModalComponent implements OnInit {
  modalData$!: Observable<ModalData | null>;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalData$ = this.modalService.getModalState();
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  submitModal(): void {
    // Emit submit event - can be extended with event emitter
    this.closeModal();
  }

  onBackdropClick(config: ModalConfig): void {
    if (config.closeOnBackdropClick !== false) {
      this.closeModal();
    }
  }
}
