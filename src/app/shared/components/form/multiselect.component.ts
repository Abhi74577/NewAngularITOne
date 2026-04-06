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
  multi?: boolean;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="flex flex-col">

    <!-- LABEL -->
    <label class="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      <span *ngIf="config.required" class="text-red-500">*</span>
      {{ config.label }}
    </label>

    <!-- FIELD -->
    <div class="relative border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 shadow-sm
                focus-within:ring-2 focus-within:ring-blue-500 hover:border-blue-400">

      <!-- SELECT BOX -->
      <div (click)="toggleDropdown($event)"
           class="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition">

        <!-- SELECTED -->
        <div class="flex flex-wrap gap-2 flex-1">

          <ng-container *ngIf="selectedItems.length > 0; else placeholder">
            <span *ngFor="let item of selectedItems; trackBy: trackByFn"
                  class="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">

              {{ item.label }}

              <button *ngIf="isMulti"
                      (click)="removeItem(item.value, $event)"
                      class="font-bold hover:opacity-70">
                ×
              </button>
            </span>
          </ng-container>

          <ng-template #placeholder>
            <span class="text-sm text-gray-400">
              {{ config.placeholder || 'Select option...' }}
            </span>
          </ng-template>

        </div>

        <!-- ICONS -->
        <div class="flex items-center gap-2">

          <i *ngIf="selectedItems.length > 0"
             (click)="clearAll($event)"
             class="fas fa-times text-red-500 hover:text-red-700 cursor-pointer">
          </i>

          <i class="fas text-gray-500"
             [ngClass]="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'">
          </i>

        </div>
      </div>

      <!-- DROPDOWN -->
      <div *ngIf="isOpen"
           (click)="$event.stopPropagation()"
           class="absolute w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                  rounded-xl shadow-lg max-h-64 overflow-auto z-50">

        <!-- SEARCH -->
        <div *ngIf="multiConfig.searchable"
             class="p-2 border-b border-gray-200 dark:border-gray-700">

          <input
            type="text"
            [formControl]="searchControl"
            placeholder="Search..."
            class="w-full px-2 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none"
          />
        </div>

        <!-- ACTIONS -->
        <div *ngIf="isMulti"
             class="flex gap-2 p-2 border-b border-gray-200 dark:border-gray-700">

          <button (click)="selectAll()"
                  class="flex-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1">
            Select All
          </button>

          <button (click)="clearAll($event)"
                  class="flex-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-2 py-1">
            Clear
          </button>
        </div>

        <!-- OPTIONS -->
        <label *ngFor="let option of filteredOptions; trackBy: trackByFn"
               class="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition">

          <input
            [type]="isMulti ? 'checkbox' : 'radio'"
            [checked]="isSelected(option.value)"
            (click)="$event.stopPropagation()"
            (change)="toggleOption(option)"
          />

          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ option.label }}
          </span>
        </label>

      </div>
    </div>

    <!-- ERROR -->
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

  get isMulti(): boolean {
    return this.multiConfig.multi ?? false;
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
    if (this.isMulti) {
      this.selectedValues = Array.isArray(this.control.value)
        ? [...this.control.value]
        : [];
    } else {
      this.selectedValues = this.control.value ? [this.control.value] : [];
    }

    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (this.isMulti) {
          this.selectedValues = Array.isArray(value) ? [...value] : [];
        } else {
          this.selectedValues = value ? [value] : [];
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
    this.control.markAsTouched(); // ✅ FIX

    this.searchControl.setValue('');

    if (this.isMulti) {
      const index = this.selectedValues.indexOf(option.value);

      if (index > -1) {
        this.selectedValues.splice(index, 1);
      } else {
        this.selectedValues.push(option.value);
      }

      this.control.setValue([...this.selectedValues]);
    } else {
      this.selectedValues = [option.value];
      this.control.setValue(option.value);
      this.isOpen = false;
    }
  }

  removeItem(value: any, event: Event): void {
    event.stopPropagation();
    this.control.markAsTouched(); // ✅ FIX

    this.selectedValues = this.selectedValues.filter(v => v !== value);
    this.control.setValue([...this.selectedValues]);
  }

  clearAll(event?: Event): void {
    if (event) event.stopPropagation();
    this.control.markAsTouched(); // ✅ FIX

    this.selectedValues = [];
    this.control.setValue(this.isMulti ? [] : null);
  }

  selectAll(): void {
    if (!this.isMulti) return;
    this.control.markAsTouched(); // ✅ FIX

    this.selectedValues = this.multiConfig.options.map(opt => opt.value);
    this.control.setValue([...this.selectedValues]);
  }

  toggleDropdown(event?: Event): void {
    if (event) event.stopPropagation();

    this.control.markAsTouched(); // ✅ FIX

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.searchControl.setValue('');
    }
  }

  @HostListener('document:click')
  closeDropdown() {
    if (this.isOpen) {
      this.control.markAsTouched(); // ✅ BEST UX FIX
    }
    this.isOpen = false;
  }

  trackByFn(index: number, item: SelectOption) {
    return item.value;
  }
}