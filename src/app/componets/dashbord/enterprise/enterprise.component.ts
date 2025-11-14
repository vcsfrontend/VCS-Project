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
import { MatTableDataSource } from '@angular/material/table';
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
  responsive: ApexResponsive[];
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-enterprise',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
    AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
    OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgApexchartsModule,
    NgbDropdownModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,NgSelectModule, ],
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
  templateUrl: './enterprise.component.html',
  styleUrl: './enterprise.component.scss'
})
export class EnterpriseComponent {
  displayedColumns: string[] = ['slNo', 'created', 'planPic', 'name', 'specName',  'city', 'modifiedTime', 'coverPic', 'Bom', 'Aux','designId', 'planId',  'status', 'renders' ]; // 'designPanoUrl' 'tagId', 'commName'

  dataSource = new MatTableDataSource<any>(); 
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  // @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>; 
  // @ViewChild('template', { static: true }) templateRef!: TemplateRef<any>;
  private modalRef: any;
  PjList : any[]=[]; furnitureData : any; ProjBasicInfo : any; BomLst : any; AuxList : any; Renders: any; 
  RoomFurData: any; showMore: boolean = false; tempList : any;
  externalUrl: string = "https://adonai.vcs.plus/api/saas/openapi/v2/redirect?url=https://adonai.vcs.plus/pub/tool/yundesign/cloud?%26redirecturl=/pub/saas/apps/project/list%26redirectbim=false&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb3VudHJ5IjoiSUwiLCJ0dSI6ZmFsc2UsImMiOjE3Mzc2MTcyMzY5MjcsInV0YyI6MiwiYXZhdGFyIjoiaHR0cHM6Ly9xaHN0YXRpY3NzbC5rdWppYWxlLmNvbS9uZXd0LzMyL2ltYWdlL3BuZy8xNTQ1MTIwNTA3NDAxL0YzQzJBNEE0NzU4RjE3REM2QzJBMzU1NzZDOUI5N0Y2LnBuZyIsImxvY2FsZSI6ImVuX1VTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl0sInNfaWQiOm51bGwsInZhbGlkYXRlZCI6ZmFsc2UsImFfaWQiOm51bGwsImlkIjoiM0ZPNEtLUFBWNERPIiwiZXhwIjoxNzM4MjIyMDM3LCJrX2lkIjoiM0ZPNEtLUFBWNERPIiwicl9pZCI6IjNGTzRLMEw3QTM1MiIsImVtYWlsIjoidHZPWktXMnFsVV9iYWxha3Jpc2huYUB2YXJtYWdyb3VwLmNvLmluIiwidXNlcm5hbWUiOiJCYWxha3Jpc2huYSJ9.9Sf8yuOHhhUlnK_cXG3YlPZmEQnC68BURnSt1PpZT0Q&locale=en_US"; // Full URL here
  
  constructor(private fb: FormBuilder, private http: HttpClient, private modalService: NgbModal,
    private toastr: ToastrService, public switchService: SwitherService, private dp: DatePipe,
    private router: Router) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(){
    this.getLst();
  }

  getSnos(index: number): number {
    return this.paginator ? index + 1 + this.paginator.pageIndex * this.paginator.pageSize : index + 1;
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1; 
  }

