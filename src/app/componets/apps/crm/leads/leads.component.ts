import { Component, TemplateRef, ViewChild } from '@angular/core';
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
@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule,
    NgbDropdownModule, NgSelectModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig, NgbModal],

  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent extends BaseComponent {
  displayedColumns: string[] = ['slNo', 'phone',];
  dataSource = new MatTableDataSource<any>();
  Crmusers: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template

  public leadForm!: FormGroup;
  public submitted = false;
  selectedCountry: string = 'India';
  public leadDetails: any = {};

  public uploadLead!: FormGroup;
  public uploadSubmitted = false;
  imageFileSrcData: any;

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas, public switchService: SwitherService, private toastr: ToastrService, private fb: FormBuilder
  ) {
    super();
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
    this.modalService.open(content12, { scrollable: true, centered: true, size: 'xl' });
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
      products: [''],
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
    });

    //Upload Lead Validatoin
    this.uploadLead = this.fb.group({
      file: ['', [Validators.required]]     
    });

    this.getCrmUsers();
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

    //this.leadForm.markAllAsTouched();
    if (this.leadForm?.valid) {  // Optional chaining is a safety check
      this.leadDetails.name = this.f['name'].value;
      this.leadDetails.companyName = this.f['companyName'].value ? this.f['companyName'].value : '';
      this.leadDetails.executive = this.f['executive'].value;
      this.leadDetails.products = this.f['products'].value;
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

  onCountryChange(data: any) {
    this.leadForm.patchValue({ country: data });
  }

  getCrmUsers() {
    this.switchService.CrmUsers().subscribe({
      next: (res: any) => {
        if (res) {
          this.Crmusers = res;
          this.dataSource.data = res;
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
    console.log(event.target.files[0].type);
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

}
