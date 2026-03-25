import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DynamicFormService } from '../../shared/services/dynamic-form.service';
import { ModalService } from '../../shared/services/modal.service';
import { DynamicFormRendererComponent } from '../../shared/components/dynamic-form-renderer/dynamic-form-renderer.component';
import { TabConfig, FormSubmissionData } from '../../shared/models/form-config.model';
import { USER_FORM_CONFIG } from './user-form.config';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormRendererComponent],
  template: `
    <div class="user-form-container">
      <!-- Form Header -->
      <div class="form-header">
        <h1>{{ USER_FORM_CONFIG.title }}</h1>
        <p *ngIf="USER_FORM_CONFIG.description" class="form-description">
          {{ USER_FORM_CONFIG.description }}
        </p>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs-navigation">
        <button
          *ngFor="let tab of USER_FORM_CONFIG.tabs"
          [class.active]="activeTab === tab.id"
          (click)="selectTab(tab.id)"
          class="tab-button"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span *ngIf="isTabComplete(tab.id)" class="tab-badge">✓</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tabs-content">
        <div *ngFor="let tab of USER_FORM_CONFIG.tabs" [class.active]="activeTab === tab.id" class="tab-panel">
          <div class="tab-header">
            <h2>{{ tab.label }}</h2>
            <p *ngIf="tab.description" class="tab-description">{{ tab.description }}</p>
          </div>

          <!-- Dynamic Form Fields -->
          <form [formGroup]="formGroups[tab.id]">
            <app-dynamic-form-renderer
              [formGroup]="formGroups[tab.id]"
              [fields]="tab.fields"
            ></app-dynamic-form-renderer>
          </form>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button (click)="previousTab()" [disabled]="!canGoToPrevious()" class="btn btn-secondary">
          ← Previous
        </button>

        <div class="action-spacer"></div>

        <button *ngIf="USER_FORM_CONFIG.showReset" (click)="resetForm()" class="btn btn-outline">
          Reset
        </button>

        <button (click)="nextTab()" [disabled]="!canGoToNext()" class="btn btn-secondary">
          Next →
        </button>

        <button (click)="submitForm()" [disabled]="!isFormValid()" class="btn btn-primary">
          {{ USER_FORM_CONFIG.submitButtonText || 'Submit' }}
        </button>
      </div>

      <!-- Form Status -->
      <div class="form-status">
        <p>Tab {{ getCurrentTabIndex() + 1 }} of {{ USER_FORM_CONFIG.tabs.length }}</p>
      </div>

      <!-- Success Message -->
      <div *ngIf="submittedData" class="success-message">
        <h3>✓ Form Submitted Successfully!</h3>
        <details class="submitted-data">
          <summary>View Submitted Data</summary>
          <pre>{{ submittedData | json }}</pre>
        </details>
      </div>
    </div>
  `,
  styles: `
    .user-form-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .form-header {
      margin-bottom: 2rem;
      text-align: center;

      h1 {
        margin: 0 0 0.5rem 0;
        color: rgb(var(--color-on-surface));
        font-size: 2rem;
        font-weight: 600;
      }
    }

    .form-description {
      color: rgb(var(--color-on-surface-variant));
      margin: 0;
      font-size: 1rem;
    }

    /* Tabs Navigation */
    .tabs-navigation {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid rgb(var(--color-on-surface-variant) / 0.2);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;

      @media (max-width: 768px) {
        flex-wrap: wrap;
      }
    }

    .tab-button {
      position: relative;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      color: rgb(var(--color-on-surface-variant));
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &:hover {
        color: rgb(var(--color-on-surface));
      }

      &.active {
        color: rgb(var(--color-primary-600));
        border-bottom: 3px solid rgb(var(--color-primary-600));
        margin-bottom: -2px;
      }
    }

    .tab-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      background-color: #10b981;
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Tab Content */
    .tabs-content {
      background-color: rgb(var(--color-surface));
      border: 1px solid rgb(var(--color-on-surface-variant) / 0.2);
      border-radius: 0.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 0.3s ease-in;

      &.active {
        display: block;
      }
    }

    .tab-header {
      margin-bottom: 1.5rem;

      h2 {
        margin: 0 0 0.5rem 0;
        color: rgb(var(--color-on-surface));
        font-size: 1.5rem;
      }
    }

    .tab-description {
      margin: 0;
      color: rgb(var(--color-on-surface-variant));
      font-size: 0.95rem;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .action-spacer {
      flex: 1;
    }

    .btn {
      padding: 0.625rem 1.5rem;
      border-radius: 0.375rem;
      border: none;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;

      &:focus {
        outline: none;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background-color: rgb(var(--color-primary-600));
      color: white;

      &:hover:not(:disabled) {
        background-color: rgb(var(--color-primary-700));
      }
    }

    .btn-secondary {
      background-color: rgb(var(--color-surface-variant));
      color: rgb(var(--color-on-surface));

      &:hover:not(:disabled) {
        background-color: rgb(var(--color-on-surface-variant) / 0.15);
      }
    }

    .btn-outline {
      background-color: transparent;
      color: rgb(var(--color-primary-600));
      border: 1px solid rgb(var(--color-primary-600));

      &:hover:not(:disabled) {
        background-color: rgb(var(--color-primary-600) / 0.1);
      }
    }

    /* Form Status */
    .form-status {
      text-align: center;
      color: rgb(var(--color-on-surface-variant));
      font-size: 0.875rem;
      margin-bottom: 1rem;

      p {
        margin: 0;
      }
    }

    /* Success Message */
    .success-message {
      background-color: #d1fae5;
      border: 1px solid #6ee7b7;
      border-radius: 0.375rem;
      padding: 1.5rem;
      margin-top: 2rem;
      color: #065f46;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.125rem;
      }
    }

    .submitted-data {
      margin: 0;
      cursor: pointer;

      summary {
        font-weight: 500;
        margin-bottom: 1rem;

        &:hover {
          opacity: 0.8;
        }
      }

      pre {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 1rem;
        border-radius: 0.375rem;
        overflow-x: auto;
        font-size: 0.8rem;
        margin: 0;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .user-form-container {
        padding: 1rem;
      }

      .form-header h1 {
        font-size: 1.5rem;
      }

      .tabs-content {
        padding: 1.5rem 1rem;
      }

      .form-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `
})
export class UserFormComponent implements OnInit, OnDestroy {
  USER_FORM_CONFIG = USER_FORM_CONFIG;
  activeTab: string = '';
  formGroups: { [key: string]: FormGroup } = {};
  submittedData: FormSubmissionData | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private dynamicFormService: DynamicFormService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // Initialize form groups for all tabs
    this.formGroups = this.dynamicFormService.createTabFormGroups(USER_FORM_CONFIG.tabs);
    
