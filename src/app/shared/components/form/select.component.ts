import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
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
    <div class="mb-5 flex flex-col">
      <label [for]="config.name" class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {{ config.label }}
        <span *ngIf="config.required" class="text-red-500 ml-1">*</span>
      </label>
      <select
        [id]="config.name"
        [formControl]="$any(control)"
        [disabled]="config.readonly || false"
        class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">Select {{ config.label }}</option>
        <option *ngFor="let option of selectConfig.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>
      <span *ngIf="control.invalid && control.touched" class="text-red-500 text-xs mt-1">
        {{ config.errorMessage || 'This field is required' }}
      </span>
    </div>
  `
})
export class SelectComponent implements OnInit {
  @Input() config!: SelectFieldConfig;
  @Input() control!: AbstractControl;

  constructor(public themeService: ThemeService) {}

  get selectConfig(): SelectFieldConfig {
    return this.config as SelectFieldConfig;
  }

  ngOnInit(): void {
    if (this.config.value && !this.control.value) {
      this.control.setValue(this.config.value);
    }
  }
}
