import { Component, ViewChild , AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../../../app/shared/common/sharedmodule';
import { NgbDropdownModule, NgbNavModule, NgbModal, NgbModalConfig, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { MatCommonModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-quotation',
    standalone: true,
    imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule,MaterialModuleModule,CommonModule,ToastrModule,],
    providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
    templateUrl: './quotation.component.html',
    styleUrl: './quotation.component.scss'
}) 
export class QuotationComponent {
    displayedColumns: string[] = ['slNo','elementUrl', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length','breadth','height','quantity','uom','draftQuantity','clientRate','finalAmount'];
    displayedClientProposal: string[] = ['slNo','ReferenceNo','ProposalRequestType', 'ProposalFor','CreatedBy','CreatedDate','Status', 'amount'];

    userDataStorage = localStorage.getItem('userDetails');
    userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
    userEmail: string = this.userData ? this.userData.email : '';
    userName: string = this.userData ? this.userData.username : '';
    userCompanyCode: string = this.userData ? this.userData.companyCode : '';
    userCompanyName: string = this.userData ? this.userData.companyName : '';
    userType: any = this.userData ? this.userData.type : ''; campaignName :any;selectedItem: any;
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort; 
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null;  designId : any; 
    boqList: any;
    categories = [
        { id: 1, name: 'Acoustic', code: 'AT' },
        { id: 2, name: 'BMS', code: 'BM' },
        { id: 3, name: 'Branding', code: 'BR' },
        { id: 4, name: 'Carpentry', code: 'CR' },
        { id: 5, name: 'CCTV & IT', code: 'IT' }
    ];
    prposaldataSource = new MatTableDataSource<any>([
    {
        slNo: 1,
        ReferenceNo: 'AD0001',
        ProposalRequestType: 'Proposal For New Order',
        ProposalFor: 'Sunil',
        CreatedBy: 'N. Bhavani Shankar',
        CreatedDate: '17 Nov 2024',
        Status: 'Approved',
        amount: 1200000
    },
    {
        slNo: 2,
        ReferenceNo: 'AD0002',
        ProposalRequestType: 'Proposal For Renovation',
        ProposalFor: 'Rajesh',
        CreatedBy: 'Admin',
        CreatedDate: '20 Nov 2024',
        Status: 'Pending',
        amount: 850000
    }
    ]);

    modal: any; chartOptions4: any;
    chartOptions1: any;
    constructor(// config: NgbModalConfig,
        private modalService: NgbModal, public switchService: SwitherService,
        private toastr: ToastrService,private offcanvasService: NgbOffcanvas) {
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
        this.chartOptions1 = {
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
    }

    open(content: any) {
        this.modalService.open(content, { centered: true });
    }
    openDetails(content: any, element: any) {
    this.selectedItem = element;
    this.offcanvasService.open(content, { position: 'end', backdrop: true });
    }

    flatpickrOptions: any = {
        inline: true
    };

    ngOnInit(): void {
        this.boqData();
        this.flatpickrOptions = {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
        };
        flatpickr('#addignedDate', this.flatpickrOptions);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    getSNo(index: number): number {
        if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
            return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
        }
        return index + 1;
    }

    boqData() {
        const payload = {
            email: this.userEmail,
            designId: "3FO3EWPJHYSK",
            bomRequired: true,
            wardrobeRequired: true,
            kbRequired: true
        };
        this.switchService.fetchBoqData(payload).subscribe({
            next: (res) => {
                const boqData = res?.boqData || {};
                this.tabKeys = Object.keys(boqData);
                this.tabKeys.forEach((key) => {
                    const items = boqData[key] || [];
                    this.boqDataSources[key] = new MatTableDataSource(
                        items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            ...item
                        }))
                    );
                });
            },
            error: () => {
                this.toastr.error('Something went wrong!');
            }
        });
    }
    setPaginatorAndSort(key: string) {
        if (this.boqDataSources[key]) {
        this.boqDataSources[key].paginator = this.paginator;
        this.boqDataSources[key].sort = this.sort;
        }
    }
    

}
