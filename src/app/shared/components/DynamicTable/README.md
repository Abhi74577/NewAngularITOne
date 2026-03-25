# Dynamic Table Component

A reusable, feature-rich, and fully responsive table component for Angular with built-in support for pagination, sorting, filtering, and actions.

## 📁 Files Structure

```
shared/components/DynamicTable/
├── dynamic-table.component.ts       # Component logic
├── dynamic-table.component.html     # Template
├── dynamic-table.component.scss     # Styles
└── index.ts                         # Barrel export

layout/demo-table/
├── demo-table.component.ts          # Demo component with mock data
├── demo-table.component.html        # Demo template
└── demo-table.component.scss        # Demo styles
```

## ✨ Features

### Core Features
- **Client-side Pagination** - Navigate through data with configurable page size
- **Global Search/Filter** - Search across all columns instantly
- **Column Sorting** - Click column headers to sort ascending/descending
- **Action Buttons** - Edit, Delete, and Download buttons for each row
- **Responsive Design** - Works seamlessly on all device sizes
- **Dark Mode Support** - Full light and dark theme support using Tailwind CSS
- **Loading State** - Show loading indicator while data is being fetched
- **Empty State** - Display friendly message when no data is available

### Design Features
- Modern, clean, professional dashboard UI
- Hover effects and smooth transitions
- Rounded corners and subtle shadows
- Proper spacing and typography
- High contrast for readability in both light and dark modes
- Fully accessible with proper semantic HTML

## 🚀 Basic Usage

### Import the Component

```typescript
import { DynamicTableComponent, ColumnConfig } from '../shared/components/DynamicTable';
```

### Define Columns

```typescript
columns: ColumnConfig[] = [
  { header: 'ID', accessor: 'id', sortable: true, width: '80px' },
  { header: 'Name', accessor: 'name', sortable: true, width: '180px' },
  { header: 'Email', accessor: 'email', sortable: true, width: '220px' },
  { header: 'Status', accessor: 'status', sortable: true, width: '120px' },
];
```

### Basic Component Setup

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DynamicTableComponent,
  ColumnConfig,
  TableActionsConfig,
} from '../shared/components/DynamicTable';

@Component({
  selector: 'app-my-table',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  template: `
    <app-dynamic-table
      [columns]="columns"
      [data]="tableData()"
      [itemsPerPage]="10"
      [isLoading]="isLoading()"
      [actions]="tableActions"
      (editClick)="onEdit($event)"
      (deleteClick)="onDelete($event)"
      (downloadClick)="onDownload($event)"
    ></app-dynamic-table>
  `,
})
export class MyTableComponent implements OnInit {
  columns: ColumnConfig[] = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
  ];

  tableData = signal<any[]>([]);
  isLoading = signal<boolean>(false);

  tableActions: TableActionsConfig = {
    onEdit: (row) => this.onEdit(row),
    onDelete: (row) => this.onDelete(row),
    onDownload: (row) => this.onDownload(row),
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    // Fetch data from API
    setTimeout(() => {
      this.tableData.set([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ]);
      this.isLoading.set(false);
    }, 1000);
  }

  onEdit(row: any): void {
    console.log('Edit:', row);
  }

  onDelete(row: any): void {
    console.log('Delete:', row);
  }

  onDownload(row: any): void {
    console.log('Download:', row);
  }
}
```

## 📋 Component API

### Inputs

```typescript
@Input() columns: ColumnConfig[] = [];
// Array of column definitions

@Input() data: any[] = [];
// Array of data objects to display

@Input() actions?: TableActionsConfig;
// Action handlers configuration

@Input() itemsPerPage = 10;
// Number of items to display per page (default: 10)

@Input() isLoading = false;
// Show loading state (default: false)
```

### Outputs

```typescript
@Output() editClick = new EventEmitter<any>();
// Emitted when Edit button is clicked

@Output() deleteClick = new EventEmitter<any>();
// Emitted when Delete button is clicked

@Output() downloadClick = new EventEmitter<any>();
// Emitted when Download button is clicked
```

### Interfaces

```typescript
/**
 * Column configuration
 */
export interface ColumnConfig {
  header: string;        // Column header text
  accessor: string;      // Data accessor (supports dot notation for nested data)
  sortable?: boolean;    // Enable sorting on this column (default: false)
  width?: string;        // Column width (e.g., '200px', '25%')
}

/**
 * Table actions configuration
 */
