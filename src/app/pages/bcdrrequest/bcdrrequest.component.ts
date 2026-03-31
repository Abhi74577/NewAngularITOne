import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SelectComponent, MultiselectComponent } from "../../shared/components/form";
import { ɵEmptyOutletComponent } from "@angular/router";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";

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
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SelectComponent,
    MultiselectComponent,
    ɵEmptyOutletComponent, OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  templateUrl: './bcdrrequest.component.html',
  styleUrls: ['./bcdrrequest.component.css'],
})

export class BcdrrequestComponent implements OnInit {
  // Form
  pageForm_bcdrRequest!: FormGroup;
  currentCSTDateTime = new Date();
  showClientLOB = false;

  // Validators helper (mock)
  vHelper = {
    phoneNb_RegEx: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    email_RegEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    checkUrl_RegEx: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  };

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
  activeTab: any = 3;
  isCollapsed = false;
  rowCollapsed: boolean[] = [];
  collapsed: any;
  showPartnerDetails: boolean = false;
  isRiskCollapsed: boolean = false;
  showAssumptionConstraints: boolean = false;
  isRecoveryTeamCollapsed: boolean = false;

  constructor(private fb: FormBuilder) {
    this.createPageForm();
  }

  toggleSection() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleRiskSection() {
     this.isRiskCollapsed = !this.isRiskCollapsed;
  }

  toggleDetails() {
    this.showPartnerDetails = !this.showPartnerDetails;
  }
  toggleAssumptionConstraintsSection() {
    this.showAssumptionConstraints = !this.showAssumptionConstraints;
  }

  toggleRecoveryTeamSection() {
    this.isRecoveryTeamCollapsed = !this.isRecoveryTeamCollapsed;
  }

  createPageForm() {
    this.pageForm_bcdrRequest = this.fb.group({
      requestId: [0],
      requestName: ['', Validators.required],
      technologyId: [[], Validators.required],
      subScenarioHeading: [null, Validators.required],
      subScenarioDetails: [null, Validators.required],
      lstbCDRRequestObjective: this.fb.array([]),
      lstbCDRRequestRisk: this.fb.array([]),
      lstbCDRRequestAssumption: this.fb.array([]),
      lstbCDRRequestClient: this.fb.array([]),
      activityStartDate: [null, Validators.required],
      activityEndDate: [null, Validators.required],
      bussinessPartnerName: [null],
      bussinessPartnerContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      bussinessPartnerAddress: [null],
      bussinessPartnerEmailAddress: [null, [Validators.pattern(this.vHelper.email_RegEx)]],
      productLocationName: [null, Validators.required],
      productLocationEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      productLocationContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      productLocations: [null, Validators.required],
      recoveryLocationName: [null, Validators.required],
      recoveryLocationEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      recoveryLocationContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      recoveryLocations: [null, Validators.required],
      conferanceBridge: [null, [Validators.required, Validators.pattern(this.vHelper.checkUrl_RegEx)]],
      helpdeskTicketNumber: [null, Validators.required],
      helpdeskTicketDetails: [null, Validators.required],
      emergencyContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      emergencyContactEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      helpdeskContactNumber: ['+91-9365592206', [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      helpdeskContactEmailAddress: ['Helpdesk@etsnetwork.com', [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      isCommunicatedWithCustomer: ['No', Validators.required],
      isExternalClientNotified: ['No', Validators.required],
      recoveryTimeObjective: [null, Validators.required],
      recoveryPointObjective: [null, Validators.required],
      dependecies: [null, Validators.required],
      lstbCDRRequestTeamInvolvement: this.fb.array([]),
      expectedResponseTime: [null, Validators.required],
      overallRecoveryStrategy: [null, Validators.required],
      supportedArtifacts: [null, Validators.required],
      reviewerId: [null, Validators.required],
      approverId: [null, Validators.required],
      requestStatus: [null, Validators.required],
      reviewerComment: [null],
      approverComment: [null],
      actualStartDate: [null],
      actualEndDate: [null],
      returnToOperation: [null, Validators.required],
      whatWorkedWell: [null, Validators.required],
      improvementsIdentified: [null, Validators.required],
      testGoalWasAchieved: [null, Validators.required],
      testGoalWasAchievedRetest: [null],
      learnOutOfThisActivity: [null],
      opportunityDuringTest: [null, Validators.required],
      recommendationsForTeam: [null, Validators.required],
      involvedTeam: [null],
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()],
      isUsesAI: false,
    });

    this.addObjective();
      this.addObjective();
    this.addRisks();
    this.addAssumptions();
    this.addTeamInvolvements();
  }

  toggleRow(index: number) {
    this.rowCollapsed = this.rowCollapsed.map((_, i) => i !== index);
  }

  // ============= OBJECTIVES =============
  get objectives(): FormArray {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestObjective"] as FormArray;
  }
  toggleCollapse(index: number) {
    this.collapsed[index] = !this.collapsed[index];
  }

  addObjective() {
    const objectiveForm = this.fb.group({
      requestObjectiveMappingId: [0],
      requestId: [0],
      objectiveTypeId: [null, Validators.required],
      objectiveDetails: [null, Validators.required],
      recoveryTeamName: [null, Validators.required],
      recoveryTeamDesignation: [null, Validators.required],
      recoveryTeamSupervisor: [null, Validators.required],
      recoveryTeamContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      recoveryTeamEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      recoveryTeamLocationId: [null, Validators.required],
      recoveryStrategyStartTime: [null],
      recoveryStrategyEndTime: [null],
      recoveryStrategyEstimatedTime: [null],
      recoveryStrategyExpectedResult: [null, Validators.required],
      recoveryStrategySuccessorTeam: [null, Validators.required],
      recoveryStrategyContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      recoveryStrategyEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      returnToOperationResult: [null],
      returnToOperationResultComment: [null],
      lstbCDRRequestObjectiveNewScheduleModels: this.fb.array([]),
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()],
      DateTimeCollector_recoveryObjective: [null]
    });
    this.objectives.push(objectiveForm);
  }

  deleteObjective(index: number) {
    this.objectives.removeAt(index);
    this.objectives.length === 0 && this.addObjective(); // Ensure at least one objective remains
  }

  // ============= RISKS =============
  get Risks(): FormArray {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestRisk"] as FormArray;
  }

  addRisks() {
    const riskForm = this.fb.group({
      requestRiskMappingId: [0],
      requestId: [0],
      details: [null, Validators.required],
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()]
    });
    this.Risks.push(riskForm);
  }

  deleteRisks(index: number) {
    this.Risks.removeAt(index);
  }

  // ============= ASSUMPTIONS =============
  get Assumptions() {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestAssumption"] as FormArray;
  }

  addAssumptions() {
    const assumptionsForm = this.fb.group({
      requestAssumptionMappingId: [0],
      requestId: [0],
      details: [null, Validators.required],
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()]
    });
    this.Assumptions.push(assumptionsForm);
  }

