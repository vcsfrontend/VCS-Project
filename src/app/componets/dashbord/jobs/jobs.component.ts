import { Component,OnInit } from '@angular/core';
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
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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

};
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Mousewheel,
  Keyboard,
  EffectCube,
  EffectFade,
  EffectFlip,
  EffectCoverflow,
  SwiperOptions,
  Swiper,
  
 
} from 'swiper';
import { FormsModule } from '@angular/forms';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Mousewheel,
  Zoom,
  Autoplay,
  Thumbs,
  Keyboard,
  EffectCube,
  EffectFade,
  EffectFlip,
  EffectCoverflow,
]);

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [SharedModule,NgApexchartsModule,NgbDropdownModule,FormsModule,SwiperModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
    thumbsSwiper: any;
    setThumbsSwiper(swiper: any) {
        this.thumbsSwiper = swiper;
      }
    chartOptions:any = {
    series: [{
        name: "Views",
        data: [20, 38, 38, 72, 55, 63, 43]
    }],
    chart: {
        height: 220,
        type: 'line',
        zoom: {
            enabled: false
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: '#000',
            opacity: 0.1
        },
        toolbar: { show: false }
    },
    dataLabels: {
        enabled: false
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
        width: '1',
    },
    grid: {
        borderColor: '#f5f4f4',
        strokeDashArray: 3
    },
    colors: ["var(--primary-color)"],
    yaxis: {
        labels: {
            formatter: function (y:any) {
                return y.toFixed(0) + "";
            }
        }
    },
    xaxis: {
        type: 'week',
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
            show: true,
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
        labels: {
            rotate: -90
        }
    }
};
chartOptions1:any = {
  series: [{
      name: 'Applications',
      type: 'column',
      data: [23, 17, 22, 27, 13, 22, 37, 21, 44, 22, 45, 35]
  }, {
      name: 'Shortlisted',
      type: 'column',
      data: [17, 12, 18, 23, 10, 17, 25, 18, 35, 18, 37, 28]
  }, {
      name: 'Rejected',
      type: 'line',
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 27]
  },
  ],
  chart: {
      toolbar: {
          show: false
      },
      height: 315,
      type: 'line',
      stacked: false,
      fontFamily: 'Poppins, sans-serif',
  },
  grid: {
      borderColor: '#f5f4f4',
      strokeDashArray: 3
  },
  dataLabels: {
      enabled: false
  },
  title: {
      text: undefined,
  },
  xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  yaxis: [
      {
          show: true,
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: false,
              color: '#4eb6d0'
          },
          labels: {
              style: {
                  colors: '#4eb6d0',
              }
          },
          title: {
              text: undefined,
          },
          tooltip: {
              enabled: true
          }
      },
      {
          seriesName: 'Projects',
          opposite: true,
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: false,
          },
          labels: {
              style: {
                  colors: '#00E396',
              }
          },
          title: {
              text: undefined,
          },
      },
      {
          seriesName: 'Revenue',
          opposite: true,
          axisTicks: {
              show: true,
          },
          axisBorder: {
              show: false,
          },
          labels: {
              show: false,
          },
          title: {
              text: undefined,
          }
      },
  ],
  tooltip: {
      enabled: true,
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
    show: true,
    width: [5, 5, 1],
          curve: 'smooth',
  },
  plotOptions: {
      bar: {
          columnWidth: "20%",
          borderRadius: 3
      }
  },
  colors: ["var(--primary-color)", "rgb(69, 214, 91)", "rgb(231, 76, 60)"]
};
}
