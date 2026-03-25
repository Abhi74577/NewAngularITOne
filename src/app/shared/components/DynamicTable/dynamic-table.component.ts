import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ColumnConfig {
  key: string;
  label: string;
  type?: string;
  sortable?: boolean;
  width?: string;
  // Support both old and new property names for backward compatibility
  header?: string;
  accessor?: string;
}

export interface TableActionsConfig {
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDownload?: (row: any) => void;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-table.component.html',
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Input() actions?: TableActionsConfig;
  @Input() itemsPerPage = 10;
  @Input() isLoading = false;

  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() downloadClick = new EventEmitter<any>();

  // Signals for state management
  searchQuery = signal<string>('');
  sortConfig = signal<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  pageSizeOptions = [10, 20, 50, 100];

  // Computed signals for filtered and sorted data
  filteredData = computed(() => {
    let result = [...this.data];

    // Apply search filter
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter((row) =>
        this.columns.some((col) => {
          const accessor = this.getColumnAccessor(col);
          const value = this.getNestedValue(row, accessor);
          return value?.toString().toLowerCase().includes(query);
        })
      );
    }

    return result;
  });

  sortedData = computed(() => {
    let result = [...this.filteredData()];
    const sort = this.sortConfig();

    if (sort) {
      result.sort((a, b) => {
        const valueA = this.getNestedValue(a, sort.column);
        const valueB = this.getNestedValue(b, sort.column);

        if (valueA === valueB) return 0;
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;

        // Handle numeric comparison
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sort.direction === 'asc' ? valueA - valueB : valueB - valueA;
        }

        const comparison = valueA < valueB ? -1 : 1;
        return sort.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  paginatedData = computed(() => {
    const sorted = this.sortedData();
    const pageSize = this.pageSize();
    const pageIndex = this.currentPage() - 1;
    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return sorted.slice(start, end);
  });

  totalPages = computed(() => {
    const total = this.sortedData().length;
    return Math.ceil(total / this.pageSize());
  });

  totalRecords = computed(() => this.sortedData().length);

  ngOnInit(): void {
    this.currentPage.set(1);
    const initialPageSize = this.itemsPerPage || 10;
    this.pageSize.set(initialPageSize);
    
    // Ensure pageSizeOptions includes the initial page size
    if (!this.pageSizeOptions.includes(initialPageSize)) {
      this.pageSizeOptions = [...this.pageSizeOptions, initialPageSize].sort((a, b) => a - b);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.currentPage.set(1);
    }
  }

  /**
   * Get accessor name from column config (supports both new and old property names)
   */
  getColumnAccessor(column: ColumnConfig): string {
    return column.key || column.accessor || '';
  }

  /**
   * Get nested value from object using dot notation (e.g., "user.name")
   */
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Handle column header click for sorting
   */
  onColumnClick(column: ColumnConfig): void {
    if (!column.sortable) return;

    const accessor = this.getColumnAccessor(column);
    const currentSort = this.sortConfig();
    let newDirection: 'asc' | 'desc' = 'asc';

    if (currentSort?.column === accessor) {
      newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    }

    this.sortConfig.set({
      column: accessor,
      direction: newDirection,
    });
    this.currentPage.set(1);
  }

  /**
   * Check if column is currently sorted
   */
  isSortedColumn(column: ColumnConfig): boolean {
    const accessor = this.getColumnAccessor(column);
    return this.sortConfig()?.column === accessor;
  }

  /**
   * Get sort direction for a column
   */
  getSortDirection(column: ColumnConfig): 'asc' | 'desc' | null {
    const sort = this.sortConfig();
    const accessor = this.getColumnAccessor(column);
    if (sort && sort.column === accessor) {
      return sort.direction;
    }
    return null;
  }

  /**
   * Handle pagination
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  /**
   * Get page numbers for pagination
   */
  getPageNumbers(): number[] {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();
    const pages: number[] = [];
    const delta = 2;

    // Always show first page
    pages.push(1);

    // Show pages around current page
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) {
      pages.push(-1); // Represents "..."
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push(-1); // Represents "..."
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  /**
   * Handle edit action
   */
  onEdit(row: any): void {
    if (this.actions?.onEdit) {
      this.actions.onEdit(row);
    }
    this.editClick.emit(row);
  }

  /**
   * Handle delete action
   */
  onDelete(row: any): void {
    if (this.actions?.onDelete) {
      this.actions.onDelete(row);
    }
    this.deleteClick.emit(row);
  }

  /**
   * Handle download action
   */
  onDownload(row: any): void {
    if (this.actions?.onDownload) {
      this.actions.onDownload(row);
    }
    this.downloadClick.emit(row);
  }

  /**
   * Handle page size change
   */
  onPageSizeChange(newSize: number | string): void {
    const size = typeof newSize === 'string' ? parseInt(newSize, 10) : newSize;
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  /**
   * Reset search and pagination
   */
  resetSearch(): void {
    this.searchQuery.set('');
    this.currentPage.set(1);
  }

  /**
   * Check if there is any data to display
   */
  hasData(): boolean {
    return this.paginatedData().length > 0;
  }
}
