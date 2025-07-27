import { Component, TemplateRef, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbModalConfig,NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule,NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../shared/prismData/advancedUi/models'
import { CommonModule, DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FlatpickrModule, FlatpickrDefaults } from 'angularx-flatpickr';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { ShowCodeContentDirective } from '../../../shared/directives/show-code-content.directive';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatButtonModule } from '@angular/material/button'; 
import { SwitherService } from '../../../shared/services/swither.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CoolTheme, data } from '../../../componets/charts/echart-charts/echarts';
import { MatCommonModule } from '@angular/material/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import * as echarts from 'echarts';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ChartComponent,
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
import { SharedModule } from '../../../shared/common/sharedmodule';
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
  selector: 'app-superadmin',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,AngularFireModule,
    AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
    AngularFirestoreModule,ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
    OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgbTooltipModule,
    NgbPopoverModule,NgApexchartsModule, NgbDropdownModule,MatCommonModule, NgxEchartsModule,NgSelectModule],
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, 
    FlatpickrDefaults, DatePipe, NgbModalConfig, NgbModal,
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: echarts }),
    },],
  templateUrl: './superadmin.component.html',
  styleUrl: './superadmin.component.scss'
})
export class SuperadminComponent {
  displayedColumns: string[] = ['slNo', 'firstName', 'lastName', 'mobile', 'adonai', 'crm', 'action', 'view', 'edit', 'loginTime', 'logoutTime' ];
  displayAdonaiColumns: string[] = ['slNo', 'email', 'history'];
  displayCrmColumns: string[] = ['slNo', 'email', 'history'];
  salesDisplayColumns: string[] = ['slNo','email', 'roleId', 'subRole', 'status', 'userName', 'createdAt'];
  dataSource = new MatTableDataSource<any>(); 
  adonaiSource = new MatTableDataSource<any>(); 
  crmSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template
  @ViewChild('template', { static: true }) templateRef!: TemplateRef<any>;
  @ViewChild('salesPaginator') salesPaginator!: MatPaginator;
  salesDataSource = new MatTableDataSource<any>();
  private modalRef: any;
  content3: any; content4: any; content5: any; content6: any; content7: any;
  userLst:any; userData: any; adonaiHstryLst: any; crmHstryLst: any;
  firstNm: any; lastNm: any; companyNm: any; phoneNo: any; dob: any;
  adonaiData: any; crmData: any;  adonaiSalesPerson: any; adonaiDiscount: any;
  adonaiEmail: any; adonaiRoleId: any; isAdonai: any; adonaiActivitySts:any; 
  adonaiAccountManager : any; adonaiManager : any;
  salesPerson : any; discount : any;  accountManager : any; manager : any;
  adonaiSubStartDate: any; adonaiSubEndDate: any; adonaiSubDate: any; adonaiRemarks: any; 
  adonaiAppUid: any; adonaiUsername: any; adonaiCity: any; adonaiUpdatedBy: any; adonaiUpdatedDate: any;
  crmEmail: any; crmRoleId: any; isCrm: any; crmStatus: any; crmSubStartDate: any; crmSubEndDate: any; 
  crmSubDate: any; crmRemarks: any; crmUsername: any; crmCity:any; crmUpdatedBy: any;
  isAdonaiView = false; isCrmView = false; userNm: any;
  isCrmTrue: any; type: any; users: any; email: any; username: any; country: any; isAdonaiTrue: any;
  dbData: any = {}; isSts:boolean =true;  salesDesignationForm! : FormGroup;  subRole: any; status:any;
  userDataStorage = localStorage.getItem('userDetails');
  salesData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.salesData ? this.salesData.email : '';
  userName: string = this.salesData ? this.salesData.username : ''; salesOptions: any;
  totalUsers = 896; 
  newUser: string = '';
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
chartOptions1:any = {
  series: [44, 55, 13, 43],
  chart: {
    heght:250,
    width:250,
      type: "pie",
  },
  colors: ["var(--primary08)", "rgba(69, 214, 91, 0.8)", "rgba(243, 156, 18, 0.8)", "rgba(231, 76, 60, 0.8)"],
  labels: ["Mobile", "Desktop", "Laptop", "Tablet"],
  legend: {
      show: false,
  },
  stroke: {
      width: 0
  },
  dataLabels: {
      enabled: true,
      dropShadow: {
          enabled: false,
      },
  },
};
chartOptions2:any = {
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
  colors: ["rgb(69, 214, 91)"],

  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.5,
      opacityTo: 0.2,
      stops: [0, 60],
    }
  },
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
  colors: ["rgb(231, 76, 60)"],

  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.5,
      opacityTo: 0.2,
      stops: [0, 60],
    }
  },
};
chartOptions4:any = {
  series: [
    {
      name: "Sales",
      data: [15, 30, 22, 49, 32, 45, 30, 45, 65, 45, 25, 45],
    },
    {
      name: "Refunds",
      data: [8, 40, 15, 32, 45, 30, 20, 25, 18, 23, 20, 40],
    }
  ],
  chart: {
    type: "area",
    height: 318,
    toolbar: {
      show: false
    }
  },
  colors: [
    "var(--primary-color)",
    "rgb(69, 214, 91)",
  ],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
      colorStops: [
        [
          {
            offset: 0,
            color: "var(--primary01)",
            opacity: 50
          },
          {
            offset: 75,
            color: "var(--primary01)",
            opacity: 0.1
          },
          {
            offset: 100,
            color: 'transparent',
            opacity: 0.1
          }
        ],
        [
          {
            offset: 0,
            color: 'rgba(69, 214, 91, 0.1)',
            opacity: 1
          },
          {
            offset: 75,
            color: 'rgba(69, 214, 91, 0.1)',
            opacity: 0.1
          },
          {
            offset: 100,
            color: 'transparent',
            opacity: 1
          }
        ],
      ]
    }
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: true,
    position: "top",
    offsetX: 0,
    offsetY: 8,
    markers: {
      width: 5,
      height: 5,
      strokeWidth: 0,
      strokeColor: '#fff',
      fillColors: undefined,
      radius: 12,
      customHTML: undefined,
      onClick: undefined,
      offsetX: 0,
      offsetY: 0
    },
  },
  stroke: {
    curve: 'smooth',
    width: [1, 1],
    lineCap: 'round',
  },
  grid: {
    borderColor: "#edeef1",
    strokeDashArray: 2,
  },
  yaxis: {
    axisBorder: {
      show: true,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: true,
      borderType: "solid",
      color: "rgba(119, 119, 142, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      formatter: function (y: number) {
        return y.toFixed(0) + "";
      },
    },
  },
  xaxis: {
    type: "month",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ],
    axisBorder: {
      show: false,
      color: "rgba(119, 119, 142, 0.05)",
      offsetX: 0,
      offsetY: 0,
    },
    axisTicks: {
      show: false,
      borderType: "solid",
      color: "rgba(119, 119, 142, 0.05)",
      width: 6,
      offsetX: 0,
      offsetY: 0,
    },
    labels: {
      rotate: -90,
    },
  },
};

