import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule
  ],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})


export class OptimizerComponent extends BaseComponent {
  stockDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'autoAdd', 'grain', 'trim', 'allowExactFitShapes', 'cost', 'notes'];
  sawDisplayedColumn: string[] = ['slNo', 'bladeWidth', 'stockType', 'cutType', 'cutPreference', 'strategy', 'maxPhase', 'headCuts', 'primaryCompression', 'stackHeight', 'stockSelection', 'minSpacing', 'stackingMode'];

  dataSource = new MatTableDataSource<any>(); mailId: any = '';
  stockDataSource = new MatTableDataSource<any>();
  sawDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  @ViewChild('sawPaginator') sawPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';


  public optimizerForm!: FormGroup;
  public optimizerFormSubmitted = false;
  public generatedForm!: FormGroup;
  public generatedrFormSubmitted = false;
  public optimizeId: any = '';
  public optimizeFormSample!: FormGroup;
  public uploadParts!: FormGroup;
  public uploadPartsSubmitted = false;
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

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,private offcanvasService: NgbOffcanvas) {
    super();
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.stockDataSource.paginator = this.stockPaginator;
    this.sawDataSource.paginator = this.sawPaginator;
  }


  stockApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    let value = 701883;  // Declare value inside ngOnInit
    this.getStockData(); this.getSawData();
    this.getGeneratedOutputJson(value);

    this.generatedForm = this.fb.group({
      id: [''],
      type: ['', [Validators.required]],
      units: ['', [Validators.required]]
    });

    this.optimizerForm = this.fb.group({
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
      webhook: ['']
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

  }
  value(value: any) {
    throw new Error('Method not implemented.');
  }

  createStockGroup(): FormGroup {
    return this.fb.group({
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
    });
  }

  addStock(): void {
    this.stock.push(this.createStockGroup());
  }

  createPartGroup(): FormGroup {
    return this.fb.group({
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
    });
  }

  addParts(): void {
    this.parts.push(this.createPartGroup());
  }

  onSubmit() {
    this.optimizerFormSubmitted = true; // Mark form as submitted

    if (this.optimizerForm.valid) {
      console.log('Form Data:', this.optimizerForm.value);

      // Send form data to API or process the data
      // Example: this.apiService.submitOptimizerData(this.optimizerForm.value).subscribe(...)

      alert('Form submitted successfully!'); // Replace with actual API call
    } else {
      console.log('Form is invalid! Please check the errors.');
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

  optimizerFormSubmitSubmit() {
    this.optimizerFormSubmitted = true;
    console.log('Form Data:', this.optimizerForm.value);

    if (this.optimizerForm.valid) {
      this.switchService.optimizeImportData(this.optimizerForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            this.optimizeId = (res.id) ? res.id : '';
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {

          }
        }
      })
      // console.log('Form Submitted:', this.optimizerForm.value);
      // Reset form after submission (optional)
      this.optimizerForm.reset();
      this.optimizerFormSubmitted = false;
    }
  }

  VerticallyScrol(content: any) {
    this.modalService.open(content, { backdrop: 'static', keyboard: false, scrollable: true, centered: true, size: 'xl' });
  }
  openLg1(content4: any) {
    this.modalService.open(content4, { backdrop: 'static', keyboard: false, scrollable: true, centered: true, });
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
          console.log("Offcuts Data:", this.offCut);
        } else {
          console.error("No data found.");
        }
      },
      error: (err: any) => {
        console.error("Error fetching data:", err);
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

  onGeneratedSubmit(modal: any) {
    this.generatedrFormSubmitted = true;
    console.log('Form Data:', this.generatedForm.value);

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
          console.log("Stock Data:", this.stockDataSource.data);
          this.stockDataSource.paginator = this.paginator;
        } else {
          this.toastr.error("No data received from server");
          this.stockDataSource.data = [];
        }
      },
      error: (error) => {
        console.error("API Error:", error);
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
          console.log("Saw Data:", this.sawDataSource.data);

          // Ensure paginator is set only if it exists
          if (this.paginator) {
            this.sawDataSource.paginator = this.paginator;
          } else {
            console.warn("Paginator not found!");
          }
        } else {
          console.warn("No data received from server.");
          this.toastr.error("No data available.");
          this.sawDataSource.data = [];
        }
      },
      error: (error) => {
        console.error("API Error:", error);
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
    const allExcel: Array<string> = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

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

}