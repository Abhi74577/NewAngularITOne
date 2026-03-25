# DynamicTable Component - Implementation Guide

## Quick Start

### 1. Import the DynamicTable Component

In your component file:

```typescript
import { DynamicTableComponent, ColumnConfig } from '../shared/components/DynamicTable';
```

Or using the barrel export:

```typescript
import { DynamicTableComponent, ColumnConfig } from '../shared/components/DynamicTable/index';
```

### 2. Add to Component Imports

```typescript
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  template: `
    <app-dynamic-table
      [columns]="columns"
      [data]="data()"
      [itemsPerPage]="10"
      [isLoading]="isLoading()"
      (editClick)="handleEdit($event)"
      (deleteClick)="handleDelete($event)"
      (downloadClick)="handleDownload($event)"
    ></app-dynamic-table>
  `,
})
export class MyComponent {}
```

### 3. Define Your Data Structure

```typescript
interface MyData {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
}
```

### 4. Set Up Component Logic

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, ColumnConfig } from '../shared/components/DynamicTable';

@Component({
  selector: 'app-my-table-demo',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './my-table-demo.component.html',
  styleUrls: ['./my-table-demo.component.scss'],
})
export class MyTableDemoComponent implements OnInit {
  // Define columns
  columns: ColumnConfig[] = [
    {
      header: 'ID',
      accessor: 'id',
      sortable: true,
      width: '80px',
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
      width: '200px',
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
      width: '250px',
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      width: '120px',
    },
    {
      header: 'Created',
      accessor: 'createdDate',
      sortable: true,
      width: '150px',
    },
  ];

  // State signals
  tableData = signal<MyData[]>([]);
  isLoading = signal<boolean>(false);
  itemsPerPage = signal<number>(10);

  // Sample data
  private mockData: MyData[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Active',
      createdDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Active',
      createdDate: '2024-02-20',
    },
    // ... more data
  ];

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Load data from API or mock source
   */
  loadData(): void {
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.tableData.set(this.mockData);
      this.isLoading.set(false);
    }, 500);
  }

  /**
   * Handle edit action
   */
  handleEdit(row: MyData): void {
    console.log('Edit:', row);
    // Implement edit logic
    // - Open modal
    // - Navigate to edit page
    // - Trigger API call
  }

  /**
   * Handle delete action
   */
  handleDelete(row: MyData): void {
    console.log('Delete:', row);
    const confirmed = confirm(`Delete ${row.name}?`);

    if (confirmed) {
      // Remove from table
      const updatedData = this.tableData().filter((item) => item.id !== row.id);
      this.tableData.set(updatedData);

      // In a real app, call API:
      // this.api.deleteItem(row.id).subscribe(...)
    }
  }

  /**
   * Handle download action
   */
  handleDownload(row: MyData): void {
    console.log('Download:', row);
    // Implement download logic
    // - Generate PDF
    // - Download Excel
    // - Export JSON
  }
}
```

### 5. Create Template (Optional if using templateUrl)

```html
<div class="container">
  <h1>My Data Table</h1>

  <app-dynamic-table
    [columns]="columns"
    [data]="tableData()"
    [itemsPerPage]="itemsPerPage()"
    [isLoading]="isLoading()"
    (editClick)="handleEdit($event)"
    (deleteClick)="handleDelete($event)"
    (downloadClick)="handleDownload($event)"
  ></app-dynamic-table>
