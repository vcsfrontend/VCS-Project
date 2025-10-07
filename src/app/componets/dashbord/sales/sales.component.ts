
import { Component,ElementRef,OnInit, Renderer2 } from '@angular/core';
import { NgbDropdownModule,NgbModal,NgbOffcanvas,NgbTooltipModule,NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import * as chartData from './chartjs';
import { NgChartsModule } from 'ng2-charts';
// C:\Users\LENOVO ADMIN\Project\VCS\src\app\shared\services
import { AuthService } from '../../../shared/services/auth.service';
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
  ApexTooltip,
  ApexPlotOptions,
  ApexFill
} from 'ng-apexcharts';

import { SharedModule } from '../../../shared/common/sharedmodule';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SwitherService } from '../../../shared/services/swither.service';
import { FormBuilder,FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { BaseComponent } from '../../../shared/base/base.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { EChartsOption } from 'echarts/types/dist/echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

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
  selector: 'app-sales',
  standalone: true,
  imports: [NgApexchartsModule,SharedModule,NgbTooltipModule ,NgbDropdownModule,NgSelectModule, 
    RouterModule, NgbModule, FormsModule, CommonModule, SharedModule, NgbDropdownModule, 
    ReactiveFormsModule, NgxEchartsModule, NgChartsModule],
  providers: [
      {
        provide: NGX_ECHARTS_CONFIG,
        useFactory: () => ({ echarts: echarts }),
      },
    ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
  
})
export class SalesComponent {
    public lineChartOptions = chartData.lineChartOptions;
    public lineChartData = chartData.lineChartData;
    public lineChartType = chartData.lineChartType;
    // Bar Chart 1
    public barChartOptions = chartData.barChartOptions;
    public barChartType = chartData.barChartType;
    public barChartLegend = chartData.barChartLegend;
    // public barChartPlugins = chartData.barChartPlugins;
    public barChartData = chartData.data1;
  
    //Doughnut and Pie Chart Data
    public PieChartData = chartData.data2;
    public PieChartOptions = chartData.PieChartOptions;
    public PieChartType = chartData.PieChartType;
    public DoughnutChartType = chartData.DoughnutChartType;
    //mixed Chart 2
    public barChart2Options = chartData.barChart2Options;
    public barChart2Type = chartData.barChart2Type;
    public barChart2Legend = chartData.barChart2Legend;
    public barChart2Plugins = chartData.barChart2Plugins;
    public barChart2Data = chartData.barChart2Data;
    //Polar Chart
    public polarChartOptions = chartData.polarChartOptions;
    public polarChartType = chartData.polarChartType;
    public polarChartData = chartData.polarChartData;
  
    //Radar Chart
    public radarChartOptions = chartData.radarChartOptions;
    public radarChartType = chartData.radarChartType;
    public radarChartData = chartData.radarChartData;
  
  public bubblechartOptions =chartData.bubblechartOptions;
  public  bubblechartType =chartData.bubblechartType;
  public bubblechartData =chartData.bubblechartData;
  
  // scattered chat
  public ScatterchartOptions =chartData.ScatterchartOptions;
  public scatterchartData= chartData.scatterchartData;
  public ScatterchartType=chartData.ScatterchartType
  users: any[] = []; userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: any = this.userData ? this.userData.type : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  adoanAiRole: any;campaignCount: any; 
  newUser: string = '';campaignList: any[] = [];campaignNameLst:any;public leadCounts: { [campaignId: string]: number } = {};
  stageCounts: { [campaignId: string]: { [stage: string]: number } } = {};totalLeadCount: any;
  selectedCampaignId: string | null = null;expandedStages: { [campaignId: string]: boolean } = {};
  userColors = [
    'bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary',
    'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark', 'bg-light'
  ];

  userList:any; filteredUserList: any[] = [];


