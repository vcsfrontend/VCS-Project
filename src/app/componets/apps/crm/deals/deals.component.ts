import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  userType: string = this.userData ? this.userData.type : '';
  displayedColumns: string[] = ['select', 'slNo', 'action', 'name', 'executive','stage', 'status', 'followUpDate', 'contact', 'email'];
  usersColumns: string[] = ['slNo', 'name', 'role', 'email', 'date', 'callsAttempted', 'callsConnected',];
  dataSource = new MatTableDataSource<any>();
  usersDataSource = new MatTableDataSource<any>();
  pageSize = 10;
  Crmusers: any[] = []; CrmLeads: any = {}; element: any = {}; crmLeadsList : any;
  campaignId !: string; stageLst: any; isStagesLoading: boolean = true; isAddStagesDisabled: boolean = false;
  statusOptionsByStage: { [stageName: string]: any[] } = {}; statusLst: any; allStatuses: any;
  selectedStage: string = ''; checkboxStageOptions: any[] = [];
  chartOptions:any ;  statusOptionsByStageforDisplay : any = {};
  fetchCrmLeadsList: any[] = []; defaultStageName: string = '';defaultStatusName: string = '';


  stageColorMap: Map<string, string> = new Map();
  statusColorMap: Map<string, string> = new Map();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) usersPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  

  public leadForm!: FormGroup;
  public submitted = false;
  selectedCountry: string = 'India';
  public leadDetails: any = {};

  public uploadLead!: FormGroup;
  public uploadSubmitted = false;
  public uploadSpinner = false;
  imageFileSrcData: any;
  public leadCount = 0;
  public leadId = 0;

  public sendLeadForm!: FormGroup;
  public sendLeadSubmitted = false;


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

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, public switchService: SwitherService, private toastr: ToastrService, private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    super();
    this.userData = localStorage.getItem('userDetails');
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
  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
  openModal(content1: any) {
    this.modalService.open(content1, { centered: true });
  }
  openRight(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  openRight1(content1: any) {
    this.offcanvasService.open(content1, { position: 'end' });
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
    this.getCrmStages();
    this.route.queryParams.subscribe((params: any) => {
      this.campaignId = params['campaignId']?.trim() || '';
      this.LeadForm(this.campaignId);   
      this.getCrmLeads();    
    });
    
    //Upload Lead Validatoin
    this.uploadLead = this.fb.group({
      file: ['', [Validators.required]]
    });

    //Send Email 
    this.sendLeadForm = this.fb.group({
      email: ['', [Validators.required]],
      template: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      cc: ['', [Validators.required, Validators.email]],
      bcc: ['', [Validators.required, Validators.email]],
      content: ['', [Validators.required]]
    });

    //Send Email 
    this.followupLeadForm = this.fb.group({
      followupDate: ['', [Validators.required]],
      followupTime: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      status: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      followUpBy: ['']
    });


    //Allocate Lead Executive
    this.allocateForm = this.fb.group({
      executive: ['', [Validators.required]]
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
  }
  LeadForm(campaignId: string) {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      companyName: [''],
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
      campaignId: [this.campaignId],
    });
  }

  get f() {
    return this.leadForm.controls;
  }

  onSubmit(modal: any) {
    this.leadForm.get('campaignId')?.setValue(this.campaignId);
    this.leadForm.get('executive')?.setValue('');
    this.leadForm.get('entryBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('updatedBy')?.setValue(JSON.parse(this.userData).email);
    this.leadForm.get('updatedTime')?.setValue(new Date().toISOString());
    const payload = this.leadForm.value;
    this.submitted = true;
    if (this.leadForm?.valid) {
      this.switchService.AddCrmLeads(payload).subscribe({
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
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
  }

  getFetchLeadData() {
    this.switchService.FetchLeadData(this.userEmail, this.campaignId).subscribe({
      next: (res: any) => {
        const executiveList = (res.executiveList || []).map((item: any) => ({
          ...item,
          source: 'executive',
        }));
        const entryList = (res.entryList || []).map((item: any) => ({
          ...item,
          source: 'entry',
        }));
        const combined = [...executiveList, ...entryList];
        this.fetchCrmLeadsList = combined;
        this.dataSource.data = combined;
        this.leadCount = combined.length;
        const hasExecutiveFlag = combined.some(item => item.source === 'executive');
        this.displayedColumns = [
          ...(hasExecutiveFlag ? ['sourceFlag'] : []),'select', 'slNo', 'action', 'name','executive','stage', 'status', 'followUpDate', 'contact','email',];
        const firstLead = combined[0];
        if (!firstLead) return;
        this.followupLeadForm.patchValue({ stage: firstLead.stage });
        setTimeout(() => {
          this.onFollowupStatusChange();
          const isValidStatus = this.checkboxStageOptions.some(
            (opt) => opt.name === firstLead.status
          );
          if (isValidStatus) {
            this.followupLeadForm.patchValue({ status: firstLead.status });
          }
        }, 500);
      },
      error: (error) => {
        this.toastr.error(error.statusText || 'Server Error');
      },
    });
  }

  onFollowupStatusChange(): void {
    const selectedStage = this.followupLeadForm.get('stage')?.value;
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
  
  
  getCrmStatus(): void {
    let completedRequests = 0;
    for (let i = 0; i < this.stageLst.length; i++) {
      const stageName = this.stageLst[i].stageName;
      const payload = {
        email: this.userData ? JSON.parse(this.userData).email : '',
        companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
        type: this.userData ? JSON.parse(this.userData).type : '',
        stage: stageName,
        campaignId: "VCS_656A1747975029689",
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
            this.statusOptionsByStageforDisplay[stageName] = options;
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
            const selectedStageNames = this.stageLst.map(
              (s: { stageName: string }) => s.stageName
            );
            this.statusLst = Object.entries(this.statusOptionsByStageforDisplay)
              .filter(([stage]) => selectedStageNames.includes(stage))
              .map(([stage, fields]) => ({
                stage,
                fields,
              }));
            if (this.defaultStageName && this.statusOptionsByStageforDisplay[this.defaultStageName]) {
              const statusArray = this.statusOptionsByStageforDisplay[this.defaultStageName];
              this.defaultStatusName = statusArray.length > 0 ? statusArray[0].name : '';
            } else {
              this.defaultStatusName = '';
            }
          }
        },
      });
    }
  }
  
  
  onStageChange(): void {
    const selectedStage = this.leadForm.get('stage')?.value;
    this.checkboxStageOptions = this.statusOptionsByStage[selectedStage] || [];
    if (selectedStage === 'In Progress Leads') {
      this.setInProgressStatus();
    }
    this.leadForm.get('status')?.setValue(null);
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

    if (allExcel.indexOf(event.target.files[0].type) === -1) {
      this.uploadSubmitted = false;
      this.uploadLead.reset();
      this.toastr.error('Please choose Valid file', 'lead', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    } else {
      this.imageFileSrcData = files;
    }

  }

  get l() {
    return this.uploadLead.controls;
  }

  onStatusChange(): void {
    const selectedStage = this.leadForm.get('stage')?.value;
    this.checkboxStageOptions =
      this.statusOptionsByStageforDisplay[selectedStage] || [];
    if (selectedStage === 'In Progress Leads') {
      this.setInProgressStatus();
    }
    this.leadForm.get('status')?.setValue(null);
  }

  ViewCrmLeads(data: any) {
    this.switchService.ViewCrmLeads(data.leadId).subscribe({
      next: (res: any) => {
        if (res && res.leadsEntry) {
          this.CrmLeads = {
            name: res.leadsEntry.name || "",
            companyName: res.leadsEntry.companyName || "",
            executive: res.leadsEntry.executive || "",
            products: res.leadsEntry.products || "",
            country: res.leadsEntry.country || "",
            stage: res.leadsEntry.stage || "",
            status: res.leadsEntry.status || "",
            leadSource: res.leadsEntry.leadSource || "",
            zipCode: res.leadsEntry.zipCode || "",
            followUpDate: res.leadsEntry.followUpDate || "",
            state: res.leadsEntry.state || "",
            city: res.leadsEntry.city || "",
            address: res.leadsEntry.address || "",
            contact: this.formatMobileNumber(res.leadsEntry.contact),
            email: res.leadsEntry.email || "",
            currentStage: res.leadsEntry.currentStage || "",
            updatedBy: res.leadsEntry.updatedBy || "",
            updatedTime: this.formatDateTime(res.leadsEntry.updatedTime), // Convert to readable format
            leadId: res.leadsEntry.leadId || 0,
            followLeads: res.followLeads?.map((followup: any) => ({
              id: followup.id || 0,
              followupDate: followup.followupDate || "",
              followupTime: followup.followupTime || "",
              stage: followup.stage || "",
              status: followup.status || "",
              comments: this.stripHtmlTags(followup.comments || ""),
              followUpBy: followup.followUpBy || "",
              updatedTime: this.formatDateTime(followup.updatedTime),
              currentStage: followup.currentStage || "",
            })) || [],
          };
          this.element = this.CrmLeads;
        } else {
          console.warn("Unexpected API structure:", res);
        }
      },
      error: (err: any) => {
        console.error("Error fetching CRM leads:", err);
      },
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
    this.uploadSubmitted = true;
    if (this.uploadLead?.valid) {
      this.uploadSpinner = true;
      const formData = new FormData();
      formData.append('file', this.imageFileSrcData);
      formData.append('uploadedBy', 'Balakrishna');
      this.switchService.UploadCrmLeads(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.uploadSubmitted = false;
            this.uploadSpinner = false;
            this.uploadLead.reset();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.uploadSpinner = false;
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (err: any) => {
          this.uploadSpinner = false;
          this.toastr.error("Error fetching CRM Bulkupload leads", 'lead', {
            timeOut: 3000, positionClass: 'toast-top-right'
          });
        },
      })
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
      const formData = new FormData();
      formData.append('file', this.imageFileSrcData);
      formData.append('email', this.sendLeadForm.get('email')?.value);
      formData.append('template', this.sendLeadForm.get('template')?.value);
      formData.append('subject', this.sendLeadForm.get('subject')?.value);
      formData.append('cc', this.sendLeadForm.get('cc')?.value);
      formData.append('bcc', this.sendLeadForm.get('bcc')?.value);
      formData.append('content', this.sendLeadForm.get('content')?.value);

      this.switchService.CRMLeadSendMailFollowup(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.imageFileSrcData = '';
            modal.close();
            this.submitted = false;
            this.leadForm.reset();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })

    }
  }

  get e() {
    return this.followupLeadForm.controls;
  }

  followupLeadSubmit(modal: any) {
    this.followupLeadSubmitted = true;
    if (this.followupLeadForm?.valid) {
      this.followupLeadForm.patchValue({ followUpBy: this.executiveName });
      let followUpDetails = this.followupLeadForm.value;
      followUpDetails.leadEntry = { leadId: this.leadId };
      this.switchService.CRMAddFollowupLead(this.followupLeadForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.followupLeadSubmitted = false;
            this.followupLeadForm.reset();
            this.executiveName = '';
            this.followupName = '';
            this.leadId = 0;
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
    }
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
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
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

    if (this.selectedIdList.size == 0) {
      this.toastr.error('Please choose at least one', 'lead', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    }

    if (this.allocateForm?.valid && this.selectedIdList.size > 0) {
      this.allocateForm.patchValue({ idList: this.allocateForm });
      let allocateData = { idList: [...this.selectedIdList], executive: this.allocateForm.get('executive')?.value }
      this.switchService.CRMAllocateLeadExecutive(allocateData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.allocateSubmitted = false;
            this.allocateForm.reset();
            this.selectedIdList.clear();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })

    }
  }


  // Handle single row selection
  onRowCheckboxChange(leadId: number, event: any) {
    if (event.checked) {
      this.selectedIdList.add(leadId);
    } else {
      this.selectedIdList.delete(leadId);
    }
  }

  // Handle "select all" checkbox
  onSelectAllChange(event: any) {
    if (event.checked) {
      this.selectedIdList = new Set(this.dataSource.data.map((row: { leadId: any }) => row.leadId));
    } else {
      this.selectedIdList.clear();
    }
  }

  isAllSelected() {
    return this.selectedIdList.size === this.dataSource.data.length;
  }

  isIndeterminate() {
    return this.selectedIdList.size > 0 && this.selectedIdList.size < this.dataSource.data.length;
  }

  isSelected(leadId: number) {
    return this.selectedIdList.has(leadId);
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

  validateAndOpenBulkUpload(content: any): void {
    if (!this.stageLst || this.stageLst.length === 0) {
      this.toastr.warning('Please add at least one Stage before uploading.');
      return;
    }
  }

  VerticallyScrol(content12: any) { this.leadId = 0; this.submitted = false; this.leadForm.reset();
    this.modalService.open(content12, {
      backdrop: 'static',
      keyboard: false,
      scrollable: true,
      centered: true,
      size: 'xl',
    });
  }

  getCrmStages(): void {
    this.isStagesLoading = true;
    this.isAddStagesDisabled = true;
    const payload = {
      email: this.userData ? JSON.parse(this.userData).email : '',
      companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
      type: this.userData ? JSON.parse(this.userData).type : '',
      campaignId: "VCS_656A1747975029689",
    };
    this.switchService.CrmStages(payload).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          const stageObj = res[0];
          this.processStageData(res[0]);
          const stageKeys = Object.keys(stageObj).filter(key => /^f\d+$/.test(key));
          const firstStageKey = stageKeys.find(key => stageObj[key]?.trim() !== '');
          this.defaultStageName = firstStageKey ? stageObj[firstStageKey] : '';
          this.getCrmStatus();
        } else {
          this.stageLst = [];
        }
      },
      error: (err) => {
        this.toastr.error('Failed to fetch CRM stages.');
      },
    });
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
  
}
