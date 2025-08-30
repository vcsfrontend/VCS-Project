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
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';

interface Plan {
    name: string;
    checked: boolean;
    isDefault: boolean;
    isCustom?: boolean;   // optional flag for custom items
}

@Component({
    selector: 'app-boq',
    standalone: true,
    imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule, MaterialModuleModule, CommonModule, ToastrModule,
    NgbOffcanvasModule],
    providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
    templateUrl: './boq.component.html',
    styleUrl: './boq.component.scss'
})
export class BoqComponent extends BaseComponent {
    displayedColumns: string[] = ['select', 'slNo', 'elementUrl', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length', 'breadth', 'height', 'quantity', 'uom', 'draftQuantity', 'clientRate', 'finalAmount'];
    displayedClientProposal: string[] = ['slNo', 'ReferenceNo', 'ProposalRequestType', 'ProposalFor', 'CreatedBy', 'CreatedDate', 'Status', 'amount'];
    displayedClientOrder: string[] = ['slNo', 'orderNo', 'ordertType', 'orderFrom', 'issuedBy', 'issueDate', 'dueDate', 'orderStatus', 'poStatus', 'progress', 'amount'];
    displayedClientInvoices: string[] = ['slNo', 'invoiceNo', 'invoiceType', 'orderNo', 'orderAmount', 'invoiceDate', 'uploadedBy', 'status', 'invoiceAmount', 'creditNoteAmount'];
    displayedClientCredit: string[] = ['slNo', 'creditnoteNo', 'refInvoiceNo', 'createdBy', 'orderAmount', 'attachments', 'verificationStatus', 'status', 'remark', 'amount'];
    poNumbers: string[] = ['PO-001', 'PO-002', 'PO-003'];
    footerColumns: string[] = ['totals'];
    libraryData: string[] = ['slNo', 'libraryName', 'typeofLibrary', 'createdBy', 'lastUpdated', 'sections', 'elements'];
    detailsColumns: string[] = ['sectionName', 'books'];
    invoiceForm!: FormGroup;
    userDataStorage = localStorage.getItem('userDetails');
    userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
    userEmail: string = this.userData ? this.userData.email : '';
    userName: string = this.userData ? this.userData.username : '';
    userCompanyCode: string = this.userData ? this.userData.companyCode : '';
    userCompanyName: string = this.userData ? this.userData.companyName : '';
    userType: any = this.userData ? this.userData.type : ''; campaignName: any; selectedItem: any;
    innerActive = 1;
    dataSource = new MatTableDataSource<any>();
    detailsDataSource = new MatTableDataSource<any>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null; designId: any;
    boqList: any; tabCounts: { [key: string]: number } = {}; elementForm!: FormGroup;
    addMoreVisible: boolean = false; selectedElementNames: string[] = []; selectedElement: any = null;
    newItem: string = ''; isEditMode = false; selectedLibrary: any; modal:any;


    public elementFormSubmitted = false;

    boqStaticFields = [
        { name: 'Branding', checked: false, isDefault: true, },
        { name: 'Civil', checked: false, isDefault: true, },
        { name: 'Electrical', checked: false, isDefault: true }
    ];
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
    clientOrdersDataSource = new MatTableDataSource<any>([
        {
            slNo: 1,
            orderNo: 'AD0001',
            ordertType: 'Regular',
            orderFrom: 'Sunil',
            issuedBy: 'N. Bhavani Shankar',
            issueDate: '17 Nov 2024',
            dueDate: '25 Nov 2024',
            orderStatus: 'confirmed',
            poStatus: 'pending',
            progress: '1%',
            amount: 120000,
        },
        {
            slNo: 2,
            orderNo: 'AD0002',
            ordertType: 'Proposal For Repeat Order',
            orderFrom: 'Ravi',
            issuedBy: 'N. Bhavani Shankar',
            issueDate: '18 Nov 2024',
            dueDate: '27 Nov 2024',
            orderStatus: 'Pending',
            poStatus: 'Not Generated',
            progress: '10%',
            amount: 30000,
        }
    ]);
    clientInvoicesDataSource = new MatTableDataSource<any>([
        {
            invoiceNo: 'INV-001',
            invoiceType: 'Tax Invoice',
            orderNo: 'ORD-101',
            orderAmount: 5000,
            invoiceDate: new Date(),
            uploadedBy: 'Admin',
            status: 'Approved',
            invoiceAmount: 5500,
            creditNoteAmount: 200
        },

    ]);
    clientCreditDataSource = new MatTableDataSource<any>([

    ])
    
    constructor(
        private modalService: NgbModal, public switchService: SwitherService,
        private toastr: ToastrService, private offcanvasService: NgbOffcanvas,
        private fb: FormBuilder,) {
        super();
    }

    open(content: any) {
        this.modalService.open(content, { centered: true });
    }
    openRights(content: any) {
        this.offcanvasService.open(content, { position: 'end' });
    }
    openRights2(content3: any) {
        this.offcanvasService.open(content3, { position: 'end' });
    }

    openDetails(content: any, element: any) {
        this.selectedItem = element;
        this.offcanvasService.open(content, { position: 'end', backdrop: true, });
    }

    openEditFromSelected(content: any) {
        if (!this.selectedElement?.length) {
            this.toastr.warning('Please select an element to edit');
            return;
        }
        const elementId = this.selectedElement[0];
        const allData = Object.values(this.boqDataSources).flatMap(ds => ds.data);
        const element = allData.find((e: any) => e.boqId === elementId);
        if (!element) return;
        this.openEditForm(element, content);
    }

    openEditForm(element: any, content: any) {
        this.elementForm.patchValue({
            elementName: element.elementNameAndDescription?.split('\n')[0] || '',
            elementDescription: element.elementNameAndDescription?.split('\n')[1] || '',
            brandOrMake: element.brandOrMake,
            length: element.length,
            breadth: element.breadth,
            height: element.height,
            codeAndCategory: element.codeAndCategory,
            uom: element.uom,
            quantity: element.quantity,
            itemType: element.itemType,
            clientRate: element.clientRate,
            budgetRate: element.budgetRate,
            hsn: element.hsn,
            gstPrecent: element.gstPrecent,
            // elementUrl: element.elementUrl
        });
        this.offcanvasService.open(content, { position: 'end', scroll: true });
    }

    resetForm() {
        this.elementForm.reset();
        this.isEditMode = false;
        this.selectedElement = null;
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
        this.elementForm = this.fb.group({
            elementUrl: [''],
            elementName: [''],
            elementDescription: [''],
            codeAndCategory: [''],
            orderStatus: [''],
            itemType: [''],
            source: [''],
            status: [''],
            length: [0],
            breadth: [0],
            height: [0],
            quantity: [0],
            uom: [''],
            draftQuantity: [0],
            clientRate: [0],
            finalAmount: [0],
            brandOrMake: [''],
            discount: [0],
            serviceCharge: [0],
            baseAmount: [0],
            budgetRate: [0],
            hsn: [0],
            gstPrecent: [0],
            amountWithoutGst: [0],
            designId: [''],
            roomName: [''],
            itemCode: [''],
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType
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
                    this.boqDataSources[key] = new MatTableDataSource(
                        items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            ...item
                        }))
                    );
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
        const formValue = { ...this.elementForm.value };
        delete formValue.elementName;
        delete formValue.elementDescription;
        const payload = {
            ...formValue,
            elementNameAndDescription: `${this.elementForm.value.elementName}${this.elementForm.value.elementDescription ? '\n' + this.elementForm.value.elementDescription : ''}`,
            budgetRate: Number(this.elementForm.value.budgetRate),
            clientRate: Number(this.elementForm.value.clientRate),
            gstPrecent: Number(this.elementForm.value.gstPrecent),
            hsn: Number(this.elementForm.value.hsn),
            breadth: Number(this.elementForm.value.breadth),
            height: Number(this.elementForm.value.height),
            length: Number(this.elementForm.value.length),
            quantity: Number(this.elementForm.value.quantity),
            codeAndCategory: formValue.codeAndCategory?.name
        };
        console.log('Final Payload:', payload);
        this.switchService.saveElementData(payload).subscribe({
            next: (res: any) => {
                if (res?.status === true) {
                    this.toastr.success(res.message || 'Data Saved Successfully');
                    this.elementForm.reset();
                    this.elementFormSubmitted = false;
                } else {
                    this.toastr.error(res?.message || 'Something went wrong.');
                }
            },
            error: (err) => {
                console.error('API Error:', err);
                this.toastr.error('An error occurred while sending mail.');
            },
        });
    }