export interface TableActionsConfig {
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onDownload?: (row: any) => void;
}
```

## 🎯 Advanced Usage

### Nested Data Support

The component supports accessing nested data using dot notation:

```typescript
columns: ColumnConfig[] = [
  { header: 'User Name', accessor: 'user.fullName', sortable: true },
  { header: 'Department', accessor: 'user.department.name', sortable: true },
];
```

### Configurable Pagination

```typescript
<app-dynamic-table
  [columns]="columns"
  [data]="data()"
  [itemsPerPage]="25"
></app-dynamic-table>
```

### Dynamic Actions

```typescript
export class MyComponent {
  tableActions: TableActionsConfig = {
    onEdit: (row) => this.openEditModal(row),
    onDelete: (row) => this.confirmAndDelete(row),
    // Download action is optional
  };

  // Only provide the actions you need
  // Buttons will still be rendered, but won't trigger any action
}
```

### With API Integration

```typescript
export class UserTableComponent implements OnInit {
  tableData = signal<User[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.tableData.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(user: User): void {
    if (confirm(`Delete ${user.name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.tableData.update((users) => users.filter((u) => u.id !== user.id));
        },
        error: (error) => console.error('Error deleting user:', error),
      });
    }
  }
}
```

## 🎨 Styling

### Using Tailwind CSS

The component uses Tailwind CSS for styling. Ensure Tailwind CSS is properly configured in your project.

```scss
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Custom Styling

Override component styles in your parent component:

```scss
.dynamic-table-wrapper {
  // Your custom styles here
}
```

## 🌙 Dark Mode Support

The component automatically supports dark mode when using Tailwind's dark mode:

```html
<html class="dark">
  <!-- Dark mode enabled -->
</html>
```

The component uses `dark:` prefixed classes to ensure proper styling in dark mode.

## 📱 Responsive Behavior

The component is fully responsive:

- **Desktop (1024px+)**: Full table layout with all features visible
- **Tablet (768px - 1023px)**: Optimized spacing, compact pagination
- **Mobile (< 768px)**: Stacked layout, simplified controls

## 🐛 Demo Component

A complete demo component with mock data is available at:

```
layout/demo-table/demo-table.component.ts
```

### Features Demonstrated:

- 15+ sample users with various roles and departments
- Edit, Delete, and Download action handlers
- Pagination with configurable items per page
- Loading state simulation
- Feature showcase card

### Use the Demo:

```typescript
import { DemoTableComponent } from './layout/demo-table/demo-table.component';

// In your app routing or parent component
{
  path: 'demo-table',
  component: DemoTableComponent,
}
```

## 🔑 Key Methods

### Public Methods

```typescript
// Sorting
isSortedColumn(column: ColumnConfig): boolean;
getSortDirection(column: ColumnConfig): 'asc' | 'desc' | null;
onColumnClick(column: ColumnConfig): void;

// Pagination
goToPage(page: number): void;
getPageNumbers(): number[];

// Search
resetSearch(): void;

// Data Access
getNestedValue(obj: any, path: string): any;
hasData(): boolean;
```

### Computed Properties

```typescript
filteredData;      // Data after search/filter
sortedData;        // Data after sorting
paginatedData;     // Currently displayed data
totalPages;        // Total number of pages
totalRecords;      // Total filtered records
```

## 💡 Best Practices

1. **Always define columns with proper widths** for better table layout
2. **Use sortable: true** only for columns that make sense to sort
3. **Implement proper error handling** in action callbacks
4. **Show loading state** while fetching data from API
5. **Provide meaningful column headers** for better UX
6. **Use unique IDs in your data** for proper row tracking
7. **Test on mobile devices** to ensure responsive design works as expected

## 🚦 Performance Tips

1. For large datasets (> 1000 rows), implement server-side pagination
2. Use `OnPush` change detection strategy if needed
3. Unsubscribe from observables using `takeUntil` pattern
4. Consider virtual scrolling for very large lists

## 🤝 Integration Examples

### With Modal Service

```typescript
constructor(private modalService: ModalService) {}

onEdit(user: User): void {
  this.modalService.open(EditUserModalComponent, { data: user });
}
```

### With Notifications

```typescript
constructor(private notificationService: NotificationService) {}

onDelete(user: User): void {
  if (confirm(`Delete ${user.name}?`)) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.notificationService.success(`${user.name} deleted successfully`);
        this.loadData();
      },
      error: () => {
        this.notificationService.error('Failed to delete user');
      },
    });
  }
}
```

## 📝 Notes

- Search is case-insensitive
- Sorting resets pagination to page 1
- Searching resets pagination to page 1
- Component uses Angular Signals for modern state management
- All data modifications update the table reactively

## 🔄 Version History

- **v1.0.0** - Initial release with core features

---

For more examples, check the `layout/demo-table/demo-table.component.ts` file.
