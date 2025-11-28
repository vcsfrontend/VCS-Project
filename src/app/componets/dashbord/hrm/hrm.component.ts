
import { Component, TemplateRef, ViewChild, ViewEncapsulation,} from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbModalRef, NgbModule,} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator, PageEvent  } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { ActivatedRoute,Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, flatMap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgbOffcanvas, OffcanvasDismissReasons,} from '@ng-bootstrap/ng-bootstrap';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import * as FilePond from 'filepond';
import { FilePondComponent, FilePondModule } from 'ngx-filepond';
import { AngularEditorModule, AngularEditorConfig,} from '@kolkov/angular-editor';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-hrm',
  standalone: true,
   imports: [ RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule, AngularFireDatabaseModule,
      CommonModule, MatFormFieldModule, MatSelectModule, AngularFirestoreModule, ToastrModule, SharedModule,
      MaterialModuleModule, MatSortModule, NgbDropdownModule, NgSelectModule, FilePondModule, AngularEditorModule,
      NgChartsModule,],
  templateUrl: './hrm.component.html',
  styleUrl: './hrm.component.scss'
})
export class HrmComponent extends BaseComponent{
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [ 'slNo', 'name', 'executive', 'followUpDate', 'contact', 'email', 'city','updatedTime',];
  userColors = [ 'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary', 'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark','bg-light', ];
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : ''; campaignName :any; leadList: any[] = []; currentStage : string =''; 
  sendProposalEnable : boolean= false; override cityList:any[]=[]; public leadCount = 0;
  taskPriorityList :any;taskList:any; pageIndex = 0; pageSize = 5;  data: any[] = []; 
  displayData: any[] = []; totalRecords: number = 0;
  statusCounts: { [key: string]: number } = {}; statusCompletion: { [key: string]: number } = {}; 
  nextLead: any = null;

 
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
  }

   ngOnInit(): void {
    this.getFetchLeadData();
   }


   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  campaignId= 'DUMMY9DD1748413866634';
  getFetchLeadData() {
    const payload = {
      page: this.pageIndex,
      size: 50,
      campaignId: this.campaignId,
      updatedBy: this.userEmail
    };
    this.switchService.fetchLeads(payload).subscribe({
      next: (res: any) => {
        const entryContent = res.entryList?.content || [];
        this.totalRecords = res.entryList?.totalElements || 0;
        this.leadList = entryContent;
        this.updateClientPagination(); 
      }
    });
  }

updateClientPagination() {
  const startIndex = 0;
  const endIndex = this.pageSize;

  this.displayData = this.leadList.slice(startIndex, endIndex);
  this.dataSource = new MatTableDataSource(this.displayData);
}


  onPageChange(event: PageEvent) {
    if (event.pageSize !== this.pageSize) {
      this.pageSize = event.pageSize;
      this.updateClientPagination();
      return;
    }
    if (event.pageIndex !== this.pageIndex) {
      this.pageIndex = event.pageIndex;
      this.getFetchLeadData(); 
    }
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

  
}
