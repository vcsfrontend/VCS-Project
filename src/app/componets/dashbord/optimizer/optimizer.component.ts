import { Component, ViewChild } from '@angular/core';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
    CommonModule,MatFormFieldModule, MatSelectModule,   MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule,MatTableModule
  ],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})


export class OptimizerComponent extends BaseComponent {
  public optimizerForm!: FormGroup;  
  public optimizerFormSubmitted = false;
  public generatedForm!: FormGroup;
  public generatedrFormSubmitted = false;
  public optimizeId: any = '';
  public optimizeFormSample!: FormGroup;
  public stepIndex = 1;
  Selection = [
    { value: 1, label: 'English' },
    { value: 2, label: 'French' },
    { value: 3, label: 'Arabic' },
    { value: 4, label: 'Hindi' },
  ];
  displayedColumns: string[] = ['slNo', 'guillotine', 'isTrim', 'x1', 'x2', 'y1', 'y2', 'order', 'id', 'notes'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  responce: any; cutData: any[] = [];
  offCut: any;
  metaData: any;


  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService) {
    super();
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    let value = 701883;  // Declare value inside ngOnInit
    this.getGeneratedOutputJson(value);

    this.generatedForm = this.fb.group({
      id: [''],
      type: [''],
      units: ['']
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
      webhook: ['']
    });

  }
  value(value: any) {
    throw new Error('Method not implemented.');
  }

  createStockGroup(): FormGroup {
    return  this.fb.group({
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
    return  this.fb.group({
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


  onGeneratedSubmit(modal: any) {
    this.generatedrFormSubmitted = true;
    console.log('Form Data:', this.generatedForm.value);

    if (this.generatedForm.valid) {
      this.switchService.optimizeGeneratedOutputData(this.generatedForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();            
            this.toastr.success(res.message, 'lead', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });

          } else {

          }
        }
      })
      // console.log('Form Submitted:', this.optimizerForm.value);
      // Reset form after submission (optional)
      this.generatedForm.reset();
      this.generatedrFormSubmitted = false;
    }
  }

}