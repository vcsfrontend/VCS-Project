import { Component } from '@angular/core';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray, } from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})


export class OptimizerComponent extends BaseComponent {
  public optimizerForm!: FormGroup;
  public optimizerFormSubmitted = false;
  public optimizeId: any = '';

  Selection = [
    { value: 1, label: 'English' },
    { value: 2, label: 'French' },
    { value: 3, label: 'Arabic' },
    { value: 4, label: 'Hindi' },
  ];

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService) {
    super();
  }



  ngOnInit(): void {
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
    return (this.optimizerForm.get('stock') as FormArray);
  }

  // Getter for parts FormArray
  get parts() {
    return (this.optimizerForm.get('parts') as FormArray);
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
}