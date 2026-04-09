import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { MultiselectComponent } from '@app/shared/components/form';
import { ColumnConfig, DynamicTableComponent, ExpandableTableConfig } from '@app/shared/components/DynamicTable';
import { BaseService } from '@app/shared/services/baseService.service';
import { LookupType } from '@app/shared/models/LookUP';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MultiselectComponent, DynamicTableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

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
      role: [1, 2, 3],
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
      role: [1, 2, 3],
      status: 'Active',
      joinDate: '2024-01-22',
      phone: '+1-555-0105',
      lstTechnologies: [1, 3]
    },
    {
      id: 6,
      name: 'Jessica Davis',
      email: 'jessica.davis@example.com',
      role: [1, 2, 3],
      status: 'Active',
      joinDate: '2024-02-18',
      phone: '+1-555-0106',
      lstTechnologies: [1, 3]
    }
  ];
  // itemsPerPage = signal<number>(5);
  pageNo = 1;
  pageSize = 10;
  sort = 'systemuserId desc';
  search = '';
  totalRecords = 0
  columns: any[] = [

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
  isFormVisible: boolean = false;
  dataUserSource: any[] = [];
  dtUserOptions: any = [];
  roleList: any = [];
  LstLookup: any = [];
  LstTechnology: any = [];
  // search: string = 'systemUserId';

  constructor(private fb: FormBuilder, private baseService: BaseService) { }

  ngOnInit(): void {
    this.refreshUserTable();
    this.createUserForm();
    // this.loadTableData();
    this.getRole();
    this.getLookup();
    this.getUsers();
  }

  refreshUserTable() {
    const columnList = [
      { key: 'fullName', value: 'Name', type: '', sortable: true, width: '20%' },
      { key: 'roleName', value: 'Assigned Roles', type: '', sortable: true, width: '15%' },
      { key: 'email', value: 'Email', type: '', sortable: true, width: '20%' },
      { key: 'userName', value: 'Username', type: '', sortable: true, width: '15%' },
      { key: 'createdOn', value: 'Registration Date', type: 'datetime', sortable: true, width: '20%' },
      { key: 'systemUserId', value: 'Action', type: 'edit', sortable: false, width: '10%' }
    ];



    // if (this.objPermission.isEdit) {
    //   columnList.push({ key: 'systemUserId', value: 'Action', type: 'edit', sortable: false, width: '10%' })
    // }


    this.dtUserOptions = {
      ...this.dtUserOptions,
      data: this.dataUserSource,
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      totalRecord: this.totalRecords,
      serverSidePaging: true,
      search: this.search,
      sort: this.sort,
      columnList,
      expandableConfig: this.expandableConfig
    };

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


  onPageChange(newPage: number): void {
    this.pageNo = newPage;
    this.getUsers()
    console.log('Page changed to:', newPage);
  }

  /**
   * Handle edit action - called when Edit button is clicked
   */
  onEdit(row: any): void {
    console.log('Edit action triggered for:', row);

    this.pageFormUser.patchValue({
      name: row.fullName,
      email: row.email,
      userName: row.userName,
      registrationDate: row.createdOn,
      // roleId: row.role,
      systemUserId: row.systemUserId,
      // lstTechnologies: row.lstTechnologies
    });

    this.getRolesByUserName(row.userName);
    this.getTechnologies(row.systemUserId);

    // if (this.pageFormUser.controls['RoleId'].value > 0) {
    //   this.roleId = this.pageFormUser.controls['RoleId'].value;

    // }
    this.isFormVisible = true;

    // alert(`Edit user: ${row.name} (ID: ${row.id})`);

    // In a real application, you would:
    // - Open an edit modal
    // - Navigate to an edit page
    // - Trigger an API call
  }

  getRolesByUserName(username: any) {
    this.baseService.callAPI('GET', `/ITOneUsers/GetRolesByUserName?userName=${username}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          var myArray = res.split(',')
          for (var i = 0; i < myArray.length; i++) { myArray[i] = +myArray[i]; }
          console.log(this.roleList);
          console.log(myArray);
          this.pageFormUser.patchValue({
            roleId: myArray
          });
        }
      });
  }

  getTechnologies(systemUserId: any) {
    this.baseService.callAPI('GET', `/ITOneRoles/GetUserTechnologies?systemuserId=${systemUserId}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.pageFormUser.patchValue({
            lstTechnologies: res
          });
        }
      });
    // this.showList = false;
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

  }

  /**
   * Reload table data
   */
  reloadData(): void {
    this.getUsers()
  }

  /**
   * Change items per page
   */
  changeItemsPerPage(newValue: any): void {
    console.log(newValue)
    this.pageSize = newValue;
    this.pageNo = 1;
    this.getUsers()
  }

  onSerchChange(newVal: any): void {
    this.search = newVal.trim();
    console.log(this.search)
    this.getUsers();
    // this.loadTableData();
  }


  getUsers() {
    this.baseService.callAPI('GET',
      `/ITOneUsers?pageNo=${this.pageNo}&pageSize=${this.pageSize}&sortBy=${this.sort}&searchBy=${this.search}`
      , null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, false);
        if (res) {

          this.dataUserSource = [...res.pageData];

          this.totalRecords = res.totalCount;
          this.dtUserOptions.totalfilteredRecord = res.filteredCount;

          this.refreshUserTable();

        }
      });
  }

  getRole() {
    this.baseService.callAPI('GET', '/ITOneRoles/Roles', null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.roleList = (res.map((e: any) => (
            { value: e.roleId, label: e.roleName })));
        }
      });

  }

  getLookup() {
    this.baseService.callAPI('GET', `/LookupTypeValue/GetLookupValues`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.LstLookup = res;
          this.LstTechnology = (res.filter((x: any) => x.lookupTypeId === LookupType.Technology).map((e: any) => (
            { value: e.lookupValueId, label: e.lookupValue })));
        }
      });
  }
}