
import { Component,ElementRef,OnInit, Renderer2 } from '@angular/core';
import { NgbDropdownModule,NgbModal,NgbOffcanvas,NgbTooltipModule,NgbModule  } from '@ng-bootstrap/ng-bootstrap';

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
  imports: [NgApexchartsModule,SharedModule,NgbTooltipModule ,NgbDropdownModule,NgSelectModule, RouterModule, NgbModule, FormsModule, CommonModule, SharedModule, NgbDropdownModule, ReactiveFormsModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent {
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
constructor(private elementRef:ElementRef,private renderer:Renderer2,
  private apiService: AuthService,private modalService: NgbModal, public switchService: SwitherService,
      private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private fb: FormBuilder, private router: Router,
          private route: ActivatedRoute){
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
          this.campaignNameLst= res.map((c: any) => c.campaignName);
          console.log(this.campaignNameLst)
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





}
