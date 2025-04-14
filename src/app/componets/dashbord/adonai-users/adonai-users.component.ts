import { Component ,ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import {  NgxEchartsModule } from 'ngx-echarts';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
 tooltip: ApexTooltip;
 plotOptions: ApexPlotOptions;
 responsive: ApexResponsive[];
 fill:ApexFill;
 grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
curve:string

};

@Component({
  selector: 'app-adonai-users',
  standalone: true,
  imports: [SharedModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
      MatPaginator, MatPaginatorModule,  MatSort, MatSortModule, MatTableModule, NgApexchartsModule 
      ,NgxEchartsModule, ToastrModule,CommonModule],
  providers: [{ provide: ToastrService, useClass: ToastrService }, ],
  templateUrl: './adonai-users.component.html',
  styleUrl: './adonai-users.component.scss'
})
export class AdonaiUsersComponent {

  adonaiUsersDisplayedColumn: string[] = ['slNo', 'email', 'phoneNumber', 'adonai', 'adonaiSubStartDate', 'adonaiSubEndDate', 'roleId', 'manager', 'salesPerson', 'accountManager', ];

  adonaiUsersDataSource = new MatTableDataSource<any>();
  @ViewChild('adonaiUsersPaginator') adonaiUsersPaginator!: MatPaginator;
  toastr: any;  subroleId = 7; userLst:any; selectedUser: any; adonaiData: any;
  adonaiEmail: any; adonaiRoleId: any; isAdonai: any; adonaiActivitySts:any; 
  adonaiSubStartDate: any; adonaiSubEndDate: any; adonaiSubDate: any; adonaiRemarks: any; 
  adonaiAppUid: any; adonaiUsername: any; adonaiCity: any; 
  adonaiSalesPerson: any;
  adonaiDiscount: any;
  adonaiAccountManager: any;
  adonaiManager: any;   combinedUserList: any[] = [];

  
  constructor(public switchService: SwitherService, private modalService: NgbModal,) {
      
  }

  ngOnInit() {
    this.getUsersWithAdonai();
  }

  ngAfterViewInit() {
    this.adonaiUsersDataSource.paginator = this.adonaiUsersPaginator;
  }

  getSNo(index: number): number {
    if (this.adonaiUsersPaginator && this.adonaiUsersPaginator.pageIndex !== undefined && this.adonaiUsersPaginator.pageSize !== undefined) {
      return this.adonaiUsersPaginator.pageIndex * this.adonaiUsersPaginator.pageSize + index + 1;
    }
    return index + 1; 
  }

  stockApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.adonaiUsersDataSource.filter = filterValue.trim().toLowerCase();
  }

  openLg1(content1: any) {
    this.modalService.open(content1, { scrollable: true, centered: true, });
  }
  openLg2(content2: any) {
    this.modalService.open(content2, { scrollable: true, centered: true, });
  }

  getRoleName(roleId: number): string {
    const roleMap: { [key: number]: string } = {
      7: 'Free Trail',
      12: 'Basic',
      3: 'Pro',
      5: 'Elite'
    };
    return roleMap[roleId] || 'Unknown';
  }
  
  getRoleBadgeClass(roleId: number): string {
    switch (roleId) {
      case 7: 
        return 'badge bg-secondary-transparent ps-3 fs-11 order-status';
      case 12: 
        return 'badge bg-info-transparent ps-3 fs-11 order-status';
      case 5: 
        return 'badge bg-success-transparent ps-3 fs-11 order-status complete';
      case 3: 
        return 'badge bg-warning-transparent ps-3 fs-11 order-status';
      default:
        return 'badge bg-danger-transparent ps-3 fs-11 order-status cancel';
    }
  }


  getUsersWithAdonai() {
    this.switchService.getAllUsers().subscribe({
      next: (users: any[]) => {
        if (users && users.length > 0) {
          const adonaiRequests = users.map(user =>
            this.switchService.onAdonaiView(user.email).pipe(
              map(adonaiData => {
                return {
                  ...user,
                  adonaiRoleId: adonaiData?.subData?.roleId,
                  adonaiActivitySts: adonaiData?.subData?.activityStatus,
                  adonaiSubStartDate: adonaiData?.subData?.subStartDate || '',
                  adonaiSubEndDate: adonaiData?.subData?.subEndDate || '',
                  adonaiRemarks: adonaiData?.subData?.remarks,
                  adonaiAppUid: adonaiData?.appuid,
                  adonaiUsername: adonaiData?.username,
                  adonaiCity: adonaiData?.city,
                  adonaiSalesPerson: adonaiData?.salesPerson,
                  adonaiDiscount: adonaiData?.discount,
                  adonaiAccountManager: adonaiData?.accountManager,
                  adonaiManager: adonaiData?.manager,
                };
              }),
              catchError(error => {
                console.error(`Adonai API failed for ${user.email}`, error);
                return of(user);
              })
            )
          );
          forkJoin(adonaiRequests).subscribe((finalList: any[]) => {
            this.combinedUserList = finalList;
            this.adonaiUsersDataSource.data = this.combinedUserList;
          });
        }
      },
      error: (err) => {
        this.toastr.error('Failed to load users');
      }
    });
  }


  onRowButtonClick(user: any) {
    console.log('User clicked:', user);
    this.selectedUser = user;
  }
  
  
  

  getAdonaiClass(adonai: boolean): string {
    return adonai ? "badge bg-success-transparent ps-3 fs-11 order-status complete " : "badge bg-danger-transparent ps-3 fs-11 order-status cancel";
  }
  
  getAdonaiText(adonai: boolean): string {
    return adonai ? 'Active' : 'Inactive';
  }
  

  chartOptions2:any = {
    series: [1454, 1234],
    labels: ["Male", "Female"],
    chart: {
      height: 250,
      type: 'donut'
    },
    dataLabels: {
      enabled: false,
    },
  
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'round',
      colors: "#fff",
      width: 0,
      dashArray: 0,
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        donut: {
          size: '99%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '20px',
              color: '#495057',
              offsetY: -4
            },
            value: {
              show: true,
              fontSize: '18px',
              color: undefined,
              offsetY: 8,
              formatter: function (val:any) {
                return val + "%"
              }
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '22px',
              fontWeight: 600,
              color: '#495057',
            }
  
          }
        }
      }
    },
    colors: ["var(--primary-color)", "rgba(69, 214, 91, 1)"],
  
  };

  chartOptions3:any = {
    series: [{
      data: [0, 32, 18, 58]
    }],
    chart: {
      height: 115,
      width: 180,
      type: 'area',
      fontFamily: 'Roboto, Arial, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return ''
          }
        }
      },
      marker: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [1],
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      }
    },
    colors: ["rgb(52, 152, 219)"],
  
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      }
    },
  };

  chartOptions1:any = {
    series: [{
      data: [0, 32, 18, 58]
    }],
    chart: {
      height: 115,
      width: 180,
      type: 'area',
      fontFamily: 'Roboto, Arial, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return ''
          }
        }
      },
      marker: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [1],
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      }
    },
    colors: ["rgb(231, 76, 60)"],
   
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
        colorStops: [
          [
            {
              offset: 0,
              color: 'rgba(231, 76, 60, 0.2)',
              opacity: 1
            },
            {
              offset: 60,
              color: 'rgba(231, 76, 60, 0.2)',
              opacity: 0.1
            }
          ],
        ]
      }
    },
  };

  chartOptions:any = {
    series: [{
      data: [0, 32, 18, 58]
    }],
    chart: {
      height: 115,
      width: 180,
      type: 'area',
      fontFamily: 'Poppins, Arial, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return ''
          }
        }
      },
      marker: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: [1],
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      }
    },
    colors: ["var(--primary-color)"],
  
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
        colorStops: [
          [
            {
              offset: 0,
              color: 'var(--primary02)',
              opacity: 1
            },
            {
              offset: 60,
              color: 'var(--primary02)',
              opacity: 0.1
            }
          ],
        ]
      }
    },
};
}

