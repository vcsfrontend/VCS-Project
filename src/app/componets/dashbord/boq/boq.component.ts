import { Component, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray,Validators  } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
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
import { emptyDoc } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperModule, } from 'swiper/angular';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Virtual, Zoom, Autoplay,
    Thumbs, Mousewheel, Keyboard, EffectCube, EffectFade, EffectFlip, EffectCoverflow,
    SwiperOptions, Swiper, } from 'swiper';
interface Plan { name: string; checked: boolean; isDefault: boolean; isCustom?: boolean; }
SwiperCore.use([ Navigation, Pagination, Scrollbar, A11y, Virtual, Mousewheel, Zoom, Autoplay,
    Thumbs, Keyboard, EffectCube, EffectFade, EffectFlip, EffectCoverflow,]);

@Component({
    selector: 'app-boq',
    standalone: true,
    imports: [SharedModule, NgSelectModule, NgbModule,
        NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule,
        NgApexchartsModule, MatPaginatorModule, MaterialModuleModule, CommonModule, ToastrModule,
        NgbOffcanvasModule, SwiperModule],
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
        'projectArea', 'assignedDesigner', 'designUrl', 'projectCompletion', 'projectStartDate', 'projectEndDate'];
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
    public userList: any; filteredUserList: any[] = []; recceStage: string = '';
    proposalContentDataSources: { [key: string]: MatTableDataSource<any> } = {}; recceList: any[] = [];
    filteredRecce: any[] = []; blockedStages: string[] = [];selectedModel : string ='';
    selectedProposalCount: any = null;
    isReadOnly :boolean = false; skipClientForm:boolean=false; clientData: any = null;
    skipProposalForm : boolean = false;minDateTime: string = '';showPanelFields : boolean = false;
    showShutterFields : boolean = false;dimensionsList : any[] = [];currentStep : number =1;
    // selectedColumns: Set<string> = new Set();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;
    @ViewChild('tabContainer', { static: false }) tabContainer!: ElementRef;

    @ViewChild(MatSort) sort!: MatSort;
    tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
    selectedCategory: any; editIndex: number | null = null; designId: any;
    boqList: any; tabCounts: { [key: string]: number } = {}; elementForm!: FormGroup; proposalForm!: FormGroup
    proposalApprovalForm!: FormGroup; extraContentProposalForm!: FormGroup; recceForm!: FormGroup;
    updateRecceForm!: FormGroup; updateProjectForm!: FormGroup; cutListForm!: FormGroup; generateCutListForm!: FormGroup;
    addMoreVisible: boolean = false; selectedElementNames: string[] = []; selectedElement: any = null;
    newItem: string = ''; isEditMode = false; selectedLibrary: any; modal: any; previewUrl: string | ArrayBuffer | null = null;
    selectedFile: File | null = null;
    activeId: any = 0; highlightedTabIndex = 0; selectedProposal: any;        
    filteredProposals: any[] = []; filteredClientOrders: any[] = []; tabTotals: { [key: string]: number } = {};
    orderContentDataSources: { [key: string]: MatTableDataSource<any> } = {};
    orderTabCounts: { [key: string]: number } = {}; orderTabKeys: string[] = [];
    projectLst: any = []; boqproject: any; showAllProposals = false; libraryList: any[] = [];
    libraryListData: any[] = [];objectKeys = Object.keys;
    showLeftArrow = false; showRightArrow = false;step = 1;submittedStep1:boolean=false;
    submittedStep2 : boolean = false;submittedStep3 : boolean = false;
    submitted: boolean = false; projectConfigList: string[] = []; 
    showOtherDesignerFields : boolean =false;showOtherRelationshipFields: boolean=false;
    thumbsSwiper: any;graniteEnabled: boolean = false;TDMCEnabled : boolean=false;projectMarginList:any;
    designerData: any[] = []; filteredDesignerData: any[] = [];   override panelList: any[] = [];
    allPanels: any[] = []; showPanelList: boolean = false; optimizerCuts: any[] = []; 
    showManualFields = false;
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
    extraFields = [
        { label: 'Shutter Length 1', control: 'l1' },
        { label: 'Shutter Width 1', control: 'w1' },
        { label: 'Shutter Length 2', control: 'l2' },
        { label: 'Shutter Width 2', control: 'w2' }
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

    openProjectModal(content45: any, project: any) {
        if (!project) {
            return;
        }
        this.updateProjectForm.patchValue({
            projectId: project.projectId || '',
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

        // Handle form enable/disable logic
        if (project.designCompletionStatus === 'Complete') {
            this.updateProjectForm.disable();
        } else if (this.userRole === 'USER') {
            Object.keys(this.updateProjectForm.controls).forEach(control => {
                if (control !== 'designCompletionStatus') {
                    this.updateProjectForm.get(control)?.disable();
                } else {
                    this.updateProjectForm.get(control)?.enable();
                }
            });
        } else if (this.userRole === 'ADMIN') {
            Object.keys(this.updateProjectForm.controls).forEach(control => {
                this.updateProjectForm.get(control)?.enable();
            });
        }

        // Open modal safely
        this.modalService.open(content45, { backdrop: 'static' });
    }

    onCreateProposalClick(content: any) {
        const storedClientData = localStorage.getItem("storedClientData");
        this.getProposal();
        if (!this.selectedElement || this.selectedElement.length === 0) {
            this.toastr.warning("Please select at least one Element");
            return;
        }
        this.openRights4(content);
    }

    openRights4(content4: any) {
        this.modalService.open(content4, { centered: true, size: 'md' });
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
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());

    this.minDateTime = `${yyyy}-${mm}-${dd}`;
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
            codeAndCategory: [],
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
            l1: [''],
            l2: [''],
            w1: [''],
            w2: [''],
            cl: [''],
            cw: [''],
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
            margin:[''],
            discount: [0,],
            others: [0, [Validators.required]],
            clientName: ['',[Validators.required]],
            clientAddress: ['',[Validators.required]],
            clientEmail:['',[Validators.required, Validators.email]],
            projectConfig: ['',[Validators.required]],
            dedEmail: ['',[Validators.required]],
            dedMobile: ['',[Validators.required]],
            dedName: ['',[Validators.required]],
            rmdEmail: ['',[Validators.required]],
            rmdMobile: ['',[Validators.required]],
            projectName: [''],
            flatNo: [''],
            rmdName: ['',[Validators.required]],
            clientMobileNumber:['',[
                Validators.required,
                 Validators.pattern(/^[0-9]{10}$/)
            ]],
            orderFrom: ['',[Validators.required]],
            orderFor: [this.userCompanyName],
            vendorId: ['',[Validators.required]],
            shippingAddress: ['',[Validators.required]],
            startDate: ['',[Validators.required]],
            dueDate: ['',[Validators.required]],
            gstNo: [''],
            contentJs: [''],
            proposalContId: [''],
            designId: [''],
            companyCode: this.userCompanyCode,
            tdmc: [0.0, [Validators.required]],
            gmc: [0.0, [Validators.required]],
            gsc: [0.0, [Validators.required]],
            tdsc: [0.0, [Validators.required]],
            gpa: [0.0, [Validators.required]],
            tdpa: [0.0, [Validators.required]],
            clientDataJs: [''],
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
        this.cutListForm = this.fb.group({
            l1: [0],
            l2: [0],
            w1: [0],
            w2: [0],
            code:[''],
            email:this.userEmail,
            companyCode:this.userCompanyCode,
            companyName:this.userCompanyName
        });
        this.generateCutListForm = this.fb.group({
            specification: ['', Validators.required],
            code: [{ value: '', disabled: true }],
            l1: [{ value: '', disabled: true }],
            l2: [{ value: '', disabled: true }],
            w1: [{ value: '', disabled: true }],
            w2: [{ value: '', disabled: true }],
            email: [this.userEmail],
            companyCode: [this.userCompanyCode],
            designId: [this.designId],
        });

        this.getUsers();
        this.getAssignProjects();
        this.getProjectConfig();
        this.getMarginData();
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
        this.getLibraryData();
        this.getLibraryNames();
        this.getOptimizerCut();
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
        selectedValue: string | { name?: string; code?: string },
        element: any
    ) {
        // Validate element
        if (!element?.boqId) {
            this.toastr.warning('Invalid element selected');
            return;
        }

        // Determine correct field value
        let fieldValue = '';
        if (typeof selectedValue === 'string') {
            fieldValue = selectedValue;
        } else if (field === 'codeAndCategory') {
            fieldValue = selectedValue?.code ?? '';
        } else {
            fieldValue = selectedValue?.name ?? '';
        }

        // Update local form state
        this.elementForm.patchValue({ [field]: fieldValue });

        // Extract brand/make logic for itemType
        let brandOrMake = element.brandOrMake ?? '';
        if (field === 'itemType' && !brandOrMake && element.elementNameAndDescription) {
            const [, brandLine] = element.elementNameAndDescription.split('\n');
            if (brandLine?.includes(':')) {
                brandOrMake = brandLine.split(':')[1]?.trim() || '';
            }
        }
        const payload = [{
            boqId: element.boqId,
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
            brandOrMake,
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

        // Send update request
        this.switchService.updateElementData(payload).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    this.toastr.success(`${field} updated successfully`);
                    element[field] = fieldValue;
                    if (field === 'itemType') {
                        element.brandOrMake = brandOrMake;
                    }
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
                const contentPayload = {
                    proposalContentId: payload.proposalContentId,
                    designId: payload.designId
                };
                this.getProposalContent(contentPayload);
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
        this.checkArrows();
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
            designId: this.designingId,
            bomRequired: false,
            wardrobeRequired: true,
            kbRequired: true
        };
        this.switchService.fetchBoqData(payload).subscribe({
            next: (res) => {
                const boqData = res?.boqResponse?.boqData || {};
                const pannelResponse = res?.pannelResponse?.pannelResponse || [];
                this.tabKeys = Object.keys(boqData);
                let allItems: any[] = [];
                this.tabKeys.forEach((key: string) => {
                    const items: any[] = boqData[key] || [];
                    this.boqDataSources[key] = new MatTableDataSource(
                        items.map((item: any, index: number) => ({
                            slNo: index + 1,
                            ...item
                        }))
                    );
                    this.tabCounts[key] = items.length;
                    this.tabTotals[key] = items.reduce(
                        (sum: number, item: any) => sum + (item.clientRate || 0),
                        0
                    );
                    allItems = [
                        ...allItems,
                        ...items.map((item: any, i: number) => ({
                            slNo: i + 1,
                            roomName: key,
                            ...item
                        }))
                    ];
                });
                this.boqDataSources['All'] = new MatTableDataSource(allItems);
                this.tabKeys = ['All', ...this.tabKeys];
                this.allPanels = (pannelResponse as any[]).map((item: any, i: number) => ({
                    order: i + 1,
                    ...item
                }));
            }
        });
    }

    onShowPanelList() {
        this.showPanelList = true;
    }

    onHidePanelList() {
        this.showPanelList = false;
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
                 if (this.proposals.length > 0) {
                    this.skipClientForm = true;  
                    this.skipProposalForm = true;
                    this.step = 3;
                    this.step = 3;  
                    const firstProposal = this.proposals[0];
                    const payload = {
                        proposalContentId: firstProposal.proposalContentId,
                        designId: firstProposal.designId
                    };   
                    this.getProposalContent(payload);           
                } else {
                    this.skipClientForm = false; 
                    this.skipProposalForm = false;
                    this.step = 1;              
                }
            },
        });
    }

    getProposalContent(element ?: any) {
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
                if(this.selectedProposalContent.clientDataJs){
                    localStorage.setItem("storedClientData", this.selectedProposalContent.clientDataJs);
                }
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

    cutList(content46: any) {
        this.modalService.open(content46, { centered: true });
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
        const breadthNum = Number(this.elementForm.value.breadth || 0);
        const lengthNum = Number(this.elementForm.value.length || 0);
        const heightNum = Number(this.elementForm.value.height || 0);
        const quantityNum = Number(this.elementForm.value.quantity || 0);
        const w1Num = Number(this.elementForm.value.w1 || 0);
        const w2Num = Number(this.elementForm.value.w2 || 0);
        const l1Num = Number(this.elementForm.value.l1 || 0);
        const l2Num = Number(this.elementForm.value.l2 || 0);
        const clNum = breadthNum - (w1Num + w2Num);
        const cwNum = lengthNum - (l1Num + l2Num); 
        const payload = {
            ...formValue,
            elementNameAndDescription:
                `${this.elementForm.value.elementName || ''}` +
                `${this.elementForm.value.elementDescription ? '\n' + this.elementForm.value.elementDescription : ''}` +
                `${this.elementForm.value.brandOrMake ? '\nBrand: ' + this.elementForm.value.brandOrMake : ''}`,
            budgetRate: Number(this.elementForm.value.budgetRate || 0).toString(),
            clientRate: Number(this.elementForm.value.clientRate || 0).toString(),
            gstPrecent: Number(this.elementForm.value.gstPrecent || 0).toString(),
            hsn: Number(this.elementForm.value.hsn || 0).toString(),
            breadth: breadthNum,
            height: heightNum,
            length: lengthNum,
            quantity: quantityNum,
            codeAndCategory: formValue.codeAndCategory?.name || '',
            brandOrMake: this.elementForm.value.brandOrMake || '',
            w1: w1Num.toString(),
            w2: w2Num.toString(),
            l1: l1Num.toString(),
            l2: l2Num.toString(),
            cl: clNum.toString(),
            cw: cwNum.toString(),
            designId:this.designingId,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType
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
        this.submittedStep3 = true;

        const step3Fields = ['orderFrom', 'vendorId', 'shippingAddress', 'startDate', 'dueDate'];

        const invalidStep3 = step3Fields.some(field => this.proposalForm.get(field)?.invalid);
        if (invalidStep3) {
            this.toastr.warning('Please fill all required fields in Step 3.');
            return;
        }
        const formValue = this.proposalForm.value;
        const selectedData: any = {};
        const seenBoqIds = new Set<number>();
        let totalAmount = 0;
        Object.keys(this.boqDataSources).forEach(key => {
            const data = this.boqDataSources[key]?.data || [];
            const filtered = data.filter((item: any) => this.selectedElement?.includes(item.boqId));
            if (filtered.length) {
                selectedData[key] = filtered;
                filtered.forEach((item: any) => {
                    if (item.clientRate && !seenBoqIds.has(item.boqId)) {
                        totalAmount += Number(item.clientRate);
                        seenBoqIds.add(item.boqId);
                    }
                });
            }
        });
        const {
            margin, discount, others, clientName, clientAddress, clientEmail, projectConfig,
            dedEmail, dedMobile, dedName, rmdEmail, rmdMobile, projectName, flatNo,
            rmdName, clientMobileNumber, tdmc, gmc, gsc, tdsc, gpa, tdpa
        } = formValue;
        const clientData = {
            margin, discount, others, clientName, clientAddress, clientEmail, projectConfig,
            dedEmail, dedMobile, dedName, rmdEmail, rmdMobile, projectName, flatNo, rmdName, clientMobileNumber,
            tdmc, gmc, gsc, tdsc, gpa, tdpa
        };
          const storedClientData = localStorage.getItem("storedClientData");
          let clientDataToSend = {};
           if (this.skipClientForm ==true ) {
            if (storedClientData) {
                clientDataToSend = JSON.parse(storedClientData);
            }
            } else {
            clientDataToSend = selectedData || {};
            }
        const proposalPayload = {
            email: this.userEmail,
            type: this.userType,
            companyCode:this.userCompanyCode,
            shippingAddress: formValue.shippingAddress,
            gstNo: formValue.gstNo,
            startDate: formValue.startDate,
            dueDate: formValue.dueDate,
            vendorId: formValue.vendorId,
            createdBy: this.userName,
            orderFor: formValue.orderFor,
            orderFrom: formValue.orderFrom,
            contentJs: JSON.stringify(selectedData),
            currentAmount: totalAmount,
            designId: this.designingId,
            clientDataJs: JSON.stringify(clientDataToSend),
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


    
    getAssignProjects(): void {
        const payload: any = {
            email: this.userEmail,
            type: this.userType,
            companycode: this.userCompanyCode,
            projectId: this.projectId,
        };
        if (this.userRole === 'ADMIN') {
            payload.currentUserEmail = '';
            payload.requestFrom = 'Admin';
        } else {
            payload.currentUserEmail = this.userEmail;
            payload.requestFrom = 'User';
        }
        this.switchService.fetchAssgnAdonaiDesign(payload).subscribe({
            next: (res: any) => {
                if (!res) {
                    this.designerData = [];
                    this.filteredDesignerData = [];
                    return;
                }
                const projects = Array.isArray(res) ? res : [res];
                this.designingId = res?.designId || '';
                this.designCompletionStatus = res?.designCompletionStatus || '';
                if (this.userRole === 'ADMIN') {
                    this.designerData = projects;
                } else {
                    this.designerData = projects.filter(
                        (p: any) => p?.assignedDesigner?.toLowerCase() === this.userEmail?.toLowerCase()
                    );
                }
                this.filteredDesignerData = [...this.designerData];
            }
        });
    }

    applyDesignerFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value
            ?.trim()
            ?.toLowerCase() || '';

        if (!filterValue) {
            this.filteredDesignerData = [...this.designerData];
            return;
        }

        this.filteredDesignerData = this.designerData.filter((item: any) =>
            item?.projectId?.toLowerCase().includes(filterValue) ||
            item?.projectName?.toLowerCase().includes(filterValue)
        );
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

    getLibraryData() {
        this.switchService.getLibrarayData().subscribe({
            next: (res: any) => {
                if (res && res.items) {
                    this.libraryListData = res.items;
                }
            }
        });
    }
    
    getLibraryNames() {
        this.switchService.getLibrarayNames().subscribe({
            next: (res: any) => {
                if (res && res.libraries) {
                    this.libraryList = res.libraries;
                }
            }
        });
    }

    onTabChange(event: any) {
  this.activeTab = event.nextId;

  if (this.activeTab === '1') {
    this.isReadOnly = true;
    this.elementForm.disable();
    this.elementForm.get('quantity')?.enable();
  } else if (this.activeTab === '5') {
    this.isReadOnly = false;
    this.elementForm.enable();
  }
}
scrollTabs(direction: 'left' | 'right') {
    const container = this.tabContainer.nativeElement;
    const scrollAmount = 150;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
    setTimeout(() => this.checkArrows(), 300);
  }

  checkArrows() {
    const container = this.tabContainer?.nativeElement;
    if (!container) return;

    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow = container.scrollWidth > container.clientWidth + container.scrollLeft;
  }

  prevStep() {
    if (this.step > 1) {
      this.step--;
    }
  }
  nextStep() {
  if (this.skipClientForm) {
    if (this.step === 1) {
      this.step = 2;
      return;
    }
  }
  if (this.step === 1) {
    this.submittedStep1 = true;
    const step1Fields = ['clientName', 'clientAddress', 'clientMobileNumber', 'clientEmail'];
    step1Fields.forEach(field => {
      const control = this.proposalForm.get(field);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
     const invalidStep1 = step1Fields.some(field => this.proposalForm.get(field)?.invalid);
    if (invalidStep1) {
      this.toastr.warning('Please fill all required fields in Step 1.');
      return;
    }
    this.step = 2;
  }
  else if (this.step === 2) {
    this.submittedStep2 = true;
    const step2Fields = ['projectConfig', 'dedEmail', 'rmdEmail',];
    step2Fields.forEach(field => {
      const control = this.proposalForm.get(field);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
     const invalidStep2 = step2Fields.some(field => this.proposalForm.get(field)?.invalid);
    if (invalidStep2) {
      this.toastr.warning('Please fill all required fields in Step 2.');
      return;
    }
    this.step = 3;
  }
  else if (this.step === 3) {
  return
}

    }
  allowOnlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
  }
  allowOnlynum(event: KeyboardEvent) {
    const allowedChars = '0123456789.';
    const inputChar = event.key;

    if (
      ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(inputChar)
    ) {
      return;
    }

    const currentValue = (event.target as HTMLInputElement).value;

    if (!allowedChars.includes(inputChar) || (inputChar === '.' && currentValue.includes('.'))) {
      event.preventDefault();
    }
  }
  get g() {
    return this.proposalForm.controls;
  }
   onDedSelected(selectedUser: any): void {
    if (selectedUser?.email === 'Other') {
    this.showOtherDesignerFields = true;

    // Clear auto-fill fields
    this.proposalForm.patchValue({
      dedMobile: '',
      dedName: ''
    });
    } else {
    this.showOtherDesignerFields = false;
    if (selectedUser) {
      this.proposalForm.patchValue({
        dedMobile: selectedUser.phoneNumber || '',
        dedName: selectedUser.username || ''
      });
    } else {
      this.proposalForm.patchValue({
        dedMobile: '',
        dedName: ''
      });
    }
  }
  }

    onUserSelected(selectedUser: any): void {
        if (selectedUser?.email === 'Other') {
            this.showOtherRelationshipFields = true;
            this.proposalForm.patchValue({
                rmdMobile: '',
                rmdName: ''
            });
        } else {
            this.showOtherRelationshipFields = false;
            if (selectedUser) {
                this.proposalForm.patchValue({
                    rmdMobile: selectedUser.phoneNumber || '',
                    rmdName: selectedUser.username || ''
                });
            } else {
                this.proposalForm.patchValue({
                    rmdMobile: '',
                    rmdName: ''
                });
            }
        }
    }
    
   getProjectConfig(){
    let payload = {
      companycode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      type: JSON.parse(this.userData).type
    };
    this.switchService.fetchProjectConfig(payload).subscribe({
      next: (res: any) => {
        if (res && res.configId) {
           const configs: string[] = [];
          for (let i = 1; i <= 10; i++) {
            const value = res[`f${i}`];
            if (value) configs.push(value);
          }
          this.projectConfigList = configs;
        } 
      }
    });
  }
   toggleGraniteFields() {
    this.graniteEnabled = !this.graniteEnabled;
    if (!this.graniteEnabled) {
      this.proposalForm.patchValue({ gpa: 0, gsc: 0,gmc:0 });
    }
  }
  toggleTDMCFields() {
    this.TDMCEnabled = !this.TDMCEnabled;
    if (!this.TDMCEnabled) {
      this.proposalForm.patchValue({ tdmc: 0, tdpa: 0,tdsc:0 });
    }
  }

  getMarginData(){
    let payload = {
      companycode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      type: JSON.parse(this.userData).type
    };
    this.switchService.fetchDynamicMargin(payload).subscribe({
      next: (res: any) => {
        if (res) {
          const configs: { name: string, percent: number }[] = [];
          for (let i = 1; i <= 10; i++) {
            const name = res[`f${i}`];
            const percent = res[`f${i}Percent`];
            if (name) {
              configs.push({ name, percent: percent || 0 });
            }
          }
          this.projectMarginList = configs;
        }
      }
    });
  }

  openSelect(select: NgSelectComponent) {
    setTimeout(() => select.open(), 100);
  }

  closeSelect(select: NgSelectComponent) {
    setTimeout(() => select.close(), 150);
  }

  goBackToProjects() {
    this.router.navigate(['/dashboard/projects']);
  }

  statusDisplayMap: { [key: string]: string } = {
    'Approve': 'Approved',
    'Pending for Approval': 'Pending for Approval',
    'Rejected': 'Rejected'
  };
  
    getPanelList() {
        const payload = {
            designId: this.designId,
            email: this.userEmail,
            bomRequired: false,
            wardrobeRequired: true,
            kbRequired: true
        };
        this.switchService.panelListData(payload).subscribe({
            next: (res: any) => {
                if (Array.isArray(res)) {
                    this.panelList = res;
                    this.allPanels = [];
                    res.forEach((room: any) => {
                        room.detailedList?.forEach((cab: any) => {
                            const panels = cab.pannelDataList || [];
                            this.allPanels.push(...panels);
                        });
                    });
                }
            }
        });
    }

    getOptimizerCut() {
        const payload = {
            companyname: JSON.parse(this.userData)?.companyName,
            companycode: JSON.parse(this.userData)?.companyCode,
            email: JSON.parse(this.userData)?.email,
            type: JSON.parse(this.userData)?.type,
        };
        this.switchService.getOptimizerCut(payload).subscribe({
            next: (res: any) => {
                this.optimizerCuts = Array.isArray(res) ? res : [];
            },
        });
    }

    sendCutsToAnotherApi() {
        const specification = this.generateCutListForm.get('specification')?.value;
        if (specification === 'manual') {
            const dimensionObj = {
            modelName: this.generateCutListForm.get('code')?.value,
            l1: Math.floor(this.generateCutListForm.get('l1')?.value),
            l2: Math.floor(this.generateCutListForm.get('l2')?.value),
            w1: Math.floor(this.generateCutListForm.get('w1')?.value),
            w2: Math.floor(this.generateCutListForm.get('w2')?.value),
        };
        console.log('dimension object',dimensionObj);
        if (!this.dimensionsList) {
            this.dimensionsList = [];
        }
        this.dimensionsList.push(dimensionObj);
        console.log(this.dimensionsList);
            const payload = {
                specification: specification,
                // 
                dimesions: this.dimensionsList,
                companyCode: this.userCompanyCode,
                email: this.userEmail,
                type: this.userType,
                designId: this.designingId,
            };
            console.log('📦 Manual Payload:', payload);
        }
        else {
            if (!this.optimizerCuts?.length) {
                console.warn('No cuts available to send');
                return;
            }
            const dimesions = this.optimizerCuts.map(cut => ({
                modelName: cut.code,
                l1: Math.floor(cut.l1),
                l2: Math.floor(cut.l2),
                w1: Math.floor(cut.w1),
                w2: Math.floor(cut.w2),
            }));
            const payload = {
                specification: specification,
                dimesions: dimesions,
                companyCode: this.userCompanyCode,
                email: this.userEmail,
                type: this.userType,
                designId: this.designingId,
            };
            console.log('📦 Default Payload:', payload);
            // this.switchService.sendToAnotherApi(payload).subscribe({
            //     next: () => this.toastr.success('Data sent successfully'),
            //     error: (err) => {
            //         console.error(err);
            //         this.toastr.error('Error sending data');
            //     },
            // });
        }
    }

    cutListSubmit() {
        const payload = {
            ...this.cutListForm.value,
            companyName:this.userCompanyName,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
        };
        console.log(payload)
    }


    onSpecificationChange(selectedItem: any) {
        const selectedValue = selectedItem?.name;
        const controls = this.generateCutListForm.controls;
        if (selectedValue === 'manual') {
            this.showManualFields = true;
            controls['code'].enable();
            controls['l1'].enable();
            controls['l2'].enable();
            controls['w1'].enable();
            controls['w2'].enable();
            controls['code'].setValidators([Validators.required]);
            controls['l1'].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
            controls['l2'].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
            controls['w1'].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
            controls['w2'].setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
        } else {
            this.showManualFields = false;
            controls['code'].disable();
            controls['l1'].disable();
            controls['l2'].disable();
            controls['w1'].disable();
            controls['w2'].disable();
            controls['code'].clearValidators();
            controls['l1'].clearValidators();
            controls['l2'].clearValidators();
            controls['w1'].clearValidators();
            controls['w2'].clearValidators();
            this.getOptimizerCut();
        }
        Object.values(controls).forEach(control => control.updateValueAndValidity());
    }

   onModelChange(selected: any) {
    this.selectedModel = selected;
    }

    nextPanelStep() {
    if (this.generateCutListForm.invalid) {
        this.generateCutListForm.markAllAsTouched();
        return;
    }
    const code = this.generateCutListForm.get('code')?.value;
    const formValue = this.generateCutListForm.value;

    const dimensionObj = {
        modelName: code,
        l1: Math.floor(formValue.l1 || 0),
        l2: Math.floor(formValue.l2 || 0),
        w1: Math.floor(formValue.w1 || 0),
        w2: Math.floor(formValue.w2 || 0),
    };


    this.dimensionsList.push(dimensionObj);
    console.log('✅ Saved step data:', this.dimensionsList);
   let nextModelCode = '';

    const selectedItem = this.cutListItems.find(i => i.code === code);
    if (selectedItem?.name.toLowerCase().includes('panel')) {
    nextModelCode = this.cutListItems.find(i => i.name.toLowerCase().includes('shutter'))?.code || '';
    } else if (selectedItem?.name.toLowerCase().includes('shutter')) {
    nextModelCode = this.cutListItems.find(i => i.name.toLowerCase().includes('panel'))?.code || '';
    }

    if (nextModelCode) {
    this.generateCutListForm.patchValue({
    code: nextModelCode,
    l1: '',
    l2: '',
    w1: '',
    w2: ''
    });
    }


   ['l1', 'l2', 'w1', 'w2'].forEach(ctrl => {
    this.generateCutListForm.get(ctrl)?.markAsPristine();
    this.generateCutListForm.get(ctrl)?.markAsUntouched();
    this.generateCutListForm.get(ctrl)?.updateValueAndValidity();
  });

    if (this.currentStep < 2) {
        this.currentStep++;
        this.generateCutListForm.patchValue({
        l1: '',
        l2: '',
        w1: '',
        w2: ''
    });

    }
}
previousStep() {
  if (this.currentStep > 1) this.currentStep--;
}



}