  deleteAssumptions(index: number) {
    this.Assumptions.removeAt(index);
  }

  // ============= CLIENTS =============
  get client() {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestClient"] as FormArray;
  }

  addclient() {
    const clientLOBForm = this.fb.group({
      requestClientMappingId: [0],
      requestId: [0],
      clientName: [null],
      lstLOB: this.fb.array([]),
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()]
    });
    this.client.push(clientLOBForm);
    if (this.showClientLOB) {
      this.addclientLOB(this.client.length - 1);
    }
  }

  deleteclient(index: number) {
    this.client.removeAt(index);
    if (this.client.length == 0) {
      this.showClientLOB = false;
    }
  }

  clientLOB(index: number) {
    return (this.pageForm_bcdrRequest.get("lstbCDRRequestClient") as FormArray).at(index).get("lstLOB") as FormArray;
  }

  addclientLOB(index: any) {
    const clientLOBForm = this.fb.group({
      lOBName: [null],
      contactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      location: [null],
      emailAddress: [null, [Validators.pattern(this.vHelper.email_RegEx)]],
    });
    this.clientLOB(index).push(clientLOBForm);
  }

  deleteclientLOB(element: number, index: number) {
    this.clientLOB(element).removeAt(index);
  }

  // ============= TEAM INVOLVEMENT =============
  get TeamInvolvement() {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestTeamInvolvement"] as FormArray;
  }

  addTeamInvolvements() {
    const involvementForm = this.fb.group({
      RequestTeamInvolvementMappingId: [0],
      requestId: [0],
      name: [null, Validators.required],
      emailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()]
    });
    this.TeamInvolvement.push(involvementForm);
  }

  deleteTeamInvolvements(index: number) {
    this.TeamInvolvement.removeAt(index);
  }

  // ============= OBJECTIVE NEW SCHEDULE =============
  getObjectiveNewScheduleFormArr(index: number): FormArray {
    return (this.pageForm_bcdrRequest.get('lstbCDRRequestObjective') as FormArray).at(index).get('lstbCDRRequestObjectiveNewScheduleModels') as FormArray;
  }

  addObjectiveNewSchedule(index: number) {
    const objectiveNewScheduleForm = this.fb.group({
      requestObjectiveNewScheduleId: [0],
      requestObjectiveMappingId: [0, Validators.required],
      requestObjectiveId: [0, Validators.required],
      result: [null, Validators.required],
      startTime: [this.currentCSTDateTime, Validators.required],
      endDtime: [this.currentCSTDateTime, Validators.required],
      estimatedTime: [null, Validators.required],
      comment: [null, Validators.required],
      isActive: true,
      createdBy: [0],
      updatedBy: [0],
      createdOn: [new Date()],
      updatedOn: [new Date()],
      DateTimeCollector_recoveryObjective: [null]
    });

    if (this.getObjectiveNewScheduleFormArr(index).value.length == 0) {
      this.getObjectiveNewScheduleFormArr(index).push(objectiveNewScheduleForm);
    }
  }

  deleteObjectiveNewSchedule(objIndex: number, scheduleIndex: number) {
    this.getObjectiveNewScheduleFormArr(objIndex).removeAt(scheduleIndex);
  }

  ngOnInit(): void {
    this.darkMode = localStorage.getItem('bcdr-dark-mode') === 'true';
  }

  // Theme Toggle
  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('bcdr-dark-mode', String(this.darkMode));
  }

  // Modal Operations
  openAddModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.pageForm_bcdrRequest.valid) {
      console.log('Form Value:', this.pageForm_bcdrRequest.value);
      alert('BCDR Request Submitted Successfully!');
      this.closeModal();
    } else {
      alert('Please fill all required fields');
    }
  }


  openEditModal(request: BcdrRequest): void {
    this.showModal = true;
  }

  // Filtered requests (for display)
  get filteredRequests(): BcdrRequest[] {
    return this.requests.filter(req => {
      const matchesSearch = req.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        req.division.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.filterStatus === "All" || req.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // Helper methods
  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'On Hold': return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  deleteRequest(id: number): void {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requests = this.requests.filter(r => r.id !== id);
    }
  }

  nextTab() {
    if (this.activeTab < 5) this.activeTab++;
  }

  prevTab() {
    if (this.activeTab > 1) this.activeTab--;
  }


}


