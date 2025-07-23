import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../../../app/shared/common/sharedmodule';
import { NgbDropdownModule,NgbNavModule,NgbModal, NgbModalConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MatCommonModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule,
    NgbNavModule,NgbDropdownModule,FlatpickrModule,FormsModule,ReactiveFormsModule],
  providers: [NgbModalConfig, NgbModal,FlatpickrDefaults],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {
  modal: any;  chartOptions4:any;
  constructor(// config: NgbModalConfig,
    private modalService: NgbModal) {
      this.chartOptions4 = {
      series: [
        // George Washington
        {
            name: 'George Washington',
            data: [
                {
                    x: 'President',
                    y: [
                        new Date(1789, 3, 30).getTime(),
                        new Date(1797, 2, 4).getTime()
                    ]
                },
            ]
        },
        // John Adams
        {
            name: 'John Adams',
            data: [
                {
                    x: 'President',
                    y: [
                        new Date(1797, 2, 4).getTime(),
                        new Date(1801, 2, 4).getTime()
                    ]
                },
                {
                    x: 'Vice President',
                    y: [
                        new Date(1789, 3, 21).getTime(),
                        new Date(1797, 2, 4).getTime()
                    ]
                }
            ]
        },
        // Thomas Jefferson
        {
            name: 'Thomas Jefferson',
            data: [
                {
                    x: 'President',
                    y: [
                        new Date(1801, 2, 4).getTime(),
                        new Date(1809, 2, 4).getTime()
                    ]
                },
                {
                    x: 'Vice President',
                    y: [
                        new Date(1797, 2, 4).getTime(),
                        new Date(1801, 2, 4).getTime()
                    ]
                },
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1790, 2, 22).getTime(),
                        new Date(1793, 11, 31).getTime()
                    ]
                }
            ]
        },
        // Aaron Burr
        {
            name: 'Aaron Burr',
            data: [
                {
                    x: 'Vice President',
                    y: [
                        new Date(1801, 2, 4).getTime(),
                        new Date(1805, 2, 4).getTime()
                    ]
                }
            ]
        },
        // George Clinton
        {
            name: 'George Clinton',
            data: [
                {
                    x: 'Vice President',
                    y: [
                        new Date(1805, 2, 4).getTime(),
                        new Date(1812, 3, 20).getTime()
                    ]
                }
            ]
        },
        // John Jay
        {
            name: 'John Jay',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1789, 8, 25).getTime(),
                        new Date(1790, 2, 22).getTime()
                    ]
                }
            ]
        },
        // Edmund Randolph
        {
            name: 'Edmund Randolph',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1794, 0, 2).getTime(),
                        new Date(1795, 7, 20).getTime()
                    ]
                }
            ]
        },
        // Timothy Pickering
        {
            name: 'Timothy Pickering',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1795, 7, 20).getTime(),
                        new Date(1800, 4, 12).getTime()
                    ]
                }
            ]
        },
        // Charles Lee
        {
            name: 'Charles Lee',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1800, 4, 13).getTime(),
                        new Date(1800, 5, 5).getTime()
                    ]
                }
            ]
        },
        // John Marshall
        {
            name: 'John Marshall',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1800, 5, 13).getTime(),
                        new Date(1801, 2, 4).getTime()
                    ]
                }
            ]
        },
        // Levi Lincoln
        {
            name: 'Levi Lincoln',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1801, 2, 5).getTime(),
                        new Date(1801, 4, 1).getTime()
                    ]
                }
            ]
        },
        // James Madison
        {
            name: 'James Madison',
            data: [
                {
                    x: 'Secretary of State',
                    y: [
                        new Date(1801, 4, 2).getTime(),
                        new Date(1809, 2, 3).getTime()
                    ]
                }
            ]
        },
    ],
    chart: {
        height: 320,
        type: 'rangeBar'
    },
    plotOptions: {
        bar: {
            horizontal: true,
            barHeight: '50%',
            rangeBarGroupRows: true
        }
    },
    colors: [
        "#b94eed", "#45d65b", "#f39c12", "#e74c3c", "#8f00ff",
        "#3F51B5", "#546E7A", "#D4526E", "#8D5B4C", "#F86624",
        "#D7263D", "#1B998B", "#2E294E", "#F46036", "#E2C044"
    ],
    grid: {
        borderColor: '#f2f5f7',
    },
    fill: {
        type: 'solid'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        }
    },
    yaxis: {
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-label',
            },
        }
    },
    legend: {
        position: 'right'
    },
    tooltip: {
        custom: function (opts: { y1: string | number | Date; y2: string | number | Date; ctx: { rangeBar: { getTooltipValues: (arg0: any) => any; }; }; }) {
            const fromYear = new Date(opts.y1).getFullYear()
            const toYear = new Date(opts.y2).getFullYear()
            const values = opts.ctx.rangeBar.getTooltipValues(opts)

            return (
                ''
            )
        }
    }
    };
    }
  
  open(content:any) {
    this.modalService.open(content,{ centered: true });
  }
  
  flatpickrOptions: any = {
    inline: true
  };
  
  ngOnInit(): void {
    this.flatpickrOptions = {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
    };
    flatpickr('#addignedDate', this.flatpickrOptions);
  }
  
}
