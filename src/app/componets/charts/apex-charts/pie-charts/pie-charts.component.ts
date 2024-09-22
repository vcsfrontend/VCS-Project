import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { MatCommonModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-pie-charts',
  standalone: true,
  imports: [MatCommonModule,SharedModule,NgApexchartsModule],
  templateUrl: './pie-charts.component.html',
  styleUrl: './pie-charts.component.scss'
})
export class PieChartsComponent {
  chartOptions:any
  chartOptions1:any;
  chartOptions3:any;
  chartOptions2:any;
  chartOptions4:any;
  chartOptions5:any;
  chartOptions6:any;
constructor(){
 this.chartOptions={
  series: [44, 55, 13, 43, 22],
  chart: {
      height: 300,
      type: 'pie',
  },
  colors: ["#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c"],
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  legend: {
      position: "bottom"
  },
  dataLabels: {
      dropShadow: {
          enabled: false
      }
  },
  },
  this.chartOptions1={
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
  this.chartOptions2={
    series: [44, 55, 13, 33],
    chart: {
        height: 280,
        type: 'donut',
    },
    dataLabels: {
        enabled: false
    },
    colors: ["#845adf", "#23b7e5", "#f5b849", "#e6533c", "#49b6f5"],
    legend: {
        position: 'bottom',
    }
  }
  this.chartOptions3={
    series: [25, 15, 44, 55, 41, 17],
    chart: {
        height: '260',
        type: 'pie',
    },
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    theme: {
        monochrome: {
            enabled: true,
            color: "#845adf",
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                offset: -5
            }
        }
    },
    title: {
        text: 'Monochrome Pie',
        align: 'left',
        style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#8c9097'
        },
    },
    dataLabels: {
        formatter(val: number, opts: { w: { globals: { labels: { [x: string]: any; }; }; }; seriesIndex: string | number; }) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
        },
        dropShadow: {
            enabled: false
        }
    },
    legend: {
        show: false
    }
  }
  this.chartOptions4={
    series: [44, 55, 41, 17, 15],
    chart: {
        height: 277,
        type: 'donut',
    },
    plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 270
        }
    },
    dataLabels: {
        enabled: false
    },
    fill: {
        type: 'gradient',
    },
    legend: {
       position:'bottom'
    },
    colors: ["#845adf", "#23b7e5", "#f5b849", "#49b6f5", "#e6533c"],
    title: {
        text: 'Gradient Donut with custom Start-angle',
        align: 'left',
        style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#8c9097'
        },
    },

  }
  this.chartOptions5={
    series: [44, 55, 41, 17, 15],
    chart: {
        height: 250,
        type: 'donut',
        dropShadow: {
            enabled: true,
            color: '#111',
            top: -1,
            left: 3,
            blur: 3,
            opacity: 0.2
        }
    },
    stroke: {
        width: 0,
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    total: {
                        showAlways: true,
                        show: true
                    }
                }
            }
        }
    },
    colors: ["#b94eed", "#45d65b", "#f39c12", "#3498db", "#e74c3c"],
    labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#111']
        },
        background: {
            enabled: true,
            foreColor: '#fff',
            borderWidth: 0
        }
    },
    fill: {
        type: 'pattern',
        opacity: 1,
        pattern: {
            enabled: true,
            style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
        },
    },
    states: {
        hover: {
            filter: 'none'
        }
    },
    theme: {
        palette: 'palette2'
    },
    title: {
        text: 'Favourite Movie Type',
        align: 'left',
        style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#8c9097'
        },
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
          }
  }],
  }
  this.chartOptions6={
    series: [44, 33, 54, 45],
    chart: {
        height: 300,
        type: 'pie',
    },
    colors: ['#93C3EE', '#E5C6A0', '#669DB5', '#94A74A'],
    fill: {
        type: 'image',
        opacity: 0.85,
        image: {
            src: ['./assets/images/media/media-21.jpg', './assets/images/media/media-21.jpg', './assets/images/media/media-21.jpg', './assets/images/media/media-21.jpg'],
            width: 25,
            imagedHeight: 25
        },
    },
    stroke: {
        width: 4
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#111']
        },
        background: {
            enabled: true,
            foreColor: '#fff',
            borderWidth: 0
        }
    },
    legend: {
        position: 'bottom'
    },
  }
}
}
