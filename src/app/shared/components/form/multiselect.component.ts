import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { FieldConfig } from './textbox.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="mb-5 flex flex-col">
  <label class="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    {{ config.label }}
    <span *ngIf="config.required" class="text-red-500 ml-1">*</span>
  </label>

  <div class="relative border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800">

    

    <!-- Selected + Icons -->
    <div (click)="toggleDropdown($event)"
         class="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">

      <!-- LEFT: Selected -->
      <div class="flex flex-wrap gap-2 flex-1">
        <span *ngFor="let item of selectedItems; trackBy: trackByFn"
              class="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-xs rounded">

          {{ item.label }}

          <button (click)="removeItem(item.value, $event)"
                  class="font-bold hover:opacity-70">
            ×
          </button>
        </span>

        <span *ngIf="selectedItems.length === 0"
              class="text-sm text-slate-500 dark:text-slate-400">
          Select skills...
        </span>
      </div>
      

      <!-- RIGHT: ICONS -->
      <div class="flex items-center gap-2">

        <!-- ❌ CLEAR ALL -->
        <i *ngIf="selectedItems.length > 0"
           (click)="clearAll($event)"
           class="fas fa-times text-red-500 hover:text-red-700 cursor-pointer">
        </i>

        <!-- ⬇⬆ DROPDOWN -->
        <i class="fas text-slate-500"
           [ngClass]="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'">
        </i>

      </div>
    </div>

    <!-- Dropdown -->
    <div *ngIf="isOpen"
         (click)="$event.stopPropagation()"
         class="absolute w-full bg-white dark:bg-slate-800 border-t border-slate-300 dark:border-slate-600 rounded-b-lg shadow-lg max-h-60 overflow-auto z-10">

         <!-- Search -->
    <div *ngIf="multiConfig.searchable"
         class="px-3 py-2 border-b border-slate-200 dark:border-slate-600">

      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Search..."
        class="w-full bg-transparent text-sm outline-none text-slate-900 dark:text-slate-100"
      />
    </div>

      <!-- Actions -->
      <div class="flex gap-2 p-2 border-b border-slate-200 dark:border-slate-600">
        <button (click)="selectAll()" class="flex-1 text-xs bg-slate-100 dark:bg-slate-700 rounded px-2 py-1">
          Select All
        </button>
        <button (click)="clearAll($event)" class="flex-1 text-xs bg-slate-100 dark:bg-slate-700 rounded px-2 py-1">
          Clear All
        </button>
      </div>

      <!-- Options -->
      <label *ngFor="let option of filteredOptions; trackBy: trackByFn"
             class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">

        <input
          type="checkbox"
          [checked]="isSelected(option.value)"
          (click)="$event.stopPropagation()"
          (change)="toggleOption(option)"
        />

        <span class="text-sm text-slate-700 dark:text-slate-300">
          {{ option.label }}
        </span>
      </label>
    </div>
  </div>

  <!-- Error -->
  <span *ngIf="control.invalid && control.touched"
        class="text-red-500 text-xs mt-1">
    {{ config.errorMessage || 'This field is required' }}
  </span>
</div>
  `
})
export class MultiselectComponent implements OnInit, OnDestroy {
  @Input() config!: MultiSelectFieldConfig;
  @Input() control!: AbstractControl;

  constructor(public themeService: ThemeService) {}

  searchControl = new FormControl('');
  isOpen = false;
  selectedValues: any[] = [];

  private destroy$ = new Subject<void>();

  get multiConfig(): MultiSelectFieldConfig {
    return this.config as MultiSelectFieldConfig;
  }

  get filteredOptions() {
    const search = this.searchControl.value?.toLowerCase() || '';
    return this.multiConfig.options.filter(opt =>
      opt.label.toLowerCase().includes(search)
    );
  }

  get selectedItems() {
    return this.multiConfig.options.filter(opt =>
      this.selectedValues.includes(opt.value)
    );
  }

  ngOnInit(): void {
    if (Array.isArray(this.control.value)) {
      this.selectedValues = [...this.control.value];
    } else if (this.config.value) {
      this.selectedValues = [...this.config.value];
      this.control.setValue(this.selectedValues);
    }

    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (Array.isArray(value)) {
          this.selectedValues = [...value];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isSelected(value: any): boolean {
    return this.selectedValues.includes(value);
  }

  toggleOption(option: SelectOption): void {
    this.searchControl.setValue(''); // ✅ NEW: CLEAR SEARCH ON TOGGLE
    const index = this.selectedValues.indexOf(option.value);

    if (index > -1) {
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push(option.value);
    }

    this.control.setValue([...this.selectedValues]);
  }

  removeItem(value: any, event: Event): void {
    event.stopPropagation();
    this.selectedValues = this.selectedValues.filter(v => v !== value);
    this.control.setValue([...this.selectedValues]);
  }

  // ✅ NEW: CLEAR ALL FROM RIGHT ICON
  clearAll(event?: Event): void {
    if (event) event.stopPropagation();
    this.selectedValues = [];
    this.control.setValue([]);
  }

  selectAll(): void {
    this.selectedValues = this.multiConfig.options.map(opt => opt.value);
    this.control.setValue([...this.selectedValues]);
  }

  toggleDropdown(event?: Event): void {
    if (event) event.stopPropagation();

    this.isOpen = !this.isOpen;

    // ✅ NEW: RESET SEARCH WHEN OPEN
    if (this.isOpen) {
      this.searchControl.setValue('');
    }
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isOpen = false;
  }

  trackByFn(index: number, item: SelectOption) {
    return item.value;
  }
}