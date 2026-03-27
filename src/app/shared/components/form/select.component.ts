import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from './textbox.component';
import { ThemeService } from '../../../core/services/theme.service';

export interface SelectOption {
  label: string;
  value: any;
}

export interface SelectFieldConfig extends FieldConfig {
  options: SelectOption[];
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-5 flex flex-col relative">
      
      <!-- Label -->
      <label
        [for]="config.name"
        class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {{ config.label }}
        <span *ngIf="config.required" class="text-red-500 ml-1">*</span>
      </label>

      <!-- Wrapper -->
      <div class="relative" (click)="onToggle()">

        <!-- ✅ Placeholder -->
        <span
          *ngIf="!control.value"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"
        >
          {{ config.placeholder || ('Select ' + config.label) }}
        </span>

        <!-- Select -->
        <select
          [id]="config.name"
          [formControl]="$any(control)"
          [disabled]="config.readonly || false"
          (focus)="isOpen = true"
          (blur)="isOpen = false"
          class="w-full px-3 py-2 pr-16 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm appearance-none transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          [ngClass]="{
            'text-gray-600': !control.value,
            'text-slate-900 dark:text-slate-100': control.value
          }"
        >
        
          <option 
            *ngFor="let option of selectConfig.options"
            [value]="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- ❌ Clear Icon -->
        <i
          *ngIf="control.value"
          class="fa fa-times absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 cursor-pointer z-10"
          (click)="clearSelection($event)"
        ></i>

        <!-- 🔽 Toggle Icon -->
        <i
          class="fa absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-200"
          [ngClass]="isOpen ? 'fa-chevron-up rotate-180' : 'fa-chevron-down'"
        ></i>

      </div>

      <!-- Error -->
      <span
        *ngIf="control.invalid && control.touched"
        class="text-red-500 text-xs mt-1"
      >
        {{ config.errorMessage || 'This field is required' }}
      </span>
    </div>
  `
})
export class SelectComponent implements OnInit {
  @Input() config!: SelectFieldConfig;
  @Input() control!: AbstractControl;

  isOpen = false;

  constructor(public themeService: ThemeService) {}

  get selectConfig(): SelectFieldConfig {
    return this.config as SelectFieldConfig;
  }

  ngOnInit(): void {
    if (this.config.value && !this.control.value) {
      this.control.setValue(this.config.value);
    }
  }

  // ✅ Clear selection
  clearSelection(event: Event): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.control.markAsTouched();
    this.control.markAsDirty();
  }

  // Optional toggle trigger
  onToggle(): void {
    this.isOpen = true;
  }
}