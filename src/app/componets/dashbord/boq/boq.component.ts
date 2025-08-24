import { Component, ViewChild , AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../../../app/shared/common/sharedmodule';
import { NgbDropdownModule, NgbNavModule, NgbModal, NgbModalConfig, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MatCommonModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-boq',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule,MaterialModuleModule,CommonModule,ToastrModule,],
    providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
  templateUrl: './boq.component.html',
  styleUrl: './boq.component.scss'
})
export class BoqComponent {
   displayedColumns: string[] = ['slNo','elementUrl', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length','breadth','height','quantity','uom','draftQuantity','clientRate','finalAmount'];
    displayedClientProposal: string[] = ['slNo','ReferenceNo','ProposalRequestType', 'ProposalFor','CreatedBy','CreatedDate','Status', 'amount'];

    userDataStorage = localStorage.getItem('userDetails');
    userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
    userEmail: string = this.userData ? this.userData.email : '';
    userName: string = this.userData ? this.userData.username : '';
    userCompanyCode: string = this.userData ? this.userData.companyCode : '';
    userCompanyName: string = this.userData ? this.userData.companyName : '';
    userType: any = this.userData ? this.userData.type : ''; campaignName :any;selectedItem: any;
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort; 
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null;  designId : any; 
    boqList: any;
    categories = [
        { id: 1, name: 'Acoustic', code: 'AT' },
        { id: 2, name: 'BMS', code: 'BM' },
        { id: 3, name: 'Branding', code: 'BR' },
        { id: 4, name: 'Carpentry', code: 'CR' },
        { id: 5, name: 'CCTV & IT', code: 'IT' }
    ];
    prposaldataSource = new MatTableDataSource<any>([
    {
        slNo: 1,
        ReferenceNo: 'AD0001',
        ProposalRequestType: 'Proposal For New Order',
        ProposalFor: 'Sunil',
        CreatedBy: 'N. Bhavani Shankar',
        CreatedDate: '17 Nov 2024',
        Status: 'Approved',
        amount: 1200000
    },
    {
        slNo: 2,
        ReferenceNo: 'AD0002',
        ProposalRequestType: 'Proposal For Renovation',
        ProposalFor: 'Rajesh',
        CreatedBy: 'Admin',
        CreatedDate: '20 Nov 2024',
        Status: 'Pending',
        amount: 850000
    }
    ]);

    modal: any;
     constructor(// config: NgbModalConfig,
        private modalService: NgbModal, public switchService: SwitherService,
        private toastr: ToastrService,private offcanvasService: NgbOffcanvas) {}

    open(content: any) {
      this.modalService.open(content, { centered: true });
  }
  openDetails(content: any, element: any) {
  this.selectedItem = element;
  this.offcanvasService.open(content, { position: 'end', backdrop: true });
  }

  flatpickrOptions: any = {
      inline: true
  };

  ngOnInit(): void {
      this.boqData();
      this.flatpickrOptions = {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
      };
      flatpickr('#addignedDate', this.flatpickrOptions);
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSNo(index: number): number {
      if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
          return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
      }
      return index + 1;
  }

  boqData() {
    const payload = {
        email: this.userEmail,
        designId: "3FO3EWPJHYSK",
        bomRequired: true,
        wardrobeRequired: true,
        kbRequired: true
    };
    this.switchService.fetchBoqData(payload).subscribe({
        next: (res) => {
            const boqData = res?.boqData || {};
            this.tabKeys = Object.keys(boqData);
            this.tabKeys.forEach((key) => {
                const items = boqData[key] || [];
                this.boqDataSources[key] = new MatTableDataSource(
                    items.map((item: any, index: number) => ({
                        slNo: index + 1,
                        ...item
                    }))
                );
            });
        },
        error: () => {
            this.toastr.error('Something went wrong!');
        }
    });
  }
  setPaginatorAndSort(key: string) {
    if (this.boqDataSources[key]) {
    this.boqDataSources[key].paginator = this.paginator;
    this.boqDataSources[key].sort = this.sort;
    }
  }
  

}
