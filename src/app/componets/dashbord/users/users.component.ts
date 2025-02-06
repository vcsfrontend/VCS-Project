import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke,
  ApexYAxis, ApexTitleSubtitle, ApexLegend, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import { FilePondOptions } from 'filepond';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbDropdownModule,NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import { ShowCodeContentDirective } from '../../../shared/directives/show-code-content.directive';
import { BaseComponent } from '../../../shared/base/base.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormArray,  } from '@angular/forms'  
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NgbOffcanvas, OffcanvasDismissReasons,} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule, AngularFireModule,
      AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
      AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
      OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgApexchartsModule,
      NgbDropdownModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,NgSelectModule, MatTableModule,MatSortModule],
    providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  displayedColumns: string[] = ['slNo', 'id', 'city', 'firstName', 'username', 'crmActivityStatus', 'email', 'phone', 'country'];
  leadForm: FormGroup;
  leads: any[] = [];
  dataSource = new MatTableDataSource<any>(); 
  pageSize = 10;
  Crmusers : any;
  @ViewChild('paginator') paginator!: MatPaginator;
  //@ViewChild('sort') sort!: MatSort;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor( public switchService: SwitherService, private toastr: ToastrService,
    private modalService: NgbModal, private offcanvasService: NgbOffcanvas,private fb: FormBuilder) {
      this.leadForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],  // Required, Min 3 chars
        companyName: ['', Validators.required],  // Required
        executive: ['', Validators.required],  // Required
        products: ['', Validators.required],  // Required
        country: ['', Validators.required],  // Required
        stage: ['', Validators.required],  // Required
        status: ['', Validators.required],  // Required
        leadSource: ['', Validators.required],  // Required
        zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],  // Only numbers, 5-6 digits
        followUpDate: ['', Validators.required],  // Required
        state: ['', Validators.required],  // Required
        city: ['', Validators.required],  // Required
        address: ['', Validators.required],  // Required
        contact: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],  // 10-12 digit phone number
        email: ['', [Validators.required, Validators.email]],  // Valid email format
        currentStage: ['', Validators.required],  // Required
        updatedBy: ['', Validators.required],  // Required
        updatedTime: ['', Validators.required],  // Required
        leadId: [0]  // Default value
      });
  }

  addLead() {
    if (this.leadForm.invalid) {
      this.toastr.error("Please fill all required fields correctly.", "Validation Error");
      this.leadForm.markAllAsTouched(); // Highlight all invalid fields
      return;
    }
  
    const newLead = this.leadForm.value;
    newLead.leadId = this.leads.length + 1; // Auto-increment ID
    this.leads.push(newLead);
  
    this.toastr.success("Lead added successfully!", "Success");
    this.leadForm.reset(); // Clear form after submission
  }
  

  editLead(lead: any) {
    this.leadForm.patchValue(lead); // Populate form with selected lead
  }

  deleteLead(leadId: number) {
    this.leads = this.leads.filter(lead => lead.leadId !== leadId);
  }

  ngOnInit()
  {
    this.getCrmUsers();
  }

  getCrmUsers(){
    this.switchService.CrmUsers().subscribe({ next: (res:any) => {
      if(res){
        this.Crmusers = res;
        this.dataSource.data = res;
        console.log(res);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  
  openModal(content1:any) {
    this.modalService.open(content1,{ centered: true });
  }
  openRight(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }
  openRight1(content1: any) {
    this.offcanvasService.open(content1, { position: 'end' });
  }
  VerticallyScrol(content12:any) {
    this.modalService.open(content12, {  scrollable: true,centered: true,size: 'xl' });
  }
  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;    
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageIndex !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageIndex + index + 1;
    }
    return index + 1; 
  }

  // Pagination event handler
  pageEvent(event: any) {
    console.log('Page changed: ', event);
  }

  edit(element: any) {
    console.log('Edit clicked for:', element);
  }

  view(element: any) {
    console.log('View clicked for:', element);
  }

  delete(element: any) {
    console.log('Delete clicked for:', element);
  }

}


export interface Element {
  id: number;
  name: string;
  userId: number;
  email: string;
  reporting_to:string;
  status:string;
}