    // Set the first tab as active
    this.activeTab = USER_FORM_CONFIG.tabs[0].id;
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getCurrentTabIndex(): number {
    return USER_FORM_CONFIG.tabs.findIndex(tab => tab.id === this.activeTab);
  }

  canGoToPrevious(): boolean {
    return this.getCurrentTabIndex() > 0;
  }

  canGoToNext(): boolean {
    const currentIndex = this.getCurrentTabIndex();
    return currentIndex < USER_FORM_CONFIG.tabs.length - 1;
  }

  previousTab(): void {
    const currentIndex = this.getCurrentTabIndex();
    if (currentIndex > 0) {
      this.activeTab = USER_FORM_CONFIG.tabs[currentIndex - 1].id;
    }
  }

  nextTab(): void {
    const currentIndex = this.getCurrentTabIndex();
    if (currentIndex < USER_FORM_CONFIG.tabs.length - 1) {
      this.activeTab = USER_FORM_CONFIG.tabs[currentIndex + 1].id;
    }
  }

  isTabComplete(tabId: string): boolean {
    const formGroup = this.formGroups[tabId];
    return formGroup && formGroup.valid;
  }

  isFormValid(): boolean {
    return Object.values(this.formGroups).every(group => group && group.valid);
  }

  submitForm(): void {
    if (this.isFormValid()) {
      this.submittedData = this.dynamicFormService.collectFormData(this.formGroups);
      console.log('Form Data:', this.submittedData);
      // Optional: Show success modal
      // this.modalService.openModal({
      //   title: 'Success!',
      //   content: 'Your form has been submitted successfully.',
      //   showFooter: false,
      //   closeOnBackdropClick: true
      // });
    }
  }

  resetForm(): void {
    this.dynamicFormService.resetFormGroups(this.formGroups);
    this.submittedData = null;
    this.activeTab = USER_FORM_CONFIG.tabs[0].id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
