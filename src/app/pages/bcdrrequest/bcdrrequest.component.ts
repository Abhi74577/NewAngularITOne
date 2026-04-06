import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";
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

export class FormErrorStateMatcher {
  static isErrorState(control: any | null, form: FormGroup ) {
    const value = 'value';
    const required = 'required';
    let error = ((form.controls[control].dirty || form.controls[control].touched)
      && form.controls[control].invalid) ? form.controls[control].errors : null;
    if (((form.controls[control].dirty || form.controls[control].touched)
      && form.controls[control].valid)) {

      if (typeof (form.controls[control][value]) === 'string' && form.controls[control].validator) {
        const validator = form.controls[control].validator({} as AbstractControl);
        if (validator && validator['required']) {
          if ((form.controls[control][value] || '').trim().length === 0) {
            if (error === null || error === undefined) {
              error = { required: true };
            } else {
              error[required] = true;
            }
          }
        }
      }
    }
    return error;
  }
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    return (control.value || '').trim().length !== 0 ? null : { required: true };
  }
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
  isDraftMode: boolean = true;  // Controls validation behavior - when true, skips strict validation

  // Form
  form!: FormGroup;
    matcher = FormErrorStateMatcher;

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
  activeTab: any = 1;
  isCollapsed = false;
  rowCollapsed: boolean[] = [];
  collapsed: any;
  showPartnerDetails: boolean = false;
  isRiskCollapsed: boolean = false;
  showAssumptionConstraints: boolean = false;
  isRecoveryTeamCollapsed: boolean = false;
  RecoveryPlanFile: any = [];
  isRecoveryObjCollapsed: boolean = false;
  ReturnToResultFiles: any = [];
  isObjectiveResultCollapsed: boolean = false;