  getLst(){
    this.switchService.ProjectList().subscribe({ next: (res:any) => {
      if(res){
        this.PjList = res.values;
        this.tempList=res.values;
        this.dataSource.data = res.values;
        console.log(res);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  
  getProjectFurniture(data: any) { 
    console.log('roomdata',data);
    this.switchService.ProjFurniture(data.designId).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.furnitureData = res.map((room: any) => ({
              name: room.name,
              roomId: room.roomId,
              roomTypeId: room.roomTypeId,
              levelId: room.levelId,
              level: room.level,
              finfo: room.finfo.map((finfoItem: any) => ({
                furnitureName: finfoItem.name,
                angle: finfoItem.angle,
                y: finfoItem.coOrdinate?.y || null,
                x: finfoItem.coOrdinate?.x || null,
                furnitureId: finfoItem.furnitureId
              }))
          }));
        }
      },
    });
  }
  getProjBomList(data: any): void {
    this.switchService.ProjBomList(data.designId).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.position)) {
          this.BomLst = res.position.map((position: any) => ({
            totalCount: res.totalCount || "",
            count: res.count || "",
            hasMore: res.hasMore || "",
            brandName: position.brandName || "",
            name: position.name || "",
            type: position.type || "",
            largeImgUrl: position.largeImgUrl || "",
            imgUrl: position.imgUrl || "",
            prodUrl: position.prodUrl || "",
            quantity: Number(position.quantity) || 1,
            roomName: position.roomName || "",
            roomId: position.roomId || "",
            position: position.position || "",
            x: Number(position.size?.x) || 0,
            y: Number(position.size?.y) || 0,
            z: Number(position.size?.z) || 0,
          }));
          console.log("Mapped BomLst:", this.BomLst);
        } else {
          console.warn("Unexpected API structure:", res);
        }
      },
      error: (err: any) => {
        console.error("Error fetching project furniture:", err);
      },
    });
  }
  
  getProjBasicInfo(data: any) { 
    this.switchService.ProjBasicInfo(data.designId).subscribe({
        next: (res: any) => {
            if (res) {
                this.ProjBasicInfo = res.levelInfos.map((levelInfo: any) => ({
                    ...res.basicInfo, 
                    ...levelInfo    
                }));
                console.log(this.ProjBasicInfo);
            }
        },
        error: (err: any) => {
            console.error("Error fetching project furniture:", err); 
        }
    });
  }

  getAuxilaryCosts(data: any): void {
    this.switchService.AuxilaryCosts(data.designId).subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);
         if (res && Array.isArray(res[0].requestAuxilary)) {
          console.log('API Response:', res[0].requestAuxilary);
          this.AuxList = res[0].requestAuxilary.map((requestAuxilary: any) => ({
            roomName: res[0].roomName, 
            roomId: res[0].roomId,     
            totalPrice: res[0].totalPrice, 
            pricePerArea: res[0].pricePerArea, 
            itemNum: res[0].itemNum, 
            itemNumWithoutPrice: res[0].itemNumWithoutPrice, 
            assistantMaterialPrice: requestAuxilary.assistantMaterialPrice,
            labourPrice: requestAuxilary.labourPrice,
            totalPrice1: requestAuxilary.totalPrice,
            formatUnitPrice: requestAuxilary.formatUnitPrice,
            hasPrice: requestAuxilary.hasPrice,
            name: requestAuxilary.name,
            calType: requestAuxilary.calType,
            formatQuantity: requestAuxilary.formatQuantity,
            calTypeId: requestAuxilary.calTypeId
          }));
        } 
      },
      error: (err: any) => {
        console.error('Error fetching auxiliary costs:', err);
      }
    });
  }

  getRenderings(data: any): void {
    this.switchService.Renderings(data.designId).subscribe({
        next: (res: any) => {
            if (res && Array.isArray(res.rendersList)) {
              console.log('API Response:', res.rendersList);
              this.Renders = res.rendersList.map((rendersList: any) => ({
                count: res.count, 
                hasMore: res.hasMore,
                totalCount: res.totalCount,
                created: rendersList.created,
                img: rendersList.img,
                panoLink: rendersList.panoLink,
                picId: rendersList.picId,
                picType: rendersList.picType,
                picDetailType: rendersList.picDetailType,
                roomName: rendersList.roomName,
                level: rendersList.level,
                roomIndex: rendersList.roomIndex,
                roomTypeId: rendersList.roomTypeId,
              }));
            } else {
                console.warn('Unexpected API response structure or empty rendersList:', res);
            }
        },
        error: (err: any) => {
            console.error('Error fetching renderings:', err); // Debug log for API error
        }
    });
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore; // Toggle between true and false
  }

  updateDisplayedCards(): void {
  this.tempList=this.PjList;

    console.log('before',this.PjList);
    this.PjList = this.showMore ?  this.tempList?.slice(0, 4) : this.PjList;
    console.log('after',this.PjList);
  }

  openLg(content10:any) {
		this.modalService.open(content10, { size: 'lg' },);
	}

  VerticallyScrol(content12:any) {
    this.modalService.open(content12, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScroll(content13:any) {
    this.modalService.open(content13, {  scrollable: true,centered: true,size: 'xl' });
  }
  openScrollableContent(content14:any,roomData:any) {
    console.log('roodFurnite',roomData);
    this.RoomFurData=roomData;
		this.modalService.open(content14, { scrollable: true,centered: true,size: 'lg' });
	}
  VerticallyScrolling(content15:any) {
    this.modalService.open(content15, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScrolling2(content16:any) {
    this.modalService.open(content16, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScrolling3(content17:any) {
    this.modalService.open(content17, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScrolling4(content18:any) {
    this.modalService.open(content18, {  scrollable: true,centered: true,size: 'xl' });
  }
  chartOptions: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
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
      },
    },
    colors: ['var(--primary-color)'],
    stroke1: {
      width: [1],
    },
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
              opacity: 1,
            },
            {
              offset: 60,
              color: 'var(--primary02)',
              opacity: 0.1,
            },
          ],
        ],
      },
    },
  };
  chartOptions1: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
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
      },
    },
    colors: ['rgb(52, 152, 219)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions2: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
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
      },
    },
    colors: ['rgb(46, 204, 113)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions3: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
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
      },
    },
    colors: ['rgb(231, 76, 60)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions4: any = {
    series: [
      {
        name: 'Income',
        data: [44, 42, 57, 86, 58, 55, 70, 43, 23, 54, 77, 34],
      },
      {
        name: 'Expenses',
        data: [-34, -22, -37, -56, -21, -35, -60, -34, -56, -78, -89, -53],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      type: 'bar',
      fontFamily: "'Poppins', sans-serif",
      height: 380,
      stacked: true,
    },
    colors: ['var(--primary-color)', 'rgb(69, 214, 91)'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '22%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: ['6', '6'],
      curve: 'smooth',
    },
    legend: {
      show: true,
      position: 'top',
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
        offsetY: 0,
      },
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      tickAmount: 4,
    },
  };
  chartOptions5: any = {
    chart: {
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 1,
        color: '#fff',
        opacity: 0.05,
      },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Value',
        data: [54, 38, 56, 35, 65, 43, 53, 45, 62, 80, 35, 48],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis1: {
      axisBorder: {
        show: false,
      },
    },
    colors: ['rgba(243, 156, 18, 0.2)'],
    tooltip: {
      enabled: true,
    },
  };
  chartOptions6: any = {
    chart: {
      height: 150,
      width: 150,
      type: 'radialBar',
    },

    series: [48],
    colors: ['rgb(69, 214, 91)'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#4b9bfa',
            fontSize: '10px',
            show: false,
          },
          value: {
            offsetY: 5,
            color: '#4b9bfa',
            fontSize: '12px',
            show: true,
            fontWeight: 800,
          },
        },
      },
    },
    stroke: {
      lineCap: "round"
    },
    labels: ['Followers'],
  };
  chartOptions7:any= {
    series: [
      {
        name: "Recieved Income",
        type: "column",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6,5.6,6.6,7.8,9.7]
      },
      {
        name: "Pending Income",
        type: "column",
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5,9.5,10,8.6,7.6]
      },
      {
        name: "Revenue",
        type: "line",
        data: [20, 29, 37, 36, 44, 45, 50, 58,65,43,55,60]
      }
    ],
    colors:['#b94eed','#44c2e9','#f6c364'],
    chart: {
      height: 350,
      type: "line",
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [1, 1, 4]
    },
    title: {
      text: "XYZ - Stock Analysis (2009 - 2016)",
      align: "left",
      offsetX: 110
    },
    xaxis: {
      // categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
      categories: ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#9673e4"
        },
        labels: {
          style: {
            color: "#9673e4"
          }
        },
        title: {
          text: "Income (thousand crores)",
          style: {
            color: "#9673e4"
          }
        },
      
      },
      {
        
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#44c2e9"
        },
        labels: {
          style: {
            color: "#44c2e9"
          }
        },
        title: {
          text: "Operating Cashflow (thousand crores)",
          style: {
            color: "#44c2e9"
          }
        }
      },
      {
       
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#FEB019"
        },
        labels: {
          style: {
            color: "#FEB019"
          }
        },
        title: {
          text: "Revenue (thousand crores)",
          style: {
            color: "#FEB019"
          }
        }
      }
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      }
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40
    }
  };

}
