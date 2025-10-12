import { Component, TemplateRef, ViewChild, ViewEncapsulation,} from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ActivatedRoute,Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, flatMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgbOffcanvas, OffcanvasDismissReasons,} from '@ng-bootstrap/ng-bootstrap';
import { SwitherService } from '../../../../shared/services/swither.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as FilePond from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';
import { AngularEditorModule, AngularEditorConfig,} from '@kolkov/angular-editor';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { errorRoutingModule } from '../../../error/error.route';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [ RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule, AngularFireDatabaseModule,
    CommonModule, MatFormFieldModule, MatSelectModule, AngularFirestoreModule, ToastrModule, SharedModule,
    MaterialModuleModule, MatSortModule, NgbDropdownModule, NgSelectModule, FilePondModule, AngularEditorModule,
    NgChartsModule, NgApexchartsModule,],
  providers: [ FirebaseService, { provide: ToastrService, useClass: ToastrService },
    DatePipe, NgbModalConfig, NgbModal, ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LeadsComponent extends BaseComponent {
  displayedColumns: string[] = [ 'sourceFlag', 'select', 'slNo', 'action', 'name', 'executive', 'stage', 'status', 'followUpDate', 'contact', 'email', 'city','updatedTime','completionStatus',];
  usersColumns: string[] = [ 'slNo', 'name', 'role', 'email', 'date', 'callsAttempted', 'callsConnected',];
  dataSource = new MatTableDataSource<any>();
  usersDataSource = new MatTableDataSource<any>();
  pageSize = 10; appointmentDataList: any[] = [];selectedAppointment: any = null; selectedLead: any;
  Crmusers: any[] = []; selectedLeads: any[] = [];
  CrmLeads: any = {}; element: any = {}; crmLeadsList: any; campaignId!: string;
  stageLst: any; isStagesLoading: boolean = true; isAddStagesDisabled: boolean = false;
  statusOptionsByStage: { [stageName: string]: any[] } = {}; statusLst: any;
  allStatuses: any; selectedStage: string = ''; checkboxStageOptions: any[] = []; 
  isStatusDataLoaded: boolean = false; selectedStatusCount: number | null = null;
  selectedStatus: string = ''; chartOptions: any; followUpCount: any;
  statusOptionsByStageforDisplay: any = {}; stageColorMap: Map<string, string> = new Map();
  statusColorMap: Map<string, string> = new Map();
  userColors = [ 'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark','bg-light', ];
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : ''; campaignName :any;
  Adonai: boolean = this.userData ? this.userData.adonai : false;
  statusClicked = false; statusCounts: { status: string; count: number }[] = [];
  crmStageData: any; crmStatusData: any; newOptionName: string = ''; status: string = 'In Progress Leads';
  showValidationError = false;  fetchCrmLeadsList: any[] = [];
  showCheckboxError = false; showNameError = false;
  anyChecked: any; addMoreVisible: boolean = false; newItem: string = '';  isStage: boolean = false;
  showStages: boolean = false; leaditems: { checked: boolean; label: string }[] = [];
  leadStatusitems: { checked: boolean; label: string }[] = []; selectedProgressLeads: any[] = [];
  selectedLostLeads: any[] = []; selectedConvertedLeads: any[] = [];
  newItemColor: string = '#000000'; newOptionColor: any; showMore = true; topshowMore = false;
  campaignList: any[] = []; agentUsers: any[] = []; selectedCampaign: any; selectTemplateForm!: FormGroup; taskForm!: FormGroup;
  formList: any; tempFormList: any; generatedTemplateId: any; currentIndex: number = 0; allTemplateGenIds: string[] = [];
  rotateCharts = true; executiveList: any[] = []; entryList: any[] = []; agents: any; leads: any[] = [];
  imageFileSrcData: any; followUpDetails: any[] = []; nextLeadStatus: any; minDateTime: string = '';
  selectedOpen: any[] = []; showForm: boolean = false; allowCustomStatus: boolean = true; shouldDisableAddStatus = false;isImporting: boolean = false;
  isStagesDisabled : boolean =false; phoneNumber: string = '';readonlyMode:boolean=false;originalConnectedForm: any = {};
  fetchedData:any;companyLst:any;selectedFileName:any;originalStatus: string = '';
  notconnectedstatusClicked = false; adoanAiRole: any;leadList :any;filteredLeadList: any[] = [];   // holds filtered leads
  displayedLeads: any[] = []; override cityList:any[]=[];
  filterApplied: boolean = false;moveCampaign:string ='';editMode:boolean= false;
  appointmentId: number | null = null; taskPriorityList :any;taskList:any; appointmentFormSubmitted : boolean = false;
  selectedLeadForAppointment:any; selectedLeadForAppointmentObject:any;
  leadCompletionsubmitted : boolean = false;leadStatusCount:any;activeCount:Number =0;connectedCount :Number =0;
  notConnectedCount:Number =0;statusCompletion:Number =0 ;crmRole:any;selecteTemplateFormSubmitted : boolean = false;
  currentCampaignId : string ='';
  crmStaticStages = [ 
    {  name: 'In Progress Leads', checked: false, isDefault: true, isCustom: false, color: '#28a745', },
    { name: 'Lost Leads', checked: false, isDefault: true, isCustom: false, color: '#dc3545', },
    { name: 'Converted Leads', checked: false, isDefault: true, isCustom: false, color: '#007bff',},
  ];
  stageColor: { [key: string]: string } = { open: '#007bff',};
  statusColor: { [key: string]: string } = { active: '#007bff', };
  uploadStageDisplay: { name: string; color: string } = { name: '', color: '' };
  uploadStatusDisplay: { name: string; color: string } = { name: '', color: '', };
  selectedType: string = ''; dynamicFields: { value: string }[] = []; showSourceFlagColumn: boolean = false;
  matcardLst: any; topDisplayedCards: any; defaultStageName: string = ''; defaultStatusName: string = '';
  allocateExecutive: boolean = false; selectedLeadId: number = 0;  individualEmail: any;  hasSelectedInvalid = false;
  completionForm !:FormGroup;currentStep = 1;
  @ViewChild(MatPaginator) paginator!: MatPaginator; LeadToCampaignForm!: FormGroup;
  @ViewChild(MatPaginator) usersPaginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;

  public leadForm!: FormGroup;
  public sendMultiMailSubmitted = false;
  public taskSubmitted = false;
  public submitted = false;
  selectedCountry: string = 'India';
  public leadDetails: any = {};

  public uploadLead!: FormGroup;
  public uploadSubmitted = false;
  public uploadSpinner = false;
  public leadCount = 0;
  public leadId = 0;

  public sendLeadForm!: FormGroup;
  public filterForm!: FormGroup;
  public sendwhatsLeadForm!: FormGroup;
  public appointmentForm!: FormGroup;
  public sendwhatsLeadFormSubmitted = false;
  public sendLeadSubmitted = false;
  public filterLeadSubmitted = false;

  public followupName = '';
  public executiveName = '';
  public followupLeadForm!: FormGroup;
  public filterLeadForm!:FormGroup;
  public followupLeadSubmitted = false;

  public userList: any;

  public allocateForm!: FormGroup;
  public allocateSubmitted = false;
  selectedIdList: Set<number> = new Set<number>();

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };
  public pieChartLabels = [ 'Spoke', 'Active', 'Proposal sent', 'Meeting Fixed', 'Met', 'Closed', 'Lost', ];
  public pieChartDatasets = [ { data: [200, 150, 100, 43, 23, 78],},];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,
    public switchService: SwitherService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();
    this.statusOptionsByStage = 
    { 'In Progress Leads': [...this.inPorgressLeads],
       'Lost Leads': [...this.lostLeads],
      'Converted Leads': [...this.convertedLeads],
      'open Stage': [...this.openStage],
    };
    this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
    this.crmRole = JSON.parse(this.userData).crmRole;
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        height: 300,
        type: 'pie',
      },
      colors: ['#845adf', '#23b7e5', '#f5b849', '#49b6f5', '#e6533c'],
      labels: [
        'Hot 250',
        'Payment Status 50',
        'Call Back Later 190',
        'cold 150',
        'warm 200',
      ],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
    };
  }
  appointmentModal(appointment1: any, element: any, appointmentData: any = null) {
   this.selectedLeadForAppointmentObject = element; // full lead object
  if (!this.selectedLeads || this.selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead');
      return;
  }
  this.appointmentForm.reset();

  if (appointmentData) {
    // Edit mode
    this.editMode = true;
    this.selectedAppointment = appointmentData;

    // Patch form values
    this.appointmentForm.patchValue({
      appointmentId : 0,
      appointmenType: appointmentData.appointmenType,
      date: appointmentData.date,
      description: appointmentData.description,
      duration: appointmentData.duration,
      assignedDesigner: appointmentData.assignedDesigner
    });

    // Save appointment ID for edit API payload
    this.appointmentId = appointmentData.id;
  } else {
    // Create mode
    this.editMode = false;
    this.selectedAppointment = null;
    this.appointmentId = 0;
  }

  this.modalService.open(appointment1, { centered: true });
  }


  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
  openModal(content1: any) {
    this.modalService.open(content1, { centered: true });
  }

  openTaskModal(content: any) {
    if (!this.selectedLeads || this.selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    this.modalService.open(content, { backdrop: 'static' });

  }
  
  offcanvasRef: any;
  openRight(content: any) {
    this.offcanvasRef = this.offcanvasService.open(content, {
      position: 'end',scroll: true,
    });
  }

  openRight1(content1: any) {
    this.offcanvasService.open(content1, { position: 'end' });
  }

  openRight2(content30: any) {
    this.modalService.open(content30, { centered: true });
  }

  selectedLeadData: any;
  openRight3(content31: any, element: any) {
    this.selectedLeadData = element;
    this.modalService.open(content31, { centered: true });
  }

  openFollowup(element: any, content1: any) {
    this.followupName = element.name;
    let executive = this.userData ? JSON.parse(this.userData).email : '';
    this.executiveName = executive;
    this.leadId = element.leadId;
    this.offcanvasService.open(content1, { position: 'end' });
  }

  url1: string = '';

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.url1 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.usersDataSource.paginator = this.usersPaginator;
    this.usersDataSource.sort = this.sort2;
  }

  getSNo(index: number): number {
    if (
      this.paginator &&
      this.paginator.pageIndex !== undefined &&
      this.paginator.pageSize !== undefined
    ) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }
  usersGetSNo(index: number): number {
    if (
      this.usersPaginator &&
      this.usersPaginator.pageIndex !== undefined &&
      this.usersPaginator.pageSize !== undefined
    ) {
      return (
        this.usersPaginator.pageIndex * this.usersPaginator.pageSize + index + 1
      );
    }
    return index + 1;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  userFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }
  VerticallyScrol(content12: any,leadData?: any) {
    if (!this.stageLst || this.stageLst.length === 0) {
      this.toastr.warning('Please add at least one Stage before uploading.');
      return;
    }

    if (!this.statusLst || this.statusLst.length === 0) {
      this.toastr.warning('Please add at least one Status before uploading.');
      return;
    }

    this.leadId = 0;
    this.submitted = false;
    this.leadForm.reset();
    this.modalService.open(content12, {
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
      centered: true,
      size: 'xl',
    });

    
  }
  // openLg(content10:any) {
  //   this.modalService.open(content10, { size: 'lg' },);
  // }

  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];

  // FormControl for search and selection
  searchControl = new FormControl('');
  selectedOption = new FormControl('');
  filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    this.options
  );

  ngOnInit(): void {
    const now = new Date();
    // Pad with 0 if needed
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());

    this.minDateTime = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    this.route.queryParams.subscribe((params) => {
      this.campaignId = params['campaignId']?.trim() || '';
      this.LeadForm(this.campaignId);
      this.getFetchLeadData();
      this.getCrmStages();
      this.getStatusCount();
      this.getCampaignData();
      this.getlistFormTemplate();
      this.getAllEmailTemplates();
      this.selectedLeads = [];
    // this.getCrmLeads();

      const nav = history.state;
      if (nav?.agents) {
        this.agents = nav.agents;
      }

      //Send Email
      this.appointmentForm = this.fb.group({
        appointmenType: ['',Validators.required],
        date: ['', Validators.required],
        description: [''],
        duration: ['', Validators.required],
        currentUser: [this.userEmail],
        assignedDesigner:['',Validators.required],
        leadEntry: this.fb.group({
          leadId: [0],
          name: [''],
          companyName: [''],
          executive: [''],
          products: [''],
          stage: [''],
          leadSource: [''],
          zipCode: [''],
          followUpDate: [''],
          state: [''],
          city: [''],
          address: [''],
          contact: [''],
          email: [''],
          currentStage: [''],
          updatedBy: [''],
          updatedTime: [''],
          entryBy: [''],
          campaignId: [''],
          companyCode: [''],
          individualEmail: [''],
          type: 0
        }),
        createdTime:['']
        });

      //Send Email
      this.sendLeadForm = this.fb.group({
        email: ['', [Validators.required]],
        template: ['', [Validators.required]],
        subject: ['', [Validators.required, Validators.minLength(3)]],
        cc: ['', [Validators.required]],
        bcc: ['', [Validators.minLength(3)]],
        content: ['', [Validators.required]],
      });

      // filterLeadForm
      this.filterLeadForm = this.fb.group({
        action : [''],
        stage: [''],
        status: [''],
        source: [''],
        startDate: [''],
        endDate: [''],
        executive: [''],
        city: [''],
        campaignId: [''],
        companyCode: this.userCompanyCode,
        email: this.userEmail,
        type: this.userType
      });

      this.sendLeadForm.get('template')
        ?.valueChanges.subscribe((templateGenId) => {
          if (templateGenId) {
            // this.getFormTemplate();
          }
      });
    });

    this.getLeadEntry();

    //Upload Lead Validatoin
    this.uploadLead = this.fb.group({
      file: ['', [Validators.required]],
      autoAllocate: [false],
      agents:[''],
      companyCode: [this.userCompanyCode],
      email: [this.individualEmail],
      type: [this.userType],
    });

    //Send Email
    this.selectTemplateForm = this.fb.group({
      campaignId: [0],
      templateGenId: [''],
      templateName: ['',Validators.required],
      subject: ['',Validators.required],
      description: ['',Validators.required],
      createdDate: [new Date().toISOString()],
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
    });

    //Create Task
    this.taskForm = this.fb.group({
      deadline: ['',Validators.required],
      taskName: ['',Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['',Validators.required ],
      description: ['',Validators.required ],
      currentStatus: ['',Validators.required],
      leadIdList: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
      taskCreatedBy : [this.userEmail],
      leadEntry : [this.userEmail]
    });

    //Send Email
    this.followupLeadForm = this.fb.group({
      followupDate: ['', [Validators.required]],
      followupTime: [''],
      stage: ['', [Validators.required]],
      status: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      followUpBy: [''],
    });

    //Allocate Lead Executive
    this.allocateForm = this.fb.group({
      executive: [ [Validators.required]],
    });

    // lead Move to Campaign

    this.LeadToCampaignForm = this.fb.group({
      campaignId: [this.campaignId,],
    });

    this.completionForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      businessCategory: ['' , Validators.required],
      address: ['' , Validators.required],
      username: ['',Validators.required],
      clientName: ['',Validators.required],
      mobileNumber: ['',Validators.required],
      endDate : ['',Validators.required],
      projectEstimation : ['',Validators.required]
    });

    this.getUsers();
    this.searchControl.valueChanges.subscribe((searchText) => {
      if (searchText && typeof searchText === 'string') {
        const filtered = this.options.filter((option) =>
          option.toLowerCase().includes(searchText.toLowerCase())
        );
        this.filteredOptions.next(filtered);
      } else {
        this.filteredOptions.next(this.options);
      }
    });
    setTimeout(() => {
      this.rotateCharts = false;
    }, 1000);

    this.crmStageData = {
      stageId: 0,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      f1: '',
      f2: '',
      f3: '',
      f4: '',
      f5: '',
      f6: '',
      f7: '',
      f8: '',
      f9: '',
      f10: '',
      f11: '',
      f12: '',
      f13: '',
      f14: '',
      f15: '',
      f16: '',
      f17: '',
      f18: '',
      f19: '',
      f20: '',
      f21: '',
      f22: '',
      f23: '',
      f24: '',
      f25: '',
      f1Color: '',
      f2Color: '',
      f3Color: '',
      f4Color: '',
      f5Color: '',
      f6Color: '',
      f7Color: '',
      f8Color: '',
      f9Color: '',
      f10Color: '',
      f11Color: '',
      f12Color: '',
      f13Color: '',
      f14Color: '',
      f15Color: '',
      f16Color: '',
      f17Color: '',
      f18Color: '',
      f19Color: '',
      f20Color: '',
      f21Color: '',
      f22Color: '',
      f23Color: '',
      f24Color: '',
      f25Color: '',
      campaignId: this.campaignId,
      updatedBy: this.userName,
      updatedTime: new Date().toISOString(),
      stageActivity: 'YES',
      type: this.userType,
    };

    this.crmStatusData = {
      stageId: 0,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      stage: '',
      f1: '',
      f2: '',
      f3: '',
      f4: '',
      f5: '',
      f6: '',
      f7: '',
      f8: '',
      f9: '',
      f10: '',
      f11: '',
      f12: '',
      f13: '',
      f14: '',
      f15: '',
      f16: '',
      f17: '',
      f18: '',
      f19: '',
      f20: '',
      f21: '',
      f22: '',
      f23: '',
      f24: '',
      f25: '',
      f1Color: '',
      f2Color: '',
      f3Color: '',
      f4Color: '',
      f5Color: '',
      f6Color: '',
      f7Color: '',
      f8Color: '',
      f9Color: '',
      f10Color: '',
      f11Color: '',
      f12Color: '',
      f13Color: '',
      f14Color: '',
      f15Color: '',
      f16Color: '',
      f17Color: '',
      f18Color: '',
      f19Color: '',
      f20Color: '',
      f21Color: '',
      f22Color: '',
      f23Color: '',
      f24Color: '',
      f25Color: '',
      campaignId: this.campaignId,
      updatedBy: this.userName,
      updatedTime: new Date().toISOString(),
      stageActivity: 'YES',
      type: this.userType,
    };
    this.updateColumns();
  }

  updateColumns() {
    const hasExecutiveLead = this.dataSource.data.some(element => element.source === 'executive');
    const newColumns = this.displayedColumns.filter(col => col !== 'sourceFlag');
    if (hasExecutiveLead) {
      this.displayedColumns = ['sourceFlag', ...newColumns]; 
    } else {
      this.displayedColumns = [...newColumns];  
    }
  }

  addLeadItem() {
    const newItemName = this.newItem?.trim();
    const selectedColor = this.newItemColor?.toLowerCase();
    if (!newItemName) {
      this.toastr.warning('Please enter a lead Stage.');
      return;
    }
    const itemExists = this.crmStaticStages.some(
      (plan) => plan.name.toLowerCase() === newItemName.toLowerCase()
    );
    if (itemExists) {
      this.toastr.warning('This item already exists!');
      return;
    }
    if (
      !selectedColor ||
      selectedColor === '#000000' ||
      selectedColor === '#000'
    ) {
      this.toastr.warning('Please select a  color');
      return;
    }
    this.crmStaticStages.push({
      name: newItemName,
      checked: false,
      isDefault: false,
      isCustom: true,
      color: selectedColor,
    });
    this.toastr.info('Item added Successfully');
    this.newItem = '';
    this.newItemColor = '#000000';
  }

  deleteLeadItem(index: number) {
    const deleted = this.crmStaticStages[index]?.name;
    this.crmStaticStages.splice(index, 1);
    this.toastr.warning(`'${deleted}' has been deleted`);
  }
  addLeadStatusItem() {
    this.leadStatusitems.push({ checked: false, label: '' });
  }
  inPorgressLeads = [
    {
      name: 'Quotataion Shared',
      checked: false,
      isDefault: true,
      color: '#28a745',
    },
    {
      name: 'Commercial Discussion',
      checked: false,
      isDefault: true,
      color: '#007bff',
    },
    { name: 'Office Visit', checked: false, isDefault: true, color: '#ffc107' },
    { name: 'Hot', checked: false, isDefault: true, color: '#dc3545' },
    { name: 'Cold', checked: false, isDefault: true, color: '#6c757d' },
    { name: 'Warm', checked: false, isDefault: true, color: '#fd7e14' },
    { name: 'Call Back', checked: false, isDefault: true, color: '#17a2b8' },
  ];

  lostLeads = [
    {
      name: 'Not Interested',
      checked: false,
      isDefault: true,
      color: '#dc3545',
    },
    { name: 'Irrelevant', checked: false, isDefault: true, color: '#6c757d' },
    {
      name: 'Given to others',
      checked: false,
      isDefault: true,
      color: '#fd7e14',
    },
  ];

  convertedLeads = [
    { name: 'CD done', checked: false, isDefault: true, color: '#28a745' },
    {
      name: '10% advance Done',
      checked: false,
      isDefault: true,
      color: '#007bff',
    },
  ];
  openStage = [
    { name: 'active', checked: false, isDefault: true, color: '#28a745' },
    { name: 'connected', checked: false, isDefault: true, color: '#28a743' },
    {
      name: 'Not Connected',
      checked: false,
      isDefault: true,
      color: '#ffc107',
    },
    { name: 'Invalid', checked: false, isDefault: true, color: '#dc3545' },
  ];

  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible;
  }

  LeadForm(campaignId: string) {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      executive: [''],
      products: [''],
      country: [''],
      stage: ['', Validators.required],
      status: ['', Validators.required],
      leadSource: [''],
      zipCode: [''],
      followUpDate: [''],
      state: [''],
      city: [''],
      address: [''],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      email: [''],
      leadId: [0],
      currentStage: [''],
      updatedBy: [this.userEmail],
      updatedTime: [''],
      entryBy: [this.userEmail],
      companyCode: [this.userCompanyCode],
      companyName: [this.userCompanyName],
      individualEmail: [this.userEmail],
      type: [this.userType],
      campaignId: [this.campaignId],
    });
  }

  get f() {
    return this.leadForm.controls;
  }
  get g() {
    return this.taskForm.controls;
  }
  get h() {
    return this.appointmentForm.controls;
  }
  get j() {
    return this.completionForm.controls;
  }
  get k() {
    return this.selectTemplateForm.controls;
  }

  onSubmit(modal: any) {
    const followUpDate = this.leadForm.get('followUpDate')?.value;
    if (followUpDate) {
      this.followupLeadSubmit(modal);
    }
    this.leadForm.get('campaignId')?.setValue(this.campaignId);
    this.leadForm.get('executive')?.setValue('');
    this.leadForm.get('entryBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('updatedBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('companyCode')?.setValue(JSON.parse(this.userData).companyCode);
    this.leadForm.get('companyName')?.setValue(JSON.parse(this.userData).companyName);
    this.leadForm.get('individualEmail')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('type')?.setValue(JSON.parse(this.userData).type);
    this.leadForm.get('updatedTime')?.setValue(new Date().toISOString());
    const payload = this.leadForm.value;
    this.submitted = true;
    this.uploadSpinner = true;

    if (this.leadForm?.valid) {
      this.switchService.AddCrmLeads(payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            modal.close();
            this.submitted = false;
            this.leadForm.reset();
            this.getFetchLeadData();
            this.uploadSpinner = false;
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }

  editLeadSubmit(modal: any) {
    this.leadForm.get('campaignId')?.setValue(this.campaignId);
    this.leadForm.get('executive')?.setValue(this.element.executive ?? null);
    this.leadForm.get('entryBy')?.setValue(this.element.entryBy ?? null);
    this.leadForm.get('updatedBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('updatedTime')?.setValue(new Date().toISOString());
    const payload = this.leadForm.value;
    this.submitted = true;
    if (this.leadForm?.valid) {
      this.switchService.EditCrmLeads(payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            modal.close();
            this.submitted = false;
            this.leadForm.reset();
            this.getFetchLeadData();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }

  appointmentFormSubmit(modal: any) {  
    const formData = this.appointmentForm.value;
    const payload = {
      appointmenType: formData.appointmenType,
      date: formData.date,
      description: formData.description,
      duration: formData.duration,
      currentUser: this.userEmail,
      assignedDesigner: formData.assignedDesigner,
          ...(this.appointmentId ? { appointmentId: this.appointmentId } : {}),
      companyCode : this.userCompanyCode,
      email : this.userEmail,
      type : this.userType,
      leadEntry:this.selectedLeadForAppointment ? {
        leadId: this.selectedLeadForAppointment.leadId,
        name: this.selectedLeadForAppointment.name,
        companyName: this.selectedLeadForAppointment.companyName,
        executive: this.selectedLeadForAppointment.executive,
        products: this.selectedLeadForAppointment.products,
        country: this.selectedLeadForAppointment.country,
        stage: this.selectedLeadForAppointment.stage,
        status: this.selectedLeadForAppointment.status,
        leadSource: this.selectedLeadForAppointment.leadSource,
        zipCode: this.selectedLeadForAppointment.zipCode,
        followUpDate: this.selectedLeadForAppointment.followUpDate,
        state: this.selectedLeadForAppointment.state,
        city: this.selectedLeadForAppointment.city,
        address: this.selectedLeadForAppointment.address,
        contact: this.selectedLeadForAppointment.contact,
        email: this.selectedLeadForAppointment.email,
        currentStage: this.selectedLeadForAppointment.currentStage,
        updatedBy: this.selectedLeadForAppointment.updatedBy,
        updatedTime: this.selectedLeadForAppointment.updatedTime,
        entryBy: this.selectedLeadForAppointment.entryBy,
        campaignId: this.selectedLeadForAppointment.campaignId,
        companyCode: this.selectedLeadForAppointment.companyCode,
        individualEmail: this.selectedLeadForAppointment.individualEmail,
        type: this.selectedLeadForAppointment.type,
      }  : null  
    };
    this.appointmentFormSubmitted = true;
    if(this.appointmentForm?.valid){
      this.switchService.saveAppointment(payload).subscribe({
        next: (res) => {
          this.toastr.success('Appointment Created ');
          this.appointmentFormSubmitted = false;
          modal.close();
        },
        error: (err) => {
        }
      });
    }
  }

  getAppointment(element: any) {
    this.leadId = element.leadId;
    const leadId = element.leadId;
    this.switchService.fetchAppointment(leadId).subscribe({
      next: (res) => {
        this.appointmentDataList = res;
        if (res.length > 0) {
          const selectedAppointment = res[0]; // or find(x => x.appointmentId === someId)
          this.appointmentId = selectedAppointment.appointmentId;
          this.appointmentForm.patchValue(selectedAppointment);
        }
        this.appointmentId= res.appointmentId;
        
      },
      // error: (err) => {
      //   this.toastr.error('Failed to fetch appointment');
      // }
    });
  }

  selectFormTemplateSubmit() {
    this.selecteTemplateFormSubmitted = true;
    if (this.selectTemplateForm.invalid) {
      this.selectTemplateForm.markAllAsTouched();
      this.toastr.warning('please fill all mandatory fields');
      return;
    }
   this.uploadSpinner = true;
    const payload = this.selectTemplateForm.value;
    this.switchService.selectFormTemplate(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Template submitted successfully!');
        // this.getFormTemplate();
        this.getAllEmailTemplates();
        this.selecteTemplateFormSubmitted = false;
           this.uploadSpinner = false;
        this.offcanvasService.dismiss();
        this.selectTemplateForm.reset();
      },
      // error: (err) => {
      //   this.toastr.error(err.statusText || 'Error submitting the template.');
      // },
    });
  }

  getlistFormTemplate() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
    };
    this.switchService.listFormTemplate(payload).subscribe({
      next: (res: any) => {
        this.formList = res;
        this.allTemplateGenIds = res.map(
          (template: any) => template.templateGenId
        );
        if (this.allTemplateGenIds.length > 0) {
          // this.getFormTemplate();
        }
      },
      // error: (error) => {
      //   this.toastr.error('Error fetching product data');
      // },
    });
  }

  // getFormTemplate(): void {
  //   const requests = this.allTemplateGenIds.map((id) =>
  //     this.switchService.fetchFormTemplate(id)
  //   );
  //   forkJoin(requests).subscribe({
  //     next: (responses: any[]) => {
  //       this.tempFormList = responses;
  //     },
  //     error: (err) => {
  //       this.toastr.error('Error fetching template details');
  //     },
  //   });
  // }

  getAllEmailTemplates(): void {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
    };
    this.switchService.allEmailTemplates(payload).subscribe({
      next: (res: any[]) => {
        this.tempFormList = res;
      },
    });
  }

  onTemplateChange(selectedTemplate: any): void {
    if (!selectedTemplate || !selectedTemplate.templateGenId) {
      this.toastr.warning('Please Select Template');
      return;
    }
    this.sendLeadForm.patchValue({
      subject: selectedTemplate.subject || '',
      content: selectedTemplate.description || '',
    });
  }
  onWhatsappTemplateChange(selectedTemplate: any): void {
    if (!selectedTemplate || !selectedTemplate.templateGenId) {
      this.toastr.warning('Please Select Template');
      return;
    }
    this.sendwhatsLeadForm.patchValue({
      subject: selectedTemplate.subject || '',
      content: selectedTemplate.description || '',
    });
  }
  get P() {
    return this.sendwhatsLeadForm.controls;
  }

  getUserColor(followup: any): string {
    const key = followup.email || followup.followUpBy || 'default';
    const index = this.hashString(key) % this.userColors.length;
    return this.userColors[index];
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  initializeDynamicFields(): void {
    this.dynamicFields = [];
    if (this.stageLst && this.stageLst.length > 0) {
      const stage = this.stageLst[0];
      for (let i = 1; i <= 25; i++) {
        const value = stage[`f${i}`];
        if (value && value.trim() !== '') {
          this.dynamicFields.push({ value: value.trim() });
        }
      }
    }
  }

  saveCrmStatus(): void {
    if (!this.selectedStage) {
      this.showValidationError = true;
      this.toastr.error('Please select a stage before saving.');
      return;
    } else {
      this.showValidationError = false;
    }
    this.crmStatusData.stage = this.selectedStage;
    const selectedOptions = this.checkboxStageOptions.filter(opt => opt.checked);
    if (selectedOptions.length === 0) {
      this.showCheckboxError = true;
      this.toastr.error('Please select at least one status.');
      return;
    } else {
      this.showCheckboxError = false;
    }
    const allNames = selectedOptions.map((option) => option.name);
    const uniqueNames =  [...new Set(selectedOptions.map(opt => opt.name))];
    const allColors = selectedOptions.map((option) => option.color);
    const uniqueColors = [...new Set(selectedOptions.map(opt => opt.color))];
    // const dynamicFields = uniqueNames.map((name, index) => {
    //   return {
    //     [`f${index + 1}`]: name,
    //     [`f${index + 1}Color`]: uniqueColors[index] || '',
    //   };
    // });
     const dynamicFields = uniqueNames.map((name, index) => ({
      [`f${index + 1}`]: name,
      [`f${index + 1}Color`]: uniqueColors[index] || ''
    }));
    const customStatuses = this.statusOptionsByStage[this.selectedStage]
      .filter((opt) => opt.isCustom)
      .map((opt) => opt.name);
    // this.crmStatusData = {
    //   ...this.crmStatusData,
    //   customStatuses,
    //   ...Object.assign({}, ...dynamicFields),
    // };
    // Step 1: Clear all 25 fields by setting them to empty strings (not deleting keys)
    for (let i = 1; i <= 25; i++) {
      this.crmStatusData[`f${i}`] = '';
      this.crmStatusData[`f${i}Color`] = '';
    }
    this.crmStatusData = {
      ...this.crmStatusData,
      stage: this.selectedStage,
      customStatuses,
      ...Object.assign({}, ...dynamicFields)
    };
    this.statusOptionsByStageforDisplay[this.selectedStage] = selectedOptions.map(opt => ({
      name: opt.name,
      color: opt.color,
      isCustom: opt.isCustom || false
    }));
    this.uploadSpinner = true;
    this.switchService.SaveCrmStatus(this.crmStatusData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Status saved successfully');
          this.offcanvasService.dismiss();
          this.uploadSpinner = false;
          this.getCrmStages();
          this.getCrmStatus();
        } else {
          this.toastr.error(res.message);
        }
      },
      // error: (error) => {
      //   this.toastr.error(error.statusText);
      // },
    });
  }

  getCrmStatus(): void {
    let completedRequests = 0;
    const hasSavedStageStatuses: string[] = [];

    this.statusOptionsByStageforDisplay = {};
    this.statusLst = [];

    for (let i = 0; i < this.stageLst.length; i++) {
      const stageName = this.stageLst[i].stageName.trim();

      const payload = {
        email: this.userData ? JSON.parse(this.userData).email : '',
        companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
        type: this.userData ? JSON.parse(this.userData).type : '',
        stage: stageName,
        campaignId: this.campaignId,
      };

      const fields = Array.from({ length: 25 }, (_, i) => `f${i + 1}`);
      const colorFields = Array.from(
        { length: 25 },
        (_, i) => `f${i + 1}Color`
      );

      this.switchService.CrmStatus(payload).subscribe({
        next: (res: any) => {
          if (res.length === 1) {
            const item = res[0];
            const options = fields
              .map((field, index) => {
                const name = item[field];
                const color = item[colorFields[index]];
                return name
                  ? {
                      name,
                      checked: false,
                      isCustom: false,
                      color: color || '#cccccc',
                    }
                  : null;
              })
              .filter((opt) => opt !== null);

            // 🧼 Always assign fresh copy
            this.statusOptionsByStageforDisplay[stageName] = JSON.parse(
              JSON.stringify(options)
            );

            if (options.length > 0) {
              hasSavedStageStatuses.push(stageName);
            }
          }
        },
        error: (error) => {
          const errorMessage =
            error.statusText || 'Something went wrong while fetching statuses.';
          this.toastr.error(errorMessage);
          this.statusOptionsByStageforDisplay[stageName] = [];
        },
        complete: () => {
          completedRequests++;

          if (completedRequests === this.stageLst.length) {
            this.statusLst = [];

            for (const [stage, fields] of Object.entries(
              this.statusOptionsByStageforDisplay
            )) {
              const clonedFields = JSON.parse(JSON.stringify(fields));
              this.statusLst.push({
                stage,
                fields: clonedFields,
                count: clonedFields.length 
              });
            }
            const openExists = this.statusLst.some(
              (s: any) => s.stage.toLowerCase() === 'open'
            );
            if (!openExists && this.openStage && this.openStage.length > 0) {
              this.statusLst.push({
                stage: 'open',
                fields: JSON.parse(JSON.stringify(this.openStage)),
              });
              this.statusOptionsByStageforDisplay['open'] = JSON.parse(
                JSON.stringify(this.openStage)
              );
            }

            this.statusLst.sort(
              (
                a: { stage: string; fields: any[] },
                b: { stage: string; fields: any[] }
              ) => {
                if (a.stage.toLowerCase() === 'open') return -1;
                if (b.stage.toLowerCase() === 'open') return 1;
                return 0;
              }
            );

            this.defaultStageName =
              this.statusLst.find(
                (s: { stage: string }) => s.stage.toLowerCase() === 'open'
              )?.stage ||
              this.stageLst[0]?.stageName ||
              '';
            this.defaultStatusName = 'active';

            this.shouldDisableAddStatus =
              this.stageLst.length > 0 &&
              this.stageLst.every((stage: any) => {
                const stageName = stage.stageName.trim();
                const options = this.statusOptionsByStageforDisplay[stageName];
                return Array.isArray(options) && options.length > 0;
              });

          }
        },
      });
    }
  }

  isAddStatusDisabled(): boolean {
    if (!this.stageLst || this.stageLst.length === 0) {
      return false;
    }

    const anyStageMissingStatuses = this.stageLst.some((stage: any) => {
      const stageName = stage.stageName;
      const options = this.statusOptionsByStageforDisplay[stageName];
      return !options || options.length === 0;
    });

    return !anyStageMissingStatuses;
  }

  getDynamicFields(status: any): string[] {
    const dynamicFields = [];
    for (let i = 1; i <= 25; i++) {
      const fieldName = `f${i}`;
      if (status[fieldName]) {
        dynamicFields.push(status[fieldName]);
      }
    }
    return dynamicFields;
  }

  isHighlightedStatus(status: string): boolean {
    const highlighted = [
      'In Progress Leads',
      'Lost Leads',
      'Converted Leads',
      'Wrong Leads',
    ];
    return highlighted.includes(status);
  }

  saveCrmStages() {
    this.isStagesDisabled = true;
    const selectedStages = this.crmStaticStages.filter(
      (stage) => stage.checked
    );
    if (selectedStages.length === 0) {
      this.toastr.error('Please select at least one stage before saving.');
      return;
    }
    this.prepareCrmStageData();
    this.switchService.SaveCrmStages(this.crmStageData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.isStagesDisabled = false;
          this.offcanvasService.dismiss();
          this.getCrmStages();
          this.isAddStagesDisabled = true;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        // this.toastr.error(error.statusText);
        this.isStagesDisabled = false;
      },
    });
  }

  getCrmStages(): void {
    this.isStagesLoading = true;
    this.isAddStagesDisabled = true;
    const payload = {
      email: this.userData ? JSON.parse(this.userData).email : '',
      companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
      type: this.userData ? JSON.parse(this.userData).type : '',
      campaignId: this.campaignId,
    };
    this.switchService.CrmStages(payload).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          const stageObj = res[0];
          this.processStageData(res[0]);
          const stageKeys = Object.keys(stageObj).filter((key) =>
            /^f\d+$/.test(key)
          );
          const anyStagesSelected = this.crmStaticStages.some(
            (stage) => stage.checked
          );
          this.isAddStagesDisabled = anyStagesSelected;

          const firstStageKey = stageKeys.find(
            (key) => stageObj[key]?.trim() !== ''
          );
          // this.defaultStageName = firstStageKey ? stageObj[firstStageKey] : '';
          this.defaultStageName = 'open';
          const isAdonaiUser = this.Adonai;
          // this.defaultStageName = firstStageKey ? stageObj[firstStageKey] : '';
          const defaultStageExists = this.stageLst.some(
            (s: any) => s.stageName === 'Design Stage'
          );

          if (isAdonaiUser && !defaultStageExists) {
            const insertIndex = Math.max(1, this.stageLst.length - 2); // ensures index is at least 1
            const defaultStage = {
              stageName: 'Design Stage',
              color: '#000000',
              createdBy: this.userEmail,
              companyCode: this.userCompanyCode,
            };
            this.stageLst.splice(insertIndex, 0, defaultStage);
          }
          const defaultStageName = 'open';
          const defaultStageColor = '#007bff';

          if (
            !this.stageLst.find((s: any) => s.stageName === defaultStageName)
          ) {
            this.stageLst.unshift({
              stageName: defaultStageName,
              color: defaultStageColor,
            });
          }
          this.getCrmStatus();
          this.isAddStagesDisabled = true;
        } else {
          this.stageLst = [];
          this.isAddStagesDisabled = false;
        }
      }
    });
  }

  addNewOption(): void {
    const newName = this.newOptionName?.trim();
    const newColor = this.newOptionColor;

    if (!newName) {
      this.toastr.warning('Please enter a status name.');
      return;
    }

    if (!newColor) {
      this.toastr.warning('Please select a color.');
      return;
    }    
    const currentStageOptions =
      this.statusOptionsByStage[this.selectedStage] || [];
    const currentDisplayOptions =
      this.statusOptionsByStageforDisplay[this.selectedStage] || [];

    const isDuplicate = currentStageOptions.some(
      (opt: any) => opt.name.toLowerCase() === newName.toLowerCase()
    );

    if (!isDuplicate) {
      const newOption = {
        name: newName,
        checked: true,
        isCustom: true,
        color: newColor,
      };
      currentStageOptions.push(newOption);
      currentDisplayOptions.push(newOption);
      this.statusOptionsByStage[this.selectedStage] = [...currentStageOptions];
      this.statusOptionsByStageforDisplay[this.selectedStage] = [
        ...currentDisplayOptions,
      ];
      this.checkboxStageOptions = [...currentStageOptions];

      this.toastr.info('Item added.');
    } else {
      this.toastr.warning(`'${newName}' already exists`);
    }

    this.newOptionName = '';
    this.newOptionColor = '';
  }

  prepareCrmStageData() {
    const selectedStages = this.crmStaticStages.filter(
      (stage) => stage.checked
    );
    for (let i = 0; i < 25; i++) {
      this.crmStageData[`f${i + 1}`] = '';
      this.crmStageData[`f${i + 1}Color`] = '';
    }
    selectedStages.forEach((stage, index) => {
      if (index < 25) {
        this.crmStageData[`f${index + 1}`] = stage.name;
        this.crmStageData[`f${index + 1}Color`] = stage.color || '#cccccc';
      }
    });
  }

  getAgentColor(name: string): string {
    const index =
      Math.abs(this.hashString(name.trim())) % this.userColors.length;
    return this.userColors[index];
  }

  getStageColor(stage: string): string {
    if (!this.stageLst) {
      return '#ccc';
    }
    const normalizedStage = stage.trim().toLowerCase();

    if (normalizedStage === 'open') return '#007bff';
    const match = this.stageLst.find(
      (s: { stageName: string }) =>
        s.stageName.toLowerCase() === stage.toLowerCase()
    );
    return match?.color || '#ccc';
  }

  getStageClass(stage: string): string {
    const baseClass = 'badge ps-3 fs-11';
    const key = stage?.trim().toLowerCase();
    const color = this.stageColorMap.get(key) || 'bg-secondary-transparent';
    return `${baseClass} ${color}`;
  }

  onStatusChange(): void {
    const selectedStage = this.leadForm.get('stage')?.value;
    if (selectedStage === 'open') {
    this.checkboxStageOptions = this.openStage.map(opt => ({
      ...opt,
      checked: true,
      isCustom: false
    }));
    const firstStatus = this.checkboxStageOptions[0]?.name || null;
    this.leadForm.patchValue({ status: firstStatus });
    return;
    }

    if (selectedStage && this.statusOptionsByStageforDisplay[selectedStage]) {
      this.checkboxStageOptions = this.statusOptionsByStageforDisplay[selectedStage];
      const currentStatus = this.leadForm.get('status')?.value;
      const statusExists = this.checkboxStageOptions.some(
        (option) => option.name === currentStatus
      );
      if (!statusExists) {
        const firstStatus = this.checkboxStageOptions[0]?.name || null;
        this.leadForm.patchValue({ status: firstStatus });
      }
    } else {
      this.checkboxStageOptions = [];
      this.leadForm.patchValue({ status: null });
    }
    // const selectedStage = this.leadForm.get('stage')?.value;
    // this.checkboxStageOptions =
    //   this.statusOptionsByStageforDisplay[selectedStage] || [];
    // if (selectedStage === 'In Progress Leads') {
    //   this.setInProgressStatus();
    // }

    // this.leadForm.get('status')?.setValue(null);
  }

  onStageChange() {
    this.checkboxStageOptions = [];
    if (this.selectedStage === 'open') {
      this.checkboxStageOptions = this.openStage.map((opt) => ({
        ...opt,
        checked: true,
        isCustom: false,
        disabled: true,
      }));

      this.allowCustomStatus = false;
      this.anyChecked = true;
      return;
    }

    const allOptions: any[] =
      this.statusOptionsByStage[this.selectedStage] || [];
    const selectedOptions: any[] =
      this.statusOptionsByStageforDisplay[this.selectedStage] || [];

    this.checkboxStageOptions = allOptions.map((item: any) => {
      const matched = selectedOptions.find(
        (opt: any) => opt.name === item.name
      );
      return {
        ...item,
        checked: matched ? true : false,
        color: matched?.color || item.color || '#cccccc',
        isCustom: matched?.isCustom || false,
      };
    });

    const dynamicOptions = selectedOptions
      .filter((opt: any) => !allOptions.some((o: any) => o.name === opt.name))
      .map((opt) => ({
        ...opt,
        checked: true,
        color: opt.color || '#cccccc',
        isCustom: false,
      }));

    this.checkboxStageOptions = [
      ...this.checkboxStageOptions,
      ...dynamicOptions,
    ];
    this.allowCustomStatus = true;
    this.anyChecked = this.checkboxStageOptions.some((opt: any) => opt.checked);
  }

  onFollowupStatusChange(): void {
    const selectedStage = this.followupLeadForm.get('stage')?.value;
    if (selectedStage === 'open') {
      this.checkboxStageOptions = this.openStage.map((opt) => ({
        ...opt,
        checked: true,
        isCustom: false,
      }));

      if (this.hasSelectedInvalid) {
        this.checkboxStageOptions = this.checkboxStageOptions.filter(
          (opt) => opt.name !== 'Invalid'
        );
      }
      const firstStatus = this.checkboxStageOptions[0]?.name || null;
      this.followupLeadForm.patchValue({ status: firstStatus });
      return;
    }
    if (selectedStage && this.statusOptionsByStageforDisplay[selectedStage]) {
      this.checkboxStageOptions = this.statusOptionsByStageforDisplay[selectedStage];

      if (this.hasSelectedInvalid) {
        this.checkboxStageOptions = this.checkboxStageOptions.filter(
          (opt) => opt.name !== 'Invalid'
        );
      }
      const currentStatus = this.followupLeadForm.get('status')?.value;
      const statusExists = this.checkboxStageOptions.some(
        (option) => option.name === currentStatus
      );
      if (!statusExists) {
        const firstStatus = this.checkboxStageOptions[0]?.name || null;
        this.followupLeadForm.patchValue({ status: firstStatus });
      }
    } else {
      this.checkboxStageOptions = [];
      this.followupLeadForm.patchValue({ status: null });
    }
  }


  deleteOption(index: number) {
    const deletedOption = this.checkboxStageOptions[index];
    this.checkboxStageOptions.splice(index, 1);
    const currentStageOptions = this.statusOptionsByStage[this.selectedStage];
    const mainIndex = currentStageOptions.findIndex(
      (opt) => opt.name.toLowerCase() === deletedOption.name.toLowerCase()
    );
    if (mainIndex !== -1) {
      currentStageOptions.splice(mainIndex, 1);
    }
    this.toastr.warning(`'${deletedOption.name}' has been deleted`);
  }

  setInProgressStatus(): void {
    const inProgressStatus = this.checkboxStageOptions.find(
      (option) => option.name === 'In Progress'
    );
    if (inProgressStatus) {
      inProgressStatus.checked = true;
    }
  }

  getStatusClass(status: string): string {
    const baseClass = 'badge ps-3 fs-11 order-status';
    const color =
      this.statusColorMap.get(status?.toLowerCase()) ||
      'bg-secondary text-white';
    return `${baseClass} ${color}`;
  }

  getStatusColor(status: string): string {
    if (!Array.isArray(this.statusLst)) {
      return '#ccc';
    }
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === 'active') return '#28a745';
    for (const stage of this.statusLst) {
      const field = stage.fields?.find(
        (f: { name: string }) => f.name?.toLowerCase() === status?.toLowerCase()
      );
      if (field?.color) {
        return field.color;
      }
    }
    return '#ccc';
  }

  filterStatusList(event: any): void { 
    const activePoints = event.active;
    if (activePoints && activePoints.length > 0) {
      const chartElement = activePoints[0];
      const index = chartElement.index;
      const label = this.pieChartLabels[index];
      this.dataSource.filter = label.trim().toLowerCase();
    }
  }

  onCountryChange(data: any) {
    this.leadForm.patchValue({ country: data });
  }

  // getCrmLeads(): void {
  //   const campaignId = this.campaignId;
  //   this.switchService.CrmLeads(campaignId).subscribe({
  //     next: (res: any) => {
  //       if (res) {
  //         this.crmLeadsList = res;
  //         this.dataSource.data = this.crmLeadsList;
  //       } else {
  //         this.toastr.error(res.message || 'Failed to load leads.');
  //       }
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.statusText || 'Server Error');
  //     },
  //   });
  // }

  getFetchLeadData(customPayload?: any) {
    this.switchService.FetchLeadData(this.userEmail, this.campaignId)
      .subscribe({
        next: (res: any) => {
          if (res.entryList) {
            this.leadList = res.entryList; 
            this.dataSource = new MatTableDataSource(res.entryList);
            const cities = res.entryList
              .map((lead: any) => lead.city?.trim())
              .filter((city: any) => !!city); 
            const uniqueCities = [...new Set(cities)];
            this.cityList = uniqueCities.map(city => ({ name: city }));
          }
          const now = new Date();
          const executiveList = (res.executiveList || []).map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'executive',
          }));
          const entryList = (res.entryList || []).map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'entry',
          }));
          const combined = [...executiveList, ...entryList];
          this.leadCount = combined.length;
          this.leadStatusCount = combined;
          const statusCounts: { [status: string]: number } = {};
          const statusCompletion : { [completionStatus: string]: number } = {};
          combined.forEach(lead => {
            const status = lead.status?.trim() || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            const completionStatus = lead.completionStatus;
            statusCompletion[completionStatus]= (statusCompletion[completionStatus] || 0) + 1;

          });

          this.activeCount = statusCounts['active'] || 0;
          this.connectedCount = statusCounts['completed'] || 0;
          this.notConnectedCount = statusCounts['not connected'] || 0;
          this.statusCompletion = statusCompletion['completed'] || 0 ;

          this.followUpCount = combined.filter(
            (item) => item.followUpDue
          ).length;
          this.dataSource.data = combined;
          
          this.updateColumns();
          if (combined.length > 0 && combined[0].contact) {
            this.phoneNumber = combined[0].contact;
          }
          const sortedByFollowUpDate = combined
            .filter((item) => item.followUpDateObj)
            .sort(
              (a, b) =>
                a.followUpDateObj.getTime() - b.followUpDateObj.getTime()
            );
          const nextLead = sortedByFollowUpDate.length
            ? sortedByFollowUpDate[0]
            : null;
          this.nextLeadStatus = nextLead ? nextLead.status : 'No follow-up';
          localStorage.setItem(
            'leadData',
            JSON.stringify({
              campaignId: this.campaignId,
              followUpCount: this.followUpCount,
              nextLeadStatus: this.nextLeadStatus,
            })
          );
          this.getStatusCount();
          if (this.paginator) {
            this.taskPriorityList = res.taskPriorityList || [];
            this.dataSource.paginator = this.paginator;
          }
          
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText || 'Server Error');
        // },
      });
  }
  
