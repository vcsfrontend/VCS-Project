import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { BaseComponent } from '../../../shared/base/base.component';

@Component({
    selector: 'app-boq',
    standalone: true,
    imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule, MaterialModuleModule, CommonModule, ToastrModule,],
    providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
    templateUrl: './boq.component.html',
    styleUrl: './boq.component.scss'
})
export class BoqComponent extends BaseComponent {
    displayedColumns: string[] = ['slNo', 'elementUrl', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length', 'breadth', 'height', 'quantity', 'uom', 'draftQuantity', 'clientRate', 'finalAmount'];
    displayedClientProposal: string[] = ['slNo', 'ReferenceNo', 'ProposalRequestType', 'ProposalFor', 'CreatedBy', 'CreatedDate', 'Status', 'amount'];
    libraryData: string[] = ['slNo', 'libraryName', 'typeofLibrary', 'createdBy', 'lastUpdated', 'sections', 'elements'];
    detailsColumns: string[] = ['sectionName', 'books'];

    userDataStorage = localStorage.getItem('userDetails');
    userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
    userEmail: string = this.userData ? this.userData.email : '';
    userName: string = this.userData ? this.userData.username : '';
    userCompanyCode: string = this.userData ? this.userData.companyCode : '';
    userCompanyName: string = this.userData ? this.userData.companyName : '';
    userType: any = this.userData ? this.userData.type : ''; campaignName: any; selectedItem: any;
    dataSource = new MatTableDataSource<any>();
    detailsDataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null; designId: any;
    boqList: any; tabCounts: { [key: string]: number } = {}; elementForm!: FormGroup;
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

    libraryDataSource = new MatTableDataSource<any>([
        {
            slNo: 1,
            libraryName: 'Central Library',
            typeofLibrary: 'Public',
            createdBy: 'Admin',
            lastUpdated: '2025-08-20',
            sections: 12,
            elements: 2500
        },
        {
            slNo: 2,
            libraryName: 'City Knowledge Hub',
            typeofLibrary: 'Community',
            createdBy: 'Manager',
            lastUpdated: '2025-08-22',
            sections: 8,
            elements: 1200
        },
        {
            slNo: 3,
            libraryName: 'Tech Research Library',
            typeofLibrary: 'Private',
            createdBy: 'Researcher',
            lastUpdated: '2025-08-25',
            sections: 15,
            elements: 5000
        },
        {
            slNo: 4,
            libraryName: 'School Library',
            typeofLibrary: 'Educational',
            createdBy: 'Teacher',
            lastUpdated: '2025-08-26',
            sections: 6,
            elements: 800
        },
        {
            slNo: 5,
            libraryName: 'Digital Archive',
            typeofLibrary: 'Online',
            createdBy: 'System',
            lastUpdated: '2025-08-27',
            sections: 20,
            elements: 10000
        }
    ]);

    modal: any;
    selectedLibrary: any;
    constructor(// config: NgbModalConfig,
        private modalService: NgbModal, public switchService: SwitherService,
        private toastr: ToastrService, private offcanvasService: NgbOffcanvas,
        private fb: FormBuilder,) {
        super();
    }

    open(content: any) {
        this.modalService.open(content, { centered: true });
    }

    openDetails(content: any, element: any) {
        this.selectedItem = element;
        this.offcanvasService.open(content, { position: 'end', backdrop: true, });
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
        this.elementForm = this.fb.group({
            elementName: ['',],
            elementDescription: ['',],
            brandMake: [''],
            elementCategory: ['',],
            uom: ['',],
            quantity: [''],
            itemType: ['',],
            clientRate: ['',],
            budgetRate: [''],
            HSN: [''],
            GST: ['']
        }
        );
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
                this.boqDataSources = {};
                this.tabCounts = {};

                this.tabKeys.forEach((key) => {
                    const items = boqData[key] || [];

                    // Table data
                    this.boqDataSources[key] = new MatTableDataSource(
                        items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            ...item
                        }))
                    );

                    // Count per tab (no optional chain needed)
                    this.tabCounts[key] = items.length;
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

    openLg1(content1: any) {
        this.offcanvasService.open(content1, { position: 'end', });
    }

    openLg2(content2: any) {
        this.offcanvasService.open(content2, { position: 'end', panelClass: 'custom-offcanvas' });
    }

    elementSubmit() {
        if (this.elementForm.valid) {
            console.log("Form submitted:", this.elementForm.value);
        } else {
            console.log("Form is invalid");
        }
    }

    onLibraryClick(library: any) {
        this.selectedLibrary = library;
        if (library.libraryName === 'Central Library') {
            this.detailsDataSource.data = [
                { sectionName: 'Fiction', books: 1200 },
                { sectionName: 'Science', books: 800 },
                { sectionName: 'History', books: 500 }
            ];
        } else if (library.libraryName === 'City Knowledge Hub') {
            this.detailsDataSource.data = [
                { sectionName: 'Kids', books: 400 },
                { sectionName: 'Comics', books: 300 },
                { sectionName: 'General', books: 500 }
            ];
        } else {
            this.detailsDataSource.data = [
                { sectionName: 'Default Section', books: 100 }
            ];
        }
    }

    backToLibrary() {
        this.selectedLibrary = null; 
    }


}
