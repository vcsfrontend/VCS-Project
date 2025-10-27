import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
import { elementAt, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule,
    NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
    NgApexchartsModule, MatPaginatorModule, MaterialModuleModule, CommonModule, ToastrModule,],
  providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {
  displayedColumns: string[] = ['slNo', 'elementUrl', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length', 'breadth', 'height', 'quantity', 'uom', 'draftQuantity', 'clientRate', 'finalAmount'];
  displayedClientProposal: string[] = ['slNo', 'ReferenceNo', 'ProposalRequestType', 'ProposalFor', 'CreatedBy', 'CreatedDate', 'Status', 'amount'];

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : ''; campaignName: any; selectedItem: any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('tabContainer', { static: false }) tabContainer!: ElementRef;

  tabKeys: string[] = []; boqDataSources: { [key: string]: any[] } = {};
  selectedCategory: any; editIndex: number | null = null; designId: any;
  totalRooms: number = 0;
  totalProducts: number = 0; userContentKeys: string[] = []; userContent: any = {};  
  totalPrice: number = 0; proposalStatus: string = ''; proposalContentDataSources: any;
  proposalTabCounts: any; showLeftArrow = false; showRightArrow = false;

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

  modal: any; chartOptions4: any;
  chartOptions1: any;
  selectedProposalContent: any;
  constructor(// config: NgbModalConfig,
    private modalService: NgbModal, public switchService: SwitherService,
    private toastr: ToastrService, private offcanvasService: NgbOffcanvas, private router: Router,
    private route: ActivatedRoute) {
    this.chartOptions1 = {
      series: [44, 55, 41, 17, 15],
      chart: {
        type: 'donut',
        height: 290
      },
      legend: {
        position: 'bottom'
      },
      colors: ["#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c"],
      dataLabels: {
        dropShadow: {
          enabled: false
        }
      },
    }
  }

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

    this.flatpickrOptions = {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
    };
    this.route.queryParams.subscribe(params => {
      const designId = params['designId'];
      const proposalContentId = params['proposalContentId'];
      if (designId && proposalContentId) {
        this.getProposalContent({
          designId,
          proposalContentId
        });
      }
    });
    flatpickr('#addignedDate', this.flatpickrOptions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkArrows();

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

  getProposalContent(element: any) {
    const payload = {
      designId: element.designId,
      proposalContentId: element.proposalContId || element.proposalContentId
    };
    this.switchService.fetchProposalContent(payload).subscribe({
      next: (res: any) => {
        this.selectedProposalContent = res;
        this.proposalStatus = res.proposalStatus;
        try {
          const parsedContent = JSON.parse(res.contentJs || "{}");
          this.userContent = JSON.parse(res.clientDataJs || "{}");
          this.userContentKeys = Object.keys(this.userContent);
          const flattened = Object.values(parsedContent).flat();
          this.userContentKeys = Object.keys(this.userContent);
          const uniqueFlattened = Array.from(
            new Map(flattened.map((item: any) => [item.boqId, item])).values()
          );
          this.boqDataSources = {};
          this.tabKeys = [];
          this.boqDataSources["All"] = uniqueFlattened;
          this.tabKeys.push("All");
          this.totalPrice = uniqueFlattened.reduce(
            (sum: number, item: any) =>
              sum + ((item.finalAmount && item.finalAmount > 0)
                ? item.finalAmount
                : (item.clientRate || 0) * (item.quantity || 0)),
            0
          );
          this.totalRooms = Object.keys(parsedContent).length;
          this.totalProducts = 0;
          this.totalPrice = 0;
          const roomTotals: { [key: string]: number } = {};
          this.proposalContentDataSources = {};
          this.proposalTabCounts = {};
          const roomKeys = Object.keys(parsedContent).filter(
            (k) => k !== 'All'
          );
          roomKeys.forEach((key) => {
            const items = parsedContent[key] || [];
            this.boqDataSources[key] = parsedContent[key] || [];
            this.tabKeys.push(key);
            this.proposalContentDataSources[key] = items.map(
              (item: any, index: number) => {
                const amount =
                  (item.clientRate || 0) * (item.quantity || 0);
                return {
                  slNo: index + 1,
                  calculatedAmount: amount,
                  ...item,
                };
              }
            );
            this.totalProducts += items.length;
            const roomTotal = items.reduce(
              (sum: number, item: any) =>
                sum +
                (item.finalAmount && item.finalAmount > 0
                  ? item.finalAmount
                  : (item.clientRate || 0) * (item.quantity || 0)),
              0
            );
            roomTotals[key] = roomTotal;
            this.totalPrice += roomTotal;
            this.proposalTabCounts[key] = items.length;
          });
          const allItems = Array.from(
            new Map(
              Object.values(parsedContent)
                .flat()
                .map((item: any) => [item.boqId, item])
            ).values()
          ).map((item: any, index: number) => ({
            ...item,
            slNo: index + 1,
          }));
          this.proposalContentDataSources['All'] = allItems;
          this.proposalTabCounts['All'] = allItems.length;
          const seriesData = [
            {
              name: 'Items Count',
              data: Object.keys(this.proposalContentDataSources).map((room) => {
                return {
                  x: room,
                  y: this.proposalContentDataSources[room].length,
                };
              }),
            },
          ];
          this.chartOptions4 = {
            ...this.chartOptions4,
            series: seriesData,
            chart: { type: 'bar' },
            xaxis: {
              type: 'category',
              title: { text: 'Rooms' },
            },
            yaxis: {
              title: { text: 'Items Count' },
            },
          };
        } catch (e) {
          this.boqDataSources = { All: [] };
          this.tabKeys = ["All"];
          this.totalPrice = 0;
          this.userContent = {};
          this.userContentKeys = [];
        }
      },
    });
  }

  getRoomTotal(roomKey: string): number {
    const items = this.boqDataSources[roomKey] || [];
    return items.reduce((sum, item) => {
      const amount = (item.finalAmount && item.finalAmount > 0)
        ? item.finalAmount
        : (item.clientRate || 0) * (item.quantity || 0);
      return sum + amount;
    }, 0);
  }



  quoteValidTill: Date = new Date('2025-09-30');
  scrollTabs(direction: 'left' | 'right') {
    const container = this.tabContainer.nativeElement;
    const scrollAmount = 150;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    setTimeout(() => this.checkArrows(), 300);
  }

  checkArrows() {
    const container = this.tabContainer?.nativeElement;
    if (!container) return;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }

}
