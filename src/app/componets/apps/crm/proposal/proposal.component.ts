import { Component, ElementRef, TemplateRef, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbDropdownModule, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgbOffcanvas, OffcanvasDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { SwitherService } from '../../../../shared/services/swither.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import flatpickr from 'flatpickr';



@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule, MatSortModule,
    NgbDropdownModule, NgSelectModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig, NgbModal],

  templateUrl: './proposal.component.html',
  styleUrl: './proposal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProposalComponent extends BaseComponent {
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
  proposalTabCounts: { [key: string]: number } = {}; activeStage: string = '';
  public userList: any; filteredUserList: any[] = [];
  proposalContentDataSources: { [key: string]: MatTableDataSource<any> } = {};
  selectedProposalCount: any = null; filteredRoomNameList: { name: string }[] = [];
  isReadOnly: boolean = false; skipClientForm: boolean = false; clientData: any = null;
  skipProposalForm: boolean = false; minDateTime: string = '';
  showShutterFields: boolean = false; dimensionsList: any[] = []; currentStep: number = 1;
  step1Data: any[] = []; step2Data: any = null; leadData: any; selectedRoom: string = 'All';
  proposalSubmitted: boolean = false; activeNavId: number = 1;
  // selectedColumns: Set<string> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  @ViewChild(MatSort) sort!: MatSort;
  tabKeys: string[] = []; boqDataSources: { [key: string]: MatTableDataSource<any> } = {};
  selectedCategory: any; editIndex: number | null = null; designId: any;
  boqList: any; tabCounts: { [key: string]: number } = {}; elementForm!: FormGroup; proposalForm!: FormGroup;
  proposalApprovalForm!: FormGroup; extraContentProposalForm!: FormGroup; updateProjectForm!: FormGroup;
  addMoreVisible: boolean = false; selectedElementNames: string[] = []; selectedElement: number[] = [];
  newItem: string = ''; isEditMode = false; selectedLibrary: any; modal: any; previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null; selectedPanel: any = null;
  activeId: any = 0; highlightedTabIndex = 0; selectedProposal: any;
  filteredProposals: any[] = []; filteredClientOrders: any[] = []; tabTotals: { [key: string]: number } = {};
  orderContentDataSources: { [key: string]: MatTableDataSource<any> } = {};
  orderTabCounts: { [key: string]: number } = {}; orderTabKeys: string[] = [];
  projectLst: any = []; boqproject: any; showAllProposals = false; libraryList: any[] = [];
  libraryListData: any[] = []; objectKeys = Object.keys; libraryCategoriesList: any[] = [];
  showLeftArrow = false; showRightArrow = false; step = 1; submittedStep1: boolean = false;
  submittedStep2: boolean = false; submittedStep3: boolean = false;
  submitted: boolean = false; projectConfigList: string[] = [];
  showOtherDesignerFields: boolean = false; showOtherRelationshipFields: boolean = false;
  thumbsSwiper: any; graniteEnabled: boolean = false; TDMCEnabled: boolean = false; projectMarginList: any;
  designerData: any[] = []; filteredDesignerData: any[] = [];
  boqKeys: string[] = []; roomNameList: any[] = []; isImportChecked: boolean = false;
  selectedRows: boolean[] = []; selectedItems: any[] = []; currentRoomName: any;
  uomList: any[] = []; leadName: string = ''; isLoading: boolean = false; elementUrl: string = '';
  showSubmitButton: boolean = true;
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

  onCreateProposalClick(content4: any) {
    const storedClientData = localStorage.getItem("storedClientData");
    this.getProposal();
    if (!this.selectedElement || this.selectedElement.length === 0) {
      this.toastr.warning("Please select at least one Element");
      return;
    }
    this.openRights4(content4);
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
    this.leadData = history.state.lead;
    console.log('lead data', this.leadData);
    this.minDateTime = `${yyyy}-${mm}-${dd}`;
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'];
      this.projectName = params['projectName'];
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
      length: [0, [Validators.min(0)]],
      breadth: [0, [Validators.min(0)]],
      height: [0, [Validators.min(0)]],
      quantity: [0, [Validators.min(1)]],
      uom: [''],
      draftQuantity: [0, [Validators.min(1)]],
      clientRate: [0, [Validators.min(0)]],
      finalAmount: [0],
      brandOrMake: [''],
      discount: [0, [Validators.min(0)]],
      serviceCharge: [0, [Validators.min(0)]],
      baseAmount: [0, [Validators.min(0)]],
      budgetRate: [0, [Validators.min(0)]],
      hsn: [0],
      gstPrecent: [0, [Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      amountWithoutGst: [0, [Validators.min(0)]],
      designId: [''],
      roomName: ['', [Validators.required]],
      itemCode: ['', [Validators.required]],
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType
    });
    this.proposalForm = this.fb.group({
      margin: [''],
      discount: [0,],
      others: [0, [Validators.required]],
      clientName: ['', [Validators.required]],
      clientAddress: ['', [Validators.required]],
      clientEmail: ['', [Validators.required, Validators.email]],
      projectConfig: ['', [Validators.required]],
      dedEmail: ['', [Validators.required]],
      dedMobile: ['', [Validators.required]],
      dedName: ['', [Validators.required]],
      rmdEmail: ['', [Validators.required]],
      rmdMobile: ['', [Validators.required]],
      projectName: [''],
      flatNo: [''],
      rmdName: ['', [Validators.required]],
      clientMobileNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      orderFrom: ['', [Validators.required]],
      orderFor: [this.userCompanyName],
      vendorId: ['', [Validators.required]],
      shippingAddress: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
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

    if (this.leadData) {
      this.proposalForm.patchValue({
        orderFrom: this.leadData.name,
      })
    }
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
    this.getAssignProjects();
    this.boqData();
    flatpickr('#addignedDate', this.flatpickrOptions);
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
      const lines = element.elementNameAndDescription.split('\n');
      const rawName = lines[0] || '';
      elementName = rawName
        .replace('Name :', '')
        .split('|')[0]
        .trim();
      const brandLine = lines.find((l: string) =>
        l.trim().startsWith('Brand :')
      );
      brandOrMake = brandLine
        ? brandLine.replace('Brand :', '').trim()
        : '';
      elementDescription = lines
        .filter((l: string) =>
          !l.startsWith('Name :') && !l.startsWith('Brand :')
        )
        .map((l: string) =>
          l.replace('Description :', '').trim()
        )
        .join('\n')
        .trim();
    }
    this.elementForm.patchValue({
      elementUrl: element.elementUrl || '',
      elementName: elementName,
      brandOrMake: brandOrMake || element.brandOrMake || '',
      elementDescription: elementDescription,
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
      roomName: element.roomName || '',
      itemCode: element.itemCode || '',
      companyCode: element.companyCode,
      email: element.email,
      type: element.type,
    });
    this.elementUrl = element.elementUrl || '';
    this.previewUrl = element.elementUrl || null;
    const ref = this.offcanvasService.open(content, {
      position: 'end',
      scroll: true
    });
    ref.closed.subscribe(() => this.resetForm());
    ref.dismissed.subscribe(() => this.resetForm());
  }

  updateDropdownField(
    field: 'itemType' | 'orderStatus' | 'uom' | 'status' | 'codeAndCategory',
    selectedValue: string | { name?: string; code?: string },
    element: any
  ) {
    if (!element?.boqId) {
      this.toastr.warning('Invalid element selected');
      return;
    }
    let fieldValue = '';
    if (typeof selectedValue === 'string') {
      fieldValue = selectedValue;
    } else if (field === 'codeAndCategory') {
      fieldValue = selectedValue?.name ?? '';
    } else {
      fieldValue = selectedValue?.name ?? '';
    }
    this.elementForm.patchValue({ [field]: fieldValue });
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
    this.switchService.updateElementData(payload).subscribe({
      next: (res: any) => {
        if (res?.status) {
          this.toastr.success(`${field} updated`);
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
        this.toastr.success("Proposal Created");
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
    this.selectedElement = [];
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.proposaldataSource.paginator = this.paginator;
    setTimeout(() => this.checkArrows(), 150);
    // this.dataSource.sort = this.sort;
  }
  ngAfterViewChecked() {
    setTimeout(() => this.checkArrows(), 300);
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
      designId: '3FO3ILENXV7I',
      bomRequired: false,
      wardrobeRequired: true,
      kbRequired: true
    };
    this.switchService.fetchBoqData(payload).subscribe({
      next: (res) => {
        const boqData = res?.boqResponse?.boqData || {};
        const pannelResponse = res?.pannelResponse?.pannelResponse || [];
        this.tabKeys = Object.keys(boqData);
        this.getProposal();
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
        this.currentRoomName = 'All';

        this.roomNameList = this.tabKeys
          .filter(name => name !== 'All')
          .map(name => ({ name }));

      }
    });
  }

  getProposal() {
    const payload = {
      designId: '3FO3ILENXV7I',
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
    };
    this.switchService.fetchProposal(payload).subscribe({
      next: (res: any) => {
        this.proposals = res.boqProposalList || [];
        this.filteredProposals = [...this.proposals];
        this.leadName = this.leadData.name;
        if (this.proposals.length > 0) {
          this.skipClientForm = true;
          this.skipProposalForm = true;
          this.step = 3;
          this.step = 3;
          const firstProposal = this.proposals[0];
        } else {
          this.skipClientForm = false;
          this.skipProposalForm = false;
          this.step = 1;
        }
      },
    });
  }

  getProposalContent(element?: any) {
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
        if (this.selectedProposalContent.clientDataJs) {
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
      designId: '3FO3ILENXV7I',
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
    this.showSubmitButton = true;
    this.openEditForm(element, content);
  }

  openOffcanvasWithoutSubmit(element: any, content: any) {
    this.isEditMode = true;
    this.showSubmitButton = false;
    this.openEditForm(element, content);
  }

  elementSubmit() {
    this.elementFormSubmitted = true;
    if (this.elementForm.invalid) {
      this.toastr.warning("Please fill in all required fields.");
      return;
    }
    const formValue = this.elementForm.value;
    let elementNameAndDescription = '';
    if (formValue.elementName && formValue.elementName.trim()) {
      elementNameAndDescription = `Name : ${formValue.elementName.trim()}`;
    }
    if (formValue.brandOrMake && formValue.brandOrMake.trim()) {
      elementNameAndDescription += `\nBrand : ${formValue.brandOrMake.trim()}`;
    }
    if (formValue.elementDescription && formValue.elementDescription.trim()) {
      elementNameAndDescription += `\nDescription : ${formValue.elementDescription.trim()}`;
    }
    const payload = {
      elementNameAndDescription,
      budgetRate: Number(formValue.budgetRate),
      clientRate: Number(formValue.clientRate),
      gstPrecent: Number(formValue.gstPrecent),
      hsn: Number(formValue.hsn),
      breadth: Number(formValue.breadth),
      height: Number(formValue.height),
      length: Number(formValue.length),
      quantity: Number(formValue.quantity),
      uom: formValue.uom || '',
      elementUrl: this.elementUrl,
      itemCode: formValue.itemCode || '',
      roomName: formValue.roomName || '',
      draftQuantity: Number(formValue.draftQuantity) || 0,
      codeAndCategory: formValue.codeAndCategory || '',
      itemType: formValue.itemType || '',
      designId: '3FO3ILENXV7I',
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType
    };
    this.switchService.saveElementData(payload).subscribe({
      next: (res: any) => {
        if (res?.status === true) {
          this.toastr.success(res.message || 'Element Saved');
          this.offcanvasService.dismiss();
          this.boqData();
          this.elementForm.reset();
          this.elementFormSubmitted = false;
        }
      }
    });
  }

   saveLibraryItem() {
        if (this.selectedItems.length === 0) {
            this.toastr.warning("Please select an item");
            return;
        }
        const item = this.selectedItems[0];
        let elementNameAndDescription = '';
        if (item.name && item.name.trim()) {
            elementNameAndDescription = `Name : ${item.name.trim()}`;
        }
        if (item.brandMake && item.brandMake.trim()) {
            elementNameAndDescription += `\nBrand : ${item.brandMake.trim()}`;
        }
        if (item.description && item.description.trim()) {
            elementNameAndDescription += `\nDescription : ${item.description.trim()}`;
        }
        const payload = {
            elementNameAndDescription,
            categoryName: this.getCategoryName(item.categoryId?._id || item.categoryId),
            uom: this.getUomName(item.uom) || null,
            quantity: Number(item.standardQuantity) || 1,
            standardRate: Number(item.standardRate) || 0,
            budgetRate: Number(item.budgetRate) || 0,
            hsn: item.hsn || '',
            gstPrecent: item.gst ?? null,
            roomName: item.roomName,
            itemCode: item.itemTypeId?.name || '',
            elementUrl: item.imageUrl || '',
            length: item.dimensions?.width || 0,
            breadth: item.dimensions?.depth || 0,
            height: item.dimensions?.height || 0,
            designId: '3FO3ILENXV7I'
        };
        this.switchService.saveElementData(payload).subscribe({
            next: (res: any) => {
               if (res?.status === true) {
                this.toastr.success(res.message || 'Elements Imported');
                 const snapshotIndex = this.activeNavId;
                const snapshotRoom = this.currentRoomName;
                this.boqData();
                this.offcanvasService.dismiss();
                setTimeout(() => {
                    this.activeNavId = snapshotIndex;
                    this.currentRoomName = snapshotRoom;
                });
               }
            }
        });
    }

  get es() {
    return this.elementForm.controls;
  }

  editElement(element?: any) {
    if (!this.elementForm.value.roomName || !this.elementForm.value.itemCode) {
      this.elementFormSubmitted = true;
      this.elementForm.markAllAsTouched();
      return;
    }
    this.elementFormSubmitted = true;
    const formValue = { ...this.elementForm.value };
    const description: string = formValue.elementDescription || '';
    const extract = (label: string): string => {
      const regex = new RegExp(`${label}\\s*:\\s*(.*)`, 'i');
      const match = description.match(regex);
      return match ? match[1].trim() : '';
    };
    const payload = [
      {
        boqId: element?.boqId || Number(this.itemId) || 0,
        elementUrl: this.elementUrl || element?.elementUrl || '',
        elementNameAndDescription: (
          `Name : ${formValue.elementName || ''}\n` +
          `Carcass Material : ${extract('Carcass Material')}\n` +
          `Carcass Finish : ${extract('Carcass Finish')}\n` +
          `Shutter Material : ${extract('Shutter Material')}\n` +
          `Shutter Finish : ${extract('Shutter Finish')}\n` +
          `Brand : ${formValue.brandOrMake || ''}`
        ).trim(),
        codeAndCategory: formValue.codeAndCategory || '',
        orderStatus: formValue.orderStatus || element?.orderStatus || '',
        itemType: formValue.itemType || element?.itemType || '',
        source: formValue.source || element?.source || '',
        status: formValue.status || element?.status || '',
        length: Number(element?.length ?? formValue.length) || 0,
        breadth: Number(element?.breadth ?? formValue.breadth) || 0,
        height: Number(element?.height ?? formValue.height) || 0,
        quantity: Number(element?.quantity ?? formValue.quantity) || 0,
        uom: formValue.uom || element?.uom || '',
        draftQuantity: Number(element?.draftQuantity ?? formValue.draftQuantity) || 0,
        clientRate: Number(element?.clientRate ?? formValue.clientRate) || 0,
        finalAmount: Number(element?.finalAmount ?? formValue.finalAmount) || 0,
        brandOrMake: formValue.brandOrMake || element?.brandOrMake || '',
        discount: Number(element?.discount ?? formValue.discount) || 0,
        serviceCharge: Number(element?.serviceCharge ?? formValue.serviceCharge) || 0,
        baseAmount: Number(element?.baseAmount ?? formValue.baseAmount) || 0,
        budgetRate: Number(element?.budgetRate ?? formValue.budgetRate) || 0,
        hsn: Number(element?.hsn ?? formValue.hsn) || 0,
        gstPrecent: Number(element?.gstPrecent ?? formValue.gstPrecent) || 0,
        amountWithoutGst: Number(element?.amountWithoutGst ?? formValue.amountWithoutGst) || 0,
        designId: this.designingId,
        roomName: formValue.roomName,
        itemCode: formValue.itemCode,
        companyCode: this.userCompanyCode,
        email: this.userEmail,
        type: this.userType
      }
    ];
    this.switchService.updateElementData(payload).subscribe({
      next: (res: any) => {
        if (res?.status === true) {
          this.toastr.success(res.message || 'Element Updated');

          const updatedItem = payload[0];
          const room = formValue.roomName;

          // update room datasource
          const roomDataSource = this.boqDataSources[room];
          if (roomDataSource) {
            const index = roomDataSource.data.findIndex(
              (d: any) => d.boqId === updatedItem.boqId
            );
            if (index !== -1) {
              roomDataSource.data[index] = {
                ...roomDataSource.data[index],
                ...updatedItem
              };
              roomDataSource._updateChangeSubscription();
            }
          }

          // update All datasource
          const allDataSource = this.boqDataSources['All'];
          if (allDataSource) {
            const allIndex = allDataSource.data.findIndex(
              (d: any) => d.boqId === updatedItem.boqId
            );
            if (allIndex !== -1) {
              allDataSource.data[allIndex] = {
                ...allDataSource.data[allIndex],
                ...updatedItem
              };
              allDataSource._updateChangeSubscription();
            }
          }

          this.elementForm.reset();
          this.offcanvasService.dismiss();
          this.elementFormSubmitted = false;
          this.selectedElement = [];
        }
      }
    });
  }

  moveToRoom(content22: any) {
    this.elementForm.patchValue({ roomName: null });
    this.filteredRoomNameList = (this.roomNameList || []).filter(
      room => room.name !== this.currentRoomName
    );
    this.modalService.open(content22, { centered: true });
  }


  moveToRoomSubmit(modal: any) {
    if (!this.elementForm.value.roomName) {
      this.toastr.warning('Please select a room');
      return;
    }
    const selectedItems: any[] = [];
    Object.keys(this.boqDataSources).forEach(key => {
      const rows = this.boqDataSources[key]?.data ?? [];
      rows.forEach(row => {
        if (this.selectedElement?.includes(row.boqId)) {
          selectedItems.push(row);
        }
      });
    });
    const uniqueItems = [
      ...new Map(selectedItems.map(item => [item.boqId, item])).values()
    ];
    if (!uniqueItems.length) {
      this.toastr.warning("Please select at least one item");
      return;
    }
    const payload = uniqueItems.map(item => ({
      boqId: item.boqId,
      elementUrl: item.elementUrl ?? '',
      elementNameAndDescription: item.elementNameAndDescription ?? '',
      codeAndCategory: item.codeAndCategory ?? '',
      orderStatus: item.orderStatus ?? '',
      itemType: item.itemType ?? '',
      source: item.source ?? '',
      status: item.status ?? '',
      length: Number(item.length ?? 0),
      breadth: Number(item.breadth ?? 0),
      height: Number(item.height ?? 0),
      quantity: Number(item.quantity ?? 1),
      uom: item.uom ?? '-',
      draftQuantity: Number(item.draftQuantity ?? 0),
      clientRate: Number(item.clientRate ?? 0),
      finalAmount: Number(item.finalAmount ?? 0),
      brandOrMake: item.brandOrMake ?? '',
      discount: Number(item.discount ?? 0),
      serviceCharge: Number(item.serviceCharge ?? 0),
      baseAmount: Number(item.baseAmount ?? 0),
      budgetRate: Number(item.budgetRate ?? 0),
      hsn: Number(item.hsn ?? 0),
      gstPrecent: Number(item.gstPrecent ?? 0),
      amountWithoutGst: Number(item.amountWithoutGst ?? 0),
      roomName: this.elementForm.value.roomName,
      itemCode: item.itemCode ?? '',
      designId: item.designId ?? '',
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
      inProposal: item.inProposal ?? '',
    }));
    this.switchService.updateElementData(payload).subscribe({
      next: (res: any) => {
        if (res?.status === true) {
          this.toastr.success(res.message || 'Data Updated ');
          modal.close();
          this.elementForm.reset();
          this.offcanvasService.dismiss();
          this.elementFormSubmitted = false;
          this.selectedElement = [];
          this.boqData();
        }
      }
    });
  }



  proposalFormSubmit(modal?: any) {
    if (!this.selectedElement || this.selectedElement.length === 0) {
      this.toastr.warning("Please select at least one Element");
      return;
    }
    this.proposalSubmitted = true;
    if (this.proposalForm.invalid) {
      this.toastr.warning('please fill the all fields');
    }
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
    const storedClientData = localStorage.getItem("storedClientData");
    let clientDataToSend = {
      clientName: this.leadData.name,
      clientMobileNumber: this.leadData.contact

    };
    const formValue = this.proposalForm.value;
    const newId = this.generateVendorId();
    const proposalPayload = {
      email: this.userEmail,
      type: this.userType,
      companyCode: this.userCompanyCode,
      shippingAddress: formValue.shippingAddress,
      gstNo: formValue.gstNo,
      startDate: formValue.startDate,
      dueDate: formValue.dueDate,
      vendorId: newId,
      createdBy: this.userName,
      orderFor: formValue.orderFor,
      orderFrom: formValue.orderFrom,
      contentJs: JSON.stringify(selectedData),
      currentAmount: totalAmount,
      designId: '3FO3ILENXV7I',
      clientDataJs: JSON.stringify(clientDataToSend),
    };
    console.log('final payload', proposalPayload);
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
        designId: '3FO3ILENXV7I',
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
          this.toastr.success(res.message || "Proposal created ");
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
        this.toastr.success("Proposal updated");
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

  get totalGST() {
    return 0;
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

  isRowSelected(boqId: number): boolean {
    return this.selectedElement?.includes(boqId) ?? false;
  }

  onSelectAllChange(event: any, key: string): void {
    const data = this.boqDataSources?.[key]?.data ?? [];
    if (!data.length) return;
    if (event.checked) {
      this.selectedElement = data
        .filter((row: any) => row.inProposal !== 'inprop')
        .map((row: any) => row.boqId);
    } else {
      this.selectedElement = [];
    }
  }

  onRowCheckboxChange(element: any, event: any): void {
    const boqId = element?.boqId;
    if (!boqId && boqId !== 0) return;
    this.selectedElement = this.selectedElement ?? [];
    if (event.checked) {
      this.selectedElement = [...new Set([...this.selectedElement, boqId])];
    } else {
      this.selectedElement = this.selectedElement.filter((id: number) => id !== boqId);
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
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.elementUrl = this.previewUrl;  
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
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
      this.fileName = null;
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
          this.toastr.success('Project updated');
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
    this.isLoading = true;
    this.switchService.getLibrarayData().subscribe({
      next: (res: any) => {
        this.libraryListData = res?.items || [];
        setTimeout(() => this.mapCategoryNames(), 200);
        this.getUomNames();
        this.getCategoriesName();
        this.isLoading = false;
      }
    });
  }

  getUomNames() {
    this.switchService.getUomNames().subscribe({
      next: (res: any) => {
        this.uomList = res.uoms || [];
      }
    });
  }

  getUomName(id: string): string {
    const match = this.uomList.find(u => u._id === id);
    return match ? match.name : '-';
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

  getCategoriesName() {
    this.switchService.getCategoriesName().subscribe({
      next: (res: any) => {
        if (res && res.categories) {
          this.libraryCategoriesList = res.categories;
        }
      }
    });
  }


  onTabChange(event: any) {
    this.activeTab = event.nextId;
    this.currentRoomName = this.tabKeys[event.nextId] || 'All';
    if (this.activeTab === '1') {
      this.isReadOnly = true;
      this.elementForm.disable();
      this.elementForm.get('quantity')?.enable();
    }
    else if (this.activeTab === '5') {
      this.isReadOnly = false;
      this.elementForm.enable();
    }
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

  toggleGraniteFields() {
    this.graniteEnabled = !this.graniteEnabled;
    if (!this.graniteEnabled) {
      this.proposalForm.patchValue({ gpa: 0, gsc: 0, gmc: 0 });
    }
  }
  toggleTDMCFields() {
    this.TDMCEnabled = !this.TDMCEnabled;
    if (!this.TDMCEnabled) {
      this.proposalForm.patchValue({ tdmc: 0, tdpa: 0, tdsc: 0 });
    }
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

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

  toggleSelect(event: any, index: number) {
    const item = this.libraryListData[index];
    if (event.target.checked) {
      this.selectedItems.push({
        ...item,
        roomName: this.currentRoomName
      });
    } else {
      this.selectedItems = this.selectedItems.filter(
        x => x.itemCode !== item.itemCode
      );
    }
    this.isImportChecked = this.selectedItems.length > 0;
  }

  onRoomTabChange(id: number) {
    this.currentRoomName = this.tabKeys[id - 1];
  }

  getUomNameById(id: string): string {
    const uom = this.uomList.find(x => x._id === id);
    return uom ? uom.name : '';
  }
  onScroll() {
    this.checkArrows();
  }
  checkArrows() {
    if (!this.scrollContainer?.nativeElement) return;
    const el = this.scrollContainer.nativeElement;
    this.showLeftArrow = el.scrollLeft > 0;
    this.showRightArrow = el.scrollWidth > el.clientWidth &&
      el.scrollLeft < (el.scrollWidth - el.clientWidth - 5);
  }
  forceBlur(select: any) {
    if (select && select.blur) {
      select.blur();
    }
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/brand-logos/no-image.png';
  }

  getTotalSum(): string {
    if (!this.tabTotals) return '0.00';
    const total = Object.values(this.tabTotals)
      .filter(v => typeof v === 'number')
      .reduce((acc: number, val: number) => acc + val, 0);
    return total.toFixed(2);
  }

  getCategoryName(id: string): string {
    const match = this.libraryCategoriesList.find(c => c._id === id);
    return match ? match.name : '-';
  }

  mapCategoryNames() {
    this.libraryListData = this.libraryListData.map(item => ({
      ...item,
      categoryName: this.getCategoryName(item.categoryId?._id)
    }));
  }

  formatTooltip(item: any): string {
    return [
      item.name || '',
      item.description ? `Description: ${item.description}` : '',
      item.brandMake ? `Brand: ${item.brandMake}` : '',
      item.carcassMaterial ? `Carcass Material: ${item.carcassMaterial}` : '',
      item.carcassFinish ? `Carcass Finish: ${item.carcassFinish}` : '',
      item.shutterMaterial ? `Shutter Material: ${item.shutterMaterial}` : '',
      item.shutterFinish ? `Shutter Finish: ${item.shutterFinish}` : ''
    ]
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  generateVendorId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';

    for (let i = 0; i < 10; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
  }

  blockMinus(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === '+') {
      event.preventDefault();
    }
  }

  getBrand(element: any): string {
    if (!element?.elementNameAndDescription) {
      return '-';
    }
    const lines = element.elementNameAndDescription.split('\n');
    const brandLine = lines.find((l: string) => l.trim().startsWith('Brand :'));
    return brandLine ? brandLine.replace('Brand :', '').trim() : '-';
  }

  trackById(index: number, item: any): any {
    return item.id ?? item.boqId ?? item.referenceNo ?? index;
  }

  getStatusBadge(status: string): string {
    switch (status) {
      case 'Approve':
        return 'bg-success';
      case 'Pending for Approval':
        return 'bg-warning text-dark';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }


}
