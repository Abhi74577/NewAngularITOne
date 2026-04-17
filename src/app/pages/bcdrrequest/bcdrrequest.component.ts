import { Component, OnInit, signal } from "@angular/core";
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SelectComponent, MultiselectComponent } from "../../shared/components/form";
import { ActivatedRoute, ɵEmptyOutletComponent } from "@angular/router";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { ColumnConfig, DynamicTableComponent, ExpandableTableConfig } from "@app/shared/components/DynamicTable";
import { BaseService } from "@app/shared/services/baseService.service";
import { LookupType, LookupValue } from "@app/shared/models/LookUP";
import { appUrl, storageConst } from "@app/shared/common";
import { ValidationHelper } from '../../shared/models/inputValidation'
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

// export class BCDRFilterModel {

// this.filterForm = new FormGroup({
//   dateFilter: new FormControl(null),
//   technology: new FormControl(null),
//   status: new FormControl(null)
// });

// }

export class FormErrorStateMatcher {
  static isErrorState(control: any | null, form: FormGroup) {
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
    MultiselectComponent, OwlDateTimeModule, OwlNativeDateTimeModule, DynamicTableComponent
  ],
  templateUrl: './bcdrrequest.component.html',
  styleUrls: ['./bcdrrequest.component.scss'],
})

export class BcdrrequestComponent implements OnInit {
  objFilter = new FormGroup({
    dateFilter: new FormControl([]),
    technology: new FormControl(null),
    status: new FormControl(null)
  });

  pageForm_bcdrRequest!: FormGroup;
  currentCSTDateTime!: Date;
  showClientLOB = false;

  // Validators helper (mock)
  // vHelper = {
  //   phoneNb_RegEx: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  //   email_RegEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //   checkUrl_RegEx: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  // };



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
  displayTabList: any = []
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
  isCollapsed = true;
  rowCollapsed: boolean[] = [];
  collapsed: any;
  showPartnerDetails: boolean = false;
  isRiskCollapsed: boolean = true;
  showAssumptionConstraints: boolean = true;
  isRecoveryTeamCollapsed: boolean = true;
  RecoveryPlanFile: any = [];
  isRecoveryObjCollapsed: boolean = true;
  showFilter: boolean = false;
  ReturnToResultFiles: any = [];
  isObjectiveResultCollapsed: boolean = true;
  lstTeamNames = new FormControl([]);

  itemsPerPage = signal<number>(5);


  expandableConfig: ExpandableTableConfig = {
    enabled: false,
    columns: [

    ]
  };

  isLoading = signal<boolean>(false);
  tableData = signal<any>([]);
  lstRequests: any[] = [];

  // objFilter = new BCDRFilterModel();
  search: any = 'requestId';
  LstLookup: any = [];
  Lstlocation: any = [];
  LstObjective: any = [];
  LstLKUPTechnology: any = [];
  LstLKUPRequestStatus: any = [];
  userProfile = this.baseService.getJSONData(storageConst.userProfile);
  menuPermission = this.baseService.getJSONData(storageConst.menuPermission);
  showFilters: boolean = false;
  LstTechnology: any = [];
  LstRequestStatus: any = [];
  LstReviewRequestStatus: any = [];
  objPermission: any;
  LstReviewRequestStatus2: any = [];
  lstRS: any = [];
  lstRRS2: any = [];
  lstRRS: any = [];
  pagenation = { pageNo: 1, pageSize: 10, sort: 'requestid desc', search: '', totalPages: 0, totalRecords: 0 };
  showList: boolean = false;
  dataSource: any = [];
  dtOptions: any = []
  isoneclickdisable: boolean = false;
  lstReviewer: any = [];
  lstApprover: any = [];
  Val_ReviewerComment: any = new FormControl(null);
  Val_ApproverComment: any = new FormControl(null);
  Val_ReviewRequestStatus: any = new FormControl(0);
  attachmentList: any = [];
  attachmentList_recoplan: any = [];
  attachmentList_result: any = [];
  IsEdit: boolean = false;
  IsInfo: boolean = false;
  // displayTabList: { id: number; name: string; }[];
  isShowApprovebtn: boolean = false;
  IsdtTimeActivity: boolean = false;
  str: any = '';
  showLOB: boolean = false;
  btnhideSubmitReview: any = false;
  btnhideSubmitApproval: any = false;
  isbCDRRequestObjective: boolean = false;
  tempactualEndDate: any = this.currentCSTDateTime;
  temactualstartDate: any = this.currentCSTDateTime;
  tempStartDate: any = this.currentCSTDateTime;
  tempEndDate: any = this.currentCSTDateTime;
  tempobjnewSchedularstart: any = this.currentCSTDateTime;
  tempobjnewSchedularend: any = this.currentCSTDateTime;
  constructor(private fb: FormBuilder, private baseService: BaseService, private route: ActivatedRoute, private vHelper: ValidationHelper) {

  }
  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.route.url.subscribe(url => {
        this.objPermission = this.menuPermission.find((x: any) => x.routePath == `/${url[0].path}`);
      });

