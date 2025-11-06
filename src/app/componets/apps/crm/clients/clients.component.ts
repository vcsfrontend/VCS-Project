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



@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule, MatSortModule,
    NgbDropdownModule, NgSelectModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig, NgbModal],

  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ClientsComponent extends BaseComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: string = this.userData ? this.userData.type : '';
  displayedColumns1: string[] = ['slNo', 'action', 'name', 'executive', 'status', 'followUpDate', 'contact', 'email'];
  displayedColumns: string[] = [ 'slNo', 'name', 'executive', 'followUpDate', 'contact', 'email', 'city','updatedTime','completionStatus',];
  dataSource = new MatTableDataSource<any>(); crmClientsList: any[] = [];
  pageSize = 10;clientCount:number=0;
  element: any = {};
  userColors = [ 'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark','bg-light', ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>; 
  
 
  public clientsCount = 0;
  public clientsId = 0;
  public clientForm!: FormGroup;
  public userList: any;


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
    this.clientsId = 0;   
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
    this.getCrmClients();
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
    this.clientForm = this.fb.group({
      date:[''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      companyname: [''],
      contact: ['', [Validators.required, Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      executive: [''],
      clientStages: ['', [Validators.required]],
      dealstatus: ['', [Validators.required]],
      dealSource: [''],
      followUpDate: [''],
      closuredate:[''],
      dealfor:[''],
      dealvalue:[0],
      Probability:[0],
      followuptime:[''],
      gstno:[''],
      description:[''],
      leadId: [''],
    });
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

  

  getCrmClients() {
    const payload = {
      status: "completed",
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType
    }
    this.switchService.crmClients(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.crmClientsList = res;
          this.clientCount=this.crmClientsList.length
          this.dataSource = new MatTableDataSource(this.crmClientsList);
        }
        if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
      }
    })
  }

  formatMobileNumber(mobile: any): string {
    if (!mobile) return "";
    return Number(mobile).toFixed(0); 
  }

  formatDateTime(dateTimeString: string): string {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-GB", { hour12: false }); // Converts to "11/02/2025, 09:45:18"
  }

  stripHtmlTags(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all HTML tags
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
}
