import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbNavModule, NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray, } from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule
  ],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss',
  encapsulation: ViewEncapsulation.None
})


export class OptimizerComponent extends BaseComponent {
  stockDisplayedColumn: string[] = ['select', 'slNo', 'name', 'l', 'w', 't', 'material', 'q', 'autoAdd', 'grain', 'allowExactFitShapes', 'cost', 'notes', 'trim'];
  sawDisplayedColumn: string[] = ['select', 'slNo', 'bladeWidth', 'stockType', 'cutType', 'cutPreference', 'strategy', 'maxPhase', 'headCuts', 'primaryCompression', 'stackHeight', 'stockSelection', 'minSpacing', 'stackingMode'];
  historyDisplayedColumn: string[] = ['select', 'slNo', 'sheetName', 'uploadedBy', 'uploadedTime', 'recordsCount', 'email', 'action'];
  bulkPartsStockDisplayedColumn: string[] = ['slNo', 'sheetName', 'icon'];
  partsDisplayedColumn: string[] = ['select', 'slNo', 'name', 'l', 'w', 't', 'material', 'q', 'trim', 'banding', 'finish', 'orientationLock', 'notes'];
  productDisplayedColumn: string[] = ['slNo', 'code', 'name', 'description', 'isActive', 'edit', 'delete'];
  panelDisplayedColumn: string[] = ['slNo', 'designNo', 'name', 'length', 'width', 'thickness', 'uom', 'basePanel', 'make', 'grade', 'hotpress', 'grains', 'isActive', 'edit', 'copy', 'image', 'delete'];
  skinDisplayedColumn: string[] = ['designNo', 'name', 'brand', 'skinType', 'length', 'width', 'thickness', 'operation', 'grains', 'uom', 'skinFinish', 'edgeBands', 'isActive', 'isColdPress', 'edit', 'copy', 'image', 'delete'];
  edgeBandDisplayedColumn: string[] = ['designcode', 'designName', 'name', 'make', 'material', 'finish', 'width', 'thickness', 'hsnCode', 'premiling', 'isActive', 'image', 'uom', 'internalCode', 'edit', 'copy', 'image', 'delete'];
  processPanelDisplayedColumn: string[] = ['code', 'name', 'panel', 'skin1', 'skin2', 'isActive', 'edit', 'delete'];

  //dataSource = new MatTableDataSource<any>(); 
  mailId: any = '';
  stockDataSource = new MatTableDataSource<any>();
  sawDataSource = new MatTableDataSource<any>();
  historyDataSource = new MatTableDataSource<any>();
  bulkPartsStockDataSource = new MatTableDataSource<any>();
  partsDataSource = new MatTableDataSource<any>();
  partsViewDataSource = new MatTableDataSource<any>();
  productDataSource = new MatTableDataSource<any>();
  panelDataSource = new MatTableDataSource<any>();
  skinDataSource = new MatTableDataSource<any>();
  edgeBandDataSource = new MatTableDataSource<any>();
  processPanelDataSource = new MatTableDataSource<any>();
  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  @ViewChild('sawPaginator') sawPaginator!: MatPaginator;
  @ViewChild('historyPaginator') historyPaginator!: MatPaginator;
  @ViewChild('bulkPartsStockPaginator') bulkPartsStockPaginator!: MatPaginator;
  @ViewChild('partsPaginator') partsPaginator!: MatPaginator;
  @ViewChild('productPaginator') productPaginator!: MatPaginator;
  @ViewChild('panelPaginator') panelPaginator!: MatPaginator;
  @ViewChild('skinPaginator') skinPaginator!: MatPaginator;
  @ViewChild('edgebandPaginator') edgebandPaginator!: MatPaginator;
  @ViewChild('processPanelPaginator') processPanelPaginator!: MatPaginator;
  @ViewChild('content4') content4: any;
  @ViewChild('content8') content8: any;
  @ViewChild('content9') content9: any;

  isProductTabActive = true;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  partList: any; stokList: any; parList: any[] = []; btnDisable: boolean = true;
  stList: any[] = []; active1 = 'Product'; productForm!: FormGroup; panelForm!: FormGroup;
  basePanelForm!: FormGroup; makeForm!: FormGroup; gradeForm!: FormGroup;
  skinForm!: FormGroup; skinTypeForm!: FormGroup; skinFinishForm!: FormGroup; skinBrandForm!: FormGroup;
  edgeBandForm!: FormGroup; edgeContentForm!: FormGroup; processPanelForm!: FormGroup;
  basePanel: any[] = []; makePanel: any[] = []; gradePanel: any[] = []; skinType: any[] = [];
  skinFinish: any[] = []; skinBrand: any[] = [];
  isEditingProduct: boolean = false;

  public optimizerForm!: FormGroup;
  public optimizerFormSubmitted = false;
  public generatedForm!: FormGroup;
  public generatedrFormSubmitted = false;
  public optimizeId: any = '';
  public optimizeFormSample!: FormGroup;
  public uploadParts!: FormGroup;
  public uploadPartsSubmitted = false;
  public sawSubmitted = false;
  public stockForm!: FormGroup;
  public sawForm!: FormGroup;
  public partsForm!: FormGroup;
  public stockSubmitted = false;
  public partsSubmitted = false;
  public productSubmitted = false;
  public panelSubmitted = false;
  public basePanelSubmitted = false;
  public makeSubmitted = false;
  public gradeSubmitted = false;
  public skinSubmitted = false;
  public skinTypeSubmitted = false;
  public skinFinishSubmitted = false;
  public skinBrandSubmitted = false;
  public EdgebandSubmitted = false;
  public processPanelSubmitted = false;

  public uploadStocks!: FormGroup;
  uploadStocksSubmitted: boolean = false;
  public stepIndex = 1;
  Selection = [
    { value: 1, label: 'English' },
    { value: 2, label: 'French' },
    { value: 3, label: 'Arabic' },
    { value: 4, label: 'Hindi' },
  ];
  responce: any; cutData: any[] = [];
  offCut: any;
  metaData: any;
  public layoutUrl: string = '';
  public lableUrl: string = '';
  public imagePartsFileSrcData: any;
  uploadSpinner: boolean = false;
  stockSpinner: boolean = false;
  sawSpinner: boolean = false;
  partSpinner: boolean = false;
  imageStocksFileSrcData: any;
  selectedSawIdList: Set<any> = new Set<any>();
  selectedHistoryIdList: Set<any> = new Set<any>();
  selectedStockIdList: Set<any> = new Set<any>();
  partsSheetId: number = 0;
  stockSheetId: number = 0;

  selectedSawRow: any = null;
  selectedPartsIdList: Set<any> = new Set<any>();

