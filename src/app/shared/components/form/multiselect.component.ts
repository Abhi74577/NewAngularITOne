import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldConfig } from './textbox.component';
import { ThemeService } from '../../../core/services/theme.service';

export interface SelectOption {
  label: string;
  value: any;
}

export interface MultiSelectFieldConfig extends FieldConfig {
  options: SelectOption[];
  searchable?: boolean;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="mb-5 flex flex-col">
      <label [for]="config.name" class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {{ config.label }}
        <span *ngIf="config.required" class="text-red-500 ml-1">*</span>
      </label>
      <div class="relative border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
        <!-- Search Input -->
        <div *ngIf="multiConfig.searchable" class="px-3 py-2 border-b border-slate-200 dark:border-slate-600">
          <input
            type="text"
            placeholder="Search..."
            [(ngModel)]="searchText"
            class="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm outline-none placeholder-slate-500 dark:placeholder-slate-400"
          />
        </div>
        
        <!-- Selected Items -->
        <div class="flex flex-wrap gap-2 p-3 min-h-[2.5rem]">
          <span *ngFor="let item of selectedItems" class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs">
            {{ item.label }}
            <button (click)="removeItem(item.value)" class="text-blue-700 hover:opacity-70 font-bold">×</button>
          </span>
        </div>
        
        <!-- Dropdown Menu -->
        <div class="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-300 dark:border-slate-600 rounded-b-lg z-10 max-h-60 overflow-y-auto shadow-lg" *ngIf="isOpen">
          <!-- Dropdown Buttons -->
          <div class="flex gap-2 p-2 border-b border-slate-200 dark:border-slate-600">
            <button (click)="selectAll()" class="flex-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded transition-colors">
              Select All
            </button>
            <button (click)="clearAll()" class="flex-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded transition-colors">
              Clear All
            </button>
          </div>
          
          <!-- Dropdown Items -->
          <div class="flex flex-col">
            <label *ngFor="let option of filteredOptions" class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <input
                type="checkbox"
                [checked]="isSelected(option.value)"
                (change)="toggleOption(option)"
                class="w-4 h-4 accent-blue-600 cursor-pointer rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span class="text-sm text-slate-700 dark:text-slate-300">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <span *ngIf="control.invalid && control.touched" class="text-red-500 text-xs mt-1">
        {{ config.errorMessage || 'This field is required' }}
      </span>
    </div>
  `
})
export class MultiselectComponent implements OnInit {
  @Input() config!: MultiSelectFieldConfig;
  @Input() control!: AbstractControl;

  constructor(public themeService: ThemeService) {}

  searchText = '';
  isOpen = false;
  selectedValues: any[] = [];

  get multiConfig(): MultiSelectFieldConfig {
    return this.config as MultiSelectFieldConfig;
  }

  get filteredOptions() {
    if (!this.searchText) {
      return this.multiConfig.options;
    }
    return this.multiConfig.options.filter(opt =>
      opt.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get selectedItems() {
    return this.multiConfig.options.filter(opt =>
      this.selectedValues.includes(opt.value)
    );
  }

  ngOnInit(): void {
    if (this.config.value) {
      this.selectedValues = Array.isArray(this.config.value) ? this.config.value : [];
      this.control.setValue(this.selectedValues);
    }
  }

  isSelected(value: any): boolean {
    return this.selectedValues.includes(value);
  }

  toggleOption(option: SelectOption): void {
    const index = this.selectedValues.indexOf(option.value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(option.value);
    }
    this.control.setValue([...this.selectedValues]);
  }

  removeItem(value: any): void {
    const index = this.selectedValues.indexOf(value);
    if (index > -1) {
      this.selectedValues.splice(index, 1);
      this.control.setValue([...this.selectedValues]);
    }
  }

  selectAll(): void {
    this.selectedValues = this.multiConfig.options.map(opt => opt.value);
    this.control.setValue([...this.selectedValues]);
  }

  clearAll(): void {
    this.selectedValues = [];
    this.control.setValue([]);
  }
}
