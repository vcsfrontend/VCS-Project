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
import { RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule, MatSortModule,
    NgbDropdownModule, NgSelectModule, FilePondModule, AngularEditorModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig, NgbModal],

  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LeadsComponent extends BaseComponent {
  displayedColumns: string[] = ['select', 'slNo', 'action', 'name', 'executive', 'status', 'followUpDate', 'contact', 'email'];
  dataSource = new MatTableDataSource<any>();
  pageSize = 10;
  Crmusers: any[] = []; CrmLeads: any = {}; element: any = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template

  public leadForm!: FormGroup;
  public submitted = false;
  selectedCountry: string = 'India';
  public leadDetails: any = {};

  public uploadLead!: FormGroup;
  public uploadSubmitted = false;
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

  selectedIdList: Set<number> = new Set<number>();

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, public switchService: SwitherService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    super();
    this.userData = localStorage.getItem('userDetails');
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
    this.executiveName = element.executive;
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
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    //Lead Form Validatoin
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      companyName: [''],
      executive: [''],
      //products: [''],
      country: [''],
      stage: ['', [Validators.required]],
      status: ['', [Validators.required]],
      leadSource: [''],
      zipCode: ['', [Validators.required, Validators.minLength(6)]],
      followUpDate: [''],
      state: [''],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      leadId: [''],
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

    this.getCrmUsers();

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

  get f() {
    return this.leadForm.controls;
  }

  onSubmit(modal: any) {
    this.submitted = true;
    if (this.leadForm?.valid) {  // Optional chaining is a safety check
      this.leadDetails.name = this.f['name'].value;
      this.leadDetails.companyName = this.f['companyName'].value ? this.f['companyName'].value : '';
      this.leadDetails.executive = this.f['executive'].value;
      //this.leadDetails.products = this.f['products'].value;
      this.leadDetails.country = this.f['country'].value;
      this.leadDetails.stage = this.f['stage'].value;
      this.leadDetails.status = this.f['status'].value;
      this.leadDetails.leadSource = this.f['leadSource'].value;
      this.leadDetails.zipCode = this.f['zipCode'].value;
      this.leadDetails.followUpDate = this.f['followUpDate'].value;
      this.leadDetails.state = this.f['state'].value;
      this.leadDetails.city = this.f['city'].value;
      this.leadDetails.address = this.f['address'].value;
      this.leadDetails.contact = this.f['contact'].value;
      this.leadDetails.email = this.f['email'].value;
      this.leadDetails.leadId = this.f['leadId'].value;

      this.switchService.AddCrmLeads(this.leadDetails).subscribe({
        next: (res: any) => {
          if (res.status == true) {
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
            return "bg-secondary"; 
    }
  }



  onCountryChange(data: any) {
    this.leadForm.patchValue({ country: data });
  }


  getCrmUsers() {
    this.switchService.CrmLeads().subscribe({
      next: (res: any) => {
        if (res) {
          this.Crmusers = res;
          this.dataSource.data = res;
          this.leadCount = res.length;
          console.log(res);
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
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
      const formData = new FormData();
      formData.append('file', this.imageFileSrcData);
      formData.append('uploadedBy', 'Balakrishna');
      this.switchService.UploadCrmLeads(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.uploadSubmitted = false;
            this.uploadLead.reset();
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
            console.log(res);
            this.leadForm.patchValue(res.leadsEntry);
            this.leadForm.patchValue({contact:this.formatMobileNumber(res.leadsEntry.contact)});
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
            this.imageFileSrcData='';
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
            console.log(res);
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
    this.imageFileSrcData=files;
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
      let allocateData={idList:[...this.selectedIdList],executive:this.allocateForm.get('executive')?.value}
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
    defaultFontSize: '14',
    toolbarHiddenButtons: [['bold', 'italic']],
  };
}
