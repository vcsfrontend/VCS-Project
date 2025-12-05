import { Component, TemplateRef, ViewChild, ViewEncapsulation,HostListener } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ActivatedRoute, RouterModule,Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgbOffcanvas, OffcanvasDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { SwitherService } from '../../../../shared/services/swither.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as FilePond from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule, MatSortModule,
    NgbDropdownModule, NgSelectModule, FilePondModule, AngularEditorModule, NgChartsModule,NgApexchartsModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig, NgbModal],

  templateUrl: './deals.component.html',
  styleUrl: './deals.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DealsComponent extends BaseComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage): null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : '';
  Adonai: boolean = this.userData ? this.userData.adonai : false;
  taskSubmitted : boolean = false;
  displayedColumns: string[] = ['sourceFlag','select', 'slNo', 'action', 'name', 'executive','stage', 'status', 'followUpDate', 'contact', 'email','companyName','city', 'updatedTime','completionStatus'];
  usersColumns: string[] = ['slNo', 'name', 'role', 'email', 'date', 'callsAttempted', 'callsConnected',];
  dataSource = new MatTableDataSource<any>();
  usersDataSource = new MatTableDataSource<any>();
  Crmusers: any[] = []; CrmLeads: any = {}; element: any = {}; crmLeadsList : any;
  campaignId :string='DUMMY9DD1748413866634' ; stageLst: any; isStagesLoading: boolean = true; isAddStagesDisabled: boolean = false;
  statusOptionsByStage: { [stageName: string]: any[] } = {}; statusLst: any; allStatuses: any;
  selectedStage: string = ''; checkboxStageOptions: any[] = [];showCheckboxError = false;
  chartOptions:any ;  statusOptionsByStageforDisplay : any = {}; showSourceFlagColumn: boolean = false;
  fetchCrmLeadsList: any[] = []; defaultStageName: string = '';defaultStatusName: string = '';
  uploadStageDisplay: { name: string, color: string } = { name: '', color: '' };
  uploadStatusDisplay: { name: string, color: string } = { name: '', color: '' };
  showValidationError = false; minDateTime: string = '';anyChecked: any;allowCustomStatus: boolean = true;
  newOptionName: string = '';newOptionColor: any;newItem: string = '';newItemColor: string = '#000000';
  addMoreVisible : boolean =false;selectedLeadId: number = 0;  followUpDetails: any[] = [];
  selectedProgressLeads: any[] = []; selectedLostLeads: any[] = []; selectedConvertedLeads: any[] = [];
  tempFormList: any; selectTemplateForm!: FormGroup; allTemplateGenIds: string[] = [];
  selectedStatusCount: number | null = null;statusCounts: { status: string; count: number }[] = [];
  rotateCharts = true;showMore = true; topshowMore = false;  dynamicFields: { value: string }[] = [];
  selectedLeads: any[] = []; currentPhoneNumber: string = ''; readonlyMode:boolean=false;
  showForm : boolean=false;selectedStatus: string = '';originalConnectedForm: any = {}; selectedUser: any = null;
  shouldDisableAddStatus = false;companyLst:any;selectedFileName:any;  offcanvasRef: any; individualEmail :any;
  phoneNumber: string = '';originalStatus: string = '';  notconnectedstatusClicked = false; hasSelectedInvalid = false;
  adoanAiRole: any;public filterLeadForm!:FormGroup; filterApplied :boolean = false;
  selectedLead: any;  public appointmentForm!: FormGroup;appointmentDataList :any;
  isChecked = false;taskPriorityList :any;
  taskForm ! :FormGroup; appointmentFormSubmitted: boolean = false;currentStep = 1;
  completionForm!:FormGroup;
  selectedLeadForAppointment:any;appointmentId: number | null = null;selectedLeadForAppointmentObject:any;
  filteredUserList: any[] = [];leadCompletionsubmitted : boolean = false;
  leadStatusCount:any;activeCount:Number =0;connectedCount :Number =0;
  notConnectedCount:Number =0;statusCompletion:Number =0 ;followUpCount:Number =0;selecteTemplateFormSubmitted:boolean=false;
  crmRole:string = '';LeadToCampaignForm!: FormGroup;leadList :any[]=[];  selectedLeadData: any;
  campaignList: any[] = [];selectedCampaign: any;
  campaignForm !:FormGroup;selectedCampaignId:any;selectedCampgnId:any;
  campaignSubmitted : boolean = false;isSubmitting : boolean = false;isEditMode : boolean = false;modal:any;
  override cityList:any[]=[];companyList : any[]=[];
  isCreateCampaignOpen :boolean=false; currentCampaignId : string ='';proposalsentSubmitted : boolean = false;
  pageIndex = 0; pageSize = 50;  data: any[] = []; displayData: any[] = []; totalRecords: number = 0;
   minimumDate : string ='';mobileNumber: any; clientName: any;  projectName: any;
  uploadLeads :boolean=false;moveCmapignSubmitted : boolean= false;
  stageColor : { [key: string]: string }={ 
  'Open': '#007bff',           
  };
  statusColor : { [key: string]: string }= {
  'active': '#007bff',         
  };
   userColors = [
    'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary',
    'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark', 'bg-light'
  ];
  stageColorMap: Map<string, string> = new Map();
  statusColorMap: Map<string, string> = new Map();crmStageData: any; crmStatusData: any;
  crmStaticStages = [ 
    { name: 'In Progress Leads', checked: false, isDefault: true, isCustom: false, color: '#28a745', },
    { name: 'Lost Leads', checked: false, isDefault: true, isCustom: false, color: '#dc3545', },
    { name: 'Converted Leads', checked: false, isDefault: true, isCustom: false, color: '#007bff', },

  ];
  @ViewChild('picker') picker: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) usersPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;
  @ViewChild('followupModal') followupModal!: TemplateRef<any>;
  firstModalRef!: NgbModalRef;
  secondModalRef!: NgbModalRef;

  public leadForm!: FormGroup;
  public submitted = false;
  selectedCountry: string = 'India';
  public leadDetails: any = {};

  public uploadLead!: FormGroup;
  public uploadSubmitted = false;
  public uploadSpinner = false;
  public sendwhatsLeadFormSubmitted = false;
  public sendwhatsLeadForm!: FormGroup;
  imageFileSrcData: any;
  public leadCount = 0;
  public leadId = 0;

  public sendLeadForm!: FormGroup;
  public sendLeadSubmitted = false;
  public sendMultiMailSubmitted = false;

  public followupName = '';
  public executiveName = '';
  public followupLeadForm!: FormGroup;
  public followupLeadSubmitted = false;
  public userList: any;

  public allocateForm!: FormGroup;
  public allocateSubmitted = false;
  // campgnId: string = '';
  leads:any;
  selectedIdList: Set<number> = new Set<number>();

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',  // Set the legend position to bottom
      },
    },
  };
  public pieChartLabels = [
    'Spoke',
    'Active',
    'Proposal sent',
    'Meeting Fixed',
    'Met',
    'Closed',
    'Lost'
  ];
  public pieChartDatasets = [{
    data: [200, 150, 100,43,23,78],
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  form: any;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, public switchService: SwitherService, private toastr: ToastrService, private fb: FormBuilder,
    private route: ActivatedRoute,private router: Router,private datePipe: DatePipe,
  ) {
    super();

    this.statusOptionsByStage = {
      'In Progress Leads': [...this.inPorgressLeads],
      'Lost Leads': [...this.lostLeads],
      'Converted Leads': [...this.convertedLeads],
      'open Stage':[...this.openStage],
      'proposal Stage': [...this.proposalStage]
    };

    this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
    this.crmRole = JSON.parse(this.userData).crmRole;
    this.chartOptions={
      series: [44, 55, 13, 43, 22],
      chart: {
          height: 300,
          type: 'pie',
      },
      colors: ["#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c"],
      labels: ['Hot 250', 'Payment Status 50', 'Call Back Later 190',],
      legend: {
          position: "bottom"
      },
      dataLabels: {
          dropShadow: {
              enabled: false
          }
      },
      }
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
    {name:'active',checked: false, isDefault: true, color:'#28a745'},
    {name:'connected',checked: false, isDefault: true,color:'#28a743'},
    { name: 'Not Connected', checked: false, isDefault: true,color: '#ffc107' },
    { name: 'Invalid', checked: false, isDefault: true,color: '#dc3545' },
  ];
   proposalStage = [
    { name: 'proposal Required', checked: false, isDefault: true, color: '#486a1bff' },
    { name: 'proposal sent', checked: false, isDefault: true, color: '#28a743' },
    {
      name: 'proposal Approved',
      checked: false,
      isDefault: true,
      color: '#ffc107',
    },
    { name: 'proposal Under Review', checked: false, isDefault: true, color: '#dc3545' },
  ];

  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
  
  openModal(content1: any) {
    this.modalService.open(content1, { centered: true });
  }
  openRight(content: any) {
    this.filterLeadForm.reset();
    this.offcanvasRef = this.offcanvasService.open(content, {
      position: 'end',
      scroll : true
    });
  }
  openRight1(content1: any) {
    this.offcanvasService.open(content1, { position: 'end' });
  }
  openRight3(content31: any, element: any) {
    this.selectedLeadData = element;
    this.LeadToCampaignForm.reset();
    this.modalService.open(content31, { centered: true });
  }
  openRight12(content12: any) {
    this.offcanvasService.open(content12, { position: 'end' });
  }
  openRight5(content5: any) {
    this.offcanvasService.open(content5, { position: 'end' });
  }

  openRight7(content: any) {
    this.offcanvasRef = this.offcanvasService.open(content, {
      position: 'end',
    });
  }

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
  
  openTaskModal(content: any) {
    if (!this.selectedLeads || this.selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    this.modalService.open(content, { backdrop: 'static' });
  }

  openFollowup(element: any, content1: any) {
    this.followupName = element.name;
    let executive = this.userData ? JSON.parse(this.userData).email : '';
    this.executiveName = executive;
    this.leadId = element.leadId;
    this.offcanvasService.open(content1, { position: 'end' });
  }

  url1: string = ''; // Assuming url1 is a property in your component

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
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }
  usersGetSNo(index: number): number {
    if (this.usersPaginator && this.usersPaginator.pageIndex !== undefined && this.usersPaginator.pageSize !== undefined) {
      return this.usersPaginator.pageIndex * this.usersPaginator.pageSize + index + 1;
    }
    return index + 1;
  }
  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
  }

  userFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];

  // FormControl for search and selection
  searchControl = new FormControl('');
  selectedOption = new FormControl('');
  filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.options);

  ngOnInit(): void {
    this.LeadForm('DUMMY9DD1748413866634');
    this.getCrmStages();
    this.getFormTemplate();
    this.getAllEmailTemplates();
    this.getLeadEntry();
    this.getCampaignData();
    this.selectedLeads = [];
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());

    this.minDateTime = `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    this.minimumDate = `${yyyy}-${mm}-${dd}`;
    this.getfetchLeadsIndividual();
    //Upload Lead Validatoin
    this.uploadLead = this.fb.group({
      file: ['', [Validators.required]],
      agents: [''],
      autoAllocate: [false],
      companyCode: [this.userCompanyCode],
      email: [this.individualEmail],
      type: [this.userType],
    });
    this.uploadLead.get('autoAllocate')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.uploadLead.get('agents')?.setValidators(Validators.required);
      } else {
        this.uploadLead.get('agents')?.clearValidators();
        this.uploadLead.get('agents')?.reset();
      }
      this.uploadLead.get('agents')?.updateValueAndValidity();
    });


    //Send Email 
    this.sendLeadForm = this.fb.group({
      email: ['', [Validators.required]],
      template: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      cc: ['', [Validators.required, Validators.email]],
      // bcc: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required]]
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

    this.LeadToCampaignForm = this.fb.group({
      campaignId: ['',Validators.required],
    });
    this.LeadToCampaignForm.patchValue({
      campaignId: [this.campaignId,],
    })

    this.campaignForm = this.fb.group({
      campaignId: [],
      campaignName: ['', [Validators.required, Validators.minLength(4)]],
      pipeline: ['',],
      campaignPoc: [''],
      agents: [[]],
      campaignPriority: [''],
      leadDuplicacy: [''],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
      isAutoCreationRequired:[false],
      createdDate: new Date().toISOString(),
      campgnId: [''],

    });
    if (this.userType === 1) {
      this.campaignForm.patchValue({ campaignPoc: this.userEmail });
    }

    this.filterLeadForm = this.fb.group({
      action:[''],
      stage: [''],
      status: [''],
      source: [''],
      startDate: [''],
      endDate: [''],
      executive: [''],
      city: [''],
      campaignId: [''],
      companyName: [''],
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType
    });


    this.sendwhatsLeadForm = this.fb.group({
      template: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required]],
      file: [''],
    });

    //Allocate Lead Executive
    this.allocateForm = this.fb.group({
      executive: [, [Validators.required]]
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
    // Filter options as the user types in the search bar
    this.searchControl.valueChanges.subscribe((searchText) => {
      if (searchText && typeof searchText === 'string') {
        const filtered = this.options.filter((option) =>
          option.toLowerCase().includes(searchText.toLowerCase())
        );
        this.filteredOptions.next(filtered);
      } else {
        this.filteredOptions.next(this.options); // Reset to all options if searchText is null
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
      campaignId: ['DUMMY9DD1748413866634'],
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
  get t() {
    return this.campaignForm.controls;
  }
  get b(){
    return this.LeadToCampaignForm.controls;
  }
  onSubmit(modal: any) {
    this.leadForm.get('campaignId')?.setValue ((JSON.parse(this.userData)?.userType == 1) ? 'SINGLE9DD1748413866634' : 'DUMMY9DD1748413866634');
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
    this.uploadSpinner = true
    if (this.leadForm?.valid) {
      this.switchService.AddCrmLeads(payload).subscribe({
        next: (res: any) => {
          const followUpDate = this.leadForm.get('followUpDate')?.value;
          // if (followUpDate) {
          //   this.followupLeadSubmit(modal); 
          // }
          if (res.status) {
            const followUpDate = this.leadForm.get('followUpDate')?.value;
            modal.close();
            this.submitted = false;
            this.leadForm.reset();
            this.getfetchLeadsIndividual();
                this.uploadSpinner = false;
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
            if (followUpDate) {
            this.followupLeadSubmit(modal); 
            }
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
  }

  getfetchLeadsIndividual() {
    this.uploadLeads = true;
    const userType = this.userType;
    this.campaignId = (userType == 1)
      ? 'SINGLE9DD1748413866634'
      : 'DUMMY9DD1748413866634';
    const payload = {
      page: this.pageIndex,
      size: 50,
      currentUser: this.userEmail,
      campaignId: this.campaignId
    }
    this.switchService.fetchLeads(payload).subscribe({
      next: (res: any) => {
          const now = new Date();
          const executiveList = res.executiveList?.content?.map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'executive',
          }));
          const entryList = res.entryList?.content?.map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'entry',
            
          }));
          const cities = res.entryList?.content
            ?.map((lead: any) => lead.city?.trim())
            .filter((city: any) => !!city) ?? [];
          const uniqueCities = [...new Set(cities)];
          this.cityList = uniqueCities.map(city => ({ name: city }));
          const companyNames = res.entryList?.content?.map((lead: any) => lead.companyName?.trim()).filter(Boolean) ?? [];
          const uniqueCompnayNames = [...new Set(companyNames)];
          this.companyList = uniqueCompnayNames.map(companyName=>({name:companyName}))
          const combined = [...executiveList, ...entryList];
          this.leadList = combined;
          this.totalRecords =(res.entryList?.totalElements ?? combined.length) || res.executiveList?.totalElements;
          if (this.pageIndex === 0) {
            this.paginator?.firstPage();
          }
          combined.forEach(item => {
            item.contact = item.contact ? Number(item.contact).toString() : '';
          });
          this.dataSource = new MatTableDataSource(combined);
          this.leadCount = combined.length;
           this.leadStatusCount = combined;
          const statusCounts: { [status: string]: number } = {};
          const statusCompletion : { [completionStatus: string]: number } = {};
          combined.forEach(lead => {
            const status = lead.status?.trim() || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            const completionStatus = lead.completionStatus;
            statusCompletion[completionStatus] = (statusCompletion[completionStatus] || 0) + 1;
          });

          this.activeCount = this.getCount(statusCounts, 'active');
          this.connectedCount = this.getCount(statusCounts, 'completed');
          this.notConnectedCount = this.getCount(statusCounts, 'not connected');

          this.statusCompletion = this.getCount(statusCompletion, 'completed');

          this.dataSource.data = combined;

          this.followUpCount = combined.filter(item => item.followUpDue).length;

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
            
           this.updateColumns();
          this.getStatusCount();
          this.taskPriorityList = res.taskPriorityList || [];
          this.uploadLeads = false;
        }
    });
  }

  onFollowupStatusChange(): void {
    const selectedStage = this.followupLeadForm.get('stage')?.value;

    if (selectedStage === 'open') {
    this.checkboxStageOptions = this.openStage.map(opt => ({
      ...opt,
      checked: true,
      isCustom: false
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

  getStageClass(stage: string): string {
    const baseClass = 'badge ps-3 fs-11';
    const key = stage?.trim().toLowerCase();  
    const color = this.stageColorMap.get(key) || 'bg-secondary-transparent'; 
    return `${baseClass} ${color}`;
  }
  
  onStageChange() {
    this.checkboxStageOptions = [];
    if (this.selectedStage === 'open') {
    this.checkboxStageOptions = this.openStage.map(opt => ({
      ...opt,
      checked: true,
      isCustom: false,
      disabled: true  
    }));

    this.allowCustomStatus = false; 
    this.anyChecked = true;
    return; 
    }

    const allOptions: any[] = this.statusOptionsByStage[this.selectedStage] || [];
    const selectedOptions: any[] = this.statusOptionsByStageforDisplay[this.selectedStage] || [];

    this.checkboxStageOptions = allOptions.map((item: any) => {
      const matched = selectedOptions.find((opt: any) => opt.name === item.name);
      return {
        ...item,
        checked: matched ? true : false,
        color: matched?.color || item.color || '#cccccc',
        isCustom: matched?.isCustom || false,
      };
    });

      const dynamicOptions = selectedOptions.filter(
        (opt: any) => !allOptions.some((o: any) => o.name === opt.name)
      ).map(opt => ({
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

  setInProgressStatus(): void {
    const inProgressStatus = this.checkboxStageOptions.find(option => option.name === 'In Progress');
    if (inProgressStatus) {
      inProgressStatus.checked = true;
    }
  }
  
  

  getStatusClass(status: string): string {
    const baseClass = 'badge ps-3 fs-11 order-status';
    const color = this.statusColorMap.get(status?.toLowerCase()) || 'bg-secondary-transparent';
    return `${baseClass} ${color}`;
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

  getCrmLeads(): void {
    const campaignId = this.campaignId;
    this.switchService.CrmLeads(campaignId).subscribe({
      next: (res: any) => {
        if (res) {
          this.crmLeadsList = res;
          this.dataSource.data = this.crmLeadsList;
        } else {
          this.toastr.error(res.message || 'Failed to load leads.');
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || 'Server Error');
      },
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
    const allExcel: Array<string> = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (!files) {
    return;
    }

    if (allExcel.indexOf(event.target.files[0].type) === -1) {
      this.selectedFileName = '';
      this.uploadSubmitted = false;
      this.uploadLead.reset();
      this.toastr.warning('Please choose Valid file', 'lead', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    } else {
      this.imageFileSrcData = files;
    }
      this.selectedFileName = files.name;

  }

  get l() {
    return this.uploadLead.controls;
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
          if(this.proposalsentSubmitted){
             this.router.navigate(
          ['apps/crm/proposal'],
          {
            state: { lead: this.CrmLeads }
          }
        )}
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
      error: (err: any) => { },
    });
  }

  formatMobileNumber(mobile: any): string {
    if (!mobile) return "";
    return Number(mobile).toFixed(0); // Convert to normal number
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-GB", { hour12: false }); // Converts to "11/02/2025, 09:45:18"
  }

  stripHtmlTags(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
  }

   uploadLeadSubmit(modal: any) {
    const selectedAgents = this.uploadLead.get('agents')?.value;
    if (this.userType !== 1) {
      if (!selectedAgents || selectedAgents.length === 0) {
        this.toastr.warning('Please select at least one user before importing.');
        return;
      }
    }
    this.uploadSubmitted = true;
    if (this.uploadLead.valid) {
      this.uploadSpinner = true;
      const formData = new FormData();
      formData.append('file', this.imageFileSrcData);
      formData.append('uploadedBy', JSON.parse(this.userData)?.email || '');
      formData.append('companyCode', JSON.parse(this.userData)?.companyCode || '');
      formData.append('email', JSON.parse(this.userData)?.email || '');
      formData.append('type', JSON.parse(this.userData)?.type || '');
      formData.append('campaignId', (JSON.parse(this.userData)?.userType == 1) ? 'SINGLE9DD1748413866634' : 'DUMMY9DD1748413866634');
      formData.append('stage', this.defaultStageName || 'open');
      formData.append('status', this.defaultStatusName || 'active');
      const autoAllocate = this.uploadLead.get('autoAllocate')?.value;
      formData.append('autoAllocate', autoAllocate.toString());
      const selectedAgent = this.uploadLead.get('agents')?.value;
      if (autoAllocate && selectedAgent) {
        formData.append('agents', selectedAgent);
      } else {
        formData.append('agents', '');
      }
      formData.forEach((value, key) => {
      });
      this.switchService.UploadCrmLeads(formData).subscribe({
        next: (res: any) => {
          if (res.status === true) {
            modal.close();
            this.uploadLead.reset();
            this.uploadSubmitted = false;
            this.uploadSpinner = false;
            this.toastr.success('Bulk Lead Uploaded Successful');
            this.getfetchLeadsIndividual();
          } else {
            this.uploadSpinner = false;
            // this.toastr.error(res.message, 'lead');
            this.toastr.warning('invalid file');
          }
        },
        error: (err: any) => {
          this.uploadSpinner = false;
          this.toastr.error('Error uploading CRM leads', 'lead');
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
      individualEmail:this.userEmail,
      campaignId:((JSON.parse(this.userData)?.userType == 1) ? 'SINGLE9DD1748413866634' : 'DUMMY9DD1748413866634'),
    };
    this.leadForm.patchValue(payload);
    this.leadForm.get('followUpDate')?.disable();
    this.modalService.open(Content14, {
      scrollable: true,
      centered: true,
      size: 'xl',
    });
    this.onStatusChange();

  }

  editLeadSubmit(modal: any) {
    this.leadForm.get('campaignId')?.setValue(this.campaignId);
    this.leadForm.get('executive')?.setValue(this.element.executive ?? null);
    this.leadForm.get('entryBy')?.setValue(this.element.entryBy ?? null);
    this.leadForm.get('updatedBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('updatedTime')?.setValue(new Date().toISOString());
    const payload = this.leadForm.value;
    this.submitted = true;
    this.uploadSpinner = true;
    if (this.leadForm?.valid) {
      this.switchService.EditCrmLeads(payload).subscribe({
        next: (res: any) => {
          if (res.status) {
            modal.close();
            this.submitted = false;
            this.leadForm.reset();
            this.getfetchLeadsIndividual();
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
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
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
        // bcc: this.sendLeadForm.get('bcc')?.value,
        content: this.sendLeadForm.get('content')?.value,
      };

      this.switchService.CRMLeadSendMailFollowup(payload).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.sendLeadSubmitted = false;
            this.submitted = false;
            modal.close();
            this.sendLeadForm.reset();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });           
          } 
          else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
  }

  get e() {
    return this.followupLeadForm.controls;
  }

  followupLeadSubmit(modal: any) {
    this.followupLeadSubmitted = true;
    this.uploadSpinner = true;
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
            this.uploadSpinner = false;
            this.showForm = false;
            this.followupLeadForm.reset();
            this.executiveName = '';
            this.followupName = '';
            this.leadId = 0;
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
            this.getfetchLeadsIndividual();
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
    }
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
      // this.switchService.getAllUsers().subscribe({ next: (res:any) => {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
             this.filteredUserList = this.userList.filter(
              (user: any) => user.adonaiRole?.toUpperCase() !== 'ADMIN'
            );
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          // this.toastr.error(error.statusText);
        },
      })
    }
  }

  @ViewChild("followUpPond") followUpPond!: FilePondComponent;
  followUpPondHandleInit() {
  }
  followUpPondHandleAddFile(event: any) {
    this.imageFileSrcData = '';
    const files = event.target.files[0];
    this.imageFileSrcData = files;
  }
  followUpPondHandleActivateFile(event: any) {
  }

  get a() {
    return this.allocateForm.controls;
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
            this.getfetchLeadsIndividual();
          } else {
            this.toastr.error(res.message, 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
  }

  onRowCheckboxChange(lead: any, event: any) {
  if (event.checked) {
    if (!this.selectedLeads.some(l =>
      (typeof l === 'object' ? l.leadId : l) === lead.leadId
    )) {
      this.selectedLeads.push(lead);
    }

    this.selectedLeadForAppointment = lead;

  } else {
    this.selectedLeads = this.selectedLeads.filter(l =>
      (typeof l === 'object' ? l.leadId : l) !== lead.leadId
    );

    if (this.selectedLeadForAppointment?.leadId === lead.leadId) {
      this.selectedLeadForAppointment = null;
    }
  }
  }
  onSelectAllChange(event: any) {
  if (event.checked) {

    this.dataSource.data.forEach((row: any, index: number) => {
    });

    const filtered = this.dataSource.data.filter((row: any) => {
      const status = (row?.completionStatus || '').trim().toLowerCase();
      const isCompleted = status === 'completed';
      const hasValidId = row?.leadId != null;

      return !isCompleted && hasValidId;
    });

    this.selectedLeads = filtered.map((row: any) => row.leadId);

  } else {
    this.selectedLeads = [];
  }
  }
  isSelected(leadId: number): boolean {
    return this.selectedLeads.includes(leadId);
  }

  isAllSelected(): boolean {
    const enabledRows = this.dataSource.data
      .filter(row => row.completionStatus?.toLowerCase() !== 'completed');

    // Only compare the selectable rows
    const selectedIds = this.selectedLeads.map(l => l.leadId ?? l);

    return enabledRows.every(row => selectedIds.includes(row.leadId));
  }


  isIndeterminate(): boolean {
  const enabledRows = this.dataSource.data
    .filter(row => row.completionStatus?.toLowerCase() !== 'completed');

  if (enabledRows.length === 0) return false;

  const selectedIds = this.selectedLeads.map(l => l.leadId ?? l);

  const selectedCount = enabledRows.filter(row =>
    selectedIds.includes(row.leadId)
  ).length;

  return selectedCount > 0 && selectedCount < enabledRows.length;
  }


  @ViewChild("myPond") myPond!: FilePondComponent;

  pondOptions: FilePond.FilePondOptions = {
    allowMultiple: false,
    maxFiles: 1,
    labelIdle: "Drop files here to Upload...",
    server: {
      url: '/upload',
      process: '/process',
      revert: '/revert',
      restore: '/restore',
    },
  };
  pondFiles: FilePond.FilePondOptions["files"] = [
    {
      source: "assets/photo.jpeg",
      options: {
        type: "local",
      },

    },
  ];
  pondHandleInit() {
  }
  pondHandleAddFile(event: any) {
  }
  pondHandleActivateFile(event: any) {
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
    { name: 'Alice Johnson', role: 'Manager', email: 'alice.johnson@example.com', date: '2025-04-25', callsAttempted: 25, callsConnected: 18 },
    { name: 'Bob Smith', role: 'Sales Executive', email: 'bob.smith@example.com', date: '2025-04-24', callsAttempted: 30, callsConnected: 22 },
    { name: 'Catherine Lee', role: 'Account Manager', email: 'catherine.lee@example.com', date: '2025-04-24', callsAttempted: 20, callsConnected: 15 },
    { name: 'David Brown', role: 'Sales Executive', email: 'david.brown@example.com', date: '2025-04-23', callsAttempted: 18, callsConnected: 10 },
    { name: 'Ella Davis', role: 'Manager', email: 'ella.davis@example.com', date: '2025-04-22', callsAttempted: 28, callsConnected: 20 },
  ];

  validateAndOpenBulkUpload(fileInput: HTMLInputElement): void {
    if (!this.stageLst || this.stageLst.length === 0) {
      this.toastr.warning('Please add at least one Stage before uploading.');
      return;
    }

    if (!this.statusLst || this.statusLst.length === 0) {
      this.toastr.warning('Please add at least one Status before uploading.');
      return;
    }

    fileInput.click();
  }

  VerticallyScrol(content112: any) {
    this.leadId = 0;
    this.submitted = false;
    this.leadForm.reset();
    this.modalService.open(content112, {
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
      centered: true,
      size: 'xl',
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

    const currentStageOptions = this.statusOptionsByStage[this.selectedStage] || [];
    const currentDisplayOptions = this.statusOptionsByStageforDisplay[this.selectedStage] || [];

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

      // Push to both arrays
      currentStageOptions.push(newOption);
      currentDisplayOptions.push(newOption);

      // Reassign for binding
      this.statusOptionsByStage[this.selectedStage] = [...currentStageOptions];
      this.statusOptionsByStageforDisplay[this.selectedStage] = [...currentDisplayOptions];
      this.checkboxStageOptions = [...currentStageOptions];

      this.toastr.info('Item added.');
    } else {
      this.toastr.warning(`'${newName}' already exists`);
    }

    this.newOptionName = '';
    this.newOptionColor = '';
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
    this.newItemColor = '#000000'; // Reset color picker
  }

  deleteLeadItem(index: number) {
    const deleted = this.crmStaticStages[index]?.name;
    this.crmStaticStages.splice(index, 1);
    this.toastr.warning(`'${deleted}' has been deleted`);
  }

  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible;
  }

  saveCrmStages() {
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
          this.offcanvasService.dismiss();
          this.getCrmStages();
          this.isAddStagesDisabled = true;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    });
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
          const anyStagesSelected = this.crmStaticStages.some(stage => stage.checked);
          this.isAddStagesDisabled = anyStagesSelected;

          const firstStageKey = stageKeys.find(
            (key) => stageObj[key]?.trim() !== ''
          );
          // this.defaultStageName = firstStageKey ? stageObj[firstStageKey] : '';
          this.defaultStageName = 'open';
          const isAdonaiUser = this.Adonai;
          // this.defaultStageName = firstStageKey ? stageObj[firstStageKey] : '';
          const defaultStageExists = this.stageLst.some((s: any) => s.stageName === 'Design Stage');
           const defaultProposalStageExists = this.stageLst.some(
            (s: any) => s.stageName === 'proposalStage'
          );

          if (isAdonaiUser && !defaultStageExists) {
            const insertIndex = Math.max(1, this.stageLst.length - 2);  // ensures index is at least 1
            const defaultStage = {
              stageName: 'Design Stage',
              color:'#000000',
              createdBy: this.userEmail,
              companyCode: this.userCompanyCode,
            };
            this.stageLst.splice(insertIndex, 0, defaultStage); 
          }
           if (isAdonaiUser && !defaultProposalStageExists) {
            const insertIndex = Math.max(1, this.stageLst.length - 2); // ensures index is at least 1
            const defaultStage = {
              stageName: 'proposal Stage',
              color: '#187edeff',
              createdBy: this.userEmail,
              companyCode: this.userCompanyCode,
            };
            this.stageLst.splice(insertIndex, 0, defaultStage);
          }
          const defaultStageName = 'open';
          const defaultStageColor = '#007bff'; 

          if (!this.stageLst.find((s:any) => s.stageName === defaultStageName)) {
          this.stageLst.unshift({
          stageName: defaultStageName,
          color: defaultStageColor
            });
          }
          
          this.getCrmStatus();
          this.isAddStagesDisabled=true;
        } else {
          this.stageLst = [];
          this.isAddStagesDisabled=false;
        }
      },
      error: (err) => {
        // this.toastr.error('Failed to fetch CRM stages.');
      },
    });
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
    // this.crmStatusData = {
    //   stage: this.selectedStage,
    //   customStatuses: selectedOptions.filter(opt => opt.isCustom).map(opt => opt.name),
    //   statuses: selectedOptions.map(opt => ({
    //     name: opt.name,
    //     color: opt.color || '#cccccc',
    //     isCustom: opt.isCustom || false
    //   }))
    // };

    this.switchService.SaveCrmStatus(this.crmStatusData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Status saved successfully');
          this.offcanvasService.dismiss();
          this.uploadSpinner = false;
          this.getCrmStages();
          
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    });
  }

  getCrmStatus(): void {
    let completedRequests = 0;
    const hasSavedStageStatuses: string[] = [];

    // ❗ Important: Reset these before reloading data
    this.statusOptionsByStageforDisplay = {};
    this.statusLst = [];
    for (let i = 0; i < this.stageLst.length; i++) {
      const stageName = this.stageLst[i].stageName;
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

            // ✅ Push valid status lists only
            for (const [stage, fields] of Object.entries(
              this.statusOptionsByStageforDisplay
            )) {
              const clonedFields = JSON.parse(JSON.stringify(fields)); // avoid reference bugs
              this.statusLst.push({ stage, fields: clonedFields });
            }

            // ✅ Inject OPEN stage if not already
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

            // ✅ Sort 'open' to the top
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

            // ✅ Default selections
            this.defaultStageName =
              this.statusLst.find(
                (s: { stage: string }) => s.stage.toLowerCase() === 'open'
              )?.stage ||
              this.stageLst[0]?.stageName ||
              '';
            this.defaultStatusName = 'active';

            // ✅ Button Disable Logic
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
            updatedTime: followup.updatedTime ? new Date(followup.updatedTime) : null
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

  deleteLeadStages() {
    const payload = {
      comapanyCode: this.userCompanyCode,
      campaignId: 'DUMMY9DD1748413866634',
      email: this.userEmail,
      type: this.userType
    }
    if (confirm('Are you sure you want to delete this Lead stages?')) {
      this.switchService.deleteLeadStages(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getCrmStages();
          this.getCrmStatus();
        },
        error: (error) => {
          this.toastr.error("Failed to delete Lead stages.");
        }
      });
    }
  }

  deleteLeadStatus() {
    const payload = {
      comapanyCode: this.userCompanyCode,
      campaignId: 'DUMMY9DD1748413866634',
      email: this.userEmail,
      type: this.userType
    }
    if (confirm('Are you sure you want to delete this Lead status?')) {
      this.switchService.deleteLeadStatus(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getCrmStatus();
        },
        error: (error) => {
          this.toastr.error("Failed to delete Lead status.");
        }
      });
    }
  }


  selectFormTemplateSubmit() {
    this.selecteTemplateFormSubmitted = true;
    if (this.selectTemplateForm.invalid) {
      this.selectTemplateForm.markAllAsTouched();
      this.toastr.warning('please fill all mandatory fields');
      return;
    }
    const payload = this.selectTemplateForm.value;
    this.switchService.selectFormTemplate(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Template submitted successfully!');
        this.getFormTemplate();
        this.selecteTemplateFormSubmitted = false;
        this.offcanvasService.dismiss();
        this.selectTemplateForm.reset();
      },
      error: (err) => {
        this.toastr.error(err.statusText || 'Error submitting the template.');
      },
    });
  }

  getFormTemplate(): void {
    const requests = this.allTemplateGenIds.map((id) =>
      this.switchService.fetchFormTemplate(id)
    );
    forkJoin(requests).subscribe({
      next: (responses: any[]) => {
        this.tempFormList = responses;
      },
      error: (err) => {
        // this.toastr.error('Error fetching template details');
      },
    });
  }

  openRight13(content13: any) {
    this.selectTemplateForm.reset();
    this.selecteTemplateFormSubmitted = false;

    this.offcanvasService.open(content13, { position: 'end' });
  }

   resetForm() {
    this.newItem = '';
    this.addMoreVisible = false;
    this.crmStaticStages.forEach((plan) => {
      plan.checked = false;
    });
  }

  getStatusCount(): void {
    this.selectedStatusCount = null;
    const userType = this.userType;
    this.campaignId = (userType == 1)
      ? 'SINGLE9DD1748413866634'
      : 'DUMMY9DD1748413866634';
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
        } 
      },
    });
  }

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
  
   private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }
  getUserColor(followup: any): string {
    const key = followup.email || followup.followUpBy || 'default';
    const index = this.hashString(key) % this.userColors.length;
    return this.userColors[index];
  }

  getStatusColor(status: string | null | undefined): string {
  if (!status || typeof status !== 'string' || status.trim() === '') {
    return '#ccc'; // default color
  }

  if (!Array.isArray(this.statusLst)) return '#ccc';

  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === 'active') return '#28a745';

  for (const stage of this.statusLst) {
    const field = stage.fields?.find(
      (f: { name: string }) => f.name?.toLowerCase() === normalizedStatus
    );
    if (field?.color) {
      return field.color;
    }
  }

  return '#ccc';
}


  getStageColor(stage: string | null | undefined): string {
  if (!stage || typeof stage !== 'string' || stage.trim() === '') {
    return '#ccc'; // default grey
  }

  if (!this.stageLst) return '#ccc';

  const normalizedStage = stage.trim().toLowerCase();

  if (normalizedStage === 'open') return '#28a745';

  const match = this.stageLst.find(
    (s: { stageName: string }) =>
      s.stageName?.toLowerCase() === normalizedStage
  );

  return match?.color || '#ccc';
}


 capitalizeFirstLetter(text: string | null | undefined, defaultText: string = ''): string {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return defaultText;   // return default label
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}



  deleteSelectedLeads() {
  if (!this.selectedLeads.length) {
    this.toastr.warning('Please select at least one lead');
    return;
  }
  const normalized = this.selectedLeads
  .map(item => {
    if (typeof item === 'number') {
      return this.dataSource.data.find(row => row.leadId === item);
    }
    return item;
  })
  .filter(x => x && x.leadId); 
  const filteredLeads = normalized.filter(
  (lead: any) => lead.status?.toLowerCase() !== 'completed'
  );

  if (!filteredLeads.length) {
    this.toastr.warning('Completed leads cannot be deleted');
    return;
  }
  const leadList = filteredLeads.map((lead: any) => lead.leadId);

  if (confirm('Are you sure you want to delete the selected leads?')) {
    this.switchService.deleteLeads({ leadList }).subscribe({
      next: (res: any) => {
        this.toastr.success('Leads deleted successfully');
        this.getfetchLeadsIndividual();
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
          this.getfetchLeadsIndividual();
          this.selectedLeads = this.selectedLeads.filter(id => id !== leadId);
        },
        error: () => {
          this.toastr.error('Failed to delete lead.');
        },
      });
    }
  }

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
      error: (err) => {
        // this.toastr.error('Error fetching template details');
      },
    });
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
  get P() {
    return this.sendwhatsLeadForm.controls;
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

  onStatusButtonClick(status: string,modal :any): void {
    this.selectedStatus = status;
    this.showForm = true;
    const followupDate = this.followupLeadForm.get('followupDate');
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
      this.followupLeadSubmit(modal)
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
      error: (error) => {
        // this.toastr.error(error.statusText);
      }
    });
  }


  filterLeads(modal:any) {
    this.uploadSpinner = true;
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
          this.uploadSpinner = false;
          this.filterLeadForm.reset();
          this.toastr.success('filter leads successfully');
          this.filterApplied = true;
        } else {
          this.toastr.error(res.message, 'Lead');
          this.filterApplied = false;
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || 'Something went wrong', 'Error');
      }
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
    this.getfetchLeadsIndividual(); 
    this.filterApplied= false;
  }

  appointmentModal(appointment1: any, element: any,appointmentData: any = null) {
     this.selectedLeadForAppointmentObject = element; // full lead object
  
    if (!this.selectedLeads || this.selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead');
      return;
    }
    this.selectedLead = element;
    this.appointmentForm.reset();
    this.modalService.open(appointment1, { centered: true });
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
    const leadId = element.leadId;
    this.switchService.fetchAppointment(leadId).subscribe({
      next: (res) => {
        this.appointmentDataList = res; 
      },
      error: (err) => {
        this.toastr.error('Failed to fetch appointment');
      }
    });
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
      error: () => {
        this.toastr.error('An error occurred while sending mail.');
      }
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
        this.getfetchLeadsIndividual();
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
    const deadlineDate = new Date(task.deadline);
    if (deadlineDate < this.today) {
      return 'btn-danger-transparent';
    }
    if (deadlineDate.toDateString() === this.today.toDateString()) {
      return 'btn-warning-transparent';
    }
    return 'btn-success-transparent';
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
    if (diffDays > 0) {
      return `${diffDays} `;
    } else if (diffDays === 0) {
      return ``;
    } else {
      return ` ${Math.abs(diffDays)}`;
    }
  }

  getDayLeft(deadline: string | Date): string {
    const today = new Date();
    const dueDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays === 0) {
      return `Due today`;
    } else {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }
  }
  
  openCompletionModal(content: any, lead: any) {
    this.selectedLead = lead;
    this.leadId = lead.leadId;
    this.currentStep = 1; 
     const mobile = lead.contact ? String(Number(lead.contact)) : '';
    this.completionForm.patchValue({
      clientName: lead.name ?? '',
      mobileNumber: mobile,
      projectName: lead.companyName ?? '',
      address: lead.address ?? '',
      username: lead.username ?? ''
    }); 
    this.modalService.open(content, { centered: true,scrollable: true });
  }
   closeLeadWithoutProject(modal : any) {
  this.updateCompletionStatus(null, false);  
  }


   updateCompletionStatus(modal: any,autoProjectCreation: boolean) {
    this.leadCompletionsubmitted = true;
    if (autoProjectCreation && this.completionForm.invalid) {
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
      type: this.userType,
      autoCreationRequired: autoProjectCreation,
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
        if (modal) {
          modal.close('closed'); 
        } else {
          this.modalService.dismissAll();
        }
        setTimeout(() => {
          this.currentStep = 1;
        }, 300);

      },
      error: (err) => {
        this.toastr.error('Something went wrong!');
      }
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
    this.updateCompletionStatus(modal,true);

    
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
  
  formatToLocal(dateString: string): string {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

  openBulkMove(content31: any, selectedLeads: any[]) {
    if (!selectedLeads || selectedLeads.length === 0) {
      this.toastr.warning('Please select at least one lead.');
      return;
    }

    this.selectedLeads = selectedLeads;
    this.getCampaignData();
    this.firstModalRef = this.modalService.open(content31, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
 openCreateCampaign(content15: any) {
    this.isCreateCampaignOpen = true;
    this.secondModalRef = this.modalService.open(content15, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    this.secondModalRef.result.finally(() => {
      this.isCreateCampaignOpen = false;
    });
  }
  submitCampaign(modal: any) {
    this.campaignSubmitted = true;
    if (this.campaignForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.isSubmitting = true;
    let agents = this.campaignForm.get('agents')?.value;
    if (Array.isArray(agents)) {
      agents = agents.join(',');
    }
    let payload = {
      ...this.campaignForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
      agents: agents,
      isAutoCreationRequired: this.campaignForm.value.isAutoCreationRequired ?? false
    };
    if (this.selectedCampgnId && this.selectedCampaignId) {
      payload.campgnId = this.selectedCampgnId;
      payload.campaignId = this.selectedCampaignId;
    }
    this.switchService.saveCampaignData(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.status === true || res.campaignId || res.createdDate) {
          const name = res.campaignName;
          this.toastr.success(`${name} created successfully!`);
          modal.close();
          this.campaignForm.reset();
          this.campaignForm.patchValue({
            companyName: this.userCompanyName,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
          });
          this.getCampaignData();
          this.selectedCampgnId = null;
          this.selectedCampaignId = null;
        } 
      }
    });
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
  
  openCreateModal(content: any) {
  this.isEditMode = false;
  this.selectedCampgnId = null;
  this.selectedCampaignId = null;
  this.campaignForm.reset();
  this.open(content);
  }
  leadToCampaignSubmit(modal: any) {
    this.moveCmapignSubmitted = true;
    if(this.LeadToCampaignForm.invalid){
      this.toastr.warning('please fill all the mandatory fields');
    }
    this.uploadSpinner = true;
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
      this.moveCmapignSubmitted = false;
      this.uploadSpinner = false;
      if (!this.isCreateCampaignOpen) {
        this.getfetchLeadsIndividual();

      }
    this.campaignId = selectedCampaignId;
  }

  moveLeadToAnotherCampaign(
    data: { leadId: string; campaignId: string } | any[],
    modal: any
  ) {
    const payloadArray = Array.isArray(data) ? data : [data];
    this.currentCampaignId = this.campaignId;
    const leadIds = payloadArray.map(item => item.leadId);
    const campaignId = payloadArray[0].campaignId;
     if (!this.isCreateCampaignOpen) {
    this.switchService.update_existing_campaign(leadIds, campaignId).subscribe({
      next: (res) => {
        this.leadList = this.leadList.filter(
          (lead: any) => !leadIds.includes(lead.leadId)
        );
        this.toastr.success(`Leads moved successfully!`);
        modal.close();
        this.submitted = false;
        this.leadForm.reset();
        this.getfetchLeadsIndividual();
      },
    });
    }
  }

  sentProposal(element : any) {
    this.proposalsentSubmitted = true;
    this.ViewCrmLeads(element);
  }

  allowOnlynum(event: KeyboardEvent) {
    const allowedChars = '0123456789.';
    const inputChar = event.key;

    if (
      ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(inputChar)
    ) {
      return;
    }

    const currentValue = (event.target as HTMLInputElement).value;

    if (!allowedChars.includes(inputChar) || (inputChar === '.' && currentValue.includes('.'))) {
      event.preventDefault();
    }
  }

  onPageChange(event: PageEvent) {
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.updateClientPagination();
      return;
    }

    if (event.pageIndex !== this.pageIndex) {
      this.pageIndex = event.pageIndex;
      this.getfetchLeadsIndividual();
    }
  }


  updateClientPagination() {
    if (!this.leadList?.length) {
      this.displayData = [];
      this.dataSource = new MatTableDataSource(this.displayData);
      return;
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayData = this.leadList.slice(startIndex, endIndex);
    this.dataSource = new MatTableDataSource(this.displayData);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.hideDropdown();
    this.hideFloatingUI();
  }
  @HostListener('document:wheel', ['$event'])
  onDocumentScroll() {
    this.hideDropdown();
    this.hideFloatingUI();
  }

  hideDropdown() {
    const dropdowns = document.querySelectorAll('.dropdown-menu.show');
    dropdowns.forEach((d: any) => d.classList.remove('show'));
  }
  hideFloatingUI() {
  document.querySelectorAll('.dropdown-menu.show')
    .forEach((el: any) => el.classList.remove('show'));
  document.querySelectorAll('.popover.show')
    .forEach((el: any) => el.classList.remove('show'));
  }
  getCount(obj: any, key: string): number {
    return Object.keys(obj).reduce((total, currentKey) => {
      return currentKey.trim().toLowerCase() === key.trim().toLowerCase()
        ? total + obj[currentKey]
        : total;
    }, 0);
  }

  openPicker() {
    setTimeout(() => {
      this.picker.open();
    });
  }

  onFollowupDateSelect(event: any) {
  const selectedDate = event.value;

  if (selectedDate) {
    const hours = 10;
    const minutes = 0;

    selectedDate.setHours(hours, minutes, 0);

    this.followupLeadForm.patchValue({
      followupDate: selectedDate
    });
  }
  }
 

}