//   getTaskForLead(leadId: number) {
//   return this.taskPriorityList.find(task => task.leadId === leadId);
// }


  getStatusCount(): void {
    this.selectedStatusCount = null;
    const payload = {
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
      campaignId: this.campaignId 
    };
    this.switchService.StatusCount(payload).subscribe({
      next: (res: any[]) => {
        if (Array.isArray(res)) {
          this.statusCounts = res;
        } else {
          this.toastr.error('Unexpected response format.');
        }
      },
      // error: (err) => {
      //   this.toastr.error(err.statusText || 'Server error.');
      // },
    });
  }

  onCheckboxChange() {
    const selectedPlans = this.crmStaticStages.filter((plan) => plan.checked);
    selectedPlans.forEach((plan, index) => {
      if (index < 30) {
        this.crmStatusData[`f${index + 1}`] = plan.name;
      }
    });
    for (let i = selectedPlans.length; i < 30; i++) {
      this.crmStatusData[`f${i + 1}`] = '';
    }
  }
  resetForm() {
    this.newItem = '';
    this.addMoreVisible = false;
    this.crmStaticStages.forEach((plan) => {
      plan.checked = false;
    });
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
    // alert('Copy, paste, and cut actions are disabled for security reasons.');
    // this.toastr.error('Copy, paste, and cut actions are disabled for security reasons.','signup', {
    //   timeOut: 3000, positionClass: 'toast-top-right' });
  }

  onFileChange(event: any): void {
    this.imageFileSrcData = '';
    const files = event.target.files[0];
    const allExcel: Array<string> = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allExcel.indexOf(event.target.files[0].type) === -1) {
      this.selectedFileName = '';
      this.uploadSubmitted = false;
      this.uploadLead.reset();
      this.toastr.error('Please choose Valid file', 'lead', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
    } else {
      this.imageFileSrcData = files;
    }
    this.selectedFileName = files.name;
  }

  get l() {
    return this.uploadLead.controls;
  }

  ViewCrmLeads(data: any) {
    this.switchService.ViewCrmLeads(data.leadId).subscribe({
      next: (res: any) => {
        if (res && res.leadsEntry) {
          this.selectedLeadId = data.leadId;
          this.CrmLeads = {
            name: res.leadsEntry.name || '',
            companyName: res.leadsEntry.companyName || '',
            executive: res.leadsEntry.executive || '',
            products: res.leadsEntry.products || '',
            country: res.leadsEntry.country || '',
            stage: res.leadsEntry.stage || '',
            status: res.leadsEntry.status || '',
            leadSource: res.leadsEntry.leadSource || '',
            zipCode: res.leadsEntry.zipCode || '',
            followUpDate: res.leadsEntry.followUpDate || '',
            state: res.leadsEntry.state || '',
            city: res.leadsEntry.city || '',
            address: res.leadsEntry.address || '',
            contact: this.formatMobileNumber(res.leadsEntry.contact),
            email: res.leadsEntry.email || '',
            currentStage: res.leadsEntry.currentStage || '',
            updatedBy: res.leadsEntry.updatedBy || '',
            updatedTime: res.leadsEntry.updatedTime || '',
            leadId: res.leadsEntry.leadId || 0,
            followLeads:
              res.followLeads?.map((followup: any) => ({
                id: followup.id || 0,
                followupDate: followup.followupDate || '',
                followupTime: followup.followupTime || '',
                stage: followup.stage || '',
                status: followup.status || '',
                comments: this.stripHtmlTags(followup.comments || ''),
                followUpBy: followup.followUpBy || '',
                updatedTime: this.formatDateTime(followup.updatedTime),
                currentStage: followup.currentStage || '',
              })) || [],
          };
          this.element = this.CrmLeads;
          this.followupLeadForm.patchValue({
            stage: res.leadsEntry.stage || '',
          });

          setTimeout(() => {
            this.onFollowupStatusChange();
            this.followupLeadForm.patchValue({
              status: res.leadsEntry.status || '',
            });
          }, 0);

          this.onFollowupStatusChange();
        } else {
        }
      },
      error: (err: any) => {},
    });
  }

  openFollowUpPopover(element: any): void {
    this.switchService.ViewCrmLeads(element.leadId).subscribe({
      next: (res: any) => {
        if (res && res.followLeads) {
          this.followUpDetails = res.followLeads.map((followup: any) => ({
            followupDate: followup.followupDate || '',
            stage: followup.stage || '',
            status: followup.status || '',
            comments: this.stripHtmlTags(followup.comments || ''),
            followUpBy: followup.followUpBy || '',
            updatedTime: followup.updatedTime
              ? new Date(followup.updatedTime)
              : null,
          }));
        } else {
          this.followUpDetails = [];
        }
      },
      error: () => {
        this.followUpDetails = [];
      },
    });
  }

  formatMobileNumber(mobile: any): string {
    if (!mobile) return '';
    return Number(mobile).toFixed(0);
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-GB', { hour12: false });
  }

  stripHtmlTags(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  }

  uploadLeadSubmit(modal: any) {
    this.uploadSubmitted = true;
    this.isImporting = true;
    this.defaultStageName = 'open';
    this.defaultStatusName = 'active';
    if (this.uploadLead?.valid) {
      this.uploadSpinner = true;
      const formData = new FormData();
      formData.append('file', this.imageFileSrcData);
      formData.append('uploadedBy', JSON.parse(this.userData)?.email || '');
      formData.append('companyCode', JSON.parse(this.userData)?.companyCode || '');
      formData.append('email', JSON.parse(this.userData)?.email || '');
      formData.append('type', JSON.parse(this.userData)?.type || '');
      formData.append('campaignId', this.campaignId || '');
      formData.append('stage', this.defaultStageName || '');
      formData.append('status', this.defaultStatusName || '');
      formData.append('agents', '');
      const autoAllocate = this.userType === 1 ? false : this.uploadLead.get('autoAllocate')?.value;
      formData.append('autoAllocate', autoAllocate.toString());
      const formDataObject: any = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });
      this.switchService.UploadCrmLeads(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.uploadSubmitted = false;
            this.uploadSpinner = false;
            this.uploadLead.reset();
            this.toastr.success('Bulk Lead Upload Successful');
            this.isImporting = false;
            const stageColor = this.stageColor[this.defaultStageName] || '#ccc';
            const statusColor =
              this.statusColor[this.defaultStatusName] || '#ccc';
            this.uploadStageDisplay = {
              name: this.defaultStageName,
              color: stageColor,
            };
            this.uploadStatusDisplay = {
              name: this.defaultStatusName,
              color: statusColor,
            };
            this.getFetchLeadData();
          } else {
            this.uploadSpinner = false;
            this.toastr.error(res.message, 'invalid file');
            this.isImporting = false;
          }
        },
        error: (err: any) => {
          this.uploadSpinner = false;
          this.toastr.error('Error fetching CRM Bulkupload leads', 'lead', );
        },
      });
    }
  }

  sendEmail(element: any) {
    this.sendLeadForm.patchValue({ email: element.email });
  }

  editLead(element: any, Content14: any): void {
    const payload = {
      leadId: element.leadId || 0,
      name: element.name || '',
      companyName: element.companyName || '',
      executive: element.executive ?? null,
      products: element.products || '',
      country: element.country || '',
      stage: element.stage || '',
      status: element.status || '',
      leadSource: element.leadSource || '',
      zipCode: element.zipCode || '',
      followUpDate: element.followUpDate || '',
      state: element.state || '',
      city: element.city || '',
      address: element.address || '',
      contact: element.contact ? this.formatMobileNumber(element.contact) : '',
      email: element.email || '',
      currentStage: element.currentStage || '',
      updatedBy: this.userEmail,
      updatedTime: new Date().toISOString(),
      entryBy: element.entryBy ?? null,
      campaignId: element.campaignId || this.campaignId,
    };
    this.leadForm.patchValue(payload);

    this.modalService.open(Content14, {
      scrollable: true,
      centered: true,
      size: 'xl',
    });
    this.onStatusChange();
  }

  onEmailFileChange(event: any): void {
    this.imageFileSrcData = '';
    const files = event.target.files[0];
    this.imageFileSrcData = files;
  }

  get s() {
    return this.sendLeadForm.controls;
  }

  sendMailLeadSubmit(modal: any) {
    this.sendLeadSubmitted = true;
    if (this.sendLeadForm?.valid) {
      const templateValue = this.sendLeadForm.get('template')?.value;
      const templateToSend =
        typeof templateValue === 'object'
          ? templateValue.templateGenId
          : templateValue;
      const payload = {
        email: this.sendLeadForm.get('email')?.value,
        template: templateToSend,
        subject: this.sendLeadForm.get('subject')?.value,
        cc: this.sendLeadForm.get('cc')?.value,
        bcc: this.sendLeadForm.get('bcc')?.value,
        content: this.sendLeadForm.get('content')?.value,
      };
      this.switchService.CRMLeadSendMailFollowup(payload).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.submitted = false;
            this.sendLeadForm.reset();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }

  filterLeads(modal:any) {
    const formValue = this.filterLeadForm.value;
    const ensureSeconds = (value: string | null): string | null => {
      if (!value) return null;
      return value.length === 16 ? `${value}:00` : value;
    };
    const startDate = ensureSeconds(formValue.startDate);
    const endDate = ensureSeconds(formValue.endDate);
    const payload = {
      ...this.filterLeadForm.value,
      startDate,
      endDate,
      stage: Array.isArray(formValue.stage) ? formValue.stage.join(',') : formValue.stage || null,
      status: Array.isArray(formValue.status) ? formValue.status.join(',') : formValue.status || null,
      city: Array.isArray(formValue.city) ? formValue.city.join(',') : formValue.city || null,
      source: Array.isArray(formValue.source) ? formValue.source.join(',') : formValue.source || null,
      executive: Array.isArray(formValue.executive) ? formValue.executive.join(',') : formValue.executive || null,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
      campaignId: this.campaignId
    };
    this.switchService.filterLeads(payload).subscribe({
      next: (res) => {
        if (res) {
          this.dataSource = new MatTableDataSource(res);
          this.leadCount = res.length;
          modal.close();
          this.submitted = false;
          this.filterLeadForm.reset();
          this.toastr.success(res.message, 'Lead');
          this.filterApplied = true;
        } else {
          this.toastr.error(res.message, 'Lead');
          this.filterApplied = false;
        }
      },
      // error: (error) => {
      //   this.toastr.error(error.statusText || 'Something went wrong', 'Error');
      // }
    });
  }

  get e() {
    return this.followupLeadForm.controls;
  }

  private getFormattedNow(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }

  followupLeadSubmit(modal: any) {
    this.followupLeadSubmitted = true;
    const currentStatus = this.followupLeadForm.get('status')?.value?.toLowerCase().trim();
    const originalStatus = this.originalStatus?.toLowerCase().trim();
    if (this.followupLeadForm?.valid) {
      this.followupLeadForm.patchValue({ followUpBy: this.executiveName });
      const formValue = this.followupLeadForm.value;
       const date = new Date(formValue.followupDate);
          let formattedDate: string | null = null;

      if (formValue.followupDate) {
      const date = new Date(formValue.followupDate);

      if (!isNaN(date.getTime())) {
        formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${date
          .getHours()
          .toString()
          .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;
      }
      }

    const updatedTime = this.getFormattedNow();
      const followUpDetails = {
        followupDate: formattedDate,
        followupTime: this.convertTo12HourFormat(formValue.followupTime || ''),
        stage: formValue.stage,
        status: formValue.status,
        comments: formValue.comments,
        followUpBy: this.executiveName,
        updatedTime: updatedTime,
        currentStage: formValue.stage,
        leadEntry: {
          leadId: this.leadId,
          name: formValue.name || '',
          companyName: formValue.companyName || '',
          executive: formValue.executive || this.executiveName || '',
          products: formValue.products || '',
          country: formValue.country || '',
          stage: formValue.stage,
          status: formValue.status,
          leadSource: formValue.leadSource || '',
          zipCode: formValue.zipCode || '',
          followUpDate: formValue.followupDate || '',
          state: formValue.state || '',
          city: formValue.city || '',
          address: formValue.address || '',
          contact: formValue.contact || '',
          email: formValue.email || '',
          currentStage: formValue.stage,
          updatedBy: this.executiveName || '',
          updatedTime: updatedTime,
          entryBy: formValue.entryBy || '',
          campaignId: formValue.campaignId || '',
          companyCode: formValue.companyCode || '',
          individualEmail: formValue.individualEmail || '',
          type: formValue.type || 0,
          taskGenId: formValue.taskGenId || '',
          completionStatus: formValue.completionStatus || '',
          completedBy: formValue.completedBy || '',
          completionTime: formValue.completionTime || ''
        }
      };
      this.switchService.CRMAddFollowupLead(followUpDetails).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.followupLeadSubmitted = false;
            this.showForm = false;
            this.followupLeadForm.reset();
            this.executiveName = '';
            this.followupName = '';
            this.leadId = 0;
            this.toastr.success(res.message, 'lead');
            this.getFetchLeadData();
          }
        },
      });
    }
  }

  convertTo12HourFormat(time24: string): string {
    if (!time24) return '';
    const [hourStr, minuteStr] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, '0')}:${minuteStr} ${suffix}`;
  }

  getUsers() {
    if (JSON.parse(this.userData).type == 2) {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }

  @ViewChild('followUpPond') followUpPond!: FilePondComponent;
  followUpPondHandleInit() { }
  followUpPondHandleAddFile(event: any) {
    this.imageFileSrcData = '';
    const files = event.target.files[0];
    this.imageFileSrcData = files;
  }
  followUpPondHandleActivateFile(event: any) { }

  get a() {
    return this.allocateForm.controls;
  }

  get c() {
    return this.LeadToCampaignForm.controls;
  }

  leadToCampaignSubmit(modal: any) {
    const selectedCampaignId = this.LeadToCampaignForm.value.campaignId;
    const currentCampaignId = this.campaignId;
    let payloadArray: any[] = [];
    if (this.selectedLeads && this.selectedLeads.length > 0) {
      payloadArray = this.selectedLeads.map((lead: any) => ({
        leadId: typeof lead === 'object' ? lead.leadId.toString() : lead.toString(),
        campaignId: selectedCampaignId
      }));
    }
    else if (this.selectedLeadData) {
      payloadArray = [
        {
          leadId: this.selectedLeadData.leadId.toString(),
          campaignId: selectedCampaignId
        }
      ];
    }
    this.moveLeadToAnotherCampaign(payloadArray, modal);
    this.getFetchLeadData(this.currentCampaignId);
    this.campaignId = selectedCampaignId;
  }

  onAllocateSubmit() {
    this.allocateSubmitted = true;
    const selectedExecutive = this.allocateForm.get('executive')?.value;
    const hasSelectedLeads = this.selectedLeads.length > 0;
    if ((selectedExecutive == null || selectedExecutive === '') && !hasSelectedLeads) {
      this.toastr.warning('Please select executive and one lead', 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
      return;
    }
    if (selectedExecutive == null || selectedExecutive === '') {
      this.toastr.warning('Please select executive', 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
      return;
    }
    if (!hasSelectedLeads) {
      this.toastr.warning('Please choose one lead', 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
      return;
    }
    if (this.allocateForm?.valid) {
      this.allocateForm.patchValue({
        idList: this.selectedLeads.map((lead: any) => lead.leadId)
      });
      let allocateData = { 
        idList: this.selectedLeads.map((lead: any) => lead.leadId), 
        executive: this.allocateForm.get('executive')?.value 
      };      
      this.switchService.CRMAllocateLeadExecutive(allocateData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.allocateSubmitted = false;
            this.allocateForm.reset();
            this.selectedLeads=[];
            this.toastr.success(res.message, 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
            this.getFetchLeadData();
          } else {
            this.toastr.error(res.message, 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }

  processStageData(data: any) {
    this.stageLst = [];
    for (let i = 1; i <= 25; i++) {
      const name = data[`f${i}`];
      const color = data[`f${i}Color`];
      if (name) {
        this.stageLst.push({ stageName: name, color: color || '#cccccc' });
      }
    }
  }


  getCampaignData() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
    };
    this.switchService.displayCampaignData(payload).subscribe({
      next: (res: any[]) => {
        if (Array.isArray(res)) {
          this.campaignList = res.map((c: any) => ({
            id: c.campgnId,
            campaignName: c.campaignName,
            agents: c.agents,
          }));
          const campaign = res.find((c) => c.campgnId === this.campaignId);
          if (campaign) {
            this.selectedCampaign = campaign;
            const agentEmails = campaign.agents
              ?.split(',')
              ?.map((email: string) => email.trim())
              ?.filter((email: string) => email);
            if (agentEmails?.length) {
              this.getAgentUsers(agentEmails);
            }
          }
        } else {
          this.toastr.error('Unexpected response format.');
        }
      },
      // error: (err) => {
      //   this.toastr.error(err.statusText || 'Error while fetching campaigns.');
      // },
    });
  }

  getAgentUsers(agentEmails: string[]) {
    const cn = JSON.parse(this.userData).companyName;
    const cc = JSON.parse(this.userData).companyCode;
    this.switchService.cmpnyUsers(cn, cc).subscribe({
      next: (users: any[]) => {
        if (Array.isArray(users)) {
          this.agentUsers = users.filter((user) =>
            agentEmails.includes(user.email)
          );
        } else {
          this.toastr.error('Unexpected user data format.');
        }
      },
      // error: (err) => {
      //   this.toastr.error(err.statusText || 'Error while fetching users.');
      // },
    });
  }
  onRowCheckboxChange(lead: any, event: any) {
    if (event.checked) {
      if (!this.selectedLeads.some(l => l.leadId === lead.leadId)) {
        this.selectedLeads.push(lead);
      }
      this.selectedLeadForAppointment = lead;
    } else {
      this.selectedLeads = this.selectedLeads.filter(l => l.leadId !== lead.leadId);
      if (this.selectedLeadForAppointment?.leadId === lead.leadId) {
        this.selectedLeadForAppointment = null;
      }
    }
  }

 isSelected(leadId: number): boolean {
  return this.selectedLeads.some((l: any) =>
    typeof l === 'object' ? l.leadId === leadId : l === leadId
  );
}


  onSelectAllChange(event: any) {
    if (event.checked) {
      this.selectedLeads = this.dataSource.data
        .filter((row: any) => row.completionStatus !== 'completed')
        .map((row: any) => row.leadId);
    } else {
      this.selectedLeads = [];
    }
  }

  isAllSelected(): boolean {
    return this.selectedLeads.length === this.dataSource.data.length;
  }

  isIndeterminate(): boolean {
    return this.selectedLeads.length > 0 && !this.isAllSelected();
  }
  @ViewChild('myPond') myPond!: FilePondComponent;

  pondOptions: FilePond.FilePondOptions = {
    allowMultiple: false,
    maxFiles: 1,
    labelIdle: 'Drop files here to Upload...',
    server: {
      url: '/upload',
      process: '/process',
      revert: '/revert',
      restore: '/restore',
    },
  };
  pondFiles: FilePond.FilePondOptions['files'] = [
    {
      source: 'assets/photo.jpeg',
      options: {
        type: 'local',
      },
    },
    
  ];
  pondHandleInit() {}
  pondHandleAddFile(event: any) {}
  pondHandleActivateFile(event: any) {}

  getSeriesData(fields: any[]): number[] {
  return fields.map((field) => {
    const foundStatus = this.statusCounts.find(
      (status) => status.status.toLowerCase() === field.name.toLowerCase()
    );
    return foundStatus ? foundStatus.count : 0;
  });
  }

  capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase());
  }


  getLabelData(fields: any[]): string[] {
  return fields.map((field) => {
    const foundStatus = this.statusCounts.find(
      (status) => status.status.toLowerCase() === field.name.toLowerCase()
    );
    const count = foundStatus ? foundStatus.count : 0;
    return `${this.capitalizeWords(field.name)} (${count})`;
  });
  }

  getColorData(fields: any[]): string[] {
    return fields.map((field) => field.color);
  }

  editorContent: string = '<p>Start writing here...</p>';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultFontName: 'Arial',
    defaultFontSize: '2',
    toolbarHiddenButtons: [['bold', 'italic']],
  };

  usersData = [
    {
      name: 'Alice Johnson',
      role: 'Manager',
      email: 'alice.johnson@example.com',
      date: '2025-04-25',
      callsAttempted: 25,
      callsConnected: 18,
    },
    {
      name: 'Bob Smith',
      role: 'Sales Executive',
      email: 'bob.smith@example.com',
      date: '2025-04-24',
      callsAttempted: 30,
      callsConnected: 22,
    },
    {
      name: 'Catherine Lee',
      role: 'Account Manager',
      email: 'catherine.lee@example.com',
      date: '2025-04-24',
      callsAttempted: 20,
      callsConnected: 15,
    },
    {
      name: 'David Brown',
      role: 'Sales Executive',
      email: 'david.brown@example.com',
      date: '2025-04-23',
      callsAttempted: 18,
      callsConnected: 10,
    },
    {
      name: 'Ella Davis',
      role: 'Manager',
      email: 'ella.davis@example.com',
      date: '2025-04-22',
      callsAttempted: 28,
      callsConnected: 20,
    },
  ];
  openRight4(content4: any) {
    this.offcanvasService.open(content4, { position: 'end' });
  }
  openFollowupLeadForm(element: any, content4: any): void {
    this.followupName = element.name;
    this.notconnectedstatusClicked = false;
    this.showForm = false;
    let executive = this.userData ? JSON.parse(this.userData).email : '';
    this.executiveName = executive;
    this.leadId = element.leadId;
    this.originalStatus = element.status?.toLowerCase().trim();
    this.openRight4(content4);
    this.ViewCrmLeads(element);
  }

  openRight5(content5: any) {
    this.offcanvasService.open(content5, { position: 'end' });
  }
  openRight12(content12: any) {
    this.offcanvasService.open(content12, { position: 'end' });
  }
  openRight13(content13: any) {
    this.selectTemplateForm.reset();
    this.selecteTemplateFormSubmitted = false;
    this.offcanvasService.open(content13, { position: 'end' });
  }
  updateTopDisplayedCards(): void {
    this.topDisplayedCards = this.topshowMore
      ? this.matcardLst?.slice(0, 2)
      : this.matcardLst;
  }
  toggleTopShowMore() {
    this.topshowMore = !this.topshowMore;
    if (this.topshowMore) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.scrollable-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  }

  sendToWhatsApp(): void {
    this.sendwhatsLeadFormSubmitted = true;
    if (this.sendwhatsLeadForm.invalid) {
      return;
    }
    const formValue = this.sendwhatsLeadForm.value;
    const template = formValue.template?.templateName || 'No Template';
    const subject = formValue.subject || 'No Subject';
    const content = formValue.content || 'No Description';
    const message =
      `Template: ${template}\n` +
      `Subject: ${subject}\n` +
      `Description: ${content}`;
    const encodedMessage = encodeURIComponent(message);

    // Use dynamic phoneNumber here, fallback to default if empty
    const phoneNumberToUse = this.phoneNumber;
    const url = `https://wa.me/${phoneNumberToUse}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }


  validateAndOpenBulkUpload(fileInput: HTMLInputElement): void {
    if (!this.stageLst || this.stageLst.length === 0) {
      this.toastr.warning('Please add at least one Stage before uploading.');
      return;
    }

    if (!this.statusLst || this.statusLst.length === 0) {
      this.toastr.warning('Please add at least one Status before uploading.');
      return;
    }

    // this.openRight(content);
    fileInput.click();

  }
  onStatusButtonClick(status: string,modal :any): void {
  this.selectedStatus = status;
  const followupDate = this.followupLeadForm.get('followupDate');
  this.showForm = true;
    if (status === 'Not Connected') {
      this.notconnectedstatusClicked = true; 
      const now = new Date();
      const year = now.getFullYear();
      const month = ('0' + (now.getMonth() + 1)).slice(-2);
      const day = ('0' + now.getDate()).slice(-2);
      const hours = ('0' + now.getHours()).slice(-2);
      const minutes = ('0' + now.getMinutes()).slice(-2);

      const formattedNow = `${year}-${month}-${day}T${hours}:${minutes}`;
      followupDate?.clearValidators();
      this.followupLeadForm.patchValue({
        status: 'not connected',
        followupDate: '',
        comments: 'Not connected',    
    });
    this.followupLeadSubmit(modal);
  }
   else if (status === 'Connected') {
    this.readonlyMode = false;
    followupDate?.setValidators([Validators.required]);
    followupDate?.updateValueAndValidity();
     if (this.originalConnectedForm) {
      this.followupLeadForm.patchValue(this.originalConnectedForm);
    }
  }
}

  deleteLeadStages() {
    const payload = {
      comapanyCode: this.userCompanyCode,
      campaignId: this.campaignId,
      email: this.userEmail,
      type: this.userType,
    };
    if (confirm('Are you sure you want to delete this Lead stages?')) {
      this.switchService.deleteLeadStages(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getCrmStages();
          this.getCrmStatus();
        },
        // error: (error) => {
        //   this.toastr.error('Failed to delete Lead stages.');
        // },
      });
    }
  }

  deleteLeadStatus() {
    const payload = {
      comapanyCode: this.userCompanyCode,
      campaignId: this.campaignId,
      email: this.userEmail,
      type: this.userType,
    };
    if (confirm('Are you sure you want to delete this Lead status?')) {
      this.switchService.deleteLeadStatus(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getCrmStatus();
        },
        error: (error) => {
          this.toastr.error('Failed to delete Lead status.');
        },
      });
    }
  }

  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }


  deleteSelectedLeads() {
    if (!this.selectedLeads.length) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    let leadList= this.selectedLeads.map((lead: any) => lead.leadId)
    if (confirm('Are you sure you want to delete the selected leads?')) {
      this.switchService.deleteLeads({ leadList}).subscribe({
        next: (res: any) => {
          this.toastr.success('Leads deleted successfully');
          this.getFetchLeadData();
          this.selectedLeads = []; 
        },
        error: (error) => {
          this.toastr.error('Failed to delete leads.');
        },
      });
    }
  }


  deleteSingleLead(leadId: number) {
    if (confirm('Are you sure you want to delete this lead?')) {
      this.switchService.deleteLeads({ leadList: [leadId] }).subscribe({
        next: () => {
          this.toastr.success('Lead deleted successfully');
          this.getFetchLeadData();
          this.selectedLeads = this.selectedLeads.filter(id => id !== leadId); // Remove if selected
        },
        error: () => {
          this.toastr.error('Failed to delete lead.');
        },
      });
    }
  }
  
  getLeadEntry() {
    let payload = {
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType
    };
    this.switchService.listLeadEntry(payload).subscribe({
      next: (res: any) => {
        this.companyLst = res;
      },
      // error: (error) => {
      //   this.toastr.error(error.statusText);
      // }
    });
  }
  

  onFilterStageChange(): void {
    const selectedStages: string[] = this.filterLeadForm.get('stage')?.value || [];
    const selectedStage = Array.isArray(selectedStages) ? selectedStages[0] : selectedStages;
    if (!selectedStage) {
      this.checkboxStageOptions = [];
      this.filterLeadForm.patchValue({ status: null });
      return;
    }
    if (selectedStage === 'open') {
      this.checkboxStageOptions = this.openStage.map(opt => ({
        ...opt,
        checked: true,
        isCustom: false
      }));
      const firstStatus = this.checkboxStageOptions[0]?.name || null;
      this.filterLeadForm.patchValue({ status: firstStatus });
      return;
    }
    const matchedStatusList = this.statusOptionsByStageforDisplay[selectedStage];
    if (matchedStatusList && matchedStatusList.length > 0) {
      this.checkboxStageOptions = matchedStatusList;
      const currentStatus = this.filterLeadForm.get('status')?.value;
      const exists = matchedStatusList.some((s: any) => s.name === currentStatus);
      if (!exists) {
        this.filterLeadForm.patchValue({ status: matchedStatusList[0].name });
      }
    } else {
      this.checkboxStageOptions = [];
      this.filterLeadForm.patchValue({ status: null });
    }
  }

  resetFilterForm() {
    this.getFetchLeadData(); 
    this.filterApplied= false;
  }

  moveLeadToAnotherCampaign(
    data: { leadId: string; campaignId: string } | any[],
    modal: any
  ) {
    const payloadArray = Array.isArray(data) ? data : [data];
    this.currentCampaignId = this.campaignId;
    const leadIds = payloadArray.map(item => item.leadId);
    const campaignId = payloadArray[0].campaignId;
    console.log(campaignId, leadIds);
    this.switchService.update_existing_campaign(leadIds, campaignId).subscribe({
      next: (res) => {
        this.leadList = this.leadList.filter(
          (lead: any) => !leadIds.includes(lead.leadId)
        );
        this.toastr.success(`Leads moved successfully!`);
        modal.close();
        this.submitted = false;
        this.leadForm.reset();
        this.getFetchLeadData(this.currentCampaignId);
      },
      error: (err) => {
        console.error('Error moving leads:', err);
      }
    });
  }



  onAppointmentSelect(selectedAppointment: any) {
  if (selectedAppointment) {
    this.appointmentForm.patchValue({
      appointmenType: selectedAppointment.appointmenType,
      date: selectedAppointment.date,
      description: selectedAppointment.description,
      duration: selectedAppointment.duration,
      assignedDesigner: selectedAppointment.assignedDesigner
    });

    // Store for edit API
    this.appointmentId = selectedAppointment.appointmentId;
  }
  }

  openEditAppointment(template: any, element: any) {
    this.switchService.fetchAppointment(element.leadId).subscribe(res => {
      if (res && res.length > 0) {
        const latestAppointment = res[res.length - 1]; 
        this.appointmentModal(template, element, latestAppointment);
      } else {
        this.appointmentModal(template, element);
      }
    });
  }

  openBulkMailOffcanvas(templateRef: TemplateRef<any>) {
    if (!this.selectedLeads.length) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    const selectedIds = this.selectedLeads.map((l: any) => l.leadId);
    const selectedLeadObjects = this.dataSource.data.filter((lead: any) =>
      selectedIds.includes(lead.leadId)
    );

    const emailList = selectedLeadObjects.map((lead: any) => lead.email).filter(Boolean);
    const emailString = emailList.join(', ');
    this.sendLeadForm.patchValue({
      email: emailString
    });

    this.offcanvasService.open(templateRef, { position: 'end' });
  }

  sendMailToMultipleLeads(offcanvasRef: any) {
    this.sendMultiMailSubmitted = true;
    if (!this.selectedLeads.length) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    if (this.sendLeadForm.invalid) {
      this.toastr.warning('Fill in all required fields.');
      return;
    }
    const selectedLeadsData = this.dataSource.data.filter((lead: any) =>
      this.selectedLeads.includes(lead.leadId)
    );
    const emailList = selectedLeadsData.map((lead: any) => lead.email).filter(Boolean);
    if (!emailList.length) {
      this.toastr.warning('No valid emails found in selected leads.');
      return;
    }
    const templateValue = this.sendLeadForm.get('template')?.value;
    const payload = {
      email: emailList.join(','),
      template: typeof templateValue === 'object' ? templateValue.templateGenId : templateValue,
      cc: this.sendLeadForm.get('cc')?.value,
      bcc: this.sendLeadForm.get('bcc')?.value,
      subject: this.sendLeadForm.get('subject')?.value,
      content: this.sendLeadForm.get('content')?.value
    };
    this.switchService.CRMLeadSendMailFollowup(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message, 'Mail Sent');
          offcanvasRef.close();
          this.sendLeadForm.reset();
          this.sendMultiMailSubmitted = false;
          this.selectedLeads = []; 
        } else {
          this.toastr.error(res.message || 'Mail sending failed.');
        }
      },
      // error: () => {
      //   this.toastr.error('An error occurred while sending mail.');
      // }
    });
  }

  createTaskSubmit(modal: any) {
    if (!this.selectedLeads || this.selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    const leadsWithoutExecutive = this.selectedLeads.filter(lead => !lead.executive);
    if (leadsWithoutExecutive.length > 0) {
      this.toastr.warning('Please assign an executive before creating the task.');
      return;
    }
    this.taskSubmitted = true;
    let payload: any = {
      ...this.taskForm.value,
      leadIdList: this.selectedLeads.map((lead: any) => lead.leadId),
      assignedTo: this.selectedLeads
        .filter((lead: any) => lead.executive)
        .map((lead: any) => lead.executive)  
        .join(',')                        
    };
    this.switchService.createTask(payload).subscribe({
      next: (res) => {
        this.toastr.success('Task created successfully!');
        this.taskForm.reset();
        this.selectedLeads = [];
        this.selectedLeadForAppointment = null;
        this.taskSubmitted = false;
        modal.close();
        this.getFetchLeadData();
      }
    });
  }

  getTaskStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-success-transparent'; 
      case 'pending':
        return 'bg-warning-transparent'; 
      case 'in_progress':
        return 'bg-info-transparent';     
      case 'cancelled':
        return 'bg-danger-transparent'; 
      default:
        return 'bg-success-transparent'; 
    }
  }

  today: Date = new Date();
  getTaskColor(task: any): string {
    if (!task.deadline) return 'btn-secondary-transparent';
    const today = new Date();
    const dueDate = new Date(task.deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return 'btn-danger-transparent';
    }
    if (diffDays === 0) {
      return 'btn-warning-transparent';
    }
    if (diffDays <= 2) {
      return 'btn-warning-transparent';
    }
    return 'btn-success-transparent';
  }

  getTaskBgColor(task: any): string {
    if (!task.deadline) return 'bg-secondary-transparent';
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    if (deadlineDate < today) {
      return 'bg-danger-transparent';
    }
    if (deadlineDate.getTime() === today.getTime()) {
      return 'bg-warning-transparent';
    }
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) {
      return 'bg-warning-transparent';
    }
    return 'bg-success-transparent';
  }

  getPriorityBadge(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'badge bg-danger-transparent';
      case 'high':
        return 'badge bg-warning-transparent';
      case 'medium':
        return 'badge bg-info-transparent';
      case 'low':
        return 'badge bg-success-transparent';
      default:
        return 'badge bg-secondary-transparent';
    }
  }

  getDaysLeft(deadline: string | Date): string {
    const today = new Date();
    const dueDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  }

  getfullDaysLeft(task: any): string {
    if (!task.deadline) return '';
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day's Due`;
    } else if (diffDays === 0) {
      return `Due today`;
    } else {
      return `${diffDays} day's left`;
    }
  }

  getDayLeft(deadline: string | Date): string {
    const today = new Date();
    const dueDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} days left`;
    if (diffDays === 0) return `Due today`;
    return `Expired ${Math.abs(diffDays)} days ago`;
  }

  fetchTasks() {
    const payload = {
      currentUser: this.userEmail
    };
    this.switchService.fetchTasksCreatedBy(payload).subscribe({
      next: (res) => {
        this.taskList = [
          ...(res.createdTaskList || []),
          ...(res.assignedTaskList || [])
        ];
      },
      // error: (err) => {
      //   this.toastr.error('Something went wrong!');
      // }
    });
  }
  openCompletionModal(content: any, lead: any) {
    this.selectedLead = lead;
    this.leadId = lead.leadId;
    this.currentStep = 1;  
    this.completionForm.reset();
    this.leadCompletionsubmitted = false;
    this.modalService.open(content, { centered: true,scrollable : true });
  }


   updateCompletionStatus(modal: any) {
    this.leadCompletionsubmitted = true;
    if (this.completionForm.invalid) {
      return; 
    }
    const payload = {
      ...this.completionForm.value,
      status : "completed",
      completedBy: this.userName,
      leadId: this.leadId,
      companyCode:this.userCompanyCode,
      companyName: this.userCompanyName,
      email: this.userEmail,
      type: this.userType
    };
    this.uploadSpinner = true;
    this.switchService.updateLeadCompletion(payload).subscribe({
      next: (res) => {
        this.toastr.success('lead completed successfully');
            this.leadCompletionsubmitted = true;
        if (this.selectedLead) {
          this.selectedLead.completionStatus = "completed"; 
        }
        this.uploadSpinner = false;
        modal.close();
        this.currentStep = 1;
      },
      // error: (err) => {
      //   this.toastr.error('Something went wrong!');
      // }
    });
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
  submitClose(modal: any) {
    this.leadCompletionsubmitted = true;
    if (this.completionForm.invalid) {
      return; 
    }
    this.updateCompletionStatus(modal);

    
  }
  chartOptions2:any = {
  series: [{
    data: [0, 32, 18, 58]
  }],
  chart: {
    height: 115,
    width: 180,
    type: 'area',
    fontFamily: 'Roboto, Arial, sans-serif',
    foreColor: '#5d6162',
    zoom: {
      enabled: false
    },
    sparkline: {
      enabled: true
    }
  },
  tooltip: {
    enabled: true,
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function (seriesName: any) {
          return ''
        }
      }
    },
    marker: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: [1],
  },
  title: {
    text: undefined,
  },
  grid: {
    borderColor: 'transparent',
  },
  xaxis: {
    crosshairs: {
      show: false,
    }
  },
  colors: ["rgb(69, 214, 91)"],

  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.5,
      opacityTo: 0.2,
      stops: [0, 60],
    }
  },
  };
  chartOptions3:any = {
    series: [{
      data: [0, 32, 18, 58]
    }],
    chart: {
      height: 115,
      width: 180,
      type: 'area',
      fontFamily: 'Roboto, Arial, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return ''
          }
        }
      },
      marker: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [1],
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      }
    },
    colors: ["rgb(231, 76, 60)"],

    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      }
    },
  };

  formatLocalDateTime(dateTime: string | Date): string {
    if (!dateTime) return "";

    let dateTimeString = dateTime.toString();

    if (typeof dateTime === "object" && dateTime instanceof Date) {
        dateTimeString = dateTime.toISOString();
    }

    const normalized = dateTimeString.split('.')[0];
    const date = new Date(normalized + "Z");

    const pad = (n: number) => n.toString().padStart(2, '0');
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dd = pad(date.getDate());
    const mmm = months[date.getMonth()];
    const yyyy = date.getFullYear();

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${dd}-${mmm}-${yyyy} ${hours}:${minutes} ${ampm}`;
  }

  goBackToCampaigns() {
    this.router.navigate(['/dashboard/campaigns']);
  }

  openBulkMove(content31: any, selectedLeads: any[]) {
  if (!selectedLeads || selectedLeads.length === 0) {
    this.toastr.warning('Please select at least one lead.');
    return;
  }
  this.selectedLeads = selectedLeads;
  this.modalService.open(content31, { centered: true });
  }

  



}
