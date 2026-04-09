import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,

  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* ==================== INTERFACES ==================== */

export interface ColumnConfig {
  key: string;
  value?: string;   // header text
  label?: string;   // backward compatibility
  type?: string;
  sortable?: boolean;
  width?: string;
}

export interface ExpandableTableConfig {
  enabled?: boolean;
  columns: ColumnConfig[];
}

export interface DtUserOptions {
  data: any[];
  pageNo: number;
  pageSize: number;
  totalRecord: number;
  serverSidePaging: boolean;
  search?: string;
  sort?: string;
  columnList: ColumnConfig[];
  expandableConfig?: ExpandableTableConfig;
}

/* ==================== COMPONENT ==================== */

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent implements OnChanges {

  /* ==================== INPUTS ==================== */

  @Input() dtUserOptions!: DtUserOptions;
  @Input() isLoading = false;

  /* ==================== OUTPUTS ==================== */

  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() downloadClick = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSort = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() onTableAction = new EventEmitter<any>();
  /* ==================== SIGNAL STATE ==================== */

  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(10);

  sortConfig = signal<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  expandedRowId = signal<number | string | null>(null);

  pageSizeOptions = [5, 10, 20, 50, 100];

  /* ==================== HELPERS ==================== */

  get isServerSide(): boolean {
    return !!this.dtUserOptions?.serverSidePaging;
  }

  columns = (() => this.dtUserOptions?.columnList ?? []);
  expandableConfig = (() => this.dtUserOptions?.expandableConfig);

  /* ==================== DATA PIPELINE ==================== */

  /** STEP 1: SORTED DATA */
  sortedData = (() => {
    const data = [...(this.dtUserOptions?.data ?? [])];
    const sort = this.sortConfig();

    if (!sort || this.isServerSide) return data;

    return data.sort((a, b) => {
      const valA = this.getNestedValue(a, sort.column);
      const valB = this.getNestedValue(b, sort.column);

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sort.direction === 'asc' ? valA - valB : valB - valA;
      }

      return sort.direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  });

  /** STEP 2: PAGINATED DATA (FINAL TABLE SOURCE) */
  paginatedData = (() => {
    const data = this.sortedData();

    if (this.isServerSide) {
      return data;
    }

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return data.slice(start, end);
  });

  /* ==================== TOTALS ==================== */

  totalRecords = (() => {
    return this.isServerSide
      ? this.dtUserOptions?.totalRecord ?? 0
      : this.sortedData().length;
  });

  totalPages = (() =>
    Math.ceil(this.totalRecords() / this.pageSize())
  );

  /* ==================== LIFECYCLE ==================== */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dtUserOptions'] && this.dtUserOptions) {
      this.currentPage.set(this.dtUserOptions.pageNo);
      this.pageSize.set(this.dtUserOptions.pageSize);
      this.searchQuery.set(this.dtUserOptions.search ?? '');
    }
  }

  /* ==================== SEARCH ==================== */

  filterData(): void {
    this.currentPage.set(1);
    this.onSearch.emit(this.searchQuery());
  }

  resetSearch(): void {
    this.searchQuery.set('');
    this.onSearch.emit('');
  }

  /* ==================== SORT ==================== */

  onColumnClick(column: ColumnConfig): void {
    if (!column.sortable) return;

    const current = this.sortConfig();
    let direction: 'asc' | 'desc' = 'asc';

    if (current?.column === column.key) {
      direction = current.direction === 'asc' ? 'desc' : 'asc';
    }

    this.sortConfig.set({ column: column.key, direction });
    this.currentPage.set(1);

    if (this.isServerSide) {
      this.onSort.emit(`${column.key} ${direction}`);
    }
  }

  isSortedColumn(column: ColumnConfig): boolean {
    return this.sortConfig()?.column === column.key;
  }

  getSortDirection(column: ColumnConfig): 'asc' | 'desc' | null {
    return this.sortConfig()?.column === column.key
      ? this.sortConfig()?.direction ?? null
      : null;
  }

  /* ==================== PAGINATION ==================== */

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);

    if (this.isServerSide) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);

    if (this.isServerSide) {
      this.pageSizeChange.emit(size);
    }
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const pages: number[] = [];

    pages.push(1);

    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);

    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);

    if (total > 1) pages.push(total);

    return pages;
  }

  /* ==================== ACTIONS ==================== */

  onAction(row: any, actiontype:any): void {
    let data = {
      type:actiontype,
      row
    }
    this.onTableAction.emit(data);
  }

  onEdit(row: any): void {
    this.editClick.emit(row);
  }

  onDelete(row: any): void {
    this.deleteClick.emit(row);
  }

  onDownload(row: any): void {
    this.downloadClick.emit(row);
  }

  /* ==================== EXPAND ==================== */

  toggleRowExpand(row: any): void {
    this.expandedRowId.set(
      this.expandedRowId() === row.systemUserId ? null : row.systemUserId
    );
  }

  isRowExpanded(row: any): boolean {
    return this.expandedRowId() === row.systemUserId;
  }

  getColspanCount(): number {
    let count = this.columns().length + 1;
    if (this.expandableConfig()?.enabled) count += 1;
    return count;
  }

  /* ==================== UTILS ==================== */

  getColumnAccessor(column: ColumnConfig): string {
    return column.key;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  hasData(): boolean {
    return this.paginatedData().length > 0;
  }
}