  constructor(private elementRef: ElementRef, private renderer: Renderer2,
    private apiService: AuthService, private modalService: NgbModal, public switchService: SwitherService,
    private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {
    // super();
    const htmlElement =
      this.elementRef.nativeElement.ownerDocument.documentElement;
    this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;

  }
  ngOnInit(): void {
    this.getCampaignData();
    this.campaignList.forEach(campaign => {
      this.getLeadCountForCampaign(campaign.campgnId);
    });
    this.getUsers();
  }

  

  getCampaignData() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayCampaignData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.campaignList = res;
          if (this.campaignList.length > 0) {
            const firstCampaignId = this.campaignList[0].campgnId;
            this.selectCampaign(firstCampaignId);
          }
          this.campaignNameLst = res.map((c: any) => c.campaignName);
          this.campaignCount = this.campaignList.length;
          this.campaignList.forEach(campaign => {
            // this.getLeadCountForCampaign(campaign.campgnId);
          });
        } else {
          this.toastr.error("Unexpected response format.");
        }
      },
      error: (err) => {
        // this.toastr.error(err.statusText || "An error occurred while fetching data.");
      }
    });
  }
  
  getLeadCountForCampaign(campaignId: string) {
  this.switchService.FetchLeadData(this.userEmail, campaignId).subscribe({
    next: (res: any) => {
      const executiveList = res.executiveList || [];
      const entryList = res.entryList || [];
      const combined = [...executiveList, ...entryList];

      // total leads for this campaign
      this.leadCounts[campaignId] = combined.length;

      // stage-wise counts
      const stageMap: { [key: string]: number } = {};
      combined.forEach((lead) => {
        const stage = lead.stage || 'Unknown';
        stageMap[stage] = (stageMap[stage] || 0) + 1;
      });

      // save stage counts
      this.stageCounts[campaignId] = stageMap;

      // update global total
      this.updateTotalLeadCount();
    },
    error: () => {
      this.leadCounts[campaignId] = 0;
      this.stageCounts[campaignId] = {}; // clear stage counts on error
      this.updateTotalLeadCount();
    }
    });
  }

  updateTotalLeadCount() {
    this.totalLeadCount = Object.values(this.leadCounts).reduce((sum, count) => sum + count, 0);
  }


  selectCampaign(campaignId: string) {
    this.selectedCampaignId = campaignId;

  // If not already fetched, call API
    if (!this.leadCounts[campaignId]) {
      this.getLeadCountForCampaign(campaignId);
    }
  }

  toggleStages(campaignId: string | null) {
  if (!campaignId) return;

  // Always toggle expanded/collapsed
  this.expandedStages[campaignId] = !this.expandedStages[campaignId];
  }

  chartOptions12:any = {
  series: [{
      data: [17, 22, 37, 47, 39, 28, 14],
      name: 'Revenue',
  }],
  chart: {
      type: 'bar',
      height: 235,
      toolbar: {
          show: false
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 6,
          left: 6,
          blur: 3,
          color: '#000',
          opacity: 0.05
      },
  },
  plotOptions: {
      bar: {
          columnWidth: '35%',
          borderRadius: 4,
          horizontal: false,
          colors: {
              ranges: [{
                  from: 41,
                  to: Infinity,
                  color: "rgb(185, 78, 237)"
              },
              {
                  from: 0,
                  to: 40,
                  color: "rgba(185, 78, 237, 0.2)"
              }]
          },
      }
  },
  dataLabels: {
      enabled: false
  },
  grid: {
      show: false,
      borderColor: 'transparent',
      padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  xaxis: {
      categories: ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      colors: '#fff',
      axisBorder: {
          show: false
      },
      axisTicks: {
          show: false
      },
      labels: {
          rotate: -90,
          style: {
              fontFamily: 'Inter, sans-serif',
          },
      }
  },
  yaxis: {
      colors: '#fff',
      axisBorder: {
          show: false
      },
      axisTicks: {
          show: false
      },
      labels: {
          show: false
      }
  }
};

items = [
    { label: 'Scope Approval Awaited', count: 7 },
    { label: 'In Progress', count: 12 },
    { label: 'Completed', count: 5 },
    { label: 'On Hold', count: 3 },
    { label: 'Archived', count: 8 },
    { label: 'Scope Approval Awaited', count: 7 },
    { label: 'In Progress', count: 12 },
    { label: 'Completed', count: 5 },
    { label: 'On Hold', count: 3 },
    { label: 'Archived', count: 8 }
  ];

  scrollLeft(content: HTMLElement) {
    content.scrollBy({ left: -150, behavior: 'smooth' });
  }

  scrollRight(content: HTMLElement) {
    content.scrollBy({ left: 150, behavior: 'smooth' });
  }

  getUserColor(user: any): string {
    const index = this.hashString(user.email) % this.userColors.length;
    return this.userColors[index];
  }

  getUsers() {
    if (JSON.parse(this.userData).type == 2) {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
             this.filteredUserList = this.userList.filter(
              (user: any) => user.adonaiRole?.toUpperCase() !== 'ADMIN'
            );
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          // this.toastr.error(error.statusText);
        },
      })
    }
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  getProgressPercent(user: any): number {
    return user.total ? Math.round((user.completed / user.total) * 100) : 0;
  }

  getProgressColor(user: any): string {
    const percent = this.getProgressPercent(user);
    if (percent >= 75) return 'bg-success';
    else if (percent >= 50) return 'bg-warning';
    else return 'bg-danger';
  }

  chartOptions: any = {
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
  chartOptions1: any = {
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
  chartOptions2: any = {
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
  chartOptions3: any = {
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
  chartOptions4: any = {
    series: [
      {
        name: "Google Ads",
        data: [15, 30, 22, 49, 32, 45, 30, 45, 65, 45, 25, 45],
      },
      {
        name: "Facebook Ads",
        data: [8, 40, 15, 32, 45, 30, 20, 25, 18, 23, 20, 40],
      },
      {
        name: "Instagram Ads",
        data: [12, 35, 22, 28, 50, 33, 18, 27, 20, 25, 22, 38],
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
          [
            {
              offset: 0,
              color: 'rgba(117, 78, 197, 0.1)',
              opacity: 1
            },
            {
              offset: 75,
              color: 'rgba(117, 78, 197, 0.1)',
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

  chartOptions5: any = {
    series: [1654, 1234],
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
  chartOptions6: any = {
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
        formatter: function (y: any) {
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

  chartOptions7: any = {
    series: [76],
    chart: {
      type: 'radialBar',
      height: 290,
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#fff",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    colors: ["#845adf"],
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['Average Results'],
  };

  options25: EChartsOption = {
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
            value: 50,
            name: 'SCORE',
          },
        ],
      },
    ],
    color: ['#845adf'],
  };

  chartOptions9: any = {
      series: [
        {
          name: 'distibuted',
          data: [21, 22, 10, 28, 16, 21, 13, 30],
        },
      ],
      chart: {
        height: 335,
        type: 'bar',
        events: {
          click: function (chart: any, w: any, e: any) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        '#9673e4',
        '#44c2e9',
        '#f6c364',
        '#64c1f6',
        '#ea6d59',
        '#46c9a4',
        '#737ecf',
        '#b3768a',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [
          ['John', 'Doe'],
          ['Joe', 'Smith'],
          ['Jake', 'Williams'],
          'Amber',
          ['Peter', 'Brown'],
          ['Mary', 'Evans'],
          ['David', 'Wilson'],
          ['Lily', 'Roberts'],
        ],
        labels: {
          style: {
            colors: [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#546E7A',
              '#26a69a',
              '#D10CE8',
            ],
            fontSize: '12px',
          },
        },
      },
    };


}
