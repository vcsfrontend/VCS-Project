import { Component, OnInit } from '@angular/core';
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
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-personal',
  standalone: true,
  imports: [SharedModule,NgApexchartsModule,NgbDropdownModule,NgbNavModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent {
  generateDayWiseTimeSeries = function(baseval: number, count: number, yrange: { max: number; min: number; }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  };
  chartOptions:any= {
    series: [
      {
        name: "Income",
        data: this.generateDayWiseTimeSeries(
          new Date("11 Feb 2017 GMT").getTime(),
          20,
          {
            min: 10,
            max: 60
          }
        )
      }, 
      {
        name: "Expenses",
        data: this.generateDayWiseTimeSeries(
          new Date("11 Feb 2017 GMT").getTime(),
          20,
          {
            min: 10,
            max: 15
          }
        )
      }
    ],
    chart: {
      type: "area",
      fontFamily: "Poppins, Arial, sans-serif",
      foreColor: "#8c9097",
      height: 260,
      horizontal: true,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
      stacked: true,
      events: {
        selection: function(chart: any, e: { xaxis: { min: string | number | Date; }; }) {
          console.log(new Date(e.xaxis.min));
        }
      }
    },
    grid: {
      borderColor: "#edeef1",
      strokeDashArray: 2,
    },
    colors: ["var(--primary-color)", "rgb(69, 214, 91)"],
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    stroke: {
      width: 1,
      curve: "smooth",
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.3,
        colorStops: [
          [
            {
              offset: 0,
              color: "var(--primary02)",
              opacity: 50
            },
            {
              offset: 75,
              color: "var(--primary02)",
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
              color: 'rgba(69, 214, 91, 0.2)',
              opacity: 1
            },
            {
              offset: 75,
              color: 'rgba(69, 214, 91, 0.2)',
              opacity: 0.1
            },
            {
              offset: 100,
              color: 'transparent',
              opacity: 1
            }
          ]
        ]
      }
    },
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
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
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      axisBorder: {
        show: false,
      },
      crosshairs: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },
    tooltip: {
      markers: {
        show: false,
      },
      enabled: true,
      shared: true,
      intersect: false,
    },
  };

  chartOptions1:any= {
    series: [
      {
        name: "Revenue",
        data: [44, 55, 41, 42, 22, 43, 21, 35, 56, 27, 43, 27],
      },
    ],
    chart: {
      height: 40,
      type: "area",
      fontFamily: "Poppins, sans-serif",
      foreColor: "#8c9097",
      toolbar: {
        enabled: false,
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      borderColor: "#edeef1",
      strokeDashArray: 2,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      curve: ["smooth"],
    },
    fill: {
      opacity: 0.38,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      show: false,
      crosshairs: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "10px",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    markers: {
      size: 0,
    },
    tooltip: {
      enabled: false,
    },
    colors: ["#ffffff"],
  };
  chartOptions2:any = {
    series: [14, 23, 21],
    chart: {
      type: "polarArea",
      height: 200,
      width: 200,
      fontFamily: "Poppins, sans-serif",
      foreColor: "#8c9097",
      sparkline: {
        enabled: true,
      }
    },
    grid: {
      borderColor: "#edeef1",
      strokeDashArray: 2,
    },
    stroke: {
      colors: ["#fff"],
    },
    colors: ['var(--primary08)', 'rgba(69, 214, 91, 0.8)', 'rgba(52, 152, 219, 0.8)'],
    legend: {
      show: false,
    },
    fill: {
      opacity: 0.9,
    },
    labels: ['Starter', 'Pro', 'Premium'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

}
