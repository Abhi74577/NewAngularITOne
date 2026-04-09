import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, ColumnConfig, ExpandableTableConfig } from '../../shared/components/DynamicTable/dynamic-table.component';

interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  department: string;
}

@Component({
  selector: 'app-demo-table',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './demo-table.component.html',
  styleUrls: ['./demo-table.component.scss'],
})
export class DemoTableComponent implements OnInit {
  // Column configuration
  // columns: ColumnConfig[] = [
  //   { key: 'id', label: 'Id', type: 'ID', sortable: true, width: '80px' },
  //   { key: 'name', label: 'Name', type: 'text', sortable: true, width: '180px' },
  //   { key: 'email', label: 'Email', type: 'text', sortable: true, width: '220px' },
  //   { key: 'department', label: 'Department', type: 'text', sortable: true, width: '150px' },
  // ];

  // 🔹 Expanded table columns (for nested table)
  expandableConfig: ExpandableTableConfig = {
    enabled: true,
    columns: [
      { key: 'email', label: 'Email' },
      { key: 'department', label: 'Department' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status' },
      { key: 'joinDate', label: 'Join Date' }
    ]
  };

  // State signals
  tableData = signal<DemoUser[]>([]);
  isLoading = signal<boolean>(false);
  itemsPerPage = signal<number>(5);

  // Mock data
  mockUsers: DemoUser[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2023-01-15',
      department: 'IT',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-02-20',
      department: 'HR',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2023-03-10',
      department: 'Sales',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-04-05',
      department: 'IT',
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.brown@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2023-05-12',
      department: 'Finance',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2023-06-18',
      department: 'Marketing',
    },
    {
      id: 7,
      name: 'David Miller',
      email: 'david.miller@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-07-22',
      department: 'Operations',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2023-08-30',
      department: 'IT',
    },
    {
      id: 9,
      name: 'James Taylor',
      email: 'james.taylor@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2023-09-11',
      department: 'Sales',
    },
    {
      id: 10,
      name: 'Patricia Thomas',
      email: 'patricia.thomas@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2023-10-25',
      department: 'HR',
    },
    {
      id: 11,
      name: 'Christopher White',
      email: 'christopher.white@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2023-11-08',
      department: 'Finance',
    },
    {
      id: 12,
      name: 'Jennifer Harris',
      email: 'jennifer.harris@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2023-12-15',
      department: 'IT',
    },
    {
      id: 13,
      name: 'Daniel Martin',
      email: 'daniel.martin@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2024-01-20',
      department: 'Marketing',
    },
    {
      id: 14,
      name: 'Karen Lee',
      email: 'karen.lee@example.com',
      role: 'Manager',
      status: 'Active',
      joinDate: '2024-02-10',
      department: 'Operations',
    },
    {
      id: 15,
      name: 'Matthew Clark',
      email: 'matthew.clark@example.com',
      role: 'User',
      status: 'Inactive',
      joinDate: '2024-03-05',
      department: 'Sales',
    },
  ];

  ngOnInit(): void {
    this.loadTableData();
  }

  /**
   * Load mock data into the table
   */
  loadTableData(): void {
    this.isLoading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      this.tableData.set(this.mockUsers);
      this.isLoading.set(false);
    }, 500);
  }

  /**
   * Handle edit action - called when Edit button is clicked
   */
  onEdit(row: DemoUser): void {
    console.log('Edit action triggered for:', row);
    alert(`Edit user: ${row.name} (ID: ${row.id})`);

    // In a real application, you would:
    // - Open an edit modal
    // - Navigate to an edit page
    // - Trigger an API call
  }

  /**
   * Handle delete action - called when Delete button is clicked
   */
  onDelete(row: DemoUser): void {
    console.log('Delete action triggered for:', row);

    const confirmed = confirm(`Are you sure you want to delete ${row.name}?`);
    if (confirmed) {
      const updatedData = this.tableData().filter((user) => user.id !== row.id);
      this.tableData.set(updatedData);
      alert(`User ${row.name} has been deleted.`);

      // In a real application, you would:
      // - Call a delete API endpoint
      // - Handle errors gracefully
      // - Show a success notification
    }
  }

  /**
   * Handle download action - called when Download button is clicked
   */
  onDownload(row: DemoUser): void {
    console.log('Download action triggered for:', row);
    alert(`Downloading data for user: ${row.name}`);

    // In a real application, you would:
    // - Generate a PDF/Excel file
    // - Trigger a file download
    // - Show download progress
  }

  /**
   * Reload table data
   */
  reloadData(): void {
    this.loadTableData();
  }

  /**
   * Change items per page
   */
  changeItemsPerPage(newValue: any): void {
    this.itemsPerPage.set(newValue);
  }
}
