import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from './textbox.component';
import { ThemeService } from '../../../core/services/theme.service';

export interface RadioOption {
  label: string;
  value: any;
}

export interface RadioFieldConfig extends FieldConfig {
  options: RadioOption[];
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-5 flex flex-col">
      <label class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        {{ config.label }}
        <span *ngIf="config.required" class="text-red-500 ml-1">*</span>
      </label>
      <div class="space-y-3">
        <label *ngFor="let option of radioConfig.options" class="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            [value]="option.value"
            [formControl]="$any(control)"
            class="w-5 h-5 accent-blue-600 cursor-pointer border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <span class="text-sm text-slate-700 dark:text-slate-300 select-none">{{ option.label }}</span>
        </label>
      </div>
      <span *ngIf="control.invalid && control.touched" class="text-red-500 text-xs mt-1">
        {{ config.errorMessage || 'This field is required' }}
      </span>
    </div>
  `
})
export class RadioComponent implements OnInit {
  @Input() config!: RadioFieldConfig;
  @Input() control!: AbstractControl;

  constructor(public themeService: ThemeService) {}

  get radioConfig(): RadioFieldConfig {
    return this.config as RadioFieldConfig;
  }

  ngOnInit(): void {
    if (this.config.value && !this.control.value) {
      this.control.setValue(this.config.value);
    }
  }
}