      if (url[0].path === 'bcdrrequest' && (this.objPermission.isAdd == true || this.objPermission.isEdit == true)) {

        this.showList = false;
        this.isoneclickdisable = false;
      }
      // if (url[0].path === 'bcdrdashboard') {
      //   this.showList = true;
      // }
      else {
        this.showList = true;
      }
    });
    if (this.objPermission.isView) {
      this.setDefaultTab();
      this.createPageForm();
      this.refreshTable();
      this.getLookup();
      this.getRequestList();
    }
  }

  loadTableData(): void {
    this.isLoading.set(true);

    // Simulate API call delay
    setTimeout(() => {
      this.tableData.set(this.lstRequests);
      this.isLoading.set(false);
    }, 500);
  }

  refreshTable() {
    const columnList = [
      { key: 'requestName', value: 'Request Id', type: '', sortable: true, width: '20%' },
      { key: 'technology', value: 'Division', type: '', sortable: true, width: '15%' },
      { key: 'raisedOn', value: 'Raised On', type: 'datetime', sortable: true, width: '25%' },
      { key: 'raisedBy', value: 'Raised By', type: '', sortable: true, width: '20%' },
      { key: 'requestStatus', value: 'Status', type: '', sortable: true, width: '30%' },
      { key: 'requestId', isShow: 'requestStatus', value: 'Action', type: 'Edit_info_conditional', sortable: false, width: '15%' },
      { key: 'requestId', value: 'Download', type: 'download', isShow: 'requestStatus', sortable: false, width: '10%' }
    ];

    this.dtOptions = {
      data: this.dataSource,
      pageNo: this.pagenation.pageNo,
      pageSize: this.pagenation.pageSize,
      serverSidePaging: true,
      totalRecord: this.pagenation.totalRecords,
      search: this.pagenation.search,
      sort: this.pagenation.sort,
      columnList,
      expandableConfig: this.expandableConfig
    };

  }

  filterClear() {

    this.pagenation.search = '';
    this.pagenation.sort = 'requestid desc';
    this.objFilter.reset({
      dateFilter: [],
      technology: null,
      status: null
    });


    this.getRequestList();

  }

  getRequestList() {


    const dateFilterValue = this.objFilter.get('dateFilter')?.value as Date[] | null;
    const tickCnvrtr: string[] = [];

    if (dateFilterValue && dateFilterValue.length > 0) {

      dateFilterValue.forEach((date: Date) => {
        const formattedDate =
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        tickCnvrtr.push(formattedDate);
      });

      console.log(tickCnvrtr);
    }

    let body = {
      "dateFilter": tickCnvrtr,
      "technology": this.objFilter.get('technology')?.value,
      "status": this.objFilter.get('status')?.value,
      "requestId": "string",
      "requestorName": "string"
    };

    this.baseService.callAPI('POST',
      `/BCDR/GetAll?pageNo=${this.pagenation.pageNo}&pageSize=${this.pagenation.pageSize}&sortBy=${this.pagenation.sort}&searchBy=${this.pagenation.search}`
      , body)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, false);
        if (res) {
          this.dataSource = res.pageData;
          this.lstRequests = this.dataSource;
          this.pagenation.totalRecords = res.totalCount;
          this.dtOptions.totalfilteredRecord = res.filteredCount;
          this.refreshTable();
        }
      });
  }

  fnTabClick(id: any) {
    this.activeTab = id;
    if (this.activeTab == 5 && this.IsEdit && (this.objPermission.isEdit)
      && (this.pageForm_bcdrRequest.get('requestStatus')?.value == LookupValue.ApprovedbyApprover ||
        this.pageForm_bcdrRequest.get('requestStatus')?.value == LookupValue.ReexecuteFailedObjective)) { this.pageForm_bcdrRequest.enable(); }
    else if (this.objPermission.isEdit && this.pageForm_bcdrRequest.get('requestStatus')?.value == LookupValue.Revise) {
      this.pageForm_bcdrRequest.enable();
    }
    else if (this.pageForm_bcdrRequest.get('requestStatus')?.value === LookupValue.Draft) {
      this.pageForm_bcdrRequest.enable();
    }
    else if (this.IsEdit) { this.pageForm_bcdrRequest.disable(); }


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

  toggleLOBSection() {
    this.showLOB = !this.showLOB;
  }

  toggleRecoveryTeamSection() {
    this.isRecoveryTeamCollapsed = !this.isRecoveryTeamCollapsed;
  }

  toggleRecoveryObjSection() {
    this.isRecoveryObjCollapsed = !this.isRecoveryObjCollapsed;
  }


  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  setCurrentCST() {
    this.currentCSTDateTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })
    );
  }

  createPageForm() {
    this.setCurrentCST()
    console.log(this.currentCSTDateTime)
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
      activityStartDate: [this.currentCSTDateTime, Validators.required],
      activityEndDate: [this.currentCSTDateTime, Validators.required],
      bussinessPartnerName: [null],
      bussinessPartnerContactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      bussinessPartnerAddress: [null],
      bussinessPartnerEmailAddress: [null, [Validators.email]],
      productLocationName: [null, Validators.required],
      productLocationEmailAddress: [null, [Validators.required, Validators.email]],
      productLocationContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      productLocations: [null, Validators.required],
      recoveryLocationName: [null, Validators.required],
      recoveryLocationEmailAddress: [null, [Validators.required, Validators.email]],
      recoveryLocationContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      recoveryLocations: [null, Validators.required],
      conferanceBridge: [null, [Validators.required, Validators.pattern(this.vHelper.checkUrl_RegEx)]],
      helpdeskTicketNumber: [null, Validators.required],
      helpdeskTicketDetails: [null, Validators.required],
      emergencyContactNumber: [null, [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      emergencyContactEmailAddress: [null, [Validators.required, Validators.email]],
      helpdeskContactNumber: ['+91-9365592206', [Validators.required, Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      helpdeskContactEmailAddress: ['Helpdesk@etsnetwork.com', [Validators.required, Validators.email]],
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
    // this.addObjective();
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
      recoveryTeamEmailAddress: [null, [Validators.required, Validators.email, Validators.pattern(this.vHelper.email_RegEx)]],
      recoveryTeamLocationId: [null, Validators.required],
      recoveryStrategyStartTime: [null],
      recoveryStrategyEndTime: [null],
      recoveryStrategyEstimatedTime: [null],
      recoveryStrategyExpectedResult: [null, Validators.required],
      recoveryStrategySuccessorTeam: [null, Validators.required],
      recoveryStrategyContactNumber: [null],
      recoveryStrategyEmailAddress: [null, [Validators.required, Validators.email, Validators.pattern(this.vHelper.email_RegEx)]],
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
    this.showLOB = true;
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
    if (this.client.length != 0) {
      this.addclientLOB(this.client.length - 1);
    }
    else {
      this.addclientLOB(0);
    }

  }

  deleteclient(index: number) {
    this.client.removeAt(index);
    if (this.client.length == 0) {
      this.showClientLOB = false;
    }
  }


  ShowClientAndLOB() {
    if (!this.showClientLOB) {
      this.addclient();
      this.addclientLOB(0);
      this.showClientLOB = true;
    }
  }

  getLOBControls(clientGroup: AbstractControl): FormArray {
    return clientGroup.get('lstLOB') as FormArray;
  }


  clientLOB(index: number) {
    return (this.pageForm_bcdrRequest.get("lstbCDRRequestClient") as FormArray).at(index).get("lstLOB") as FormArray;
  }

  addclientLOB(index: any) {
    const clientLOBForm = this.fb.group({
      lOBName: [null],
      contactNumber: [null, [Validators.pattern(this.vHelper.phoneNb_RegEx)]],
      location: [null],
      emailAddress: [null, [Validators.email, Validators.pattern(this.vHelper.email_RegEx)]],
    });
    this.clientLOB(index).push(clientLOBForm);
  }

  deleteclientLOB(element: number, index: number) {
    this.clientLOB(element).removeAt(index);
  }

  // ============= TEAM INVOLVEMENT =============

  getLookupValueFromId(lookupValueId: any) {
    return this.LstLookup.find((x: any) => x.lookupValueId === lookupValueId).lookupValue;
  }
  get TeamInvolvement() {
    return this.pageForm_bcdrRequest.controls["lstbCDRRequestTeamInvolvement"] as FormArray;
  }

  addTeamInvolvements() {
    const involvementForm = this.fb.group({
      RequestTeamInvolvementMappingId: [0],
      requestId: [0],
      name: [null, Validators.required],
      emailAddress: [null, [Validators.required, Validators.email, Validators.pattern(this.vHelper.email_RegEx)]],
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

    if (control.hasError('required')) return 'This field is required.';
    if (control.hasError('email')) return ' Invalid email address.';
    if (control.hasError('pattern')) return 'This field has an invalid format.';
    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength']?.requiredLength;
      return `Minimum length is ${minLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength']?.requiredLength;
      return `Maximum length is ${maxLength} characters`;
    }

    return 'This field is required.';
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

  onToggle(event: any, controllerName: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.pageForm_bcdrRequest.get(controllerName)
      ?.setValue(checked ? 'Yes' : 'No');
  }



  // ---- Main DATA API Call-- -----------------------------------

  fillSameAsAbove(event: any, referanceOf: any, index = 0) {

    switch (referanceOf) {
      case "productionlocation":
        if (event.target.checked) {
          this.pageForm_bcdrRequest.patchValue({
            recoveryLocationName: this.pageForm_bcdrRequest.controls['productLocationName'].value,
            recoveryLocationEmailAddress: this.pageForm_bcdrRequest.controls['productLocationEmailAddress'].value,
            recoveryLocationContactNumber: this.pageForm_bcdrRequest.controls['productLocationContactNumber'].value,
            recoveryLocations: this.pageForm_bcdrRequest.controls['productLocations'].value
          });
        }
        else {
          this.pageForm_bcdrRequest.patchValue({
            recoveryLocationName: null,
            recoveryLocationEmailAddress: null,
            recoveryLocationContactNumber: null,
            recoveryLocations: null,
          });
        }

        break;
      case "recoveryobjectiveteam":

        if (event.target.checked) {
          const objectivesFA = this.pageForm_bcdrRequest.get(
            'lstbCDRRequestObjective'
          ) as FormArray;

          // ✅ Guard: avoid index underflow
          if (index === 0) {
            return;
          }

          const prevGroup = objectivesFA.at(index - 1);
          const currGroup = objectivesFA.at(index);

          if (!prevGroup || !currGroup) {
            return;
          }

          currGroup.patchValue({
            recoveryTeamName: prevGroup.get('recoveryTeamName')?.value,
            recoveryTeamDesignation: prevGroup.get('recoveryTeamDesignation')?.value,
            recoveryTeamSupervisor: prevGroup.get('recoveryTeamSupervisor')?.value,
            recoveryTeamContactNumber: prevGroup.get('recoveryTeamContactNumber')?.value,
            recoveryTeamEmailAddress: prevGroup.get('recoveryTeamEmailAddress')?.value,
            recoveryTeamLocationId: prevGroup.get('recoveryTeamLocationId')?.value
          });
        }

        else {
          let obj: FormArray = this.pageForm_bcdrRequest.get('lstbCDRRequestObjective') as FormArray
          obj.at(index).patchValue({
            recoveryTeamName: null,
            recoveryTeamDesignation: null,
            recoveryTeamSupervisor: null,
            recoveryTeamContactNumber: null,
            recoveryTeamEmailAddress: null,
            recoveryTeamLocationId: null
          });
        }

        break;

      case "recoveryobjective":
        if (event.target.checked) {
          const objectivesFA = this.pageForm_bcdrRequest.get(
            'lstbCDRRequestObjective'
          ) as FormArray;

          // ✅ Guard against invalid index
          if (index === 0) {
            return;
          }

          const previousGroup = objectivesFA.at(index - 1);
          const currentGroup = objectivesFA.at(index);

          if (!previousGroup || !currentGroup) {
            return;
          }

          currentGroup.patchValue({
            recoveryStrategyStartTime:
              previousGroup.get('recoveryStrategyStartTime')?.value,
            recoveryStrategyEndTime:
              previousGroup.get('recoveryStrategyEndTime')?.value,
            recoveryStrategyEstimatedTime:
              previousGroup.get('recoveryStrategyEstimatedTime')?.value,
            recoveryStrategyExpectedResult:
              previousGroup.get('recoveryStrategyExpectedResult')?.value,
            recoveryStrategySuccessorTeam:
              previousGroup.get('recoveryStrategySuccessorTeam')?.value,
            recoveryStrategyContactNumber:
              previousGroup.get('recoveryStrategyContactNumber')?.value,
            recoveryStrategyEmailAddress:
              previousGroup.get('recoveryStrategyEmailAddress')?.value
          });
        }
        else {
          let obj: FormArray = this.pageForm_bcdrRequest.get('lstbCDRRequestObjective') as FormArray
          obj.at(index).patchValue({
            recoveryStrategyStartTime: null,
            recoveryStrategyEndTime: null,
            recoveryStrategyEstimatedTime: null,
            recoveryStrategyExpectedResult: null,
            recoveryStrategySuccessorTeam: null,
            recoveryStrategyContactNumber: null,
            recoveryStrategyEmailAddress: null
          });
        }
        break;
    }
  }

  getLookup() {
    this.baseService.callAPI('GET', `/LookupTypeValue/GetLookupValues`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.LstLookup = res;
          this.Lstlocation = (res.filter((x: any) => x.lookupTypeId === LookupType.Location).map((e: any) => (
            { value: e.lookupValueId, label: e.lookupValue })));

          this.LstObjective = (res.filter((x: any) => x.lookupTypeId === LookupType.Objective).map((e: any) => (
            { value: e.lookupValueId, label: e.lookupValue })));

          this.LstLKUPTechnology = (res.filter((x: any) => x.lookupTypeId === LookupType.Technology).map((e: any) => (
            { value: e.lookupValueId, label: e.lookupValue })));

          this.LstLKUPRequestStatus = (res.filter((x: any) => x.lookupTypeId === LookupType.RequestStatus).filter((x: any) => x.lookupValueId != LookupValue.Draft).
            map((e: any) => (
              { value: e.lookupValueId, label: e.lookupValue })));

          this.getStatusByRole();
          this.getTechnologies();


        }
      });
  }

  getTechnologies() {

    this.baseService.callAPI('GET', `/ITOneRoles/GetTechnologies?systemuserId=${this.userProfile.systemUserId}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          let temp: any = [];
          res.forEach((element: any) => {
            temp.push(this.LstLKUPTechnology.find((x: any) => x.value == element));
          });
          this.showFilters = true;
          this.LstTechnology = temp;
        }
      });
  }

  getStatusByRole() {
    if (this.userProfile.roleId == 1) {
      this.LstRequestStatus = this.LstLKUPRequestStatus;
      this.LstReviewRequestStatus = this.LstLKUPRequestStatus;
    }
    if (this.objPermission.isEdit || this.objPermission.isAdd) {
      this.LstLKUPRequestStatus.forEach((element: any) => {
        if (element.value == LookupValue.Draft || element.value == LookupValue.Revise || element.value == LookupValue.Completed ||
          element.value == LookupValue.CompletedWithFail || element.value == LookupValue.DeclinedbyReviewer ||
          element.value == LookupValue.DeclinedbyApprover || element.value == LookupValue.ReexecuteFailedObjective ||
          element.value == LookupValue.ApprovedbyApprover) {
          this.LstRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
      });
    }
    if (this.objPermission.isReView == true && this.objPermission.isApprove == false) {
      this.LstLKUPRequestStatus.forEach((element: any) => {
        if (element.value == LookupValue.ApprovalPendingatReviewer || element.value == LookupValue.Completed || element.value == LookupValue.DeclinedbyReviewer || element.value == LookupValue.ReviewPendingatReviewer || element.value == LookupValue.CompletedWithFail) {
          this.LstRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }

        if (element.value == LookupValue.DeclinedbyReviewer || element.value == LookupValue.ApprovedbyReviewer || element.value == LookupValue.Revise) {
          this.LstReviewRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));

        }

        if (element.value == LookupValue.ReexecuteFailedObjective || element.value == LookupValue.ReviewedbyReviewer) {
          this.LstReviewRequestStatus2.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
      });
    }
    if (this.objPermission.isApprove == true && this.objPermission.isReView == false) {
      this.LstLKUPRequestStatus.forEach((element: any) => {
        if (element.value == LookupValue.ApprovalPendingatApprover || element.value == LookupValue.ReviewPendingatApprover || element.value == LookupValue.Completed || element.value == LookupValue.CompletedWithFail) {
          this.LstRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
        if (element.value == LookupValue.Revise || element.value == LookupValue.DeclinedbyApprover || element.value == LookupValue.ApprovedbyApprover) {
          this.LstReviewRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));

        }
        if (element.value == LookupValue.CompletedWithFail || element.value == LookupValue.Completed) {
          this.LstReviewRequestStatus2.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
      });
    }

    if (this.objPermission.isApprove == true && this.objPermission.isReView == true) {
      this.LstLKUPRequestStatus.forEach((element: any) => {
        //   isReView = true
        if (element.value == LookupValue.ApprovalPendingatReviewer || element.value == LookupValue.Completed || element.value == LookupValue.DeclinedbyReviewer || element.value == LookupValue.ReviewPendingatReviewer || element.value == LookupValue.CompletedWithFail) {
          this.LstRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }

        if (element.value == LookupValue.DeclinedbyReviewer || element.value == LookupValue.ApprovedbyReviewer || element.value == LookupValue.Revise) {
          this.LstReviewRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));

        }

        if (element.value == LookupValue.ReexecuteFailedObjective || element.value == LookupValue.ReviewedbyReviewer) {
          this.LstReviewRequestStatus2.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }

        //   isApprove = true
        if (element.value == LookupValue.ApprovalPendingatApprover || element.value == LookupValue.ReviewPendingatApprover ||
          element.value == LookupValue.Completed || element.value == LookupValue.CompletedWithFail) {
          this.LstRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
        if (element.value == LookupValue.DeclinedbyApprover || element.value == LookupValue.ApprovedbyApprover) {
          this.LstReviewRequestStatus.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));

        }
        if (element.value == LookupValue.CompletedWithFail || element.value == LookupValue.Completed) {
          this.LstReviewRequestStatus2.push(this.LstLKUPRequestStatus.find((x: any) => x.value == element.value));
        }
      });
    }
    this.LstRequestStatus.forEach((e: any) => {
      if (this.lstRS.length == 0) {
        this.lstRS.push(this.LstRequestStatus.find((x: any) => x.value == e.value));
      } else {
        let index = this.lstRS.findIndex((x: any) => x.value == e.value);
        if (index == -1) {
          this.lstRS.push(this.LstRequestStatus.find((x: any) => x.value == e.value));
        }
      }
    });

    this.LstReviewRequestStatus2.forEach((e: any) => {
      if (this.lstRRS2.length == 0) {
        this.lstRRS2.push(this.LstReviewRequestStatus2.find((x: any) => x.value == e.value));
      } else {
        let index = this.lstRRS2.findIndex((x: any) => x.value == e.value);
        if (index == -1) {
          this.lstRRS2.push(this.LstReviewRequestStatus2.find((x: any) => x.value == e.value));
        }
      }
    });

    this.LstReviewRequestStatus.forEach((e: any) => {
      if (this.lstRRS.length == 0) {
        this.lstRRS.push(this.LstReviewRequestStatus.find((x: any) => x.value == e.value));
      } else {
        let index = this.lstRRS.findIndex((x: any) => x.value == e.value);
        if (index == -1) {
          this.lstRRS.push(this.LstReviewRequestStatus.find((x: any) => x.value == e.value));
        }
      }
    });


    console.log(this.lstRRS)


  }


  getUsersByRoleIdAndTechnology(techId = null) {

    let technologyId = techId == null ? this.pageForm_bcdrRequest.controls['technologyId'].value : techId;
    this.baseService.callAPI('GET', `/ITOneUsers/GetUserByRoleandTech?roleId=4&technologyId=${technologyId}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.lstReviewer = (res.map((e: any) => (
            { value: e.id, label: e.name })));
        }
      });

    this.baseService.callAPI('GET', `/ITOneUsers/GetUserByRoleandTech?roleId=5&technologyId=${technologyId}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {

          this.lstApprover = (res.map((e: any) => (
            { value: e.id, label: e.name })));

          console.log("lstap", this.lstApprover)
        }
      });
  }


  convertStringtoArray(string: any) {
    if (string == null) {
      return null;
    }

    let array = string.split(',');
    let numberArray: any = [];
    array.forEach((element: any) => {
      numberArray.push(parseInt(element));
    });
    return numberArray;
  }

  get objectivesInvalid(): boolean {
    return this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.invalid ?? true;
  }

  setDefaultTab() {
    this.displayTabList = [];
    for (let index = 0; index < this.tabList.length - 1; index++) {
      const element = this.tabList[index];
      this.displayTabList.push(element)
    }
  }


  onTableAction(event: any): void {
    if (event.type === 'download') {
      this.baseService.Export('GET', `/BCDR/GetById?requestId=${event.element.requestId}&isExport=true`, null)
        .subscribe((data: any) => {
          if (data.body.byteLength > 0) {
            let blob = new Blob([data.body], { type: "application/pdf" });

            //var headers = data.headers;
            //console.log(headers); //<--- Check log for content disposition
            //var contentDisposition = headers.get('content-disposition');
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            //a.download = this.ListReportBy.find((x:any) => x.id == 1).name;
            a.download = data.headers.get('content-disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }
          else {

          }
          // this.progressBarService = true;
        });
    }

    if (event.type === 'edit' || event.type === 'info') {

      this.showPartnerDetails = true;
      this.pageForm_bcdrRequest.reset();
      this.Val_ReviewerComment = null;
      this.Val_ApproverComment = null;
      // this.Val_ReviewRequestStatus = 0;
      this.activeTab = 1;
      this.attachmentList = [];
      this.attachmentList_recoplan = [];
      this.attachmentList_result = [];
      this.setDefaultTab();

      this.baseService.callAPI('GET', `/BCDR/GetById?requestId=${event.element.requestId}`, null)
        .subscribe((data) => {
          const res = this.baseService.GetResponse(data, true);
          if (res) {
            console.log(res);

            this.getUsersByRoleIdAndTechnology(res.technologyId);

            this.pageForm_bcdrRequest.patchValue({
              requestId: res.requestId,
              requestName: res.requestName,
              technologyId: res.technologyId,
              subScenarioHeading: res.subScenarioHeading,
              subScenarioDetails: res.subScenarioDetails,
              //    lstbCDRRequestObjective: res.lstbCDRRequestObjective,
              //    lstbCDRRequestRisk: res.lstbCDRRequestRisk as FormArray,
              //   lstbCDRRequestAssumption: res.lstbCDRRequestAssumption,
              //    lstbCDRRequestClient: res.lstbCDRRequestClient,
              activityStartDate: res.activityStartDate,
              activityEndDate: res.activityEndDate,
              bussinessPartnerName: res.bussinessPartnerName,
              bussinessPartnerContactNumber: res.bussinessPartnerContactNumber,
              bussinessPartnerAddress: res.bussinessPartnerAddress,
              bussinessPartnerEmailAddress: res.bussinessPartnerEmailAddress,
              productLocationName: res.productLocationName,
              productLocationEmailAddress: res.productLocationEmailAddress,
              productLocationContactNumber: res.productLocationContactNumber,
              productLocations: this.convertStringtoArray(res.productLocations),
              recoveryLocationName: res.recoveryLocationName,
              recoveryLocationEmailAddress: res.recoveryLocationEmailAddress,
              recoveryLocationContactNumber: res.recoveryLocationContactNumber,
              recoveryLocations: this.convertStringtoArray(res.recoveryLocations),
              conferanceBridge: res.conferanceBridge,
              helpdeskTicketNumber: res.helpdeskTicketNumber,
              helpdeskTicketDetails: res.helpdeskTicketDetails,
              emergencyContactNumber: res.emergencyContactNumber,
              emergencyContactEmailAddress: res.emergencyContactEmailAddress,
              helpdeskContactNumber: res.helpdeskContactNumber,
              helpdeskContactEmailAddress: res.helpdeskContactEmailAddress,
              isCommunicatedWithCustomer: res.isCommunicatedWithCustomer,
              isExternalClientNotified: res.isExternalClientNotified,
              recoveryTimeObjective: res.recoveryTimeObjective,
              recoveryPointObjective: res.recoveryPointObjective,
              //    lstbCDRRequestAccountability: res.lstbCDRRequestAccountability,
              //     lstbCDRRequestApproving: res.lstbCDRRequestApproving,
              dependecies: res.dependecies,
              //    lstbCDRRequestTeamInvolvement: res.lstbCDRRequestTeamInvolvement,
              expectedResponseTime: res.expectedResponseTime,
              overallRecoveryStrategy: res.overallRecoveryStrategy,
              supportedArtifacts: res.supportedArtifacts,
              reviewerId: res.reviewerId,
              approverId: res.approverId,
              requestStatus: res.requestStatus,
              reviewerComment: res.reviewerComment,
              approverComment: res.approverComment,
              returnToOperation: res.returnToOperation,
              whatWorkedWell: res.whatWorkedWell,
              improvementsIdentified: res.improvementsIdentified,
              testGoalWasAchieved: res.testGoalWasAchieved,
              testGoalWasAchievedRetest: res.testGoalWasAchievedRetest,
              learnOutOfThisActivity: res.learnOutOfThisActivity,
              opportunityDuringTest: res.opportunityDuringTest,
              recommendationsForTeam: res.recommendationsForTeam,
              isActive: res.isActive,
              createdBy: res.createdBy,
              updatedBy: res.updatedBy,
              createdOn: res.createdOn,
              updatedOn: res.updatedOn,
              actualStartDate: res.actualStartDate,
              actualEndDate: res.actualEndDate,
              isUsesAI: res.isUsesAI,
            });

            this.attachmentList = res.lstAttachments;
            if (this.attachmentList.length > 0) {
              this.attachmentList.forEach((element: any) => {
                console.log("data", element);

                element.downloadPath = appUrl + element.path + '/' + element.fileName;
              });

              this.attachmentList_recoplan = this.attachmentList.filter((x: any) => x.attachmentTypeId == 45);
              this.attachmentList_result = this.attachmentList.filter((x: any) => x.attachmentTypeId == 46);
              console.log(this.attachmentList_recoplan, this.attachmentList_result)
            }



            //  this.tempArray = [];
            // let arr_objective = <FormArray>this.pageForm_bcdrRequest.controls.lstbCDRRequestObjective;
            // arr_objective.removeAt(0);
            this.objectives.removeAt(0);
            (res.lstbCDRRequestObjective ?? []).forEach((x: any, index: number) => {
              this.addObjective();

              this.objectives.at(index).patchValue({
                requestObjectiveMappingId: x.requestObjectiveMappingId,
                requestId: x.requestId,
                objectiveTypeId: x.objectiveTypeId,
                objectiveDetails: x.objectiveDetails,
                recoveryTeamName: x.recoveryTeamName,
                recoveryTeamDesignation: x.recoveryTeamDesignation,
                recoveryTeamSupervisor: x.recoveryTeamSupervisor,
                recoveryTeamContactNumber: x.recoveryTeamContactNumber,
                recoveryTeamEmailAddress: x.recoveryTeamEmailAddress,
                recoveryTeamLocationId: x.recoveryTeamLocationId,
                recoveryStrategyStartTime: x.recoveryStrategyStartTime,
                recoveryStrategyEndTime: x.recoveryStrategyEndTime,
                recoveryStrategyEstimatedTime: x.recoveryStrategyEstimatedTime,
                recoveryStrategyExpectedResult: x.recoveryStrategyExpectedResult,
                recoveryStrategySuccessorTeam: x.recoveryStrategySuccessorTeam,
                recoveryStrategyContactNumber: x.recoveryStrategyContactNumber,
                recoveryStrategyEmailAddress: x.recoveryStrategyEmailAddress,
                returnToOperationResult: x.returnToOperationResult,
                returnToOperationResultComment: x.returnToOperationResultComment,
                isActive: x.isActive
              });

              const schedules = x.lstbCDRRequestObjectiveNewScheduleModels ?? [];
              if (schedules.length > 0) {
                this.addObjectiveNewSchedule(index);
                this.objectives
                  .at(index)
                  .get('lstbCDRRequestObjectiveNewScheduleModels')
                  ?.get([0])
                  ?.patchValue(schedules[0]);
              }
            });


            this.setRecoveryObjectiveDates();
            //this.setactualDate(res.actualStartDate, res.actualEndDate);


            // let arr_risk = <FormArray>this.pageForm_bcdrRequest.controls.lstbCDRRequestRisk;
            // arr_risk.removeAt(0);
            this.Risks.removeAt(0);
            res.lstbCDRRequestRisk.forEach((x: any, index: any) => {
              console.log(this.Risks.value);
              this.addRisks();
              // this.items.at(index).patchValue(...)
              this.Risks.at(index).patchValue({
                requestRiskMappingId: x.requestRiskMappingId,
                requestId: x.requestId,
                details: x.details,
                isActive: x.isActive,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdOn: x.createdOn,
                updatedOn: x.updatedOn
              })

            })


            // let arr_assumption = <FormArray>this.pageForm_bcdrRequest.controls.lstbCDRRequestAssumption;
            // arr_assumption.removeAt(0);
            this.Assumptions.removeAt(0);
            res.lstbCDRRequestAssumption.forEach((x: any, index: any) => {
              this.addAssumptions();
              this.Assumptions.at(index).patchValue({
                requestAssumptionMappingId: x.requestAssumptionMappingId,
                requestId: x.requestId,
                details: x.details,
                isActive: x.isActive,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdOn: x.createdOn,
                updatedOn: x.updatedOn
              });
            })

            // let arr_client = <FormArray>this.pageForm_bcdrRequest.controls.lstbCDRRequestClient;
            this.client.removeAt(0);
            this.showClientLOB = res.lstbCDRRequestClient.length;
            res.lstbCDRRequestClient.forEach((x: any, index: any) => {
              this.addclient();

              if (x.lstLOB.length > 0) {
                x.lstLOB.forEach((element: any, i: any) => {
                  if (i > 0) {
                    this.addclientLOB(index);
                  }
                  this.clientLOB(index).at(i).patchValue({
                    lOBName: element.lOBName,
                    contactNumber: element.contactNumber,
                    location: element.location,
                    emailAddress: element.emailAddress
                  })
                });
              }
              this.client.at(index).patchValue({
                requestClientMappingId: x.requestClientMappingId,
                requestId: x.requestId,
                clientName: x.clientName,
                isActive: x.isActive,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdOn: x.createdOn,
                updatedOn: x.updatedOn
              });
              // arr_client.push(this.fb.group(x));
            })

            // if (res.requestStatus != LookupValue.Draft) {
            // let arr_team = <FormArray>this.pageForm_bcdrRequest.controls.lstbCDRRequestTeamInvolvement;
            // arr_team.removeAt(0);
            if (res.lstbCDRRequestTeamInvolvement.length > 0) {
              console.log(this.TeamInvolvement.value);
              this.TeamInvolvement.removeAt(0);
              console.log(this.TeamInvolvement.value);
              res.lstbCDRRequestTeamInvolvement.forEach((x: any, index: any) => {
                this.addTeamInvolvements();
                this.TeamInvolvement.at(index).patchValue({
                  RequestTeamInvolvementMappingId: x.requestTeamInvolvementMappingId,
                  requestId: x.requestId,
                  name: x.name,
                  emailAddress: x.emailAddress,
                  isActive: x.isActive,
                  createdBy: x.createdBy,
                  updatedBy: x.updatedBy,
                  createdOn: x.createdOn,
                  updatedOn: x.updatedOn
                });
                console.log(this.TeamInvolvement.value);
              })
            } else {
              this.TeamInvolvement.removeAt(0);
              this.addTeamInvolvements();
            }



            this.lstTeamNames.setValue(this.convertStringtoArray(res.involvedTeam));


            this.Val_ReviewerComment = res.reviewerComment ?? null;
            this.Val_ApproverComment = res.approverComment ?? null;

            //  this.Val_ReviewRequestStatus = res.requestStatus;
            this.showList = !this.showList;
            this.IsEdit = event.type === 'edit';
            this.IsInfo = event.type === 'info';
            // this.conditionalControlDisabled=true;

            if (res.requestStatus >= LookupValue.ApprovedbyApprover) {
              this.displayTabList = this.tabList;
              if (res.actualStartDate == null) {
                this.pageForm_bcdrRequest.patchValue({
                  actualStartDate: this.currentCSTDateTime,
                  actualEndDate: this.currentCSTDateTime
                });

              }

              if (res.requestStatus == LookupValue.ApprovedbyApprover) {
                this.isShowApprovebtn = true;
              }

              //if (this.tabList.length == 5) { this.tabList.splice(this.tabList.length - 1, 1) };
            }

            if ((this.objPermission.isAdd || this.objPermission.isEdit) && res.requestStatus == LookupValue.Revise) {
              this.pageForm_bcdrRequest.enable();
              this.IsEdit = false;
              this.IsdtTimeActivity = true;
            }
            else if ((this.objPermission.isReView || this.objPermission.isApprove) && (res.requestStatus != LookupValue.Draft && res.requestStatus != LookupValue.ApprovedbyApprover)) {
              this.pageForm_bcdrRequest.disable();
            }
            else if (res.requestStatus === LookupValue.Draft) {
              this.IsEdit = false;
              this.IsdtTimeActivity = true;
              this.pageForm_bcdrRequest.enable();
              if (this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value.length === 0) {
                this.addObjective();
              }
              if (this.pageForm_bcdrRequest.controls['lstbCDRRequestRisk'].value.length === 0) {
                this.addRisks();
              }
              if (this.pageForm_bcdrRequest.controls['lstbCDRRequestAssumption'].value.length === 0) {
                this.addAssumptions();
              }

            }
            else {
              this.pageForm_bcdrRequest.disable();
            }
          }
        });

    }


  }

  setRecoveryObjectiveDates() {
    if (this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value != undefined) {
      let lstObjectives: any = [];
      this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value.forEach((element: any) => {
        if (element.recoveryStrategyStartTime != null && element.recoveryStrategyEndTime != null) {
          let array: any = [];
          array.push(new Date(element.recoveryStrategyStartTime));
          array.push(new Date(element.recoveryStrategyEndTime));
          element.recoveryStrategyStartTime = array;
          lstObjectives.push(element);
        }
      });
      this.pageForm_bcdrRequest.patchValue({
        lstbCDRRequestObjective: lstObjectives
      });
    }
  }

  get f() {
    return this.pageForm_bcdrRequest.controls;
  }

  getFormArray(name: string) {
    return this.pageForm_bcdrRequest.get(name) as FormArray;
  }


  checkValidation(btnclickName: string): boolean {

    const errors: string[] = [];

    /* ------------ TAB 1 ------------ */
    if (this.f['technologyId']?.invalid) errors.push('Division (Tab 1)');
    if (this.f['subScenarioHeading']?.invalid) errors.push('Scenario Title (Tab 1)');
    if (this.f['subScenarioDetails']?.invalid) errors.push('Scenario Overview (Tab 1)');


    /* ------------ OBJECTIVES ------------ */
    const objectives = this.getFormArray('lstbCDRRequestObjective');
    objectives?.controls.forEach((obj: any, idx: number) => {

      if (obj.get('objectiveTypeId')?.invalid) errors.push('Objective (Tab 1)');
      if (obj.get('objectiveDetails')?.invalid) errors.push('Details Of The Objective (Tab 1)');

      if (obj.get('recoveryTeamEmailAddress')?.invalid)
        errors.push('Recovery Team Email Address (Tab 3)');

      if (obj.get('recoveryTeamName')?.invalid)
        errors.push('Recovery Team Name (Tab 3)');

      if (obj.get('recoveryTeamSupervisor')?.invalid)
        errors.push('Recovery Team Supervisor (Tab 3)');

      if (obj.get('recoveryTeamDesignation')?.invalid)
        errors.push('Recovery Team Designation (Tab 3)');

      if (obj.get('recoveryTeamContactNumber')?.invalid)
        errors.push('Recovery Team Contact Number (Tab 3)');

      if (obj.get('recoveryTeamLocationId')?.invalid)
        errors.push('Recovery Team Location (Tab 3)');


      /* ------------ TAB 4 ------------ */
      if (obj.get('recoveryStrategySuccessorTeam')?.invalid)
        errors.push('Recovery Team Successor Team/Technician (Tab 4)');

      if (obj.get('recoveryStrategyExpectedResult')?.invalid)
        errors.push('Recovery Team Expected Result (Tab 4)');

      if (obj.get('recoveryStrategyEmailAddress')?.invalid)
        errors.push('Recovery Team Email Address (Tab 4)');


      /* ------------ TAB 5 (Conditional) ------------ */
      if (btnclickName === 'SubmitReturnToOperation') {

        if (!obj.get('returnToOperationResultComment')?.value)
          errors.push('Return To Operation Result Comment (Tab 5)');

        const schedules = obj.get('lstbCDRRequestObjectiveNewScheduleModels') as FormArray;

        schedules?.controls.forEach((sch: any) => {

          if (sch.get('result')?.invalid)
            errors.push('New Test Objective Result (Tab 5)');

          if (sch.get('estimatedTime')?.invalid)
            errors.push('Estimated Time (Tab 5)');

          if (sch.get('comment')?.invalid)
            errors.push('Comment (Tab 5)');
        });
      }
    });


    /* ------------ RISK ------------ */
    this.getFormArray('lstbCDRRequestRisk')?.controls.forEach(risk => {
      if (risk.get('details')?.invalid)
        errors.push('Risk - Details (Tab 1)');
    });


    /* ------------ ASSUMPTION ------------ */
    this.getFormArray('lstbCDRRequestAssumption')?.controls.forEach(assumption => {
      if (assumption.get('details')?.invalid)
        errors.push('Assumption/Constraints (Tab 1)');
    });


    /* ------------ TAB 2 ------------ */
    if (this.f['productLocationName']?.invalid) errors.push('Product Location Name (Tab 2)');
    if (this.f['productLocationEmailAddress']?.invalid) errors.push('Product Location Email Address (Tab 2)');
    if (this.f['productLocationContactNumber']?.invalid) errors.push('Product Location Contact Number (Tab 2)');
    if (this.f['recoveryLocationName']?.invalid) errors.push('Recovery Location Name (Tab 2)');
    if (this.f['recoveryLocationEmailAddress']?.invalid) errors.push('Recovery Location Email Address (Tab 2)');
    if (this.f['recoveryLocationContactNumber']?.invalid) errors.push('Recovery Location Contact Number (Tab 2)');
    if (this.f['conferanceBridge']?.invalid) errors.push('Conference Bridge (Tab 2)');


    /* ------------ TAB 3 ------------ */
    if (this.f['recoveryTimeObjective']?.invalid) errors.push('Recovery Time Objective (Tab 3)');
    if (this.f['recoveryPointObjective']?.invalid) errors.push('Recovery Point Objective (Tab 3)');
    if (this.f['dependecies']?.invalid) errors.push('Dependencies (Tab 3)');
    if (this.f['reviewerId']?.invalid) errors.push('Reviewer Name (Tab 3)');
    if (this.f['approverId']?.invalid) errors.push('Approver Name (Tab 3)');


    /* ------------ TAB 5 FINAL ------------ */
    if (btnclickName === 'SubmitReturnToOperation') {
      if (this.f['returnToOperation']?.invalid) errors.push('Return To Operation (Tab 5)');
      if (this.f['whatWorkedWell']?.invalid) errors.push('What Worked Well? (Tab 5)');
      if (this.f['recommendationsForTeam']?.invalid) errors.push('Recommendations (Tab 5)');
      if (this.f['opportunityDuringTest']?.invalid) errors.push('Opportunity During Test (Tab 5)');
      if (this.f['improvementsIdentified']?.invalid) errors.push('Improvements Identified (Tab 5)');
      if (this.f['testGoalWasAchieved']?.invalid) errors.push('Objectives Achieved? (Tab 5)');
    }

    /* ------------ RESULT ------------ */
    this.str = errors;

    return errors.length === 0;
  }

  checkSubmitValidation(isDraft: boolean) {



    if (isDraft == false && (this.pageForm_bcdrRequest.controls['reviewerId'].value == null || this.pageForm_bcdrRequest.controls['approverId'].value == null)) {
      alert("Please Fill Reviewer Name & Approver Name These Field are Required!!");
    } else {
      if (isDraft == false && this.pageForm_bcdrRequest.controls['reviewerId'].value != null && this.pageForm_bcdrRequest.controls['approverId'].value != null) {
        let isValidate = this.checkValidation("SubmitcreateRequest");
        if (isValidate == true) {
          this.submitRequest(isDraft);
        }

      }

      if (isDraft && (this.pageForm_bcdrRequest.controls['technologyId'].value == null)) {
        alert("Please select Division in tab 1!!");
        //this.checkValidation("Draft");
      } else {
        if (isDraft && (this.pageForm_bcdrRequest.controls['technologyId'].value != null)) {
          this.submitRequest(isDraft);
        }
      }
    }
  }


  submitRequest(isDraft: any) {
    if (isDraft) {
      //checking null lstbCDRRequestObjective in edit
      if (this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value.find((x: any) => x.objectiveTypeId == null)) {
        while (this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value.length !== 0) {
          (this.pageForm_bcdrRequest.get('lstbCDRRequestObjective') as FormArray).removeAt(0)

        }
      }

      //checking null lstbCDRRequestRisk in edit
      if (this.pageForm_bcdrRequest.controls['lstbCDRRequestRisk'].value.find((x: any) => x.details == null)) {
        while (this.pageForm_bcdrRequest.controls['lstbCDRRequestRisk'].value.length !== 0) {
          (this.pageForm_bcdrRequest.get('lstbCDRRequestRisk') as FormArray).removeAt(0)
        }
      }
      //checking null lstbCDRRequestAssumption in edit
      if (this.pageForm_bcdrRequest.controls['lstbCDRRequestAssumption'].value.find((x: any) => x.details == null)) {
        while (this.pageForm_bcdrRequest.controls['lstbCDRRequestAssumption'].value.length !== 0) {
          (this.pageForm_bcdrRequest.get('lstbCDRRequestAssumption') as FormArray).removeAt(0)
        }
      }
      //checking null lstbCDRRequestTeamInvolvement  in edit
      if (this.pageForm_bcdrRequest.controls['lstbCDRRequestTeamInvolvement'].value.find((x: any) => x.emailAddress == null)) {
        while (this.pageForm_bcdrRequest.controls['lstbCDRRequestTeamInvolvement'].value.length !== 0) {
          (this.pageForm_bcdrRequest.get('lstbCDRRequestTeamInvolvement') as FormArray).removeAt(0)
        }
      }
    }
    this.isoneclickdisable = true;
    let lstproductlocations = (this.pageForm_bcdrRequest.controls['productLocations'].value != null &&
      typeof (this.pageForm_bcdrRequest.controls['productLocations'].value) != 'string')
      ? this.pageForm_bcdrRequest.controls['productLocations'].value.join(",") : this.pageForm_bcdrRequest.controls['productLocations'].value;

    let lstrecoverylocations = (this.pageForm_bcdrRequest.controls['recoveryLocations'].value != null
      &&
      typeof (this.pageForm_bcdrRequest.controls['recoveryLocations'].value) != 'string')
      ? this.pageForm_bcdrRequest.controls['recoveryLocations'].value.join(",") : this.pageForm_bcdrRequest.controls['recoveryLocations'].value;





    this.pageForm_bcdrRequest.patchValue({
      productLocations: lstproductlocations,
      recoveryLocations: lstrecoverylocations,
      bussinessPartnerContactNumber: this.pageForm_bcdrRequest.controls['bussinessPartnerContactNumber'].value,
      productLocationContactNumber: this.pageForm_bcdrRequest.controls['productLocationContactNumber'].value,
      recoveryLocationContactNumber: this.pageForm_bcdrRequest.controls['recoveryLocationContactNumber'].value,
      emergencyContactNumber: this.pageForm_bcdrRequest.controls['emergencyContactNumber'].value,
      requestStatus: isDraft ? 6 : null
    });

    //checking Null/Undefined value in involvedTeam in edit 

    const teamNames = this.lstTeamNames?.value;

    if (Array.isArray(teamNames) && teamNames.length > 0) {

      // ✅ Remove NaN values
      const cleanedList = teamNames.filter(
        (x: any) => !Number.isNaN(x)
      );

      // ✅ Update the control
      this.lstTeamNames.setValue(cleanedList);

      // ✅ Patch dependent field
      this.pageForm_bcdrRequest.patchValue({
        involvedTeam: cleanedList.length > 0
          ? cleanedList.join(',')
          : null
      });
    }


    //this.getActivityDates();
    this.getRecoveryObjectiveDates();

    this.baseService.callAPI('POST', `/BCDR/Request`, JSON.parse(JSON.stringify(this.pageForm_bcdrRequest.getRawValue())))
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          if (res > 0) {
            this.uploadRecoveryPlanFiles(res);
          }
          this.cancel();
          // this.getRequestList();
          this.showList = true;
          this.createPageForm();
        }
      });
  }

  checkValidationcANDSubmitReturnToOperation() {
    let isvalid = this.checkValidation("SubmitReturnToOperation");
    if (isvalid == true) {
      this.SubmitReturnToOperation();
    }
  }

  SubmitReturnToOperation() {
    if (this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value.filter((x: any) => x.returnToOperationResultComment == null).length != 0
      || this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value.filter((x: any) => x.returnToOperationResultComment == "").length != 0 ||
      this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value.filter((x: any) => x.returnToOperationResult == null).length != 0
    ) {
      this.isbCDRRequestObjective = true;
      alert("Please fill all required fields in Return to Operation (Tab)");
    } else {

      this.isbCDRRequestObjective = false;
      //checking Null/Undefined value in involvedTeam in edit 

      const teamNames = this.lstTeamNames?.value;

      if (Array.isArray(teamNames) && teamNames.length > 0) {

        // ✅ Remove NaN values
        const cleanedList = teamNames.filter(
          (x: any) => !Number.isNaN(x)
        );

        // ✅ Update the control
        this.lstTeamNames.setValue(cleanedList);

        // ✅ Patch dependent field
        this.pageForm_bcdrRequest.patchValue({
          involvedTeam: cleanedList.length > 0
            ? cleanedList.join(',')
            : null
        });
      }

      let ArrayObjectiveModels: any = [];
      if (this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value != undefined) {
        let lstObjectives: any;
        this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value.forEach((element: any) => {
          // if (element.recoveryStrategyStartTime != null && element.recoveryStrategyStartTime.length) {
          // lstObjectives.requestObjectiveMappingId = element.requestObjectiveMappingId;
          // lstObjectives.returnToOperationResult = element.returnToOperationResult;
          // lstObjectives.returnToOperationResultComment = element.returnToOperationResultComment;
          // lstObjectives.lstbCDRRequestObjectiveNewScheduleModels = element.lstbCDRRequestObjectiveNewScheduleModels;
          ArrayObjectiveModels.push(element);
          // }
        });
      }

      // this.setNewScheduleDates();

      let body = {
        RequestId: this.pageForm_bcdrRequest.controls['requestId'].value,
        TechnologyId: this.pageForm_bcdrRequest.controls['technologyId'].value,
        ReviewerId: this.pageForm_bcdrRequest.controls['reviewerId'].value,
        ApproverId: this.pageForm_bcdrRequest.controls['approverId'].value,
        CreatedBy: this.pageForm_bcdrRequest.controls['createdBy'].value,
        InvolvedTeam: this.pageForm_bcdrRequest.controls['involvedTeam'].value,
        ActualStartDate: this.pageForm_bcdrRequest.controls['actualStartDate'].value,
        ActualEndDate: this.pageForm_bcdrRequest.controls['actualEndDate'].value,
        ReturnToOperation: this.pageForm_bcdrRequest.controls['returnToOperation'].value,
        WhatWorkedWell: this.pageForm_bcdrRequest.controls['whatWorkedWell'].value,
        ImprovementsIdentified: this.pageForm_bcdrRequest.controls['improvementsIdentified'].value,
        TestGoalWasAchieved: this.pageForm_bcdrRequest.controls['testGoalWasAchieved'].value,
        TestGoalWasAchievedRetest: this.pageForm_bcdrRequest.controls['testGoalWasAchievedRetest'].value,
        LearnOutOfThisActivity: this.pageForm_bcdrRequest.controls['learnOutOfThisActivity'].value,
        OpportunityDuringTest: this.pageForm_bcdrRequest.controls['opportunityDuringTest'].value,
        RecommendationsForTeam: this.pageForm_bcdrRequest.controls['recommendationsForTeam'].value,
        lstObjectiveModels: ArrayObjectiveModels,
      }

      this.baseService.callAPI('POST', `/BCDR/SubmitReturnToOperation`, body)
        .subscribe((data) => {
          const res = this.baseService.GetResponse(data, true);
          if (res) {
            this.uploadReturnToResultFiles(this.pageForm_bcdrRequest.controls['requestId'].value);
            // this.getRequestList();
            this.pageForm_bcdrRequest.reset();
            this.showList = true;
            // this.ReturnToResultFile = [];

            this.cancel();
          }
        });
    }
  }

  updatestatus() {
    let TeamName = null;

    const teamNames = this.lstTeamNames?.value;

    if (Array.isArray(teamNames) && teamNames.length > 0) {

      // ✅ Remove NaN values
      const cleanedList = teamNames.filter(
        (x: any) => !Number.isNaN(x)
      );

      // ✅ Update the control
      this.lstTeamNames.setValue(cleanedList);

      // ✅ Patch dependent field
      TeamName = cleanedList.length > 0
        ? cleanedList.join(',')
        : null

    }

    // if (this.lstTeamNames != null) {
    //   TeamName = typeof (this.lstTeamNames) != 'string' ? this.lstTeamNames.value?.toString() : null
    // }
    let body =
    {
      "BCDRRequestId": this.pageForm_bcdrRequest.controls['requestId'].value,
      "TechnologyId": this.pageForm_bcdrRequest.controls['technologyId'].value,
      "ReviewerId": this.pageForm_bcdrRequest.controls['reviewerId'].value,
      "ApproverId": this.pageForm_bcdrRequest.controls['approverId'].value,
      "CreatedBy": this.pageForm_bcdrRequest.controls['createdBy'].value,
      "InvolvedTeam": TeamName,
      "recordStatus": this.Val_ReviewRequestStatus.value,
      "Comment": this.objPermission.isReView ? this.Val_ReviewerComment : this.Val_ApproverComment
    };

    this.baseService.callAPI('PUT', `/BCDR/UpdateStatus`, body)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);
        if (res) {
          this.IsEdit = false;
          this.showList = true;
          // this.getRequestList();
          this.pageForm_bcdrRequest.reset();
          this.cancel();
        }
      });
  }


  uploadRecoveryPlanFiles(requestId: any) {
    if (this.RecoveryPlanFile != null || this.RecoveryPlanFile != undefined) {
      var formData: any = new FormData();
      // formData.append('avatar', this.form.get('avatar').value);
      for (let index = 0; index < this.RecoveryPlanFile.length; index++) {
        //const element = array[index];
        formData.append(`lstAttachmentModel[${index}].attachmentId`, 0);
        formData.append(`lstAttachmentModel[${index}].requestId`, requestId);
        formData.append(`lstAttachmentModel[${index}].attachmentTypeId`, 45);
        formData.append(`lstAttachmentModel[${index}].file`, this.RecoveryPlanFile[index]);
      }


      this.baseService.callFormAPI('POST', `/Attachment/Add`, formData)
        .subscribe((data) => {
          const res = this.baseService.GetResponse(data, true);
          if (res) {
            // this.getRequestList();
            // this.uploadReturnFiles(this.pageForm_bcdrRequest.controls['requestId'].value);
            // this.pageForm_bcdrRequest.reset();
            // this.showList = true;
            this.RecoveryPlanFile = [];
          }
        });
    }
  }


  deleteAttachmentDraft_Revise(id: any) {
    let idx = this.attachmentList_recoplan.findIndex((x: any) => x.attachmentId == id);
    this.attachmentList_recoplan.splice(idx, 1);
    console.log(this.attachmentList_recoplan);
    console.log(id);
    this.baseService.callAPI('Delete', `/Attachment/Delete?attachmentId=${id}`, null)
      .subscribe((data) => {
        const res = this.baseService.GetResponse(data, true);

      });
  }

  uploadReturnToResultFiles(requestId: any) {

    if (this.ReturnToResultFiles != null || this.ReturnToResultFiles != undefined) {
      var formData: any = new FormData();
      // formData.append('avatar', this.form.get('avatar').value);
      for (let index = 0; index < this.ReturnToResultFiles.length; index++) {
        //const element = array[index];
        formData.append(`lstAttachmentModel[${index}].attachmentId`, 0);
        formData.append(`lstAttachmentModel[${index}].requestId`, requestId);
        formData.append(`lstAttachmentModel[${index}].attachmentTypeId`, 46);
        formData.append(`lstAttachmentModel[${index}].file`, this.ReturnToResultFiles[index]);
      }


      this.baseService.callFormAPI('POST', `/Attachment/Add`, formData)
        .subscribe((data) => {
          const res = this.baseService.GetResponse(data, true);
          if (res) {
            // this.getRequestList();
            // this.uploadReturnFiles(this.pageForm_bcdrRequest.controls['requestId'].value);
            // this.pageForm_bcdrRequest.reset();
            // this.showList = true;
          }
        });
    }
  }

  getRecoveryObjectiveDates() {

    if (this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value != undefined) {
      let lstObjectives: any = [];
      this.pageForm_bcdrRequest.controls['lstbCDRRequestObjective'].value.forEach((element: any) => {
        if (element.recoveryStrategyStartTime != null && element.recoveryStrategyStartTime.length) {
          let temp = element.recoveryStrategyStartTime;
          element.recoveryStrategyStartTime = null;
          element.recoveryStrategyEndTime = temp[1];
          element.recoveryStrategyStartTime = temp[0];

          element.recoveryTeamContactNumber = element.recoveryTeamContactNumber;
          element.recoveryStrategyContactNumber = element.recoveryStrategyContactNumber;
          lstObjectives.push(element);
        }
        else {
          element.recoveryTeamContactNumber = element.recoveryTeamContactNumber;
          element.recoveryStrategyContactNumber = element.recoveryStrategyContactNumber;
          lstObjectives.push(element);
        }
      });

      this.pageForm_bcdrRequest.patchValue({
        lstbCDRRequestObjective: lstObjectives
      });
    }

  }
  cancel() {
    this.showFilter = false;
    this.showPartnerDetails = false;
    this.IsEdit = false;
    this.IsInfo = false;
    this.showClientLOB = false;
    this.isoneclickdisable = false;
    this.IsdtTimeActivity = false;
    this.lstTeamNames.setValue([]);
    this.attachmentList_recoplan = [];
    this.LstReviewRequestStatus = [];
    this.RecoveryPlanFile = [];
    this.isShowApprovebtn = false;
    this.client.removeAt(0);
    this.Risks.removeAt(0);
    this.objectives.removeAt(0);
    this.Assumptions.removeAt(0);
    this.getRequestList();
    this.activeTab = 1
    this.setDefaultTab();
    this.createPageForm();
  }

  // Utility: normalize any input (Date, Moment-like, or string) to a real Date in local time
  private normalizeToLocalDate(value: any): Date | null {
    if (!value) return null;

    // If it's a native Date
    if (value instanceof Date) return value;

    // If it's a Moment instance (safer check than ._d)
    if (value && value._isAMomentObject && typeof value.toDate === 'function') {
      return value.toDate();
    }

    // Some date pickers store moment-like object as {_d: Date}
    if (value && value._d instanceof Date) {
      return value._d as Date;
    }

    // If it's a string, handle both ISO and "datetime-local" formats
    if (typeof value === 'string') {
      const s = value.trim();

      // Handle input[type="datetime-local"] without timezone (e.g., "2026-01-06T21:30" or with seconds)
      const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
      if (m) {
        const [, y, mo, d, h, mi, se] = m;
        return new Date(
          Number(y),
          Number(mo) - 1,
          Number(d),
          Number(h),
          Number(mi),
          se ? Number(se) : 0
        ); // Local time
      }

      // Otherwise let Date try to parse (handles "GMT"/"UTC" strings)
      const parsed = new Date(s);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    // Unknown type
    return null;
  }

  // Utility: format as local ISO-like string WITHOUT timezone (so it won't shift)
  private formatLocalISO(d: any): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
      `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }


  // Example usage inside your component method
  checkActualDate(compname: string) {
    const startRaw = this.pageForm_bcdrRequest.controls['actualStartDate'].value;
    const endRaw = this.pageForm_bcdrRequest.controls['actualEndDate'].value;

    const result = this.validateFullDateTime(startRaw, endRaw /*, { allowEqual: false } */);

    if (!result.valid) {
      alert(result.message || 'Invalid date-time selection.');
      this.patchDateValue(compname);
      return;
    }

    // Keep local Date objects; do NOT convert to ISO
    this.temactualstartDate = this.formatLocalISO(result?.start);
    this.tempactualEndDate = this.formatLocalISO(result?.end);

    this.getActualDates();
  }

  getActualDates() {
    this.pageForm_bcdrRequest.patchValue({
      actualEndDate: this.tempactualEndDate,
      actualStartDate: this.temactualstartDate
    });
  }


  patchDateValue(compname: any) {
    if (compname == 'activityEndDate') {
      this.pageForm_bcdrRequest.patchValue({
        activityEndDate: this.tempEndDate,
      });
    }
    if (compname == 'activityStartDate') {
      this.pageForm_bcdrRequest.patchValue({
        activityStartDate: this.tempStartDate,
      });
    }
    if (compname == 'actualEndDate') {
      this.pageForm_bcdrRequest.patchValue({
        actualEndDate: this.tempactualEndDate,
      });
    }
    if (compname == 'actualStartDate') {
      this.pageForm_bcdrRequest.patchValue({
        actualStartDate: this.temactualstartDate,
      });
    }
  }


  // Normalize any input (Date | Moment | string) to a local Date, without using toISOString()
  normalizeToDate(value: any): Date | null {
    if (!value) return null;

    // Already a Date
    if (value instanceof Date) return value;

    // Moment.js object (without touching private _d)
    if (value?._isAMomentObject && typeof value.toDate === 'function') {
      return value.toDate(); // local Date representation
    }

    // String or other — let native Date parse (works for ISO strings or "YYYY-MM-DD HH:mm")
    const d = new Date(String(value));
    return isNaN(d.getTime()) ? null : d;
  }

  validateFullDateTime(
    startRaw: any,
    endRaw: any,
    { allowEqual = false } = {}
  ): { valid: boolean; message?: string; start?: Date; end?: Date } {
    const start = this.normalizeToDate(startRaw);
    const end = this.normalizeToDate(endRaw);

    if (!start || !end) {
      //  this.patchDateValue(compname)
      return { valid: false, message: 'Please provide both Start and End date-time.' };
    }

    const startMs = start.getTime();
    const endMs = end.getTime();

    if (allowEqual ? startMs > endMs : startMs >= endMs) {
      // this.patchDateValue(compname)
      return { valid: false, message: 'StartDate must be greater then EndDate!!' };
    }

    return { valid: true, start, end };
  }



  checkObjectiveNewScheduleDate(compname: string): void {
    const objectives =
      this.pageForm_bcdrRequest.get('lstbCDRRequestObjective')?.value ?? [];

    for (let index = 0; index < objectives.length; index++) {
      const objective = objectives[index];

      const sched =
        objective?.lstbCDRRequestObjectiveNewScheduleModels?.[0];

      const start = sched?.startTime;
      const end = sched?.endDtime;

 

      /* ✅ 3. Start date must be LESS than end date */
      if (new Date(start).getTime() >= new Date(end).getTime()) {
        alert('Start date must be earlier than end date.');
        this.patchDateValueObjectiveNewScheduleDate(index, compname);
        return;
      }

      /* ✅ 4. Existing full date-time validation */
      const result = this.validateFullDateTime(
        start,
        end,
        { allowEqual: false }
      );

      if (!result.valid) {
        alert(result.message ?? 'Invalid date-time selection.');
        this.patchDateValueObjectiveNewScheduleDate(index, compname);
        return;
      }

      /* ✅ Store properly formatted local ISO strings */
      this.tempobjnewSchedularstart = this.formatLocalISO(result.start!);
      this.tempobjnewSchedularend = this.formatLocalISO(result.end!);

      this.getObjectiveNewScheduleActualDates(index);
    }
  }


  getObjectiveNewScheduleActualDates(i: number): void {

    const objectivesFA = this.pageForm_bcdrRequest.get(
      'lstbCDRRequestObjective'
    ) as FormArray;

    if (!objectivesFA || !objectivesFA.at(i)) return;

    const objectiveFG = objectivesFA.at(i) as FormGroup;

    const scheduleFA = objectiveFG.get(
      'lstbCDRRequestObjectiveNewScheduleModels'
    ) as FormArray;

    if (!scheduleFA || !scheduleFA.at(0)) return;

    const scheduleFG = scheduleFA.at(0) as FormGroup;

    scheduleFG.patchValue({
      startTime: this.tempobjnewSchedularstart,
      endDtime: this.tempobjnewSchedularend
    });
  }



  patchDateValueObjectiveNewScheduleDate(index: number, compname: any) {

    const objectivesFA = this.pageForm_bcdrRequest.get(
      'lstbCDRRequestObjective'
    ) as FormArray;

    if (!objectivesFA?.at(index)) return;

    const objectiveFG = objectivesFA.at(index) as FormGroup;

    const scheduleFA = objectiveFG.get(
      'lstbCDRRequestObjectiveNewScheduleModels'
    ) as FormArray;

    if (!scheduleFA?.at(0)) return;

    const scheduleFG = scheduleFA.at(0) as FormGroup;

    if (compname === 'startTime') {
      scheduleFG.patchValue({
        startTime: this.tempobjnewSchedularstart
      });
    } else {
      scheduleFG.patchValue({
        endDtime: this.tempobjnewSchedularend
      });
    }
  }

  // Main check function
  checkDate(nb: any, compname: any) {
    const startRaw = this.pageForm_bcdrRequest.controls['activityStartDate'].value;
    const endRaw = this.pageForm_bcdrRequest.controls['activityEndDate'].value;

    const start = this.normalizeToLocalDate(startRaw);
    const end = this.normalizeToLocalDate(endRaw);

    // If either date is missing/invalid, do nothing (or handle as needed)
    if (!start || !end) {
      return;
    }

    // Compare using numeric timestamps (local)
    if (start.getTime() > end.getTime()) {
      alert('Start Date must be less than End Date!');
      this.patchDateValue(compname);
      return;
    }

    // Preserve local date/time without timezone shift
    this.tempStartDate = this.formatLocalISO(start); // or keep as Date: this.tempStartDate = start;
    this.tempEndDate = this.formatLocalISO(end);   // or keep as Date: this.tempEndDate   = end;

    this.getActivityDates();
  }

  getActivityDates() {
    this.pageForm_bcdrRequest.patchValue({
      activityEndDate: this.tempEndDate,
      activityStartDate: this.tempStartDate
    });
  }




  // ---- tabe actions ----

  /**
  * Handle edit action - called when Edit button is clicked
  */
  onEdit(row: any): void {
    console.log('Edit action triggered for:', row);



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
    this.pagenation.pageSize = newValue;
    this.getRequestList();
    // this.itemsPerPage.set(newValue);
  }

  onSerchChange(newVal: string): void {
    console.log(newVal)
    this.pagenation.search = newVal.trim();
    this.getRequestList();
  }

  onPageChange(newPage: number): void {
    this.pagenation.pageNo = newPage;
    this.getRequestList();
    console.log('Page changed to:', newPage);
  }

  onShortChanges(name: any) {
    this.pagenation.sort = name;
    this.getRequestList();
    console.log(this.pagenation.sort)
  }




  // --valiaditon check

  CheckSpecialChar(event: any) {
    return this.vHelper.CheckSpecialChar(event);
  }

  allowCertainSpecChar(event: any) {
    return this.vHelper.allowCertainSpecChar(event);
  }

  OnlyNumber(event: any) {
    return this.vHelper.OnlyNumber(event);
  }

  alfaNumricwithSpace(event: any) {
    return this.vHelper.alfaNumricwithSpace(event);
  }

  onlyAlfabetic(event: any) {
    return this.vHelper.onlyAlfabetic(event);
  }




}