</div>
```

## Integration with Existing Pages

### Example: Add to Users Component

```typescript
// src/app/pages/users/users.component.ts
import { DynamicTableComponent, ColumnConfig } from '../../shared/components/DynamicTable';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, DynamicFormRendererComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  tableColumns: ColumnConfig[] = [
    { header: 'ID', accessor: 'id', sortable: true, width: '80px' },
    { header: 'First Name', accessor: 'firstName', sortable: true },
    { header: 'Last Name', accessor: 'lastName', sortable: true },
    { header: 'Email', accessor: 'email', sortable: true },
    { header: 'Role', accessor: 'role', sortable: true, width: '120px' },
    { header: 'Status', accessor: 'status', sortable: true, width: '120px' },
    { header: 'Join Date', accessor: 'joinDate', sortable: true },
  ];

  tableData = signal<User[]>([]);
  isLoading = signal<boolean>(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
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

  onEditUser(user: User): void {
    // Open edit modal or navigate to edit page
    this.modalService.open(EditUserModal, { data: user });
  }

  onDeleteUser(user: User): void {
    if (confirm(`Delete ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers(); // Reload table
      });
    }
  }

  onDownloadUser(user: User): void {
    // Generate and download user data
    this.userService.downloadUserData(user.id);
  }
}
```

## Using with Forms

### Combined Form + Table Example

```typescript
@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, DynamicFormRendererComponent, DynamicTableComponent],
  template: `
    <div class="container">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Form Column -->
        <div class="lg:col-span-1">
          <h2>Add New User</h2>
          <app-dynamic-form-renderer
            [config]="formConfig"
            [formGroup]="userForm"
            (formSubmit)="onFormSubmit($event)"
          ></app-dynamic-form-renderer>
        </div>

        <!-- Table Column -->
        <div class="lg:col-span-2">
          <h2>All Users</h2>
          <app-dynamic-table
            [columns]="tableColumns"
            [data]="tableData()"
            [isLoading]="isLoading()"
            (editClick)="onEditUser($event)"
            (deleteClick)="onDeleteUser($event)"
          ></app-dynamic-table>
        </div>
      </div>
    </div>
  `,
})
export class UserManagementComponent {
  // ... implementation
}
```

## Routing Integration

### Add to App Routes

```typescript
// src/app/app.routes.ts
import { DemoTableComponent } from './layout/demo-table/demo-table.component';

export const routes: Routes = [
  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      {
        path: 'demo-table',
        component: DemoTableComponent,
      },
      // ... other routes
    ],
  },
];
```

## Common Patterns

### Pattern 1: Search and Filter

```typescript
export class SearchableTableComponent {
  globalSearch = signal<string>('');

  get filteredData(): MyData[] {
    const query = this.globalSearch().toLowerCase();
    return this.tableData().filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(query)
      )
    );
  }
}
```

### Pattern 2: Bulk Actions

```typescript
selectedRows = signal<MyData[]>([]);

onRowSelected(row: MyData): void {
  const current = this.selectedRows();
  const index = current.findIndex((r) => r.id === row.id);

  if (index > -1) {
    current.splice(index, 1);
  } else {
    current.push(row);
  }

  this.selectedRows.set([...current]);
}

onBulkDelete(): void {
  const ids = this.selectedRows().map((r) => r.id);
  // Call API to delete multiple items
  this.api.deleteMultiple(ids).subscribe(() => {
    this.loadData();
  });
}
```

### Pattern 3: Real-time Updates

```typescript
constructor(private dataService: DataService) {}

ngOnInit(): void {
  this.loadData();
  this.subscribeToUpdates();
}

subscribeToUpdates(): void {
  this.dataService.onDataChange().subscribe((updatedItem) => {
    const current = this.tableData();
    const index = current.findIndex((item) => item.id === updatedItem.id);

    if (index > -1) {
      current[index] = updatedItem;
      this.tableData.set([...current]);
    }
  });
}
```

## Troubleshooting

### Table Not Showing Data

1. Verify columns have correct `accessor` values
2. Check if data is being set: `console.log(this.tableData())`
3. Ensure component is imported in parent
4. Check browser console for errors

### Sorting Not Working

1. Set `sortable: true` in column config
2. Ensure data field supports comparison
3. Check for null/undefined values in data

### Search Not Working

1. Verify search input binds to `searchQuery`
2. Check that accessor paths are correct
3. Test with simple string data first

### Styling Issues

1. Ensure Tailwind CSS is configured
2. Check that SCSS file is properly imported
3. Verify dark mode class is applied to HTML element

---

For more examples, see the demo component at `layout/demo-table/demo-table.component.ts`
