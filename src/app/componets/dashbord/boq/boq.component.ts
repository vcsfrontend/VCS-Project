import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
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
import { emptyDoc, Validators } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
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
interface Plan {
    name: string;
    checked: boolean;
    isDefault: boolean;
    isCustom?: boolean;   // optional flag for custom items
}

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
    selector: 'app-boq',
    standalone: true,
    imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule, MaterialModuleModule, CommonModule, ToastrModule,
        NgbOffcanvasModule,SwiperModule],
    providers: [NgbModalConfig, NgbModal, FlatpickrDefaults,],
    templateUrl: './boq.component.html',
    styleUrl: './boq.component.scss'
})
export class BoqComponent extends BaseComponent {
    displayedColumns: string[] = ['sourceFlag', 'select', 'elementUrl', 'brandOrMake', 'codeAndCategory', 'orderStatus', 'itemType', 'source', 'status', 'length', 'breadth', 'height', 'quantity', 'uom', 'draftQuantity', 'clientRate', 'serviceCharge', 'baseAmount', 'budgetRate', 'hsn', 'gstPrecent', 'amountWithoutGst', 'discount', 'finalAmount',];
    // optionalColumns: string[] = ['brandOrMake', 'discount', 'serviceCharge', 'baseAmount', 'budgetRate', 'hsn', 'gst', 'amountWithoutGST'];
    displayedClientProposal: string[] = ['slNo', 'referenceNo', 'proposalRequestType', 'proposalFor', 'createdBy', 'createdDate', 'status', 'amount'];
    displayedClientOrder: string[] = ['slNo', 'orderNo', 'ordertType', 'orderFrom', 'issuedBy', 'issueDate', 'dueDate', 'orderStatus', 'poStatus', 'progress', 'amount'];
    displayedClientInvoices: string[] = ['slNo', 'invoiceNo', 'invoprposaldataSourceiceType', 'orderNo', 'orderAmount', 'invoiceDate', 'uploadedBy', 'status', 'invoiceAmount', 'creditNoteAmount'];
    displayedClientCredit: string[] = ['slNo', 'creditnoteNo', 'refInvoiceNo', 'createdBy', 'orderAmount', 'attachments', 'verificationStatus', 'status', 'remark', 'amount'];
    poNumbers: string[] = ['PO-001', 'PO-002', 'PO-003'];
    footerColumns: string[] = ['totals'];
    libraryData: string[] = ['slNo', 'libraryName', 'typeofLibrary', 'createdBy', 'lastUpdated', 'sections', 'elements'];
    detailsColumns: string[] = ['propasalContentId', 'jobId', 'orderNo', 'orderFrom', 'orderFor', 'createdBy', 'vendorId', 'shippingAddress', 'startDate', 'dueDate', 'gstNo'];
    proposalContentColumns: string[] = ["elementUrl", "brandOrMake", "codeAndCategory", "orderStatus", "itemType", "source", "status", "length", "breadth", "height", "quantity", "uom", "draftQuantity", "clientRate", "serviceCharge", "baseAmount", "budgetRate", "hsn", "gstPrecent", "amountWithoutGst", "discount", "finalAmount"];
    orderContentColumns: string[] = ["elementUrl", "brandOrMake", "codeAndCategory", "orderStatus", "itemType", "source", "status", "length", "breadth", "height", "quantity", "uom", "draftQuantity", "clientRate", "serviceCharge", "baseAmount", "budgetRate", "hsn", "gstPrecent", "amountWithoutGst", "discount", "finalAmount"];
    userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];
    designerColumns: string[] = ['slNo', 'projectId', 'projectName', 'clientName', 'projStatus', 'projectEstimation',
        'projectArea', 'projectStartDate', 'projectEndDate', 'designUrl', 'projectCompletion'];
    invoiceForm!: FormGroup; extraContentProposal!: FormGroup
    userDataStorage = localStorage.getItem('userDetails');
    userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
    userEmail: string = this.userData ? this.userData.email : '';
    userName: string = this.userData ? this.userData.username : '';
    userCompanyCode: string = this.userData ? this.userData.companyCode : '';
    userCompanyName: string = this.userData ? this.userData.companyName : '';
    userRole: string = this.userData ? this.userData?.adonaiRole : '';
    userType: any = this.userData ? this.userData.type : ''; campaignName: any; selectedItem: any;
    innerActive = 1; selectedProposalContent: any = null; isCollapsed = false;
    selectedOrderContent: any = null; actstatus: any;
    adoanAiRole: string = '';
    itemId: any; currentSection: any; proposals: any[] = []; clientOrders: any[] = [];
    dataSource = new MatTableDataSource<any>(); projectId: any; projectName!: any;
    designingId: any; designCompletionStatus: string = '';
    detailsDataSource = new MatTableDataSource<any>([]);
    proposaldataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
    proposalContentDetailsDataSource = new MatTableDataSource<any>([]);
    designerDataSource = new MatTableDataSource<any>();
    proposalTabKeys: string[] = []; dateDiff: any; roleid: any;
    proposalTabCounts: { [key: string]: number } = {}; recceData: any; activeStage: string = '';
    itemCodeLst: any; public userList: any; filteredUserList: any[] = []; recceStage: string = '';
    proposalContentDataSources: { [key: string]: MatTableDataSource<any> } = {}; recceList: any[] = [];
    filteredRecce: any[] = []; blockedStages: string[] = [];
    // selectedColumns: Set<string> = new Set();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    @ViewChild(MatSort) sort!: MatSort;
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null; designId: any;
    boqList: any; tabCounts: { [key: string]: number } = {}; elementForm!: FormGroup; proposalForm!: FormGroup
    proposalApprovalForm!: FormGroup; extraContentProposalForm!: FormGroup; recceForm!: FormGroup;
    updateRecceForm!: FormGroup; updateProjectForm!: FormGroup;
    addMoreVisible: boolean = false; selectedElementNames: string[] = []; selectedElement: any = null;
    newItem: string = ''; isEditMode = false; selectedLibrary: any; modal: any; previewUrl: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;
    activeId: any = 0; highlightedTabIndex = 0; selectedProposal: any;          // raw API data
    filteredProposals: any[] = []; filteredClientOrders: any[] = []; tabTotals: { [key: string]: number } = {};
    orderContentDataSources: { [key: string]: MatTableDataSource<any> } = {};
    orderTabCounts: { [key: string]: number } = {}; orderTabKeys: string[] = [];
    projectLst: any = []; boqproject: any; showAllProposals = false;
    thumbsSwiper: any;
    setThumbsSwiper(swiper: any) {
        this.thumbsSwiper = swiper;
    }
    public swiperConfig: any = {

        breakpoints: {
            200: {
                slidesPerView: 1,
            },
            500: {
                slidesPerView: 2,
            },
            770: {
                slidesPerView: 3,
            },
            1400: {
                slidesPerView: 4,
            },
            1600: {
                slidesPerView: 5,
            },
        }
    } 
    public elementFormSubmitted = false;
    public proposalFormSubmitted = false;
    public proposalApprovalSubmitted = false;

    boqStaticFields = [
        { name: 'Branding', checked: false, isDefault: true, },
        { name: 'Civil', checked: false, isDefault: true, },
        { name: 'Electrical', checked: false, isDefault: true }
    ];

    constructor(
        private modalService: NgbModal, public switchService: SwitherService,
        private toastr: ToastrService, private offcanvasService: NgbOffcanvas,
        private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
        super();
        this.userData = localStorage.getItem('userDetails');
        this.userType = JSON.parse(this.userData).type;
        this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
    }

    open(content: any) {
        this.modalService.open(content, { centered: true });
    }
    openRights(content: any) {
        this.offcanvasService.open(content, { position: 'end' });
    }
    openRecce(content44: any, recceStage: string) {
        this.recceStage = recceStage;
        this.modalService.open(content44, { centered: true });
    }
    openRights2(content3: any) {
        this.offcanvasService.open(content3, { position: 'end' });
    }

    openProjectModal(content45: any, projectId: string) {
        const project = this.designerDataSource.data.find(p => p.projectId === projectId);
        this.updateProjectForm.patchValue({
            projectId: project.projectId,
            designId: project.designId || '',
            projectStage: project.projectStage || '',
            projectArea: project.projectArea || '',
            designUrl: project.designUrl || '',
            assignedDesigner: project.assignedDesigner?.email || project.assignedDesigner || '',
            designCompletionStatus: project.designCompletionStatus || '',
            email: this.userEmail,
            companycode: this.userCompanyCode,
            updatedBy: this.userName,
            type: this.userType
        });
        if (project.designCompletionStatus === 'Complete') {
            this.updateProjectForm.disable();
        } else {

            if (this.userRole === 'USER') {
                Object.keys(this.updateProjectForm.controls).forEach(control => {
                    if (control !== 'designCompletionStatus') {
                        this.updateProjectForm.controls[control].disable();
                    } else {
                        this.updateProjectForm.controls[control].enable();
                    }
                });
            } else if (this.userRole === 'ADMIN') {
                Object.keys(this.updateProjectForm.controls).forEach(control => {
                    this.updateProjectForm.controls[control].enable();
                });
            }
        }
        this.modalService.open(content45, { backdrop: 'static' });
    }



    onCreateProposalClick(content: any) {
        if (!this.selectedElement || this.selectedElement.length === 0) {
            this.toastr.warning("Please select at least one Element");
            return;
        }
        this.openRights4(content);
    }

    openRights4(content4: any) {
        this.modalService.open(content4, { centered: true, size: 'lg' });
    }

    openRights5(content6: any, proposal: any) {
        this.extraContentProposalForm.patchValue({
            orderNo: proposal?.orderNo || '',
            startDate: proposal?.startDate || '',
            endDate: proposal?.dueDate || '',
            shippingAdddress: proposal?.shippingAdddress || '',
            contentJs: proposal?.contentJs || ''
        });
        this.modalService.open(content6, { centered: true, size: 'lg' });
    }

    openDetails(content: any, element: any) {
        this.selectedItem = element;
        this.offcanvasService.open(content, { position: 'end', backdrop: true, });
    }

    flatpickrOptions: any = {
        inline: true
    };

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.projectId = params['projectId'];
            this.projectName = params['projectName'];
            this.buildRecceForm();
            this.recceForm.patchValue({
                projectId: this.projectId,
                projectName: this.projectName
            });
        });
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
        });
        this.proposalForm = this.fb.group({
            orderFrom: [''],
            orderFor: [this.userCompanyName],
            vendorId: [''],
            shippingAddress: [''],
            startDate: [''],
            dueDate: [''],
            gstNo: [''],
            contentJs: [''],
            proposalContId: [''],
            designId: [''],
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
            updatedBy: this.userName,
            currentAmount: [0],
            createdBy: this.userName,
            updatedTime: new Date().toISOString(),
        }
        );
        this.proposalApprovalForm = this.fb.group({
            designId: [''],
            orderNo: [''],
            desicion: [''],
            updatedBy: this.userName,
            startDate: [''],
            endDate: [''],
            shippingAddress: [''],
            amount: [0],
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType
        });
        this.extraContentProposalForm = this.fb.group({
            orderNo: [''],
            proposalContId: [''],
            startDate: [''],
            endDate: [''],
            shippingAdddress: [''],
            contentJs: [''],
            // designId:['3FO3EWPJHYSK']
        });
        this.flatpickrOptions = {
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
        };

        this.getRecceData();
        this.updateRecceForm = this.fb.group({
            files: this.fb.array([]),
            updatedBy: [''],
            updatedTime: [new Date().toISOString()],
            projectId: [''],
            recceStage: [''],
        });
        this.updateProjectForm = this.fb.group({
            designId: [''],
            projectId: this.projectId,
            email: this.userEmail,
            companycode: this.userCompanyCode,
            updatedBy: this.userName,
            type: this.userType,
            projectStage: [''],
            projectArea: [''],
            designUrl: [''],
            assignedDesigner: [''],
            designCompletionStatus: ['']
        });
        this.getUsers();
        this.getAssignProjects();
        flatpickr('#addignedDate', this.flatpickrOptions);
    }

    buildRecceForm() {
        this.recceForm = this.fb.group({
            projectName: [''],
            projectId: [''],
            recceName: [''],
            recceStage: [''],
            recceDueDate: [''],
            recceAssigne: [''],
            recceStakeHolders: [''],
            recceClientPoc: [''],
            description: [''],
            files: this.fb.array([]),
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
            createdBy: this.userName
        });
    }

    getUsers() {
        if (this.userType == 2) {
            let cn = this.userCompanyName;
            let cc = this.userCompanyCode;
            this.switchService.cmpnyUsers(cn, cc).subscribe({
                next: (res: any) => {
                    if (res) {
                        this.userList = res.map((user: any) => ({
                            email: user.email,
                            username: user.username,
                            adonaiRole: user.adonaiRole
                        }));
                        this.filteredUserList = this.userList.filter(
                            (user: any) => user.adonaiRole?.toUpperCase() !== 'ADMIN'
                        );
                    }
                }
            });
        }
    }


    onSubmit() {
        if (this.isEditMode) {
            this.editElement();
        } else {
            this.elementSubmit();
        }
    }

    getAgentColor(name: string): string {
        const index = Math.abs(this.hashString(name.trim())) % this.userColors.length;
        return this.userColors[index];
    }

    private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    applyGlobalFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        Object.keys(this.boqDataSources).forEach(key => {
            this.boqDataSources[key].filter = filterValue;
        });
    }


    openEditForm(element: any, content: any) {
        this.isEditMode = true;
        this.itemId = element.boqId;
        let elementName = '';
        let brandOrMake = '';
        let elementDescription = '';
        if (element.elementNameAndDescription) {
            const parts: string[] = element.elementNameAndDescription.split('\n');
            const namePart = parts.find((p: string) => p.startsWith('Name :'));
            elementName = namePart ? namePart.replace('Name :', '').trim() : '';

            const brandPart = parts.find((p: string) => p.startsWith('Brand :'));
            brandOrMake = brandPart ? brandPart.replace('Brand :', '').trim() : '';
            elementDescription = parts
                .filter(p => !p.startsWith('Name :') && !p.startsWith('Brand :'))
                .join('\n')
                .trim();
        }
        this.elementForm.patchValue({
            elementUrl: element.elementUrl || '',
            elementName: elementName,
            elementDescription: elementDescription,
            brandOrMake: brandOrMake || element.brandOrMake || '',
            length: element.length || 0,
            breadth: element.breadth || 0,
            height: element.height || 0,
            codeAndCategory: element.codeAndCategory,
            uom: element.uom,
            quantity: element.quantity,
            itemType: element.itemType,
            clientRate: element.clientRate,
            budgetRate: element.budgetRate,
            hsn: element.hsn,
            gstPrecent: element.gstPrecent,
            roomName: element.roomName,
            itemCode: element.itemCode,
            companyCode: element.companyCode,
            email: element.email,
            type: element.type,
        });
        this.previewUrl = element.elementUrl || null;
        const ref = this.offcanvasService.open(content, { position: 'end', scroll: true });
        ref.closed.subscribe(() => this.resetForm());
        ref.dismissed.subscribe(() => this.resetForm());
        // if (this.isEditMode) {
        //     this.elementForm.disable();
        //     this.elementForm.get('quantity')?.enable();
        // }

    }

    updateDropdownField(
        field: 'itemType' | 'orderStatus' | 'uom' | 'status' | 'codeAndCategory',
        selectedValue: string | { name?: string, code?: string },
        element: any
    ) {
        if (!element?.boqId) {
            this.toastr.warning('Invalid element selected');
            return;
        }
        let fieldValue: string;
        if (typeof selectedValue === 'string') {
            fieldValue = selectedValue;
        } else if (field === 'codeAndCategory') {
            fieldValue = selectedValue?.code || '';
        } else {
            fieldValue = selectedValue?.name || '';
        }
        this.elementForm.patchValue({ [field]: fieldValue });
        let brandOrMake = element.brandOrMake;
        if (field === 'itemType' && !brandOrMake && element.elementNameAndDescription) {
            const brandLine = element.elementNameAndDescription.split('\n')[1];
            if (brandLine?.includes(':')) {
                brandOrMake = brandLine.split(':')[1]?.trim() || '';
            }
        }

        const payload = [{
            boqId: element.boqId ?? 0,
            elementUrl: element.elementUrl ?? '',
            elementNameAndDescription: element.elementNameAndDescription ?? '',
            codeAndCategory: field === 'codeAndCategory' ? fieldValue : element.codeAndCategory ?? '',
            orderStatus: field === 'orderStatus' ? fieldValue : element.orderStatus ?? '',
            itemType: field === 'itemType' ? fieldValue : element.itemType ?? '',
            uom: field === 'uom' ? fieldValue : element.uom ?? '',
            status: field === 'status' ? fieldValue : element.status ?? '',
            source: element.source ?? '',
            length: element.length ?? 0,
            breadth: element.breadth ?? 0,
            height: element.height ?? 0,
            quantity: element.quantity ?? 0,
            draftQuantity: element.draftQuantity ?? 0,
            clientRate: element.clientRate ?? 0,
            finalAmount: element.finalAmount ?? 0,
            brandOrMake: brandOrMake ?? element.brandOrMake ?? '',
            discount: element.discount ?? 0,
            serviceCharge: element.serviceCharge ?? 0,
            baseAmount: element.baseAmount ?? 0,
            budgetRate: element.budgetRate ?? 0,
            hsn: element.hsn ?? 0,
            gstPrecent: element.gstPrecent ?? 0,
            amountWithoutGst: element.amountWithoutGst ?? 0,
            designId: element.designId ?? '',
            roomName: element.roomName ?? '',
            itemCode: element.itemCode ?? '',
            companyCode: element.companyCode ?? '',
            email: element.email ?? '',
            type: element.type ?? 0
        }];
        this.switchService.updateElementData(payload).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    this.toastr.success(`${field} updated successfully`);
                    element[field] = fieldValue;
                    if (field === 'itemType') element.brandOrMake = brandOrMake;
                }
            }
        });
    }

    proposalApprovalSubmit(modal: any) {
        if (this.proposalApprovalForm.invalid) {
            this.toastr.warning("Please select a decision");
            return;
        }
        const payload = {
            ...this.proposalApprovalForm.value,
            proposalContentId: this.selectedProposal?.proposalContId ?? this.selectedProposal?.proposalContentId ?? '',
            orderNo: this.selectedProposal?.orderNo ?? this.selectedProposal?.referenceNo ?? '',
            designId: this.selectedProposal?.designId ?? '',
            jobId: this.selectedProposal?.jobId ?? '',
            updatedBy: this.userName
        };
        this.switchService.approveProposal(payload).subscribe({
            next: () => {
                this.toastr.success("Proposal Created successfully");
                modal.close();
            },
        });
    }

    resetForm() {
        this.elementForm.reset();
        this.isEditMode = false;
        this.selectedElement = null;
    }
    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.proposaldataSource.paginator = this.paginator;
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
            // designId: "3FO3EWPJHYSK",
            designId: this.designingId,
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
                this.tabTotals = {};
                let allItems: any[] = [];
                this.tabKeys.forEach((key) => {
                    const items = boqData[key] || [];
                    this.boqDataSources[key] = new MatTableDataSource(
                        items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            ...item
                        }))
                    );
                    this.tabCounts[key] = items.length;
                    const total = items.reduce((sum: number, item: any) => {
                        return sum + (item.clientRate || 0);
                    }, 0);
                    this.tabTotals[key] = total;
                    allItems = [
                        ...allItems,
                        ...items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            roomName: key,
                            ...item
                        }))
                    ];
                });
                this.boqDataSources['All'] = new MatTableDataSource(allItems);
                this.tabCounts['All'] = allItems.length;
                this.tabTotals['All'] = allItems.reduce((sum, item) => sum + (item.clientRate || 0), 0);
                this.tabKeys = ['All', ...this.tabKeys];
            },
        });
    }

    getProposal() {
        const payload = {
            designId: this.designingId,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
        };
        this.switchService.fetchProposal(payload).subscribe({
            next: (res: any) => {
                this.proposals = res.boqProposalList || [];
                this.filteredProposals = [...this.proposals];
            },
        });
    }

    getProposalContent(element: any) {
        if (!element?.proposalContentId || !element?.designId) {
            this.toastr.warning('Invalid proposal data');
            return;
        }
        const payload = {
            designId: element.designId,
            proposalContentId: element.proposalContentId
        };
        this.switchService.fetchProposalContent(payload).subscribe({
            next: (res: any) => {
                this.selectedProposalContent = res;
                try {
                    const parsedContent = JSON.parse(res.contentJs || "{}");
                    const flattened = Object.values(parsedContent).flat();
                    const uniqueFlattened = Array.from(
                        new Map(flattened.map((item: any) => [item.boqId, item])).values()
                    );
                    const totalAmount = uniqueFlattened.reduce(
                        (sum: number, item: any) => sum + (item.clientRate || 0),
                        0
                    );
                    this.proposalApprovalForm.patchValue({ amount: totalAmount });
                    this.proposalContentDataSources = {};
                    this.proposalTabCounts = {};
                    this.proposalContentDataSources["All"] = new MatTableDataSource<any>(uniqueFlattened);
                    this.proposalTabCounts["All"] = uniqueFlattened.length;
                    if (this.paginator) {
                        this.proposalContentDataSources["All"].paginator = this.paginator;
                    }
                    if (this.sort) {
                        this.proposalContentDataSources["All"].sort = this.sort;
                    }
                    const roomKeys = Object.keys(parsedContent).filter(k => k !== "All");
                    roomKeys.forEach(room => {
                        const roomData = parsedContent[room] || [];
                        this.proposalContentDataSources[room] = new MatTableDataSource<any>(roomData);
                        this.proposalTabCounts[room] = roomData.length;
                        if (this.paginator) {
                            this.proposalContentDataSources[room].paginator = this.paginator;
                        }
                        if (this.sort) {
                            this.proposalContentDataSources[room].sort = this.sort;
                        }
                    });

                    this.proposalTabKeys = ["All", ...roomKeys];

                } catch (e) {
                    this.proposalContentDataSources = {
                        All: new MatTableDataSource<any>([])
                    };
                    this.proposalTabKeys = ["All"];
                    this.proposalTabCounts = { All: 0 };
                    this.proposalApprovalForm.patchValue({ amount: 0 });
                }
            },
        });
    }

    getTotalAmount(): number {
        return this.filteredProposals?.reduce(
            (sum, item) => sum + (item.amount || 0),
            0
        ) || 0;
    }

    getClientOrders() {
        const payload = {
            designId: this.designingId,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
        };
        this.switchService.fetchClientOrder(payload).subscribe({
            next: (res: any) => {
                this.clientOrders = res.boqClinetOrderList || [];
                this.filteredClientOrders = [...this.clientOrders];
            }
        });
    }

    getClientOrdersContent(element: any) {
        if (!element?.proposalContentId || !element?.designId) {
            this.toastr.warning('Invalid order data');
            return;
        }

        const payload = {
            designId: element.designId,
            proposalContentId: element.proposalContentId
        };

        this.switchService.fetchClientOrderContent(payload).subscribe({
            next: (res: any) => {
                this.selectedOrderContent = res;

                try {
                    const parsedContent = JSON.parse(res.contentJs || "{}");
                    const flattened = Object.values(parsedContent).flat();
                    const uniqueFlattened = Array.from(
                        new Map(flattened.map((item: any) => [item.boqId, item])).values()
                    );

                    const totalAmount = uniqueFlattened.reduce(
                        (sum: number, item: any) => sum + (item.clientRate || 0),
                        0
                    );

                    this.proposalApprovalForm.patchValue({ amount: totalAmount });

                    // 👇 Use *separate* state for orders
                    this.orderContentDataSources = {};
                    this.orderTabCounts = {};
                    this.orderContentDataSources["All"] = new MatTableDataSource<any>(uniqueFlattened);
                    this.orderTabCounts["All"] = uniqueFlattened.length;

                    if (this.paginator) {
                        this.orderContentDataSources["All"].paginator = this.paginator;
                    }
                    if (this.sort) {
                        this.orderContentDataSources["All"].sort = this.sort;
                    }

                    const roomKeys = Object.keys(parsedContent).filter(k => k !== "All");
                    roomKeys.forEach(room => {
                        const roomData = parsedContent[room] || [];
                        this.orderContentDataSources[room] = new MatTableDataSource<any>(roomData);
                        this.orderTabCounts[room] = roomData.length;

                        if (this.paginator) {
                            this.orderContentDataSources[room].paginator = this.paginator;
                        }
                        if (this.sort) {
                            this.orderContentDataSources[room].sort = this.sort;
                        }
                    });

                    this.orderTabKeys = ["All", ...roomKeys];
                } catch (e) {
                    this.orderContentDataSources = {
                        All: new MatTableDataSource<any>([])
                    };
                    this.orderTabKeys = ["All"];
                    this.orderTabCounts = { All: 0 };
                    this.proposalApprovalForm.patchValue({ amount: 0 });
                }
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
        this.isEditMode = false;
        this.elementForm.reset();
        this.elementForm.enable();
        this.offcanvasService.open(content1, { position: 'end', });
    }


    openLg2(content2: any) {
        this.offcanvasService.open(content2, { position: 'end', panelClass: 'custom-offcanvas' });
    }
    openLg5(content5: any) {
        this.selectedProposal = this.selectedProposalContent;
        this.modalService.open(content5, { centered: true });
    }

    openCreateForm(content: any) {
        this.isEditMode = false;
        this.elementForm.reset();
        const ref = this.offcanvasService.open(content, { position: 'end', scroll: true });
        ref.closed.subscribe(() => this.resetForm());
        ref.dismissed.subscribe(() => this.resetForm());
    }

    openEditFromSelected(element: any, content: any) {
        this.isEditMode = true;
        this.openEditForm(element, content);
    }

    elementSubmit() {
        const formValue = { ...this.elementForm.value };
        delete formValue.elementName;
        delete formValue.elementDescription;
        const payload = {
            ...formValue,
            elementNameAndDescription: `${this.elementForm.value.elementName || ''}`
                + `${this.elementForm.value.elementDescription ? '\n' + this.elementForm.value.elementDescription : ''}`
                + `${this.elementForm.value.brandOrMake ? '\nBrand: ' + this.elementForm.value.brandOrMake : ''}`, // 👈 embed brand
            budgetRate: Number(this.elementForm.value.budgetRate),
            clientRate: Number(this.elementForm.value.clientRate),
            gstPrecent: Number(this.elementForm.value.gstPrecent),
            hsn: Number(this.elementForm.value.hsn),
            breadth: Number(this.elementForm.value.breadth),
            height: Number(this.elementForm.value.height),
            length: Number(this.elementForm.value.length),
            quantity: Number(this.elementForm.value.quantity),
            codeAndCategory: formValue.codeAndCategory?.name,
            brandOrMake: this.elementForm.value.brandOrMake || ''
        };
        this.switchService.saveElementData(payload).subscribe({
            next: (res: any) => {
                if (res?.status === true) {
                    this.toastr.success(res.message || 'Data Saved Successfully');
                    this.elementForm.reset();
                    this.elementFormSubmitted = false;
                } 
            }
        });
    }

    editElement(element?: any) {
        const formValue = { ...this.elementForm.value };
        const payload = [
            {
                boqId: element?.boqId || Number(this.itemId) || 0,
                elementUrl: element?.elementUrl || formValue.elementUrl || '',
                elementNameAndDescription: (
                    `Name : ${formValue.elementName || ''}\n` +
                    `Carcass Material : ${formValue.carcassMaterial || ''}\n` +
                    `Carcass Finish : ${formValue.carcassFinish || ''}\n` +
                    `Shutter Material : ${formValue.shutterMaterial || ''}\n` +
                    `Shutter Finish : ${formValue.shutterFinish || ''}\n` +
                    `Brand : ${formValue.brandOrMake || ''}`
                ).trim(),

                codeAndCategory: formValue.codeAndCategory || element?.codeAndCategory || '',
                orderStatus: formValue.orderStatus || element?.orderStatus || '',
                itemType: formValue.itemType || element?.itemType || '',
                source: formValue.source || element?.source || '',
                status: formValue.status || element?.status || '',
                length: Number(element?.length ?? formValue.length) || 0,
                breadth: Number(element?.breadth ?? formValue.breadth) || 0,
                height: Number(element?.height ?? formValue.height) || 0,
                quantity: Number(element?.quantity ?? formValue.quantity) || 0,
                uom: formValue.uom || element?.uom || '',

                // 🔹 Draft Quantity from table row
                draftQuantity: Number(element?.draftQuantity ?? formValue.draftQuantity) || 0,

                clientRate: Number(element?.clientRate ?? formValue.clientRate) || 0,
                finalAmount: Number(element?.finalAmount ?? formValue.finalAmount) || 0,
                brandOrMake: element?.brandOrMake || formValue.brandOrMake || '',
                discount: Number(element?.discount ?? formValue.discount) || 0,
                serviceCharge: Number(element?.serviceCharge ?? formValue.serviceCharge) || 0,
                baseAmount: Number(element?.baseAmount ?? formValue.baseAmount) || 0,
                budgetRate: Number(element?.budgetRate ?? formValue.budgetRate) || 0,
                hsn: Number(element?.hsn ?? formValue.hsn) || 0,
                gstPrecent: Number(element?.gstPrecent ?? formValue.gstPrecent) || 0,
                amountWithoutGst: Number(element?.amountWithoutGst ?? formValue.amountWithoutGst) || 0,

                designId: this.designingId,
                roomName: element?.roomName || formValue.roomName || '',
                itemCode: element?.itemCode || formValue.itemCode || '',

                companyCode: this.userCompanyCode,
                email: this.userEmail,
                type: this.userType,
            },
        ];
        this.switchService.updateElementData(payload).subscribe({
            next: (res: any) => {
                if (res?.status === true) {
                    this.toastr.success(res.message || 'Data Updated Successfully');
                    this.elementForm.reset();
                    this.offcanvasService.dismiss();
                    this.elementFormSubmitted = false;
                    this.selectedElement = null;
                    this.boqData();
                } 
            }
        });
    }

    proposalFormSubmit(modal: any) {
        const formValue = this.proposalForm.value;
        const selectedData: any = {};
        let totalAmount = 0;
        const seenBoqIds = new Set<number>();
        for (const key in this.boqDataSources) {
            if (this.boqDataSources[key] && this.boqDataSources[key].data) {
                const filtered = this.boqDataSources[key].data.filter((item: any) =>
                    this.selectedElement?.includes(item.boqId)
                );
                if (filtered.length > 0) {
                    selectedData[key] = filtered;
                    filtered.forEach((item: any) => {
                        if (item.clientRate && !seenBoqIds.has(item.boqId)) {
                            totalAmount += Number(item.clientRate);
                            seenBoqIds.add(item.boqId);
                        }
                    });
                }
            }
        }
        const proposalPayload = {
            ...formValue,
            shippingAddress: Number(formValue.shippingAddress),
            contentJs: JSON.stringify(selectedData),
            currentAmount: totalAmount,
            designId: this.designingId
        };
        this.updateElementsAndCreateProposal(proposalPayload, modal);
    }

    private updateElementsAndCreateProposal(proposalPayload: any, modal: any) {
        if (!this.selectedElement || this.selectedElement.length === 0) return;
        const formValue = this.elementForm?.value ?? {};
        const payloads = this.selectedElement.map((boqId: number) => {
            let element: any = null;
            for (const key of this.tabKeys) {
                const dataSource = this.boqDataSources[key];
                if (dataSource) {
                    const found = dataSource.data.find((item: any) => item.boqId === boqId);
                    if (found) {
                        element = found;
                        break;
                    }
                }
            }
            return {
                boqId: element?.boqId || boqId,
                elementUrl: element?.elementUrl || formValue.elementUrl || '',
                elementNameAndDescription:
                    element?.elementNameAndDescription ||
                    (
                        `${formValue.elementName || ''}` +
                        `${formValue.elementDescription ? '\n' + formValue.elementDescription : ''}` +
                        `${formValue.brandOrMake ? '\nBrand: ' + formValue.brandOrMake : ''}`
                    ),
                codeAndCategory: element?.codeAndCategory || formValue.codeAndCategory?.name || '',
                orderStatus: element?.orderStatus || formValue.orderStatus || '',
                itemType: element?.itemType || formValue.itemType || '',
                source: element?.source || formValue.source || '',
                status: element?.status || formValue.status || '',
                length: Number(element?.length ?? formValue.length) || 0,
                breadth: Number(element?.breadth ?? formValue.breadth) || 0,
                height: Number(element?.height ?? formValue.height) || 0,
                quantity: Number(element?.quantity ?? formValue.quantity) || 0,
                uom: element?.uom || formValue.uom || '',
                draftQuantity: Number(element?.draftQuantity ?? formValue.draftQuantity) || 0,
                clientRate: Number(element?.clientRate ?? formValue.clientRate) || 0,
                finalAmount: Number(element?.finalAmount ?? formValue.finalAmount) || 0,
                brandOrMake: element?.brandOrMake || formValue.brandOrMake || '',
                discount: Number(element?.discount ?? formValue.discount) || 0,
                serviceCharge: Number(element?.serviceCharge ?? formValue.serviceCharge) || 0,
                baseAmount: Number(element?.baseAmount ?? formValue.baseAmount) || 0,
                budgetRate: Number(element?.budgetRate ?? formValue.budgetRate) || 0,
                hsn: Number(element?.hsn ?? formValue.hsn) || 0,
                gstPrecent: Number(element?.gstPrecent ?? formValue.gstPrecent) || 0,
                amountWithoutGst: Number(element?.amountWithoutGst ?? formValue.amountWithoutGst) || 0,
                designId: this.designingId,
                roomName: element?.roomName || formValue.roomName || '',
                itemCode: element?.itemCode || formValue.itemCode || '',
                companyCode: this.userCompanyCode,
                email: this.userEmail,
                type: this.userType,
                inProposal: "inprop",
            };
        });
        this.switchService.updateElementData(payloads).subscribe({
            next: () => {
                this.createProposal(proposalPayload, modal);
            },
        });
    }

    private createProposal(proposalPayload: any, modal: any) {
        this.switchService.createProposal(proposalPayload).subscribe({
            next: (res: any) => {
                if (res?.status === true) {
                    this.toastr.success(res.message || "Proposal created successfully");
                    modal.close();
                    this.boqData();
                } 
            },
        });
    }





    extraContentProposalSubmit(modal: any) {
        if (this.extraContentProposalForm.invalid) {
            return;
        }
        const formValue = this.extraContentProposalForm.value;
        const selectedData: any = {};

        for (const key in this.boqDataSources) {
            if (this.boqDataSources[key] && this.boqDataSources[key].data) {
                const filtered = this.boqDataSources[key].data.filter((item: any) =>
                    this.selectedElement?.includes(item.boqId)
                );
                if (filtered.length > 0) {
                    selectedData[key] = filtered;
                }
            }
        }

        const payload = {
            ...formValue,
            contentJs: JSON.stringify(selectedData)
        };
        this.switchService.extraContentProposal(payload).subscribe({
            next: (res) => {
                this.toastr.success("Proposal updated successfully");
                modal.close();
            }
        });
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
        this.selectedProposalContent = null;
        this.proposalContentDataSources = {};
        this.proposalTabKeys = [];
        this.proposalTabCounts = {};
    }

    backToOrders() {
        this.selectedOrderContent = null;
        this.orderContentDataSources = {};
        this.orderTabKeys = [];
        this.orderTabCounts = {};
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
            this.selectedElement = data
                .filter((row: any) => row.inProposal !== 'inprop')
                .map((row: any) => row.boqId);
        }
        else {
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
            return;
        }
        dataSource.data[index] = {
            ...dataSource.data[index],
            ...updatedElement
        };
        dataSource._updateChangeSubscription();
    }

    // toggleColumn(columnKey: string, event: any) {
    //     if (event.target.checked) {
    //         this.selectedColumns.add(columnKey);
    //     } else {
    //         this.selectedColumns.delete(columnKey);
    //     }
    //     this.displayedColumns = ['select', 'slNo', 'elementUrl', ...Array.from(this.selectedColumns)];
    // }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            // show preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

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
        {
            invoiceNo: 'INV-002',
            invoiceType: 'Tax Invoice',
            orderNo: 'ORD-104',
            orderAmount: 5000,
            invoiceDate: new Date(),
            uploadedBy: 'Admin',
            status: 'Approved',
            invoiceAmount: 5500,
            creditNoteAmount: 200
        },
        {
            invoiceNo: 'INV-003',
            invoiceType: 'Tax Invoice',
            orderNo: 'ORD-105',
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
    sectionName = 'Unsectioned (12)';
    sectionTotal = 10000;
    activeTab: string = 'tab1';
    tab1Checked: boolean = false;
    tab2Checked: boolean = false;
    tab3Checked: boolean = false;

    selectTab(tab: string) {
        this.activeTab = tab;
    }

    fileName: string | null = null;

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.fileName = input.files[0].name;
        } else {
            this.fileName = null; // Reset if no file selected
        }
    }
    active5 = 'Home';
    active6 = 'Home'
    active7 = 'Home1'


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.myFileClick();
        this.detailsClick();
    }

    myFileClick() {
        const fileManagerFolders = document.querySelector('.file-manager-folders');
        const fileManagerNavigation = document.querySelector('.file-manager-navigation');
        if (window.innerWidth <= 992) {
            if (fileManagerFolders) {
                fileManagerFolders.classList.add('open');
            }
            if (fileManagerNavigation) {
                fileManagerNavigation.classList.add('close');
            }
        } else {
            if (fileManagerFolders) {
                fileManagerFolders.classList.remove('open');
            }
            if (fileManagerNavigation) {
                fileManagerNavigation.classList.remove('close');
            }
        }
    }
    detailsClick() {
        const selectedFileDetails = document.querySelector('.selected-file-details');

        if (window.innerWidth <= 1180 && selectedFileDetails) {
            selectedFileDetails.classList.add('open');
        } else {
            if (selectedFileDetails) {
                selectedFileDetails.classList.remove('open');
            }
        }
    }

    openModal(recceContent3: any) {
        this.modalService.open(recceContent3, { centered: true, size: 'lg' });
    }
    openModal1(recceContent1: any) {
        this.modalService.open(recceContent1, { centered: true, size: 'lg' });
    }
    openModal2(recceContent2: any) {
        this.modalService.open(recceContent2, { centered: true, size: 'lg' });
    }


    onClkDesign(key: string = '', type: 'newDesign' | 'projectList' = 'newDesign') {
        this.userData = localStorage.getItem('userDetails');
        this.switchService.onAdonai(JSON.parse(this.userData)?.email).subscribe({
            next: (res: any) => {
                if (!res.status) {
                    alert(res.message);
                    return;
                }
                if (key === 'i') {
                    this.dateDiff = res.datediff;
                    this.roleid = res.roleId;
                    this.actstatus = res.activityStatus;
                } else {
                    const url = type === 'newDesign' ? res.newDesign : res.projectList;
                    window.open(url, '_blank');
                    this.toastr.success(res.message);
                }
            }
        });
    }

    // getLst() {
    //     let payload = {
    //         email: this.userEmail,
    //         type: this.userType,
    //         companyname: this.userCompanyName,
    //         companycode: this.userCompanyCode,
    //         projectId: '',
    //         projectname: '',
    //         filter: 'All',
    //     }
    //     this.switchService.projectLst(payload).subscribe({
    //         next: (res: any) => {
    //             if (res) {
    //                 this.projectLst = res.projList;
    //                 this.designerDataSource.data = this.projectLst;
    //             } 
    //         }
    //     })
    // }


    getAssignProjects() {
        let payload: any = {
            email: this.userEmail,
            type: this.userType,
            companycode: this.userCompanyCode,
            projectId: this.projectId
        };

        if (this.userRole === 'ADMIN') {
            payload.currentUserEmail = '';
            payload.requestFrom = 'Admin';
        } else if (this.userRole === 'USER') {
            payload.currentUserEmail = this.userEmail;
            payload.requestFrom = 'User';
        }
        this.switchService.fetchAssgnAdonaiDesign(payload).subscribe({
            next: (res: any) => {
                if (res) {
                    let projects = Array.isArray(res) ? res : [res];
                    this.designingId = res?.designId || '';
                    this.designCompletionStatus = res.designCompletionStatus;
                    if (this.userRole === 'ADMIN') {
                        this.projectLst = projects;
                    } else if (this.userRole === 'USER') {
                        this.projectLst = projects.filter(
                            p => p.assignedDesigner === this.userEmail
                        );
                    }

                    this.designerDataSource.data = this.projectLst;
                } else {
                    this.projectLst = [];
                    this.designerDataSource.data = [];
                }
            },
        });
    }


    applyDesignerFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.designerDataSource.filter = filterValue.trim().toLowerCase();
    }

    recceSubmit(modal: any) {
        if (this.recceForm.invalid) {
            this.toastr.warning('Please fill all required fields');
            return;
        }
        const formValue = this.recceForm.value;
        const payload = {
            ...formValue,
            recceAssigne: formValue.recceAssigne
                ? `${formValue.recceAssigne.email},${formValue.recceAssigne.username}`
                : '',
            recceStakeHolders: formValue.recceStakeHolders
                ? `${formValue.recceStakeHolders.email},${formValue.recceStakeHolders.username}`
                : '',
            recceClientPoc: formValue.recceClientPoc
                ? `${formValue.recceClientPoc.email},${formValue.recceClientPoc.username}`
                : '',
            files: this.files.value
        };
        this.switchService.createRecce(payload).subscribe({
            next: () => {
                this.toastr.success('Recce created successfully!');
                this.getRecceData();
                modal.close();
                this.recceForm.reset();
            },
        });
    }

    get files(): FormArray {
        return this.recceForm.get('files') as FormArray;
    }

    get updateFiles(): FormArray {
        return this.updateRecceForm.get('files') as FormArray;
    }

    onUpdateFilesChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        this.updateFiles.clear();
        Array.from(input.files).forEach(file => {
            this.updateFiles.push(this.fb.control(file));
        });
    }

    onFilesChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;
        this.files.clear();
        Array.from(input.files).forEach(file => {
            this.files.push(this.fb.control(file));
        });
    }

    getRecceData() {
        const payload = {
            email: this.userEmail,
            companyCode: this.userCompanyCode,
            type: this.userType,
            projectId: this.projectId
        };
        this.switchService.fetchRecceData(payload).subscribe({
            next: (res: any) => {
                if (res && res.length > 0) {
                    this.recceList = res.map((recce: any) => ({
                        ...recce,
                        imageList: recce.imageUrls
                            ? recce.imageUrls.split(',').map((url: string) => url.trim())
                            : [],
                        recceAssigneEmails: recce.recceAssigne
                            ? recce.recceAssigne.split(',').map((v: string) => v.trim())
                            : [],
                        recceStakeHoldersEmail: recce.recceStakeHolders
                            ? recce.recceStakeHolders.split(',')[0].trim() : '',
                        recceClientPocEmail: recce.recceClientPoc
                            ? recce.recceClientPoc.split(',')[0].trim() : '',
                    }));
                    this.blockedStages = [];
                    this.recceList.forEach(recce => {
                        if (recce.recceStage) {
                            this.blockedStages.push(recce.recceStage);
                        }
                    });
                    this.filterRecceByStage('Recce Details');
                }
            },
        });
    }

    filterRecceByStage(stage: string) {
        this.filteredRecce = this.recceList.filter(r => r.recceStage === stage);
    }

    updateRecce(modal: any) {
        if (this.updateRecceForm.invalid) {
            this.toastr.warning('Please fill required fields');
            return;
        }
        const payload = {
            ...this.updateRecceForm.value,
            recceStage: this.recceStage,
            projectId: this.projectId,
            updatedBy: this.userEmail,
            updatedTime: new Date().toISOString(),
            // files :this.updateRecceForm.value.files,
        };
        this.switchService.updateRecce(payload).subscribe({
            next: (res: any) => {
                this.toastr.success('Recce updated successfully');
                this.getRecceData();
            },
        });
    }

    updateProjectSubmit(modal: any) {
        if (this.updateProjectForm.valid) {
            const formValue = this.updateProjectForm.getRawValue();
            // const formValue = this.updateProjectForm.value;
            const payload = {
                ...formValue,
                updatedBy: `${this.userName},${this.userEmail}`,
            };
            this.switchService.updateAssgnAdonaiDesign(payload).subscribe({
                next: (res: any) => {
                    this.toastr.success('Project updated successfully');
                    modal.close();
                    this.getAssignProjects();
                }
            });
        }
    }

    openDesignLink(url: string) {
        if (url) {
            window.open(url, '_blank');
        } else {
            this.toastr.warning('Design URL not available');
        }
    }

    getRecceByStage(stage: string) {
        return this.recceList.filter(r => r.recceStage === stage);
    }

    isBlocked(stageName: string): boolean {
        return this.blockedStages.includes(stageName);
    }
    onShare(proposal: any) {
        const designId = proposal?.designId;
        const proposalContentId = proposal?.proposalContId;
        this.router.navigate(['/dashboard/quotation'], {
            queryParams: {
                designId: designId,
                proposalContentId: proposalContentId
            }
        });
    }

}