  activeTab: string = 'product';
  panelItems: any[] = [];
  skinItems: any[] = [];

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService, private offcanvasService: NgbOffcanvas, private dialog: MatDialog, private cdRef: ChangeDetectorRef) {
    super();
    const selectedSawRow = localStorage.getItem('selectedSawRow');
    this.selectedSawRow = selectedSawRow ? JSON.parse(selectedSawRow) : null;
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }


  ngOnInit(): void {
    let value = 701883;  // Declare value inside ngOnInit
    this.getProductData();
    this.getPanelData();
    this.getEdgebandData();
    this.getSkinData();
    this.getProcessPanelData();
    this.getBasePanelData();
    this.getMakeData();
    this.getGradeData();
    this.getStockData();
    this.getSkinBrandData();
    this.getSkinTypeData();
    this.getSkinFinishData();
    this.getSawData();
    this.getPartsData();
    this.getPartshistory();
    this.getGeneratedOutputJson(value);

    this.generatedForm = this.fb.group({
      id: [{ value: '', disabled: this.btnDisable }],
      type: ['', [Validators.required]],
      units: ['', [Validators.required]]
    });

    this.optimizerForm = this.fb.group({
      saw: this.fb.group({
        bladeWidth: [0],
        sawId: [''],
        stockType: [''],
        cutType: [''],
        cutPreference: [''],
        guillotineOptions: this.fb.group({
          strategy: [''],
          maxPhase: [0]
        }),
        efficiencyOptions: this.fb.group({
          primaryCompression: ['']
        }),
        stackHeight: [0],
        options: this.fb.group({
          stockSelection: [''],
          minSpacing: [0],
          stackingMode: ['']
        })
      }),
      stock: this.fb.array([
        this.fb.group({
          name: [''],
          l: [0],
          w: [0],
          t: [0],
          material: [''],
          q: [0],
          autoAdd: [''],
          grain: [''],
          trim: this.fb.group({
            x1: [0],
            x2: [0],
            y1: [0],
            y2: [0]
          }),
          allowExactFitShapes: [true],
          cost: [0],
          notes: ['']
        })
      ]),
      parts: this.fb.array([
        this.fb.group({
          name: [''],
          l: [0],
          w: [0],
          t: [0],
          material: [''],
          q: [0],
          banding: this.fb.group({
            x1: [true],
            x2: [true],
            y1: [true],
            y2: [true]
          }),
          trim: this.fb.group({
            x1: [0],
            x2: [0],
            y1: [0],
            y2: [0]
          }),
          finish: this.fb.group({
            a: [''],
            b: ['']
          }),
          orientationLock: [''],
          notes: ['']
        })
      ]),
      groups: this.fb.array([]),
      webhook: ['https://example.com/webhook']
    });

    this.optimizeFormSample = this.fb.group({
      saw: this.fb.group({
        bladeWidth: [0, Validators.required],
        stockType: [''],
        cutType: [''],
        cutPreference: [''],
        guillotineOptions: this.fb.group({
          strategy: [''],
          maxPhase: [0]
        }),
        efficiencyOptions: this.fb.group({
          primaryCompression: ['']
        }),
        stackHeight: [0],
        options: this.fb.group({
          stockSelection: [''],
          minSpacing: [0],
          stackingMode: ['']
        })
      }),
      stock: this.fb.array([this.createStockGroup()]),
      parts: this.fb.array([this.createPartGroup()]),
      groups: this.fb.array([]),
      webhook: ['https://example.com/webhook']
    });

    //Upload Lead Validatoin
    this.uploadParts = this.fb.group({
      file: ['', [Validators.required]]
    });

    //Upload Lead Validatoin
    this.uploadStocks = this.fb.group({
      file: ['', [Validators.required]]
    });

    this.stockForm = this.fb.group({
      stockList: this.fb.array([this.createStockGroup()]),
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });

    this.sawForm = this.fb.group({
      sawList: this.fb.array([this.createSawGroup()]),
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });

    //Initialize Parts Form
    this.partsForm = this.fb.group({
      partList: this.fb.array([this.createPartGroup()]),
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });

    //product form
    this.productForm = this.fb.group({
      prodId: [{ value: this.generateProductId(), disabled: true }],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });

    //panel form
    this.panelForm = this.fb.group({
      panelId: [{ value: this.generateProductId(), disabled: true }],
      designNo: ['', Validators.required],
      name: ['', Validators.required],
      pressing: ['', Validators.required],
      basePanel: ['', Validators.required],
      make: ['', Validators.required],
      grade: ['', Validators.required],
      length: [0, Validators.required],
      width: [0, Validators.required],
      thickness: [0, Validators.required],
      isActive: [true],
      isColdPress: [true],
      grains: ['', Validators.required],
      image: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
      hotpress: [0]
    });

    //base panel form
    this.basePanelForm = this.fb.group({
      basePanelId: [{ value: this.generateProductId(), disabled: true }],
      basePanleName: ['', Validators.required],
      abbr: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //make form
    this.makeForm = this.fb.group({
      makeId: [{ value: this.generateProductId(), disabled: true }],
      makeName: ['', Validators.required],
      abbr: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //base panel grade form
    this.gradeForm = this.fb.group({
      gradePanelId: [{ value: this.generateProductId(), disabled: true }],
      gradeName: ['', Validators.required],
      abbr: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //skin form
    this.skinForm = this.fb.group({
      skinId: [{ value: this.generateProductId(), disabled: true }],
      designNo: ['', Validators.required],
      name: ['', Validators.required],
      brand: ['', Validators.required],
      skinType: ['', Validators.required],
      length: [0, Validators.required],
      width: [0, Validators.required],
      thickness: [0, Validators.required],
      operation: ['', Validators.required],
      grains: ['', Validators.required],
      uom: ['nos', Validators.required],
      skinFinish: ['', Validators.required],
      isActive: [true],
      isColdPress: [true],
      edgeBands: ['', Validators.required],
      image: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //skin type form
    this.skinTypeForm = this.fb.group({
      skinTypeId: [{ value: this.generateProductId(), disabled: true }],
      skinTypeName: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //skin finish form
    this.skinFinishForm = this.fb.group({
      skinFinishId: [{ value: this.generateProductId(), disabled: true }],
      skinFinshName: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //skin brand form
    this.skinBrandForm = this.fb.group({
      skinBrandId: [{ value: this.generateProductId(), disabled: true }],
      skinBrandName: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //edgebrand form
    this.edgeBandForm = this.fb.group({
      edgeBandId: [{ value: this.generateProductId(), disabled: true }],
      designCode: ['', Validators.required],
      designName: ['', Validators.required],
      name: ['', Validators.required],
      make: ['', Validators.required],
      material: ['', Validators.required],
      typeName: ['', Validators.required],
      finish: ['', Validators.required],
      width: [0, Validators.required],
      thickness: [0, Validators.required],
      isActive: [true],
      hsnCode: ['', Validators.required],
      premiling: ['', Validators.required],
      image: ['', Validators.required],
      uom: ['nos', Validators.required],
      internalCode: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //process panel form
    this.processPanelForm = this.fb.group({
      processedPanelId: [{ value: this.generateProductId(), disabled: true }],
      code: ['', Validators.required],
      name: ['', Validators.required],
      panel: ['', Validators.required],
      skin1: ['', Validators.required],
      skin2: ['', Validators.required],
      pricePerFt: ['', Validators.required],
      gst: [0, Validators.required],
      finalAmount: [0, Validators.required],
      isActive: [true],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //make form
    this.edgeContentForm = this.fb.group({
      content: [''],
      name: ['', Validators.required],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

  }

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  }

  getSNo(index: number): number {
    if (this.stockPaginator && this.stockPaginator.pageIndex !== undefined && this.stockPaginator.pageSize !== undefined) {
      return this.stockPaginator.pageIndex * this.stockPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  sawGetSNo(index: number): number {
    if (this.sawPaginator && this.sawPaginator.pageIndex !== undefined && this.sawPaginator.pageSize !== undefined) {
      return this.sawPaginator.pageIndex * this.sawPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  getPartsSNo(index: number): number {
    if (this.partsPaginator && this.partsPaginator.pageIndex !== undefined && this.partsPaginator.pageSize !== undefined) {
      return this.partsPaginator.pageIndex * this.partsPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  historyGetSNo(index: number): number {
    if (this.historyPaginator && this.historyPaginator.pageIndex !== undefined && this.historyPaginator.pageSize !== undefined) {
      return this.historyPaginator.pageIndex * this.historyPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  bulkPartsStockGetSNo(index: number): number {
    if (this.bulkPartsStockPaginator && this.bulkPartsStockPaginator.pageIndex !== undefined && this.bulkPartsStockPaginator.pageSize !== undefined) {
      return this.bulkPartsStockPaginator.pageIndex * this.bulkPartsStockPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  productGetSNo(index: number): number {
    if (this.productPaginator && this.productPaginator.pageIndex !== undefined && this.productPaginator.pageSize !== undefined) {
      return this.productPaginator.pageIndex * this.productPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  ngAfterViewInit() {
    this.stockDataSource.paginator = this.stockPaginator;
    this.sawDataSource.paginator = this.sawPaginator;
    this.historyDataSource.paginator = this.historyPaginator;
    this.partsDataSource.paginator = this.partsPaginator;
    this.bulkPartsStockDataSource.paginator = this.bulkPartsStockPaginator;
    this.productDataSource.paginator = this.productPaginator;
    this.panelDataSource.paginator = this.panelPaginator;
    this.skinDataSource.paginator = this.skinPaginator;
    this.edgeBandDataSource.paginator = this.skinPaginator;
    this.processPanelDataSource.paginator = this.processPanelPaginator;
    this.cdRef.detectChanges();

  }

  onTabChange(event: MatTabChangeEvent) {
    console.log(event.index);
    this.isProductTabActive = event.index === 0;
    setTimeout(() => {
      this.productDataSource.paginator = this.productPaginator;
    });
  }

  value(value: any) {
    throw new Error('Method not implemented.');
  }

  get stockList() {
    return this.stockForm.get('stockList') as FormArray;
  }

  addStock(): void {
    this.stock.push(this.createStockGroup());
  }
  removeStock(index: number): void {
    this.stockList.removeAt(index);
  }

  addPopupStock(): void {
    this.stockList.push(this.createStockGroup());
  }

  addSaw(): void {
    this.sawList.push(this.createSawGroup());
  }
  removeSaw(index: number): void {
    this.sawList.removeAt(index);
  }

  get sawList() {
    return this.sawForm.get('sawList') as FormArray;
  }

  createStockGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      l: [0, [Validators.required]],
      w: [0, [Validators.required]],
      t: [0, [Validators.required]],
      material: ['', [Validators.required]],
      q: [0, [Validators.required]],
      autoAdd: ['', [Validators.required]],
      grain: ['', [Validators.required]],
      trim: this.fb.group({
        x1: [0, [Validators.required]],
        x2: [0, [Validators.required]],
        y1: [0, [Validators.required]],
        y2: [0, [Validators.required]]
      }),
      allowExactFitShapes: ['', Validators.required],
      cost: [0, [Validators.required]],
      notes: ['', [Validators.required]]
    });
  }
  createPartGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      l: [0, [Validators.required]],
      w: [0, [Validators.required]],
      t: [0, [Validators.required]],
      material: ['', [Validators.required]],
      q: [0, [Validators.required]],
      banding: this.fb.group({
        x1: [true, [Validators.required]],
        x2: [true, [Validators.required]],
        y1: [true, [Validators.required]],
        y2: [true, [Validators.required]]
      }),
      trim: this.fb.group({
        x1: [0, [Validators.required]],
        x2: [0, [Validators.required]],
        y1: [0, [Validators.required]],
        y2: [0, [Validators.required]]
      }),
      finish: this.fb.group({
        a: ['', [Validators.required]],
        b: ['', [Validators.required]]
      }),
      orientationLock: ['', [Validators.required]],
      notes: ['', [Validators.required]]
    });
  }

  createSawGroup(): FormGroup {
    return this.fb.group({
      bladeWidth: [0, [Validators.required]],
      stockType: ['', [Validators.required]],
      cutType: ['', [Validators.required]],
      cutPreference: ['', [Validators.required]],
      guillotineOptions: this.fb.group({
        strategy: ['', [Validators.required]],
        maxPhase: [0, [Validators.required]]
      }),
      efficiencyOptions: this.fb.group({
        primaryCompression: ['', [Validators.required]]
      }),
      stackHeight: [0, [Validators.required]],
      options: this.fb.group({
        stockSelection: ['', [Validators.required]],
        minSpacing: [0, [Validators.required]],
        stackingMode: ['', [Validators.required]]
      })
    });
  }

  addParts(): void {
    this.parts.push(this.createPartGroup());
  }

  get partsList() {
    return this.partsForm.get('partList') as FormArray;
  }
  removeParts(index: number): void {
    this.partsList.removeAt(index);
  }
  addPopupParts(): void {
    this.partsList.push(this.createPartGroup());
  }


  onSubmit() {
    this.optimizerFormSubmitted = true; // Mark form as submitted

    if (this.optimizerForm.valid) {


      // Send form data to API or process the data
      // Example: this.apiService.submitOptimizerData(this.optimizerForm.value).subscribe(...)

      alert('Form submitted successfully!'); // Replace with actual API call
    } else {

    }
  }



  get e() {
    return (this.optimizerForm.get('saw') as FormGroup).controls; // Cast to FormGroup
  }

  // Getter for stock FormArray
  get stock() {
    return this.optimizeFormSample.get('stock') as FormArray;
  }

  // Getter for parts FormArray
  get parts() {
    return this.optimizeFormSample.get('parts') as FormArray;
  }

  // Getter for groups FormArray
  get groups() {
    return (this.optimizerForm.get('groups') as FormArray);
  }

  optimizerFormSubmit() {
    this.optimizerFormSubmitted = true;
    if (this.optimizerForm.valid) {
      this.switchService.optimizeImportData(this.optimizerForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.optimizeId = (res.id) ? res.id : '';
            this.generatedForm.patchValue({ id: this.optimizeId });
            if (this.optimizeId) {
              this.modalService.open(this.content4, { centered: true });
            }
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {

          }
        }
      })
      // Reset form after submission (optional)
      this.optimizerForm.reset();
      this.optimizerFormSubmitted = false;
    }
  }

  VerticallyScrol(content: any) {
    this.modalService.open(content, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg1(content4: any) {
    this.modalService.open(content4, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg2(content5: any) {
    this.modalService.open(content5, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg3(content6: any) {
    this.modalService.open(content6, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg4(content7: any) {
    this.modalService.open(content7, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg5(content8: any) {
    this.modalService.open(content8, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg6(content10: any) {
    this.modalService.open(content10, { scrollable: true, centered: true, });
  }
  openLg7(content11: any) {
    this.modalService.open(content11, { scrollable: true, centered: true, });
  }
  openLg8(content12: any) {
    this.modalService.open(content12, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg9(content13: any) {
    this.modalService.open(content13, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg10(content14: any) {
    this.modalService.open(content14, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg11(content15: any) {
    this.modalService.open(content15, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg12(content16: any) {
    this.modalService.open(content16, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg13(content17: any) {
    this.modalService.open(content17, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg14(content18: any) {
    this.modalService.open(content18, { scrollable: true, centered: true, });
  }
  openLg15(content19: any) {
    this.modalService.open(content19, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg16(content20: any) {
    this.modalService.open(content20, { size: 'lg', scrollable: true, centered: true, });
  }
  openLg17(content21: any) {
    this.modalService.open(content21, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg18(content22: any) {
    this.modalService.open(content22, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg19(content23: any) {
    this.modalService.open(content23, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg20(content24: any) {
    this.modalService.open(content24, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg21(content25: any) {
    this.modalService.open(content25, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg22(content26: any) {
    this.modalService.open(content26, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg23(content27: any) {
    this.modalService.open(content27, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg24(content28: any) {
    this.modalService.open(content28, { size: 'sm', scrollable: true, centered: true, });
  }
  openLg25(content29: any) {
    this.modalService.open(content29, { size: 'sm', scrollable: true, centered: true, });
  }

  downloadOptimizerFile() {
    this.switchService.optimizeDownload(this.optimizeId).subscribe({
      next: (res: any) => {
        if (res) {
          window.open(res.url, '_blank');

        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  downloadOutputFile(url: any) {
    if (url) {
      window.open(url, '_blank');

    }
  }


  nextStep(id: any): void {
    this.stepIndex = id;

  }
  prevStep(id: any): void {
    this.stepIndex = id;
  }

  getGeneratedOutputJson(value: any) {
    this.switchService.generatedOutputJson(value).subscribe({
      next: (res: any) => {
        if (res) {
          this.responce = res;
          this.cutData = res.cuts || [];
          this.offCut = res.offcuts || [];
          this.metaData = res.metadata || [];

        } else {
        }
      },
      error: (err: any) => {
      }
    });
  }

  submitForm(): void {
    this.optimizerFormSubmitted = true;
    if (this.optimizeFormSample.valid) {
      this.switchService.optimizeImportData(this.optimizeFormSample.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.optimizeFormSample.reset();
            this.optimizeId = (res.id) ? res.id : '';

            this.generatedForm.patchValue({ id: this.optimizeId });

            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {
            this.toastr.error(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.optimizerFormSubmitted = false;
    }

  }

  get g() {
    return this.generatedForm.controls;
  }

  get q() {
    return this.productForm.controls;
  }

  onGeneratedSubmit(modal: any) {
    this.generatedrFormSubmitted = true;

    if (this.generatedForm.valid) {
      this.switchService.optimizeGeneratedOutputData(this.generatedForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.lableUrl = (res.layoutUrl) ? res.layoutUrl : '';
            this.layoutUrl = (res.lableUrl) ? res.lableUrl : '';
            modal.close();
            this.toastr.success(res.message, 'optimize', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {
            this.toastr.error(res.message, 'optimize', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      // console.log('Form Submitted:', this.optimizerForm.value);
      // Reset form after submission (optional)
      this.generatedForm.reset();
      this.generatedrFormSubmitted = false;
    }
  }

  getStockData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.StockData(payload).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.stockDataSource.data = res;
          this.stockDataSource.paginator = this.stockPaginator;
        } else {
          this.toastr.error("No data received from server");
          this.stockDataSource.data = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching stock data");
        this.stockDataSource.data = [];
      },
    });
  }

  getSawData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.SawData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.sawDataSource.data = res;
          if (this.sawPaginator) {
            this.sawDataSource.paginator = this.sawPaginator;
          } else {
          }
        } else {
          this.toastr.error("No data available.");
          this.sawDataSource.data = [];
        }
      },
      error: (error) => {
        this.toastr.error("Failed to fetch saw data.");
        this.sawDataSource.data = [];
      },
    });
  }

  getPartsData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.PartsData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.partsDataSource.data = res;

          // Ensure paginator is set only if it exists
          if (this.partsPaginator) {
            this.partsDataSource.paginator = this.partsPaginator;
          } else {
          }
        } else {
          this.toastr.error("No data available.");
          this.sawDataSource.data = [];
        }
      },
      error: (error) => {
        this.toastr.error("Failed to fetch saw data.");
        this.sawDataSource.data = [];
      },
    });
  }


  openRight(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  get p() {
    return this.uploadParts.controls;
  }

  onFileChange(event: any): void {
    this.imagePartsFileSrcData = '';
    const files = event.target.files[0];
    const allExcel: Array<string> = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

    if (allExcel.indexOf(event.target.files[0].type) === -1) {
      this.uploadPartsSubmitted = false;
      this.uploadParts.reset();
      this.toastr.error('Please choose Valid file', 'lead', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    } else {
      this.imagePartsFileSrcData = files;
    }

  }

  uploadPartsSubmit(modal: any) {
    this.uploadPartsSubmitted = true;
    if (this.uploadParts?.valid) {
      this.uploadSpinner = true;
      const formData = new FormData();
      formData.append('file', this.imagePartsFileSrcData);
      formData.append('uploadedBy', this.userName);
      formData.append('email', this.userEmail);
      formData.append('companyCode', this.userCompanyCode);
      formData.append('type', this.userType);
      formData.append('contentType', 'parts');
      formData.append('sheetName', 'Parts Bulk Upload');
      formData.append('sheetUrl', '');
      this.switchService.bulkUploadParts(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.uploadPartsSubmitted = false;
            this.uploadSpinner = false;
            this.uploadParts.reset();
            this.getPartshistory();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.uploadSpinner = false;
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (err: any) => {
          this.uploadSpinner = false;
          this.toastr.error("Error fetching CRM Bulkupload leads", 'lead', {
            timeOut: 3000, positionClass: 'toast-top-right'
          });
        },
      })
    }
  }

  get s() {
    return this.uploadStocks.controls;
  }

  onStockFileChange(event: any): void {
    this.imageStocksFileSrcData = '';
    const files = event.target.files[0];
    const allExcel: Array<string> = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

    if (allExcel.indexOf(event.target.files[0].type) === -1) {
      this.uploadStocksSubmitted = false;
      this.uploadParts.reset();
      this.toastr.error('Please choose Valid file', 'lead', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    } else {
      this.imageStocksFileSrcData = files;
    }

  }

  uploadStocksSubmit(modal: any) {
    this.uploadStocksSubmitted = true;
    if (this.uploadStocks?.valid) {
      this.uploadSpinner = true;
      const formData = new FormData();
      formData.append('file', this.imageStocksFileSrcData);
      formData.append('uploadedBy', this.userName);
      formData.append('email', this.userEmail);
      formData.append('companyCode', this.userCompanyCode);
      formData.append('type', this.userType);
      formData.append('contentType', 'stock');
      formData.append('sheetName', 'Stocks Bulk Upload');
      formData.append('sheetUrl', '');
      this.switchService.bulkUploadStock(formData).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.uploadStocksSubmitted = false;
            this.uploadSpinner = false;
            this.uploadStocks.reset();
            this.getPartshistory();
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.uploadSpinner = false;
            this.toastr.error(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        },
        error: (err: any) => {
          this.uploadSpinner = false;
          this.toastr.error("Error fetching CRM Bulkupload leads", 'lead', {
            timeOut: 3000, positionClass: 'toast-top-right'
          });
        },
      })
    }
  }

  getPartshistory() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.HistoryUploadParts(payload).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.historyDataSource.data = res;
          this.historyDataSource.paginator = this.historyPaginator;
        } else {
          this.toastr.error("No data received from server");
          this.historyDataSource.data = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching stock data");
        this.historyDataSource.data = [];
      },
    });
  }



  // Handle single row selection
  onSawRowCheckboxChange(row: any, event: any) {
    if (event.checked) {
      this.selectedSawRow = row;
    } else {
      this.selectedSawRow = null;
    }
  }

  isCheckboxSawDisabled(row: any): boolean {
    return this.selectedSawRow && this.selectedSawRow !== row; // Disable others
  }

  // Handle "select all" checkbox
  onSawSelectAllChange(event: any) {
    if (event.checked) {
      this.selectedSawIdList = new Set(this.sawDataSource.data.map((row) => row));
      console.log('selected all', this.selectedSawIdList);
    } else {
      this.selectedSawIdList.clear();
    }
  }

  isSawAllSelected() {
    return this.selectedSawIdList.size === this.sawDataSource.data.length;
  }

  isSawIndeterminate() {
    return this.selectedSawIdList.size > 0 && this.selectedSawIdList.size < this.sawDataSource.data.length;
  }

  isSawSelected(data: any) {
    return this.selectedSawIdList.has(data);
  }


  // Handle Stock selection
  onStockRowCheckboxChange(data: any, event: any) {
    if (event.checked) {
      this.selectedStockIdList.add(data);
    } else {
      this.selectedStockIdList.delete(data);
    }
  }

  // Handle "select all" checkbox
  onStockSelectAllChange(event: any) {
    if (event.checked) {
      this.selectedStockIdList = new Set(this.stockDataSource.data.map((row) => row));
    } else {
      this.selectedStockIdList.clear();
    }
  }

  isStockAllSelected() {
    return this.selectedStockIdList.size === this.stockDataSource.data.length;
  }

  isStockIndeterminate() {
    return this.selectedStockIdList.size > 0 && this.selectedStockIdList.size < this.stockDataSource.data.length;
  }

  isStockSelected(data: any) {
    return this.selectedStockIdList.has(data);
  }


  // Handle Parts selection
  onPartsRowCheckboxChange(data: any, event: any) {
    if (event.checked) {
      this.selectedPartsIdList.add(data);
    } else {
      this.selectedPartsIdList.delete(data);
    }
  }

  // Handle "select all" checkbox
  onPartsSelectAllChange(event: any) {
    if (event.checked) {
      this.selectedPartsIdList = new Set(this.partsDataSource.data.map((row) => row));
    } else {
      this.selectedPartsIdList.clear();
    }
  }

  isPartsAllSelected() {
    return this.selectedPartsIdList.size === this.partsDataSource.data.length;
  }

  isPartsIndeterminate() {
    return this.selectedPartsIdList.size > 0 && this.selectedPartsIdList.size < this.partsDataSource.data.length;
  }

  isPartsSelected(data: any) {
    return this.selectedPartsIdList.has(data);
  }


  // Handle History selection
  onHistoryRowCheckboxChange(data: any, event: any) {
    if (event.checked) {
      this.selectedHistoryIdList.add(data);
    } else {
      this.selectedHistoryIdList.delete(data);
    }
  }

  // Handle "select all" checkbox
  onHistorySelectAllChange(event: any) {
    if (event.checked) {
      this.selectedHistoryIdList = new Set(this.historyDataSource.data.map((row) => row));
    } else {
      this.selectedHistoryIdList.clear();
    }
  }

  isHistoryAllSelected() {
    return this.selectedHistoryIdList.size === this.historyDataSource.data.length;
  }

  isHistoryIndeterminate() {
    return this.selectedHistoryIdList.size > 0 && this.selectedHistoryIdList.size < this.historyDataSource.data.length;
  }

  isHistorySelected(data: any) {
    return this.selectedHistoryIdList.has(data);
  }

  // Submit Stock Form and reset Form

  resetStockList() {
    this.stockForm.setControl('stockList', this.fb.array([this.createStockGroup()]));
  }

  submitStockForm(modal: any): void {
    this.stockSubmitted = true;
    if (this.stockForm.valid) {
      this.stockSpinner = true;
      this.switchService.saveStockData(this.stockForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.stockSpinner = false;
            modal.close();
            this.resetStockList();
            this.getStockData();
            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {
            this.stockSpinner = false;
            this.toastr.error(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.stockSubmitted = false;
    }
  }

  //Submit Saw Form and reset Form

  resetSawList() {
    this.sawForm.setControl('sawList', this.fb.array([this.createSawGroup()]));
  }

  submitSawForm(modal: any): void {
    this.sawSubmitted = true;
    if (this.sawForm.valid) {
      this.sawSpinner = true;
      this.switchService.saveSawData(this.sawForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.sawSpinner = false;
            modal.close();
            this.resetSawList();
            this.getSawData();
            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {
            this.sawSpinner = false;
            this.toastr.error(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.sawSubmitted = false;
    }
  }

  //Submit Parts Form and reset Form

  resetPartList() {
    this.partsForm.setControl('partList', this.fb.array([this.createPartGroup()]));
  }

  submitPartsForm(modal: any): void {
    this.partsSubmitted = true;
    if (this.partsForm.valid) {
      this.partSpinner = true;
      this.switchService.savePartsData(this.partsForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.partSpinner = false;
            modal.close();
            this.resetPartList();
            this.getPartsData();
            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {
            this.partSpinner = false;
            this.toastr.error(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.partsSubmitted = false;
    }
  }

  getBulkPartsStock() {
    let payload = {
      partsSheetId: this.partsSheetId ?? 22,
      stockSheetId: this.stockSheetId ?? 24,
    };

    this.switchService.bulkPartsStock(payload).subscribe({
      next: (res: any) => {
        if (res && res.partsList && Array.isArray(res.partsList) && res.stockList && Array.isArray(res.stockList)) {
          this.bulkPartsStockDataSource.data = res.partsList;
          this.bulkPartsStockDataSource.paginator = this.bulkPartsStockPaginator;
          this.partList = res.partsList;
          this.stokList = res.stockList;

          //Parts   
          if (this.partList.length > 0 || this.selectedPartsIdList.size > 0) {
            const partsArray = this.optimizerForm.get('parts') as FormArray;
            partsArray.clear(); // Clear old values before adding new ones
            let selectedPartsArray = this.partList;
            if (this.selectedPartsIdList.size > 0) {
              selectedPartsArray = [...this.partList, ...this.selectedPartsIdList];
            }

            selectedPartsArray.forEach((parts: any) => {
              partsArray.push(this.fb.group({
                name: [parts.name],
                l: [parts.l],
                w: [parts.w],
                t: [parts.t],
                material: [parts.material],
                q: [parts.q],
                banding: this.fb.group({
                  x1: [parts.banding?.x1 ?? true],
                  x2: [parts.banding?.x2 ?? true],
                  y1: [parts.banding?.y1 ?? true],
                  y2: [parts.banding?.y2 ?? true]
                }),
                trim: this.fb.group({
                  x1: [parts.trim?.x1 ?? 0],
                  x2: [parts.trim?.x2 ?? 0],
                  y1: [parts.trim?.y1 ?? 0],
                  y2: [parts.trim?.y2 ?? 0]
                }),
                finish: this.fb.group({
                  a: [parts.finish?.a ?? ''],
                  b: [parts.finish?.b ?? '']
                }),
                orientationLock: [parts.orientationLock],
                notes: [parts.notes]
              }));
            });
          }


          //Stock
          if (this.stokList.length > 0 || this.selectedStockIdList.size > 0) {
            const stockArray = this.optimizerForm.get('stock') as FormArray;
            stockArray.clear(); // Clear old values before adding new ones
            let selectedStockArray = this.stokList;
            if (this.selectedStockIdList.size > 0) {
              selectedStockArray = [...this.stokList, ...this.selectedStockIdList];
            }

            selectedStockArray.forEach((stocks: any) => {
              stockArray.push(this.fb.group({
                name: [stocks.name],
                l: [stocks.l],
                w: [stocks.w],
                t: [stocks.t],
                material: [stocks.material],
                q: [stocks.q],
                autoAdd: [stocks.autoAdd],
                grain: [stocks.grain],
                trim: this.fb.group({
                  x1: [stocks.trim?.x1 ?? 0],
                  x2: [stocks.trim?.x2 ?? 0],
                  y1: [stocks.trim?.y1 ?? 0],
                  y2: [stocks.trim?.y2 ?? 0]
                }),
                allowExactFitShapes: [stocks.allowExactFitShapes],
                cost: [stocks.cost],
                notes: [stocks.notes]
              }));
            });

          }

          //Saw
          if (this.selectedSawRow) {
            this.optimizerForm.patchValue({ saw: this.selectedSawRow });
          }

          this.optimizerFormSubmit();

        }
      },
      error: (error) => {
        this.toastr.error("Error fetching stock data.");
        this.bulkPartsStockDataSource.data = [];
      },
    });
  }

  submitBulkPartsStock() {
    this.partsSheetId = 0;
    this.stockSheetId = 0;
    if (this.selectedStockIdList.size > 0 && this.selectedSawRow !== null && this.selectedPartsIdList) {
      if (this.selectedHistoryIdList.size === 2) {
        for (let item of this.selectedHistoryIdList) {
          if (item.contentType == 'parts') {
            this.partsSheetId = item.sheetId;
          }
          else if (item.contentType == 'stock') {
            this.stockSheetId = item.sheetId;
            this.selectedStockIdList.clear();
          }
        }
        if (this.partsSheetId > 0 && this.stockSheetId > 0) {
          this.getBulkPartsStock();

        } else {
          this.toastr.error("Please choose one stock and parts option");
        }
      }
      else if (this.selectedHistoryIdList.size === 1) {
        for (let item of this.selectedHistoryIdList) {
          if (item.contentType == 'parts') {
            this.partsSheetId = item.sheetId;
          }
          else if (item.contentType == 'stock') {
            this.stockSheetId = item.sheetId;
          }
        }
        if (this.partsSheetId > 0 || this.stockSheetId > 0) {
          this.getBulkPartsStock();

        } else {
          this.toastr.error("Please choose one stock or parts option");
        }
      }
      else {
        this.getBulkPartsStock();
      }
    }
    else if (this.selectedSawRow === null) {
      this.toastr.error("Please choose one saw option");
    }
    else if (this.selectedHistoryIdList.size === 0 && this.selectedPartsIdList.size === 0) {
      this.toastr.error("Please choose one parts option");
    }
    else if (this.selectedHistoryIdList.size === 0 && this.selectedStockIdList.size === 0) {
      this.toastr.error("Please choose one stock option");
    }
    else if (this.selectedHistoryIdList.size === 1 && this.selectedStockIdList.size > 0) {
      for (let item of this.selectedHistoryIdList) {
        if (item.contentType == 'parts') {
          this.partsSheetId = item.sheetId;
        }
        else if (item.contentType == 'stock') {
          this.stockSheetId = item.sheetId;
        }
      }
      if (this.partsSheetId > 0 || this.stockSheetId > 0) {
        this.getBulkPartsStock();

      } else {
        this.toastr.error("Please choose one stock or parts option");
      }
    }
    else if (this.selectedHistoryIdList.size === 1 && this.selectedPartsIdList.size > 0) {
      for (let item of this.selectedHistoryIdList) {
        if (item.contentType == 'parts') {
          this.partsSheetId = item.sheetId;
        }
        else if (item.contentType == 'stock') {
          this.stockSheetId = item.sheetId;
        }
      }
      if (this.partsSheetId > 0 || this.stockSheetId > 0) {
        this.getBulkPartsStock();

      } else {
        this.toastr.error("Please choose one stock or parts option");
      }
    }
    else if (this.selectedHistoryIdList.size === 2) {
      for (let item of this.selectedHistoryIdList) {
        if (item.contentType == 'parts') {
          this.partsSheetId = item.sheetId;
        }
        else if (item.contentType == 'stock') {
          this.stockSheetId = item.sheetId;
          this.selectedStockIdList.clear();
        }
      }
      if (this.partsSheetId > 0 && this.stockSheetId > 0) {
        this.getBulkPartsStock();

      } else {
        this.toastr.error("Please choose one stock and parts option");
      }


    }
    else {
      this.toastr.error("Please choose atleast two option");
    }

  }
  stockApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.stockDataSource.filter = filterValue.trim().toLowerCase();
  }
  sawApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sawDataSource.filter = filterValue.trim().toLowerCase();
  }
  partsApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.partsDataSource.filter = filterValue.trim().toLowerCase();
  }
  historyApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.historyDataSource.filter = filterValue.trim().toLowerCase();
  }
  productApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
  }
  panelApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.panelDataSource.filter = filterValue.trim().toLowerCase();
  }
  skinApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.skinDataSource.filter = filterValue.trim().toLowerCase();
  }
  edgeBandApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.edgeBandDataSource.filter = filterValue.trim().toLowerCase();
  }
  processPanelApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.processPanelDataSource.filter = filterValue.trim().toLowerCase();
  }

  getViewBulkPartsStock(data: any) {
    let payload = {
      partsSheetId: (data.contentType === 'parts') ? data.sheetId : 0,
      stockSheetId: (data.contentType === 'stock') ? data.sheetId : 0,
    };

    this.switchService.bulkPartsStock(payload).subscribe({
      next: (res: any) => {
        if (res && res.partsList && Array.isArray(res.partsList) && res.stockList && Array.isArray(res.stockList)) {
          if (data.contentType === 'parts') {
            this.parList = res.partsList;
            this.modalService.open(this.content8, { size: 'xl', scrollable: true, centered: true, })
          }
          if (data.contentType === 'stock') {
            this.stList = res.stockList;
            this.modalService.open(this.content9, { size: 'xl', scrollable: true, centered: true, });
          }

        }
      },
      error: (error) => {
        this.toastr.error("Error fetching stock data.");
        this.bulkPartsStockDataSource.data = [];
      },
    });
  }

  onProductSubmit(modal: any) {
    this.productSubmitted = true;
    if (this.productForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.productForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    const request = this.switchService.saveOrUpdateProduct(payload);
    request.subscribe({
      next: (res: any) => {
        if (res.status === true) {
          const message = this.isEditingProduct
            ? "Product updated successfully."
            : "Product saved successfully.";
          this.toastr.success(message);
          this.modalService.dismissAll(modal);
          this.productForm.reset();
          this.productSubmitted = false;
          this.isEditingProduct = false;
          this.getProductData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onEditProduct(product: any, modal: any) {
    this.productForm.patchValue(product);
    this.isEditingProduct = true;
    this.modalService.open(modal);
  }


  onPanelSubmit(modal: any) {
    this.panelSubmitted = true;
    if (this.panelForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.panelForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.savePanelData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.panelForm.reset();
          this.panelSubmitted = false;
          this.getPanelData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }


  onBasePanelSubmit(modal: any) {
    this.basePanelSubmitted = true;
    if (this.basePanelForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.basePanelForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveBasePanelData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.basePanelForm.reset();
          this.basePanelSubmitted = false;
          this.getBasePanelData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onMakeSubmit(modal: any) {
    this.makeSubmitted = true;
    if (this.makeForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.makeForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveMakeData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.makeForm.reset();
          this.makeSubmitted = false;
          this.getMakeData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onGradeSubmit(modal: any) {
    this.gradeSubmitted = true;
    if (this.gradeForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.gradeForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveGradeData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.gradeForm.reset();
          this.gradeSubmitted = false;
          this.getGradeData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onSkinSubmit(modal: any) {
    this.skinSubmitted = true;
    if (this.skinForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.skinForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveSkinData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.skinForm.reset();
          this.skinSubmitted = false;
          this.getSkinData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onSkinTypeSubmit(modal: any) {
    this.skinTypeSubmitted = true;
    if (this.skinTypeForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.skinTypeForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveSkinTypeData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.skinTypeForm.reset();
          this.skinTypeSubmitted = false;
          this.getSkinTypeData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onSkinFinishSubmit(modal: any) {
    this.skinFinishSubmitted = true;
    if (this.skinFinishForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.skinFinishForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveSkinFinishData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.skinFinishForm.reset();
          this.skinFinishSubmitted = false;
          this.getSkinFinishData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onSkinBrandSubmit(modal: any) {
    this.skinBrandSubmitted = true;
    if (this.skinBrandForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.skinBrandForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveSkinBrandData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.skinBrandForm.reset();
          this.skinBrandSubmitted = false;
          this.getSkinBrandData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onEdgebandSubmit(modal: any) {
    this.EdgebandSubmitted = true;
    if (this.edgeBandForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.edgeBandForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveEdgebandData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.edgeBandForm.reset();
          this.EdgebandSubmitted = false;
          this.getEdgebandData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  onEdgeContentSubmit(
    edgeType: 'edge_make' | 'edge_finish' | 'edge_type' | 'edge_material',
    modal: any
  ) {
    // Set content and type based on the form type
    this.edgeContentForm.patchValue({
      content: edgeType,
      type: this.userType
    });

    // Validate the form
    if (this.edgeContentForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }

    // Get the payload to send
    const payload = this.edgeContentForm.getRawValue();
    console.log("Sending payload:", payload); // for debugging

    // Submit to backend
    this.switchService.saveEdgeContentData(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toastr.success(`Edge ${edgeType.replace('edge_', '')} saved successfully.`);
          this.edgeContentForm.reset();

          // Reset required values again after form reset
          this.edgeContentForm.patchValue({
            companyCode: this.userCompanyCode,
            email: this.userEmail
          });

          // Close modal
          modal.close();
        } else {
          this.toastr.error(res.message || "Something went wrong.");
        }
      },
      error: (err) => {
        console.error('Backend error:', err);
        this.toastr.error(err.error?.message || err.statusText || "Error saving edge content.");
      }
    });
  }

  onProcessPanelSubmit(modal: any) {
    this.processPanelSubmitted = true;
    if (this.processPanelForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    let payload = {
      ...this.processPanelForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveProcessPanelData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          this.toastr.success(res.message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.processPanelForm.reset();
          this.processPanelSubmitted = false;
          this.getProcessPanelData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }



  getProductData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayProductData(payload).subscribe({
      next: (res: any) => {
        this.productDataSource.data = res || [];
        if (this.productPaginator) {
          this.productDataSource.paginator = this.productPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
        this.productDataSource.data = [];
      }
    });
  }

  getPanelData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayPanelData(payload).subscribe({
      next: (res: any) => {
        this.panelItems = res;
        this.panelDataSource.data = [...res];
        if (this.panelPaginator) {
          this.panelDataSource.paginator = this.panelPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
        this.panelDataSource.data = [];
      }
    });
  }

  getEdgebandData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayEdgebandData(payload).subscribe({
      next: (res: any) => {
        this.edgeBandDataSource.data = res || [];
        if (this.edgebandPaginator) {
          this.edgeBandDataSource.paginator = this.edgebandPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
        this.edgeBandDataSource.data = [];
      }
    });
  }

  getProcessPanelData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayProcessPanelData(payload).subscribe({
      next: (res: any) => {
        this.processPanelDataSource.data = res || [];
        if (this.processPanelPaginator) {
          this.processPanelDataSource.paginator = this.processPanelPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
        this.processPanelDataSource.data = [];
      }
    });
  }

  getBasePanelData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayBasePanelData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.basePanel = res.map(panel => ({
            name: panel.basePanleName,
            id: panel.basePanelId
          }));
        } else {
          this.basePanel = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching base panel data");
        this.basePanel = [];
      }
    });
  }


  getMakeData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayMakeData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.makePanel = res.map(make => ({
            name: make.makeName,
            id: make.makeId
          }));
        } else {
          this.makePanel = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching make data");
        this.makePanel = [];
      }
    });
  }

  getGradeData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayGradeData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.gradePanel = res.map(grade => ({
            name: grade.gradeName,
            id: grade.gradePanelId
          }));
        } else {
          this.gradePanel = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching grade data");
        this.gradePanel = [];
      }
    });
  }

  getSkinData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displaySkinData(payload).subscribe({
      next: (res: any) => {
        this.skinItems=res;
        this.skinDataSource.data = res || [];
        if (this.skinPaginator) {
          this.skinDataSource.paginator = this.skinPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching skin data");
        this.skinDataSource.data = [];
      }
    });
  }

  getSkinTypeData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displaySkinTypeData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.skinType = res.map(skin => ({
            name: skin.skinTypeName,
            id: skin.skinTypeId
          }));
        } else {
          this.skinType = [];
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching skin type data");
        this.skinType = [];
      }
    });
  }

  getSkinFinishData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displaySkinFinishData(payload).subscribe({
      next: (res: any) => {
        if (!Array.isArray(res) || res.length === 0) {
          // this.toastr.warning("No make data found.");
        } else {
          this.skinFinish = res.map(skin => ({
            name: skin.skinFinshName,
            id: skin.skinFinishId
          }));
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching make data");
        this.skinFinish = [];
      }
    });
  }

  getSkinBrandData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displaySkinBrandData(payload).subscribe({
      next: (res: any) => {
        if (!Array.isArray(res) || res.length === 0) {
          // this.toastr.warning("No make data found.");
        } else {
          this.skinBrand = res.map(brand => ({
            name: brand.skinBrandName,
            id: brand.skinBrandId
          }));
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching make data");
        this.skinBrand = [];
      }
    });
  }



  deleteProduct(data: any) {
    const prodId = data.prodId;
    if (!prodId) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteProductData(prodId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getProductData();
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deletePannel(data: any) {
    const panelId = data.panelId;
    if (!panelId) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deletePannelData(panelId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getPanelData();
        },
        error: (error) => {
          this.toastr.error("Failed to delete product.");
        }
      });
    }
  }

  deleteBasePanel(data: any, modal: any) {
    const base_pannel_id = data.id;
    if (!base_pannel_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteBasePanelData(base_pannel_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getBasePanelData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deleteMake(data: any, modal: any) {
    const make_id = data.id;
    if (!make_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteMakeData(make_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getMakeData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deletePannelGrade(data: any, modal: any) {
    const pannel_grade_id = data.id;
    if (!pannel_grade_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deletePannelGradeData(pannel_grade_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getGradeData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }


  deleteSkin(data: any) {
    const skinId = data.skinId;
    if (!skinId) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteSkinData(skinId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getSkinData();
        },
        error: (error) => {
          this.toastr.error("Failed to delete product.");
        }
      });
    }
  }


  deleteSkinBrand(data: any, modal: any) {
    const skin_brand_id = data.id;
    if (!skin_brand_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteSkinBrandData(skin_brand_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getSkinBrandData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deleteSkinType(data: any, modal: any) {
    const skin_type_id = data.id;
    if (!skin_type_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteSkinTypeData(skin_type_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getSkinTypeData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deleteSkinFinishType(data: any, modal: any) {
    const skin_finish_id = data.id;
    if (!skin_finish_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteSkinFinishData(skin_finish_id).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getSkinFinishData();
          if (modal) {
            modal.close();
          }
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }


  getStatusClass(isActive: boolean): string {
    return isActive ? "badge bg-success-transparent ps-3 fs-11 order-status complete " : "badge bg-danger-transparent ps-3 fs-11 order-status cancel";
  }

  getStatusText(isActive: boolean): string {
    return isActive ? "Active" : "Inactive";
  }
  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode >= 48 && charCode <= 57) ||
      charCode === 46
    ) {
      return;
    }
    event.preventDefault();
  }



}