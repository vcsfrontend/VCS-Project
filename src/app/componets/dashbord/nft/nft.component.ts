
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
 responsive: ApexResponsive[];
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
  selector: 'app-nft',
  standalone: true,
  imports: [SharedModule,NgApexchartsModule,NgbDropdownModule,FormsModule,SwiperModule],
  templateUrl: './nft.component.html',
  styleUrl: './nft.component.scss'
})
export class NftComponent {
  chartOptions:any = {
    series: [{
      name: "Price",
      data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80]
    }, {
      name: "Volume",
      data: [85, 65, 75, 38, 85, 35, 62, 40, 40, 64, 50, 89]
    }],
    chart: {
      height: 320,
      type: 'bar',
      zoom: {
        enabled: false
      },
    },
      plotOptions: {
          bar: {
              columnWidth: "20%",
          }
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
        show: true,
        width: 5,
        colors: ['transparent']
      },
      grid: {
          borderColor: '#f1f1f1',
          strokeDashArray: 3
      },
    colors: ["var(--primary-color)", "rgb(69, 214, 91)"],
    yaxis: {
      title: {
        text: 'Statistics',
        style: {
          color: '#adb5be',
          fontSize: '14px',
          fontFamily: 'poppins, sans-serif',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-label',
        },
      },
    },
    xaxis: {
      type: 'month',
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
    chart: {
        type: 'line',
        height: 20,
        width: 80,
        sparkline: {
            enabled: true
        },
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 3,
            color: '#000',
            opacity: 0.1
        }
    },
    grid: {
        show: false,
        xaxis: {
            lines: {
                show: false
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 1,
        dashArray: 0,
    },
    fill: {
        gradient: {
            enabled: false
        }
    },
    series: [{
        name: 'Value',
        data: [54, 38, 56, 24, 65]
    }],
    yaxis: {
        min: 0,
        show: false
    },
    xaxis: {
        show: false,
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        }
    },
    yaxis1: {
        axisBorder: {
            show: false
        },
    },
    colors: ['var(--primary-color)'],

}
chartOptions2:any = {
  chart: {
      type: 'line',
      height: 20,
      width: 80,
      sparkline: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.1
      }
  },
  grid: {
      show: false,
      xaxis: {
          lines: {
              show: false
          }
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: 0,
  },
  fill: {
      gradient: {
          enabled: false
      }
  },
  series: [{
      name: 'Value',
      data: [24, 54, 15, 42, 16]
  }],
  yaxis: {
      min: 0,
      show: false
  },
  xaxis: {
      show: false,
      axisTicks: {
          show: false
      },
      axisBorder: {
          show: false
      }
  },
  yaxis1: {
      axisBorder: {
          show: false
      },
  },
  colors: ['rgb(69, 214, 91)'],

}
chartOptions3:any  = {
  chart: {
      type: 'line',
      height: 20,
      width: 80,
      sparkline: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.1
      }
  },
  grid: {
      show: false,
      xaxis: {
          lines: {
              show: false
          }
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: 0,
  },
  fill: {
      gradient: {
          enabled: false
      }
  },
  series: [{
      name: 'Value',
      data: [15, 42, 16, 44, 24 ]
  }],
  yaxis: {
      min: 0,
      show: false
  },
  xaxis: {
      show: false,
      axisTicks: {
          show: false
      },
      axisBorder: {
          show: false
      }
  },
  yaxis1: {
      axisBorder: {
          show: false
      },
  },
  colors: ['rgb(243, 156, 18)'],

}
chartOptions4:any  = {
  chart: {
      type: 'line',
      height: 20,
      width: 80,
      sparkline: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.1
      }
  },
  grid: {
      show: false,
      xaxis: {
          lines: {
              show: false
          }
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: 0,
  },
  fill: {
      gradient: {
          enabled: false
      }
  },
  series: [{
      name: 'Value',
      data: [54, 38, 56, 24, 65]
  }],
  yaxis: {
      min: 0,
      show: false
  },
  xaxis: {
      show: false,
      axisTicks: {
          show: false
      },
      axisBorder: {
          show: false
      }
  },
  yaxis1: {
      axisBorder: {
          show: false
      },
  },
  colors: ['rgb(52, 152, 219)'],

}
chartOptions5:any = {
  chart: {
      type: 'line',
      height: 20,
      width: 80,
      sparkline: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.1
      }
  },
  grid: {
      show: false,
      xaxis: {
          lines: {
              show: false
          }
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: 0,
  },
  fill: {
      gradient: {
          enabled: false
      }
  },
  series: [{
      name: 'Value',
      data: [15, 42, 16, 44, 24 ]
  }],
  yaxis: {
      min: 0,
      show: false
  },
  xaxis: {
      show: false,
      axisTicks: {
          show: false
      },
      axisBorder: {
          show: false
      }
  },
  yaxis1: {
      axisBorder: {
          show: false
      },
  },
  colors: ['rgb(46, 204, 113)'],

}
chartOptions6:any = {
  chart: {
      type: 'line',
      height: 20,
      width: 80,
      sparkline: {
          enabled: true
      },
      dropShadow: {
          enabled: true,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.1
      }
  },
  grid: {
      show: false,
      xaxis: {
          lines: {
              show: false
          }
      },
      yaxis: {
          lines: {
              show: false
          }
      },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 1,
      dashArray: 0,
  },
  fill: {
      gradient: {
          enabled: false
      }
  },
  series: [{
      name: 'Value',
      data: [15, 42, 16, 44, 24 ]
  }],
  yaxis: {
      min: 0,
      show: false
  },
  xaxis: {
      show: false,
      axisTicks: {
          show: false
      },
      axisBorder: {
          show: false
      }
  },
  yaxis1: {
      axisBorder: {
          show: false
      },
  },
  colors: ['rgb(231, 76, 60)'],

}

thumbsSwiper: any;
setThumbsSwiper(swiper: any) {
    this.thumbsSwiper = swiper;
  }
  imageData = [
    {
      src: './assets/images/nft-images/6.png',
    },
    {
      src: './assets/images/nft-images/7.png',
    },
    {
      src: './assets/images/nft-images/8.png',
    },
    {
        src: './assets/images/nft-images/9.png',
      },
  ];
}
