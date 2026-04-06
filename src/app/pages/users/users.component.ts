import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { MultiselectComponent } from '@app/shared/components/form';
import { ColumnConfig, DynamicTableComponent, ExpandableTableConfig } from '@app/shared/components/DynamicTable';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiselectComponent, DynamicTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
// Sample user data
  users: any[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: [2],
      status: 'Active',
      joinDate: '2023-01-15',
      phone: '+1-555-0101',
      lstTechnologies: [1, 3]
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      role: [1],
      status: 'Active',
      joinDate: '2023-03-20',
      phone: '+1-555-0102',
      lstTechnologies: [1, 3]
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      role: [1,2,3],
      status: 'Active',
      joinDate: '2023-06-10',
      phone: '+1-555-0103',
      lstTechnologies: [1, 3]
    },
    {
      id: 4,
      name: 'Emily Williams',
      email: 'emily.williams@example.com',
      role: [1],
      status: 'Inactive',
      joinDate: '2023-02-14',
      phone: '+1-555-0104',
      lstTechnologies: [1, 3]
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
    role: [1,2,3],
      status: 'Active',
      joinDate: '2024-01-22',
      phone: '+1-555-0105',
      lstTechnologies: [1, 3]
    },
    {
      id: 6,
      name: 'Jessica Davis',
      email: 'jessica.davis@example.com',
      role: [1,2,3],
      status: 'Active',
      joinDate: '2024-02-18',
      phone: '+1-555-0106',
      lstTechnologies: [1, 3]
    }
  ];
    itemsPerPage = signal<number>(5);

   columns: ColumnConfig[] = [
      { key: 'id', label: 'Id', type: 'ID', sortable: true, width: '80px' },
      { key: 'name', label: 'Name', type: 'text', sortable: true, width: '180px' },
      { key: 'email', label: 'Email', type: 'text', sortable: true, width: '220px' },
      { key: 'status', label: 'Status', type: 'text', sortable: true, width: '150px' },
    ];
  
    // 🔹 Expanded table columns (for nested table)
    expandableConfig: ExpandableTableConfig = {
      enabled: true,
      columns: [
        
        { key: 'role', label: 'Role' },
        { key: 'phone', label: 'Phone' },
        { key: 'joinDate', label: 'Join Date' }
      ]
    };
    
  pageFormUser!: FormGroup;
    teamOptions = [
    { label: "Network Team", value: 1 },
    { label: "Database Team", value: 2 },
    { label: "Security Team", value: 3 },
    { label: "IT Operations", value: 4 },
    { label: "Architecture Team", value: 5 },
    { label: "DevOps Team", value: 6 }
  ];
    isLoading = signal<boolean>(false);
   tableData = signal<any>([]);
isFormVisible :boolean =false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createUserForm();
      this.loadTableData();
  }

  /**
   * Load mock data into the table
   */
    loadTableData(): void {
    this.isLoading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      this.tableData.set(this.users);
      this.isLoading.set(false);
    }, 500);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createUserForm() {
    this.pageFormUser = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: [''],
      registrationDate: [''],
      roleId: [''],
      systemUserId: [0],
      lstTechnologies: [[]]
    });
  }

  submit() {
    if (this.pageFormUser.invalid) {
      this.pageFormUser.markAllAsTouched();
      return;
    }

    console.log(this.pageFormUser.value);
  }

  
  /**
   * Handle edit action - called when Edit button is clicked
   */
  onEdit(row: any): void {
    console.log('Edit action triggered for:', row);

    this.pageFormUser.patchValue({
      name: row.name,
      email: row.email,
      userName: row.name.toLowerCase().replace(/\s/g, '.'),
      registrationDate: row.joinDate,
      roleId: row.role,
      systemUserId: row.id,
      lstTechnologies: row.lstTechnologies
    });
    this.isFormVisible = true;
    
    // alert(`Edit user: ${row.name} (ID: ${row.id})`);

    // In a real application, you would:
    // - Open an edit modal
    // - Navigate to an edit page
    // - Trigger an API call
  }

  /**
   * Handle delete action - called when Delete button is clicked
   */
  onDelete(row: any): void {
    console.log('Delete action triggered for:', row);

    const confirmed = confirm(`Are you sure you want to delete ${row.name}?`);
    
  }

  /**
   * Handle download action - called when Download button is clicked
   */
  onDownload(row: any): void {
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