lstTeamNames = new FormControl(null);
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

  toggleRecoveryObjSection() {
    this.isRecoveryObjCollapsed = !this.isRecoveryObjCollapsed;
  }
  createPageForm() {
    this.pageForm_bcdrRequest = this.fb.group({
      requestId: [0],
      requestName: ['', Validators.required],
      technologyId: [null, Validators.required],
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
      productLocationContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      productLocations: [null, Validators.required],
      recoveryLocationName: [null, Validators.required],
      recoveryLocationEmailAddress: [null, [Validators.required, Validators.pattern(this.vHelper.email_RegEx)]],
      recoveryLocationContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      recoveryLocations: [null, Validators.required],
      conferanceBridge: [null, [Validators.required, Validators.pattern(this.vHelper.checkUrl_RegEx)]],
      helpdeskTicketNumber: [null, Validators.required],
      helpdeskTicketDetails: [null, Validators.required],
      emergencyContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
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
    // this.addObjectiveNewSchedule(this.objectives.length - 1);
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
  getNewScheduleControls(objectiveForm: any): FormArray {
  return objectiveForm.get('lstbCDRRequestObjectiveNewScheduleModels') as FormArray;
}

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
      endTime: [this.currentCSTDateTime, Validators.required],
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
  checkobjNewSchedule(index: number) {

    const objectives = this.pageForm_bcdrRequest.get('lstbCDRRequestObjective') as FormArray;

    const newScheduleArray = objectives
      .at(index)
      .get('lstbCDRRequestObjectiveNewScheduleModels') as FormArray;

    if (newScheduleArray && newScheduleArray.length > 0) {
      newScheduleArray.removeAt(0);
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
    if (this.isDraftMode) {
      // Draft mode: Only validate current tab
      if (this.activeTab === 1) {
        const tab1Controls = ['requestName', 'technologyId', 'subScenarioHeading', 'subScenarioDetails'];
        const isTab1Valid = tab1Controls.every(ctrl => this.pageForm_bcdrRequest.get(ctrl)?.valid);
        if (isTab1Valid) {
          console.log('Draft Saved (Tab 1):', this.pageForm_bcdrRequest.value);
          alert('BCDR Request Draft Saved!');
        } else {
          this.markTabControlsAsTouched(this.activeTab);
          alert('Please fill all required fields in the current tab');
        }
      }
    } else {
      // Validation mode: Validate all tabs
      if (this.validateAllTabs()) {
        console.log('Form Value:', this.pageForm_bcdrRequest.value);
        alert('BCDR Request Submitted Successfully!');
        this.closeModal();
      } else {
        alert('Please fix validation errors in all tabs');
      }
    }
  }

  /**
   * Mark all form controls in a specific tab as touched
   * This triggers error messages to show
   */
  markTabControlsAsTouched(tabIndex: number): void {
    const tabControlMap: { [key: number]: string[] } = {
      1: ['requestName', 'technologyId', 'subScenarioHeading', 'subScenarioDetails', 'lstbCDRRequestObjective', 'lstbCDRRequestRisk', 'lstbCDRRequestAssumption'],
      2: ['bussinessPartnerName', 'bussinessPartnerContactNumber', 'bussinessPartnerAddress', 'bussinessPartnerEmailAddress', 'productLocationName', 'productLocationEmailAddress', 'productLocationContactNumber', 'productLocations', 'recoveryLocationName', 'recoveryLocationEmailAddress', 'recoveryLocationContactNumber', 'recoveryLocations', 'conferanceBridge', 'helpdeskTicketNumber', 'helpdeskTicketDetails', 'emergencyContactNumber', 'emergencyContactEmailAddress', 'helpdeskContactNumber', 'helpdeskContactEmailAddress', 'isCommunicatedWithCustomer', 'isExternalClientNotified'],
      3: ['recoveryTimeObjective', 'recoveryPointObjective', 'dependecies'],
      4: ['lstbCDRRequestTeamInvolvement', 'expectedResponseTime', 'overallRecoveryStrategy', 'supportedArtifacts'],
      5: ['actualStartDate', 'actualEndDate', 'returnToOperation', 'whatWorkedWell', 'improvementsIdentified', 'testGoalWasAchieved', 'opportunityDuringTest', 'recommendationsForTeam']
    };

    const controlsToMark = tabControlMap[tabIndex] || [];
    
    controlsToMark.forEach(controlName => {
      const control = this.pageForm_bcdrRequest.get(controlName);
      if (control) {
        control.markAsTouched();
        // Also mark nested form arrays as touched
        if (control instanceof FormArray) {
          control.controls.forEach((formGroup: any) => {
            Object.keys(formGroup.controls).forEach(key => {
              formGroup.get(key)?.markAsTouched();
            });
          });
        }
      }
    });
  }

  /**
   * Validate all tabs and return validation status
   * Returns true if all required fields are valid, false otherwise
   */
  validateAllTabs(): boolean {
    // Mark all controls as touched to show validation errors
    Object.keys(this.pageForm_bcdrRequest.controls).forEach(key => {
      const control = this.pageForm_bcdrRequest.get(key);
      control?.markAsTouched();
      
      // Mark nested controls in FormArray
      if (control instanceof FormArray) {
        control.controls.forEach((formGroup: any) => {
          Object.keys(formGroup.controls).forEach(nestedKey => {
            formGroup.get(nestedKey)?.markAsTouched();
          });
        });
      }
    });

    // Return overall form validity
    return this.pageForm_bcdrRequest.valid;
  }

  /**
   * Toggle draft mode - when enabled, allows saving without full validation
   */
  toggleDraftMode(): void {
    this.isDraftMode = !this.isDraftMode;
    console.log(`Draft Mode: ${this.isDraftMode ? 'Enabled' : 'Disabled'}`);
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



  selectRecoveryPlanFiles(event: any): void {
    // const input = event.target as HTMLInputElement;

    // if (input.files && input.files.length > 0) {
    //   const files = Array.from(input.files);
    //   console.log('Selected files:', files);
    // }

    for (let index = 0; index < event.target.files.length; index++) {
      const fileName = event.target.files[index].name;
      const dotCount = (fileName.match(/\./g) || []).length;
      if (dotCount > 1) {
        alert("Error: Double extension detected (e.g., 'image.html.png'). Please upload a valid file.");
        event.target.value = '';
        continue;
      }
      this.RecoveryPlanFile.push(event.target.files[index]);
    }

  }

  selectReturnToResultFiles(event: any): void {
    // const input = event.target as HTMLInputElement;

    // if (input.files && input.files.length > 0) {
    //   const files = Array.from(input.files);
    //   console.log('Selected files:', files);
    // }

    for (let index = 0; index < event.target.files.length; index++) {
      const fileName = event.target.files[index].name;
      const dotCount = (fileName.match(/\./g) || []).length;
      if (dotCount > 1) {
        alert("Error: Double extension detected (e.g., 'image.html.png'). Please upload a valid file.");
        event.target.value = '';
        continue;
      }
      this.ReturnToResultFiles.push(event.target.files[index]);
    }

  }


  removeFile(index: number): void {
    this.RecoveryPlanFile.splice(index, 1);
  }

  removeReturnToResultFilesFile(index: number): void {
    this.ReturnToResultFiles.splice(index, 1);
  }

  toggleObjectiveResultSection(): void {
    this.isObjectiveResultCollapsed = !this.isObjectiveResultCollapsed;
  }

  /**
   * Handle multiselect field changes and mark as touched
   * This ensures validation errors show up properly
   */
  onMultiselectChange(controlName: string): void {
    const control = this.pageForm_bcdrRequest.get(controlName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  /**
   * Check if multiselect field is empty (validation check)
   */
  isMultiselectEmpty(controlName: string): boolean {
    const control = this.pageForm_bcdrRequest.get(controlName);
    if (!control) return true;
    
    const value = control.value;
    return !value || (Array.isArray(value) && value.length === 0) || value === null || value === undefined;
  }

  /**
   * Get validation status for multiselect field
   */
  isMultiselectInvalid(controlName: string): boolean {
    const control = this.pageForm_bcdrRequest.get(controlName);
    if (!control) return false;
    
    const isEmpty = this.isMultiselectEmpty(controlName);
    const isTouched = control.touched || control.dirty;
    
    return isEmpty && isTouched && control.hasError('required');
  }

  /**
   * Check if a form control has a specific validation error
   */
  hasError(controlName: string, errorType: string): boolean {
    const control = this.pageForm_bcdrRequest.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  /**
   * Check if a form control is invalid and has been touched/modified
   */
  isFieldInvalid(controlName: string): boolean {
    const control = this.pageForm_bcdrRequest.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Get error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.pageForm_bcdrRequest.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email address';
    if (control.hasError('pattern')) return 'This field has an invalid format';
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength']?.requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength']?.requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }

    return 'This field has a validation error';
  }

  /**
   * Get all validation errors in current tab
   */
  getTabErrors(tabIndex: number): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    const tabControlMap: { [key: number]: string[] } = {
      1: ['requestName', 'technologyId', 'subScenarioHeading', 'subScenarioDetails'],
      2: ['bussinessPartnerContactNumber', 'bussinessPartnerEmailAddress', 'productLocationEmailAddress'],
      3: ['recoveryTimeObjective', 'recoveryPointObjective'],
      4: ['expectedResponseTime', 'overallRecoveryStrategy'],
      5: ['returnToOperation', 'whatWorkedWell']
    };

    const controls = tabControlMap[tabIndex] || [];
    controls.forEach(controlName => {
      const control = this.pageForm_bcdrRequest.get(controlName);
      if (control && control.invalid && control.touched) {
        errors[controlName] = this.getErrorMessage(controlName);
      }
    });

    return errors;
  }

}


