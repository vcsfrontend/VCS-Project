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

  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LeadsComponent extends BaseComponent {
  displayedColumns: string[] = ['select', 'slNo', 'action', 'name', 'executive', 'status', 'followUpDate', 'contact', 'email'];
  usersColumns: string[] = ['slNo', 'name', 'role', 'email', 'date', 'callsAttempted', 'callsConnected',];
  dataSource = new MatTableDataSource<any>();
  usersDataSource = new MatTableDataSource<any>();
  pageSize = 10;
  Crmusers: any[] = []; CrmLeads: any = {}; element: any = {}; crmLeadsList : any;
  campaignId !: string; stageLst: any; isStagesLoading: boolean = true; isAddStagesDisabled: boolean = false;
  statusOptionsByStage: { [stageName: string]: any[] } = {}; statusLst: any; allStatuses: any;
  selectedStage: string = ''; checkboxStageOptions: any[] = [];
  chartOptions:any 
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) usersPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('sort2') sort2!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template

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

  public userData: any;
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
  VerticallyScrol(content12: any) {
    this.leadId = 0;
    this.submitted = false;
    this.leadForm.reset();
    this.modalService.open(content12, { backdrop: 'static', keyboard: false, scrollable: true, centered: true, size: 'xl' });
  }
  // openLg(content10:any) {
  //   this.modalService.open(content10, { size: 'lg' },);
  // }


  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];

  // FormControl for search and selection
  searchControl = new FormControl('');
  selectedOption = new FormControl('');
  filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.options);

  ngOnInit(): void {
    this.getCrmStages();
    this.route.queryParams.subscribe((params: any) => {
      this.campaignId = params['campaignId']?.trim() || '';
      console.log(this.campaignId)
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
    console.log('Campaign ID inside initLeadForm:', campaignId);
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      companyName: [''],
      executive: [''],
      products: [''],
      country: [''],
      stage: [''],
      status: [''],
      leadSource: [''],
      zipCode: [''],
      followUpDate: [''],
      state: [''],
      city: [''],
      address: [''],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      email: [''],
      leadId: [''],
      currentStage: [''],
      updatedBy: [JSON.parse(this.userData).username],
      updatedTime: [''],
      entryBy: [JSON.parse(this.userData).username],
      campaignId: [this.campaignId]
    });
    console.log('campaignId in form:', this.leadForm.get('campaignId')?.value);

  }
 

  get f() {
    return this.leadForm.controls;
  }

  onSubmit(modal: any) {
    this.leadForm.get('campaignId')?.setValue(this.campaignId);
    const payload = this.leadForm.value;  // Get the form values
    console.log('Add Lead Payload:', payload);
  
    this.submitted = true;
  
    if (this.leadForm?.valid) {
      console.log('Campaign ID from form:', payload.campaignId);
  
      // Make API call or further processing
      // this.switchService.AddCrmLeads(payload).subscribe({
      //   next: (res: any) => {
      //     if (res.status) {
      //       modal.close();
      //       this.submitted = false;
      //       this.leadForm.reset();
      //       this.getCrmLeads();
      //       this.toastr.success(res.message, 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
      //     } else {
      //       this.toastr.error(res.message, 'lead', { timeOut: 3000, positionClass: 'toast-top-right' });
      //     }
      //   },
      //   error: (error) => {
      //     this.toastr.error(error.statusText);
      //   },
      // });
    }
  }


  getCrmStages(): void {
    this.isStagesLoading = true;
    this.isAddStagesDisabled = true;
    const payload = {
      email: this.userData ? JSON.parse(this.userData).email : '',
      companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
      type: this.userData ? JSON.parse(this.userData).type : '',
    };

    this.switchService.CrmStages(payload).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res) && res.length > 0) {
          const stageObj = res[0];
          const extractedStages = [];
          for (let i = 1; i <= 25; i++) {
            const key = `f${i}`;
            if (stageObj[key] && stageObj[key].trim() !== "") {
              extractedStages.push({ stageName: stageObj[key].trim() });
            }
          }
          this.stageLst = extractedStages;
          console.log(extractedStages);
          this.getCrmStatus(); 
          this.isAddStagesDisabled = this.stageLst.length > 0;
        }
        else {
          this.stageLst = [];
          this.isAddStagesDisabled = false;
        }
        this.isStagesLoading = false;
      },
      error: (error) => {
        console.error('CRM Stages Error:', error);
        this.toastr.error(error.statusText || 'Something went wrong while fetching stages.');
      },
    });
  }

  getCrmStatus(): void {
    let completedRequests = 0;
    for (let i = 0; i < this.stageLst.length; i++) {
      const payload = {
        email: this.userData ? JSON.parse(this.userData).email : '',
        companyCode: this.userData ? JSON.parse(this.userData).companyCode : '',
        type: this.userData ? JSON.parse(this.userData).type : '',
        stage: this.stageLst[i].stageName,
      };
      const fields = Array.from({ length: 25 }, (_, i) => `f${i + 1}`);
      this.switchService.CrmStatus(payload).subscribe({
        next: (res: any) => {
          const options = Array.isArray(res) ?
            fields
              .filter(field => res[0][field]) // skip empty values
              .map(field => ({
                name: res[0][field],
                checked: false,
                isCustom: false
              }))
            : [];

          this.statusOptionsByStage[this.stageLst[i].stageName] = (options);
        },
        error: (error) => {
          const errorMessage = error.statusText || 'Something went wrong while fetching stages.';
          this.toastr.error(errorMessage);
          this.statusOptionsByStage[this.stageLst[i].stageName] = [];
          console.error('Error fetching CRM status:', error);
        },
        complete: () => {
          completedRequests++;
          if (completedRequests === this.stageLst.length) {
            this.statusLst = Object.entries(this.statusOptionsByStage)
              .filter(([key]) => key.trim() !== "")
              .map(([stage, fields]) => ({
                stage,
                fields
              }));
              this.allStatuses = this.statusLst
                .flatMap((group: { stage: string; fields: { name: string }[] }) =>
                  group.fields.map((f: { name: string }) => ({
                    name: f.name,
                    stage: group.stage
                  }))
                );
            console.log(this.statusLst);
            console.log(this.statusOptionsByStage);
          }
        }
      });
    }

  }
  
  onStageChange(): void {
    const selectedStage = this.leadForm.get('stage')?.value;
    console.log('Selected Stage:', selectedStage);
    this.checkboxStageOptions = this.statusOptionsByStage[selectedStage] || [];
  
    if (selectedStage === 'In Progress Leads') {
      this.setInProgressStatus();
    }
    this.leadForm.get('status')?.setValue(null);
  }
  


  setInProgressStatus(): void {
    console.log('Setting In Progress Status...');
    const inProgressStatus = this.checkboxStageOptions.find(option => option.name === 'In Progress');

    if (inProgressStatus) {
      inProgressStatus.checked = true;
      console.log('In Progress Status selected:', inProgressStatus);
    }
  }
  
  

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case "active":
        return "badge bg-success-transparent ps-3 fs-11 order-status complete ";
      case "proposal sent":
        return "badge bg-warning-transparent ps-3 fs-11 order-status pending";
      case "meeting fixed":
        return "badge bg-dark-transparent ps-3 fs-11 order-status going";
      case "met":
        return "badge bg-primary-transparent ps-3 fs-11 order-status live";
      case "spoke":
        return "badge bg-purple-transparent ps-3 fs-11 order-status spoke";
      case "closed":
        return "badge bg-danger-transparent ps-3 fs-11 order-status cancel";
      case "converted to deal/opportunity":
        return "badge bg-primar-transparent ps-3 fs-11 order-status  live ";
      default:
        return "";
    }
  }

  filterStatusList(event: any): void {
    console.log('Chart Clicked:', event);

    const activePoints = event.active;

    if (activePoints && activePoints.length > 0) {
      const chartElement = activePoints[0];      
      const index = chartElement.index;       
      const label = this.pieChartLabels[index];
      console.log('Label:', label); 
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

          // Assign to `element` for template binding
          this.element = this.CrmLeads;

          console.log("Mapped CrmLeads:", this.CrmLeads);
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
    console.log('View clicked for:', element);
  }

  editLead(element: any, content12: any) {
    console.log('View clicked for:', element);
    if (element.leadId) {
      //this.leadId = element.leadId;
      this.switchService.ViewCrmLeads(element.leadId).subscribe({
        next: (res: any) => {
          if (res.leadsEntry) {
            this.leadForm.patchValue(res.leadsEntry);
            this.leadForm.patchValue({ contact: this.formatMobileNumber(res.leadsEntry.contact) });
            this.modalService.open(content12, { scrollable: true, centered: true, size: 'xl' });

          } else {
            this.toastr.error(res.message);
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })
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
      console.log(this.imageFileSrcData);
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
      console.log(followUpDetails);
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
    console.log("FilePond has initialised");
  }
  followUpPondHandleAddFile(event: any) {
    this.imageFileSrcData = '';
    const files = event.target.files[0];
    this.imageFileSrcData = files;
    console.log("A file was added", event);
  }
  followUpPondHandleActivateFile(event: any) {
    console.log("A file was activated", event);
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
    console.log("FilePond has initialised");
  }
  pondHandleAddFile(event: any) {
    console.log("A file was added", event);
  }
  pondHandleActivateFile(event: any) {
    console.log("A file was activated", event);
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
  
}
