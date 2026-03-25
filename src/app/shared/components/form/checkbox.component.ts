import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from './textbox.component';
import { ThemeService } from '../../../core/services/theme.service';

export interface CheckboxOption {
  label: string;
  value: any;
}

export interface CheckboxFieldConfig extends FieldConfig {
  options?: CheckboxOption[];
  standalone?: boolean;

}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-5 flex flex-col">
      <div *ngIf="!checkboxConfig.standalone" class="space-y-3">
        <label *ngFor="let option of checkboxConfig.options" class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            [value]="option.value"
            [formControl]="$any(control)"
            class="w-5 h-5 accent-blue-600 rounded cursor-pointer border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <span class="text-sm text-slate-700 dark:text-slate-300 select-none">{{ option.label }}</span>
        </label>
      </div>
      <div *ngIf="checkboxConfig.standalone">
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            [formControl]="$any(control)"
            class="w-5 h-5 accent-blue-600 rounded cursor-pointer border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <span class="text-sm text-slate-700 dark:text-slate-300 select-none">{{ config.label }}</span>
        </label>
      </div>
      <span *ngIf="control.invalid && control.touched" class="text-red-500 text-xs mt-1">
        {{ config.errorMessage || 'This field is required' }}
      </span>
    </div>
  `
})
export class CheckboxComponent implements OnInit {
  @Input() config!: CheckboxFieldConfig;
  @Input() control!: AbstractControl;

  constructor(public themeService: ThemeService) {}

  get checkboxConfig(): CheckboxFieldConfig {
    return this.config as CheckboxFieldConfig;
  }

  ngOnInit(): void {
    if (!this.checkboxConfig.options) {
      this.checkboxConfig.options = [];
      this.checkboxConfig.standalone = true;
    }

    if (this.config.value && !this.control.value) {
      this.control.setValue(this.config.value);
    }
  }
}
