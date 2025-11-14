import { Component,OnInit } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
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
 responsive: ApexResponsive[];
 grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
curve:string,
options:any

};

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [SharedModule,NgbDropdownModule,NgApexchartsModule,LeafletModule],
  templateUrl: './crm2.component.html',
  styleUrl: './crm2.component.scss'
})
export class CRM2Component {
    ngOnInit(): void {
        //leaflet maps 1
        const map = L.map('customers-countries').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap',
        }).addTo(map);
      }

  chartOptions:any = {
    series: [
        {
            type: 'line',
            name: 'Profit',
            data: [
                {
                    x: 'Jan',
                    y: 100
                },
                {
                    x: 'Feb',
                    y: 210
                },
                {
                    x: 'Mar',
                    y: 180
                },
                {
                    x: 'Apr',
                    y: 454
                },
                {
                    x: 'May',
                    y: 230
                },
                {
                    x: 'Jun',
                    y: 320
                },
                {
                    x: 'Jul',
                    y: 656
                },
                {
                    x: 'Aug',
                    y: 830
                },
                {
                    x: 'Sep',
                    y: 350
                },
                {
                    x: 'Oct',
                    y: 350
                },
                {
                    x: 'Nov',
                    y: 210
                },
                {
                    x: 'Dec',
                    y: 410
                }
            ]
        },
        {
            type: 'line',
            name: 'Revenue',
            chart: {
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 3,
                    color: '#000',
                    opacity: 0.1
                }
            },
            data: [
                {
                    x: 'Jan',
                    y: 180
                },
                {
                    x: 'Feb',
                    y: 620
                },
                {
                    x: 'Mar',
                    y: 476
                },
                {
                    x: 'Apr',
                    y: 220
                },
                {
                    x: 'May',
                    y: 520
                },
                {
                    x: 'Jun',
                    y: 780
                },
                {
                    x: 'Jul',
                    y: 435
                },
                {
                    x: 'Aug',
                    y: 515
                },
                {
                    x: 'Sep',
                    y: 738
                },
                {
                    x: 'Oct',
                    y: 454
                },
                {
                    x: 'Nov',
                    y: 525
                },
                {
                    x: 'Dec',
                    y: 230
                }
            ]
        },
        {
            type: 'line',
            name: 'Sales',
            chart: {
                dropShadow: {
                    enabled: true,
                    enabledOnSeries: undefined,
                    top: 5,
                    left: 0,
                    blur: 3,
                    color: '#000',
                    opacity: 0.1
                }
            },
            data: [
                {
                    x: 'Jan',
                    y: 200
                },
                {
                    x: 'Feb',
                    y: 530
                },
                {
                    x: 'Mar',
                    y: 110
                },
                {
                    x: 'Apr',
                    y: 130
                },
                {
                    x: 'May',
                    y: 480
                },
                {
                    x: 'Jun',
                    y: 520
                },
                {
                    x: 'Jul',
                    y: 780
                },
                {
                    x: 'Aug',
                    y: 435
                },
                {
                    x: 'Sep',
                    y: 475
                },
                {
                    x: 'Oct',
                    y: 738
                },
                {
                    x: 'Nov',
                    y: 454
                },
                {
                    x: 'Dec',
                    y: 480
                }
            ]
        }
    ],
    chart: {
        height: 350,
        animations: {
            speed: 500
        }
    },
    colors: ["var(--primary-color)", "rgb(69, 214, 91)", "rgb(243, 156, 18)"],
    dataLabels: {
        enabled: false
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    stroke: {
        curve: 'smooth',
        width: [1, 1, 1],
    },
    xaxis: {
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        labels: {
            formatter: function (value:any) {
                return "$" + value;
            }
        },
    },
    tooltip: {
        y: [{
            formatter: function (e:any) {
                return void 0 !== e ? "$" + e.toFixed(0) : e
            }
        }, {
            formatter: function (e: any) {
                return void 0 !== e ? "$" + e.toFixed(0) : e
            }
        }, {
            formatter: function (e: any) {
                return void 0 !== e ? e.toFixed(0) : e
            }
        }]
    },
    legend: {
        show: true,
        customLegendItems: ['Profit', 'Revenue', 'Sales'],
        position: "bottom",
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
    title: {
        align: 'left',
        style: {
            fontSize: '.8125rem',
            fontWeight: 'semibold',
            color: '#8c9097'
        },
    },
    markers: {
        hover: {
            sizeOffset: 5
        }
    }
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
        name: 'Deals',
        data: [21, 22, 10, 28, 16, 21, 13, 19]
    }],
    chart: {
        height: 412,
        type: 'bar',
        events: {
            click: function (chart: any, w: any, e: any) {
            }
        },
        toolbar: {
            show: false,
        }
    },
    colors: ['var(--primary-color)', 'rgb(69, 214, 91)', 'rgb(243, 156, 18)', 'rgb(52, 152, 219)', 'rgb(46, 204, 113)', 'rgb(231, 76, 60)', 'rgb(0, 177, 163)', 'rgb(255, 116, 23)'],
    plotOptions: {
        bar: {
            barHeight: '2%',
            distributed: true,
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    xaxis: {
        categories: [
            ['New Deal'],
            ['Qualified Deal'],
            ['Renewal Deal'],
            ['Referral Deal'],
            ['Won Deal'],
            ['Lost Deal'],
            ['Negotiation Deal'],
            ['Proposal/Quote'],
        ],
        labels: {
            show: false,
            style: {
                fontSize: '12px'
            },
        }
    },
    yaxis: {
        offsetX: 30,
        offsetY: 30,
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetY: 8,
        }
    },
    tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        x: {
            show: false
        }
    },
  };


}



