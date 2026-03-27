import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SelectComponent, MultiselectComponent } from "../../shared/components/form";

interface BcdrRequest {
  id: number;
  name: string;
  division: string;
  status: "Pending" | "In Progress" | "Completed" | "On Hold";
  priority?: "Critical" | "High" | "Medium" | "Low";
  recoveryStrategy?: "Hot Standby" | "Warm Standby" | "Cold Standby" | "Hybrid";
  assignedTeams?: number[];
  createdDate: Date;
  description: string;
}

@Component({
  selector: 'app-bcdrrequest',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule, 
    CommonModule,
    SelectComponent,
    MultiselectComponent
  ],
  templateUrl: './bcdrrequest.component.html',
  styleUrls: ['./bcdrrequest.component.css'],
})

export class BcdrrequestComponent implements OnInit {
  // Mock Data
  requests: BcdrRequest[] = [
    {
      id: 1,
      name: "System Recovery Plan",
      division: "IT Infrastructure",
      status: "Completed",
      priority: "Critical",
      recoveryStrategy: "Hot Standby",
      assignedTeams: [1, 3],
      createdDate: new Date("2025-03-15"),
      description: "Complete recovery plan for main servers"
    },
    {
      id: 2,
      name: "Database Backup",
      division: "Database Team",
      status: "In Progress",
      priority: "High",
      recoveryStrategy: "Warm Standby",
      assignedTeams: [2],
      createdDate: new Date("2025-03-20"),
      description: "Automated backup configuration"
    },
    {
      id: 3,
      name: "Disaster Recovery Test",
      division: "Operations",
      status: "Pending",
      priority: "Medium",
      recoveryStrategy: "Cold Standby",
      assignedTeams: [4, 5],
      createdDate: new Date("2025-03-22"),
      description: "Quarterly DR testing cycle"
    },
    {
      id: 4,
      name: "Network Redundancy",
      division: "Network Team",
      status: "On Hold",
      priority: "High",
      recoveryStrategy: "Hybrid",
      assignedTeams: [1, 6],
      createdDate: new Date("2025-03-10"),
      description: "Implement failover network infrastructure"
    },
    {
      id: 5,
      name: "Cloud Migration Plan",
      division: "Architecture",
      status: "Pending",
      priority: "Medium",
      recoveryStrategy: "Hot Standby",
      assignedTeams: [5, 6],
      createdDate: new Date("2025-03-25"),
      description: "Migrate critical systems to cloud"
    }
  ];

  // UI State
  darkMode: boolean = false;
  showModal: boolean = false;
  isEditMode: boolean = false;
  searchQuery: string = "";
  filterStatus: string = "All";
  selectedRequest: BcdrRequest | null = null;

  // Form
  form!: FormGroup;

  // Filter options
  statusOptions = ["All", "Pending", "In Progress", "Completed", "On Hold"];
  divisions = ["IT Infrastructure", "Database Team", "Operations", "Network Team", "Architecture"];
   tabList = [{ id: 1, name: 'Scope' },
  { id: 2, name: 'Mandatory Details' },
  { id: 3, name: 'Recovery Objectives' },
  { id: 4, name: 'Recovery Strategy' },
  { id: 5, name: 'Return to Operation' }
  ];
  // Pre-computed options for dynamic components
  divisionOptions = this.divisions.map(d => ({ label: d, value: d }));
  statusFilterOptions = this.statusOptions
    .filter(s => s !== 'All')
    .map(s => ({ label: s, value: s }));
  
  // New select fields
  priorities = [
    { label: "Critical", value: "Critical" },
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" }
  ];

  recoveryStrategies = [
    { label: "Hot Standby", value: "Hot Standby" },
    { label: "Warm Standby", value: "Warm Standby" },
    { label: "Cold Standby", value: "Cold Standby" },
    { label: "Hybrid", value: "Hybrid" }
  ];

  teamOptions = [
    { label: "Network Team", value: 1 },
    { label: "Database Team", value: 2 },
    { label: "Security Team", value: 3 },
    { label: "IT Operations", value: 4 },
    { label: "Architecture Team", value: 5 },
    { label: "DevOps Team", value: 6 }
  ];
activeTab: number = 1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      division: ['', Validators.required],
      status: [null, Validators.required],
      priority: [''],
      recoveryStrategy: [],
      assignedTeams: [[]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('bcdr-dark-mode') === 'true';
  }

  // Get filtered/searched data
  get filteredRequests(): BcdrRequest[] {
    return this.requests.filter(req => {
      const matchesSearch = req.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        req.division.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.filterStatus === "All" || req.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // Theme Toggle
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('bcdr-dark-mode', String(this.darkMode));
  }

  // Modal Operations
  openAddModal(): void {
    this.isEditMode = false;
    this.form.reset();
    // this.form.patchValue({
    //   status: 'Pending'
    // });
    this.showModal = true;
  }

  openEditModal(request: BcdrRequest): void {
    this.isEditMode = true;
    this.selectedRequest = request;
    this.form.patchValue({
      name: request.name,
      division: request.division,
      status: request.status,
      priority: request.priority,
      recoveryStrategy: request.recoveryStrategy,
      assignedTeams: request.assignedTeams || [],
      description: request.description
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.form.reset();
    this.selectedRequest = null;
  }

  // CRUD Operations
  addRequest(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const newRequest: BcdrRequest = {
        id: Math.max(...this.requests.map(r => r.id), 0) + 1,
        name: formValue.name || "",
        division: formValue.division || "",
        status: formValue.status || "Pending",
        priority: formValue.priority,
        recoveryStrategy: formValue.recoveryStrategy,
        assignedTeams: formValue.assignedTeams || [],
        createdDate: new Date(),
        description: formValue.description || ""
      };
      this.requests.unshift(newRequest);
      this.closeModal();
    } else {
      alert("Please fill all required fields");
    }
  }

  editRequest(): void {
    if (this.form.valid && this.selectedRequest) {
      const index = this.requests.findIndex(r => r.id === this.selectedRequest?.id);
      if (index !== -1) {
        const formValue = this.form.value;
        this.requests[index] = {
          ...this.requests[index],
          name: formValue.name,
          division: formValue.division,
          status: formValue.status,
          priority: formValue.priority,
          recoveryStrategy: formValue.recoveryStrategy,
          assignedTeams: formValue.assignedTeams || [],
          description: formValue.description
        };
      }
      this.closeModal();
    } else {
      alert("Please fill all required fields");
    }
  }

  deleteRequest(id: number): void {
    if (confirm("Are you sure you want to delete this request?")) {
      this.requests = this.requests.filter(r => r.id !== id);
    }
  }

  // Helper Methods
  getStatusColor(status: string): string {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "On Hold":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
}