chartOptions5:any = {
  series: [],
  labels: ["Male", "Female"],
  chart: {
    height: 255,
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
            formatter: function (val: string) {
              return val + "%"
            }
          },
          total: {
            show: true,
            showAlways: true,
            label: 'Total',
            fontSize: '22px',
            fontWeight: 300,
            color: '#495057',
          }

        }
      }
    }
  },
  colors: ["var(--primary-color)", "rgba(69, 214, 91, 1)"],

};
chartOptions6:any= {
  series: [
    {
      name: "New Customers",
      data: [12, 20, 16, 21, 17, 22],
    },
    {
      name: "Return Customers",
      data: [20, 12, 14, 12, 19, 15],
    },
  ],
  chart: {
    type: "line",
    height: 125,
    toolbar: {
      show: false
    }
  },
  colors: [
    "var(--primary-color)",
    "rgb(69, 214, 91)"
  ],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    curve: 'smooth',
    width: [1, 1]
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (y:any) {
        return y.toFixed(0) + "";
      },
    },
  },
  xaxis: {
    show: false,
    type: "month",
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    labels: {
      show: false,
    },
  },
};

  public salesSubmitted = false; 
  constructor(config: NgbModalConfig, private modalService: NgbModal, private viewContainerRef: ViewContainerRef,
    public switchService: SwitherService, private toastr: ToastrService, private dp: DatePipe ,private fb: FormBuilder, ) {
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  VerticalScrol(content3:any, element:any) {
		this.modalService.open(content3, { scrollable: true,centered: true });
    console.log('Data:', content3, element);
	}

  VerticallyScrol(content3:any) {
		this.modalService.open(content3, { scrollable: true,centered: true });
	}

  ngOnInit(){
    this.getUsers(); this.getInfo();
    this.getSalesUsers();  




    this.salesDesignationForm = this.fb.group({
      userId: [{ value: this.generateProductId(), disabled: true }],
      userName: [''],
      email: [''],
      roleId: [0],
      subRole: [''],
      status: [''],
      createdAt: new Date().toISOString()
    });

  }

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  onRowButtonClick(data: any) {
    console.log('Selected Row Data:', data);
    this.type = (+data.type)== 1 ? 'Individual' : 'Enterprise',
    this.users = data.noOfUsers,
    this.email = data.email,
    this.username = data.username,
    this.country = data.country,
    this.isAdonaiTrue = data.adonai,
    this.isCrmTrue = data.crm,
    this.firstNm = data.firstName,
    this.lastNm = data.lastName,
    this.companyNm = data.companyName,
    this.phoneNo = data.phoneNumber,
    this.dob = data.dob
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.adonaiSource.paginator = this.paginator1;
    this.crmSource.paginator = this.paginator2;
    this.salesDataSource.paginator = this.salesPaginator;
  }  

  salesApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.salesDataSource.filter = filterValue.trim().toLowerCase();
  }

  getSnos(index: number): number {
    return this.paginator ? index + 1 + this.paginator.pageIndex * this.paginator.pageSize : index + 1;
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }
  
  // onClkRB(gI: number, crdtNteDtls: any) {
    // this.userLst.forEach((e:any) => { e.isChk = false}), this.lstGrid[gI].isChk = true;
    // this.crdtNteDtls = crdtNteDtls != '' ? crdtNteDtls: 0;
  // }
  
  getUsers(){
    this.switchService.getAllUsers().subscribe({ next: (res:any) => {
      if(res){
        this.userLst = res
        // this.dataSource = new MatTableDataSource<any>(res);
        this.dataSource.data = res;
        } else{
          this.toastr.error(res.message,'', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        }
      }
    })
  }
  
  getAdonai(data: any, ctrl: string =''){
    // this.userNm = data.username,
    ctrl == 'v' ? (this.isAdonaiView = true) : (this.isAdonaiView = false);
    this.switchService.onAdonaiView(data.email).subscribe({ next: (res:any) => {
      if(res){
        this.adonaiData = res,
        this.adonaiEmail = data.email,
        this.adonaiRoleId = res.subData.roleId,
        // this.isAdonai = res.email; 
        this.adonaiActivitySts = res.subData.activityStatus,
        // this.isSts = res.subData.activityStatus,
        this.adonaiSubStartDate = res.subData.subStartDate ? res.subData.subStartDate : '', 
        this.adonaiSubEndDate = res.subData.subEndDate ? res.subData.subEndDate : ''
        this.adonaiSubDate = res.subData.subscriptionDate ? this.dp.transform(res.subData.subscriptionDate, 'yyyy-MM-dd'): '', 
        this.adonaiRemarks = res.subData.remarks;
        this.adonaiAppUid = res.appuid;
        this.adonaiUsername = res.username;
        this.adonaiCity = res.city;
        this.adonaiSalesPerson = res.subData.salesPerson;
        this.adonaiDiscount = res.subData.discount;
        this.adonaiAccountManager = res.subData.accountManager;
        this.adonaiManager = res.subData.manager;
        } else{
          this.toastr.error(res.message);
          return;
        }
      }
    })
  }

  convertDate(date:any) {
    const [day, month, year] = date.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate; // Output: 2024-12-15
  }

  getCrm(data:any, ctrl:string = ''){
    // this.userNm = data.username,
    ctrl == 'v' ? (this.isCrmView = true) : (this.isCrmView = false);
    this.switchService.onCrmView(data.email).subscribe({ next: (res:any) => {
      if(res){
        this.crmData = res,
        this.crmEmail = data.email; 
        this.crmRoleId = res?.crmDataResponse?.roleId; 
        this.crmStatus = res?.crmDataResponse?.crmActivityStatus; 
        this.crmSubStartDate = res?.crmDataResponse?.subStartDate; 
        this.crmSubEndDate = res?.crmDataResponse?.subEndDate; 
        this.crmSubDate = res?.crmDataResponse?.subDate; 
        this.crmRemarks = res?.crmDataResponse?.remarks; 
        this.crmUsername = res?.username; 
        this.crmCity = res?.city; 
    // "crmDataResponse": {
    //     "roleId": 0,
    //     "crmActivityStatus": true,
    //     "subDate": "2024-10-16T13:58:58.969282899",
    //     "subStartDate": "",
    //     "subEndDate": "",
    //     "updatedBy": "",
    //     "updatedDate": "",
    //     "remarks": null
    // },
    // "email": "masteradonai@gmail.com",
    // "username": "adonai-master",
    // "city": null,
    // "companyname": "individual company",
    // "noOfUsers": 1
        } else{
          this.toastr.error(res.message);
          return;
        }
      }
    })
  }

  updateAdonai(modal:any){
    // this.submitted = true; 
    let payload = {
      "email": this.adonaiEmail,
      "roleId": this.adonaiRoleId,
      "activityStatus": this.adonaiActivitySts,
      "subscriptionDate": this.dp.transform(this.adonaiSubDate, 'dd-MM-yyyy'),
      "subStartDate": this.dp.transform(this.adonaiSubStartDate, 'yyyy-MM-dd'),
      "subEndDate": this.dp.transform(this.adonaiSubEndDate, 'yyyy-MM-dd'),
      "remarks": this.adonaiRemarks,
      "updatedBy": localStorage.getItem('username'),
      "salesPerson": this.adonaiSalesPerson,
      "discount": this.adonaiDiscount,   
      "accountManager": this.adonaiAccountManager,
      "manager": this.adonaiManager 
    };
    // payload.type = +payload.type, 
    // payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy');
    // if (this.signupFrm.invalid) {
    //   this.toastr.error('Please fill mandatory fields');
    //   this.btnDisable = false;
    //     return;
    // }
    // else{
    console.log('pl-',payload);
      this.switchService.onAdonaiUpdate(payload).subscribe({ next: (res:any) => {
        if(res.status == true){
          this.toastr.success(res.message);
          modal.close();
          } else {
            // this.btnDisable = false;
            this.toastr.error(res.message);
          }
        }
      })
    // }
  }

  updateCrm(){
    // this.submitted = true; 
    let payload = {
      "email": this.crmEmail,
      "roleId": this.crmRoleId,
      "crmActivityStatus": this.crmStatus,
      "subDate": this.dp.transform(this.crmSubDate, 'dd-MM-yyyy'),
      "subStartDate": this.dp.transform(this.crmSubStartDate, 'dd-MM-yyyy'),
      "subEndDate": this.dp.transform(this.crmSubEndDate, 'dd-MM-yyyy'),
      "remarks": this.crmRemarks,
      "updatedBy": localStorage.getItem('username')
    };

    // payload.type = +payload.type, 
    // payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy');
    // if (this.signupFrm.invalid) {
    //   this.toastr.error('Please fill mandatory fields');
    //   this.btnDisable = false;
    //     return;
    // }
    // else{
    console.log('crmPl-',payload);
      this.switchService.onCrmUpdate(payload).subscribe({ next: (res:any) => {
        if(res.status == true){
          this.toastr.success(res.message)
          } else {
            // this.btnDisable = false;
            this.toastr.error(res.message);
          }
        }
      })
    // }
  }

  getAdonaiHistory(data:any){
    this.switchService.adonaiHstry(data.email).subscribe({ next: (res:any) => {
      if(res){
        this.adonaiHstryLst = res,
        this.adonaiSource.data = res;
        console.log(res);
      } else{
        this.toastr.error(res.message,'', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          });
        }
      }
    })
  }

  getCrmHistory(data:any){
    this.switchService.crmHstry(data.email).subscribe({ next: (res:any) => {
      if(res){
        this.crmHstryLst = res,
        this.crmSource.data = res;
        console.log(res);
      } else{
        this.toastr.error(res.message,'', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          });
        }
      }
    })
  }

  onSalesUserSubmit(modal: any) {
    if (this.salesDesignationForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.salesSubmitted = true;
    const payload = this.salesDesignationForm.getRawValue();
    console.log(payload);
  
    this.switchService.saveSalesUsers(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success("User saved successfully!");
          this.modalService.dismissAll(modal);
          this.salesSubmitted = false;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the user.");
      }
    });
  }
  
  
  getSalesUsers() {
    this.switchService.allSalesUsers().subscribe({
      next: (res: any) => {
        this.salesDataSource.data = Array.isArray(res) ? res : [res];
        if (this.salesPaginator) this.salesDataSource.paginator = this.salesPaginator;
        this.salesOptions = Array.isArray(res) ? res : [res];
      },
      error: () => {
        this.toastr.error("Error fetching sales data");
        this.salesDataSource.data = [];
      }
    });
  }
  
  

  openLg(content10:any) {
		this.modalService.open(content10, { size: 'lg' },);
	}
  openLg2(content2:any) {
		this.modalService.open(content2, { scrollable: true, centered: true, },);
	}

  openMdl(template: TemplateRef<any>) {
    this.viewContainerRef.createEmbeddedView(template);
  }

  closeMdl() {
    this.viewContainerRef.clear();
  }  

  ReadMore:boolean = true

  //hiding info box
  visible:boolean = false


  //onclick toggling both
  onclick()
  {
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visible = !this.visible
  }
  
  getInfo() {
    // superAdminDbData
    this.switchService.superAdminDbData().subscribe({ next: (res:any) => {
      if(res){
        this.dbData = res;
        this.totalUsers = res.individualCount + res.enterpriseCount,
        this.chartOptions5.series = [res.individualCount, res.enterpriseCount];
        this.options25 = {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%',
          },
          series: [
            {
              name: 'Pressure',
              type: 'gauge',
              progress: {
                show: true,
              },
              detail: {
                valueAnimation: true,
                formatter: '{value}',
              },
              data: [
                {
                  value: this.totalUsers,
                  name: 'SCORE',
                },
              ],
            },
          ],
          color: ['#845adf'],
        };
      } else{
        this.toastr.error(res.message,'', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
          });
        }
      }
    })
    // this.dbData = {
    //   "totalUsers": 55,
    //   "totalUserAnalytics": 16.363636363636363,
    //   "totalNewUsers": 10,
    //   "totalNewAnalytics": 111.11111111111111,
    //   "revenueGenerated": 0,
    //   "revenueAnalytics": 0,
    //   "totalRenevalUsers": 0,
    //   "renevalUsersAnalytics": 0,
    //   "crmTotalUsers": 33,
    //   "crmTotalUserAnalytics": 27.272727272727273,
    //   "crmTotalNewUsers": 8,
    //   "crmTotalNewAnalytics": 88.88888888888889,
    //   "crmRevenueGenerated": 0,
    //   "crmRevenueAnalytics": 0,
    //   "crmTotalRenevalUsers": 0,
    //   "crmRenevalUserAnalytics": 0,
    //   "adonaiTotalUsers": 30,
    //   "adonaiTotalUserAnalytics": 30,
    //   "adonaiTotalNewUsers": 8,
    //   "adonaiTotalNewAnalytics": 30,
    //   "adonaiRevenueGenerated": 0,
    //   "adonaiRevenueAnalytics": 0,
    //   "adonaiTotalRenevalUsers": 0,
    //   "adonaiRenevalUserAnalytics": 0,
    //   "individualCount": 44,
    //   "enterpriseCount": 11,
    //   "adonaiData": [
    //     { "count": 12,"city": "Bangalore"},
    //     { "city": "Chennai", "count": 11 },
    //     { "city": "Delhi", "count": 4 },
    //     { "city": "Hyderabad", "count": 3 }
    //   ],
    //   "crmData": [
    //     { "count": 15, "city": "Bangalore" },
    //     { "city": "Chennai", "count": 11 },
    //     { "city": "Delhi", "count": 4 },
    //     { "city": "Hyderabad", "count": 3 },
    //     { "city": "Mumbai", "count": 5 },
    //     { "city": "Bangalore", "count": 2 },
    //     { "city": "Kolkata", "count": 8 }
    //   ]
    // }
  }
  showCrmFullDetails:boolean = false;
  showAdonaiFullDetails:boolean = false;
  toggleCrmFullDetails(): void {
    this.showCrmFullDetails = !this.showCrmFullDetails;
  }

  toggleAdonaiFullDetails(): void {
    this.showAdonaiFullDetails = !this.showAdonaiFullDetails;
  }

  productGetSNo(index: number): number {
    if (this.salesPaginator && this.salesPaginator.pageIndex !== undefined && this.salesPaginator.pageSize !== undefined) {
      return this.salesPaginator.pageIndex * this.salesPaginator.pageSize + index + 1;
    }
    return index + 1;
  }

  options25: EChartsOption = { };
  
}