    elementEdit() {
        if (!this.selectedElement) {
            this.toastr.warning('No element selected for editing.');
            return;
        }
        const formValue = { ...this.elementForm.value };
        const payload = {
            boqId: this.selectedElement,
            elementUrl: formValue.elementUrl || '',
            elementNameAndDescription: `${formValue.elementName || ''}${formValue.elementDescription ? '\n' + formValue.elementDescription : ''}`,
            codeAndCategory: formValue.codeAndCategory?.name || '',
            orderStatus: formValue.orderStatus || '',
            itemType: formValue.itemType || '',
            source: formValue.source || '',
            status: formValue.status || '',
            length: Number(formValue.length) || 0,
            breadth: Number(formValue.breadth) || 0,
            height: Number(formValue.height) || 0,
            quantity: Number(formValue.quantity) || 0,
            uom: formValue.uom || '',
            draftQuantity: Number(formValue.draftQuantity) || 0,
            clientRate: Number(formValue.clientRate) || 0,
            finalAmount: Number(formValue.finalAmount) || 0,
            brandOrMake: formValue.brandOrMake || '',
            discount: Number(formValue.discount) || 0,
            serviceCharge: Number(formValue.serviceCharge) || 0,
            baseAmount: Number(formValue.baseAmount) || 0,
            budgetRate: Number(formValue.budgetRate) || 0,
            hsn: Number(formValue.hsn) || 0,
            gstPrecent: Number(formValue.gstPrecent) || 0,
            amountWithoutGst: Number(formValue.amountWithoutGst) || 0,
            designId: formValue.designId || '',
            roomName: formValue.roomName || '',
            itemCode: formValue.itemCode || '',
            companyCode: formValue.companyCode || '',
            email: formValue.email || '',
            type: Number(formValue.type) || 0
        };
        console.log('Update Payload:', payload);
        // this.switchService.updateElementData(payload).subscribe({
        //     next: (res: any) => {
        //         if (res?.status === true) {
        //             this.toastr.success(res.message || 'Data Updated Successfully');
        //             this.elementForm.reset();
        //             this.elementFormSubmitted = false;
        //             this.selectedElement = null; 
        //         } else {
        //             this.toastr.error(res?.message || 'Something went wrong.');
        //         }
        //     },
        //     error: (err) => {
        //         console.error('API Error:', err);
        //         this.toastr.error('An error occurred while updating the element.');
        //     },
        // });
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
    get totalWithoutGST() {
        return this.clientOrdersDataSource.data
            .map(t => t.amount)
            .reduce((acc, val) => acc + val, 0);
    }

    get totalGST() {
        return 0;
    }

    get totalAmount() {
        return this.totalWithoutGST + this.totalGST;
    }

    deleteLeadItem(index: number): void {
        if (!this.boqStaticFields[index].isDefault) {
            this.boqStaticFields.splice(index, 1);
        }
    }

    toggleAddMore(): void {
        this.addMoreVisible = !this.addMoreVisible;
    }

    addLeadItem(): void {
        if (this.newItem.trim()) {
            this.boqStaticFields.push({
                name: this.newItem,
                checked: false,
                isDefault: false
            });
            this.newItem = '';
            this.addMoreVisible = false;
        }
    }


    isAllSelected(key: string): boolean {
        const data = this.boqDataSources?.[key]?.data ?? [];
        if (!data.length || !this.selectedElement?.length) return false;

        const selectedInThisTable = data.filter(row => this.selectedElement?.includes(row.boqId) ?? false);
        return selectedInThisTable.length === data.length;
    }


    isIndeterminate(key: string): boolean {
        const data = this.boqDataSources?.[key]?.data ?? [];
        if (!data.length || !this.selectedElement?.length) return false;

        const selectedInThisTable = data.filter(row => this.selectedElement?.includes(row.boqId) ?? false);
        return selectedInThisTable.length > 0 && selectedInThisTable.length < data.length;
    }

    onSelectAllChange(event: any, key: string): void {
        const data = this.boqDataSources?.[key]?.data ?? [];
        if (!data.length) return;

        if (event.checked) {
            this.selectedElement = data.map((row: any) => row.boqId);
        } else {
            this.selectedElement = [];
        }
    }

    onRowCheckboxChange(element: any, event: any) {
        if (!this.selectedElement) this.selectedElement = [];

        const boqId = element.boqId;
        if (event.checked) {
            if (!this.selectedElement.includes(boqId)) {
                this.selectedElement.push(boqId);
            }
        } else {
            const index = this.selectedElement.indexOf(boqId);
            if (index > -1) this.selectedElement.splice(index, 1);
        }
    }

    isSelected(boqId: number): boolean {
        return this.selectedElement?.includes(boqId) ?? false;
    }

    updateBoqElement(key: string, updatedElement: any) {
        const dataSource = this.boqDataSources?.[key];
        if (!dataSource || !dataSource.data?.length) return;
        const index = dataSource.data.findIndex(item => item.boqId === updatedElement.boqId);
        if (index === -1) {
            console.warn(`BOQ element with id ${updatedElement.boqId} not found in tab ${key}`);
            return;
        }
        dataSource.data[index] = {
            ...dataSource.data[index],
            ...updatedElement
        };
        dataSource._updateChangeSubscription();
    }



}
