import { Component } from '@angular/core';
import { NgbNavModule,NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule,} from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { CommonModule} from '@angular/common';



@Component({
  selector: 'app-optimizer',
  standalone: true,
  imports: [SharedModule,NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './optimizer.component.html',
  styleUrl: './optimizer.component.scss'
})


export class OptimizerComponent extends BaseComponent{
    public optimizerForm!: FormGroup;
    public optimizerFormSubmitted = false;

  
    Selection = [
      { value: 1, label: 'English' },
      { value: 2, label: 'French' },
      { value: 3, label: 'Arabic' },
      { value: 4, label: 'Hindi' },
    ];
  
    constructor(private modalService: NgbModal, private fb: FormBuilder) {
      super();
    }
    requestData = {
      saw: {
        bladeWidth: 0,
        stockType: 'string',
        cutType: 'string',
        cutPreference: 'string',
        guillotineOptions: {
          strategy: 'string',
          maxPhase: 0
        },
        efficiencyOptions: {
          primaryCompression: 'string'
        },
        stackHeight: 0,
        options: {
          stockSelection: 'string',
          minSpacing: 0,
          stackingMode: 'string'
        }
      },
      stock: [
        {
          name: 'string',
          l: 0,
          w: 0,
          t: 0,
          material: 'string',
          q: 0,
          autoAdd: true,
          grain: 'string',
          trim: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          },
          allowExactFitShapes: true,
          cost: 0,
          notes: 'string'
        }
      ],
      parts: [
        {
          name: 'string',
          l: 0,
          w: 0,
          trim: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
          },
          t: 0,
          material: 'string',
          q: 0,
          banding: {
            x1: true,
            x2: true,
            y1: true,
            y2: true
          },
          finish: {
            a: 'string',
            b: 'string'
          },
          orientationLock: 'string',
          notes: 'string'
        }
      ],
      groups: [
        {
          direction: 'string',
          parts: [0],
          q: 0
        }
      ],
      webhook: 'string'
    };
    
  
    ngOnInit(): void {
      this.optimizerForm = this.fb.group({
        saw: this.fb.group({
          bladeWidth: [this.requestData.saw.bladeWidth, [Validators.required]],
          stockType: [this.requestData.saw.stockType, Validators.required],
          cutType: [this.requestData.saw.cutType, Validators.required],
          cutPreference: [this.requestData.saw.cutPreference, Validators.required],
          guillotineOptions: this.fb.group({
            strategy: [this.requestData.saw.guillotineOptions.strategy, Validators.required],
            maxPhase: [this.requestData.saw.guillotineOptions.maxPhase, Validators.required]
          }),
          efficiencyOptions: this.fb.group({
            primaryCompression: [this.requestData.saw.efficiencyOptions.primaryCompression]
          }),
          stackHeight: [this.requestData.saw.stackHeight],
          options: this.fb.group({
            stockSelection: [this.requestData.saw.options.stockSelection],
            minSpacing: [this.requestData.saw.options.minSpacing],
            stackingMode: [this.requestData.saw.options.stackingMode]
          })
        }),
    
        stock: this.fb.array([]), // If needed, populate dynamically
        parts: this.fb.array([]), // If needed, populate dynamically
        groups: this.fb.array([]), // If needed, populate dynamically
    
        webhook: [this.requestData.webhook, Validators.required]
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
      return this.optimizerForm.controls;
    }
  
    optimizerFormSubmitSubmit() {
      this.optimizerFormSubmitted = true;
  
      if (this.optimizerForm.valid) {
        // console.log('Form Submitted:', this.optimizerForm.value);
        // Reset form after submission (optional)
        this.optimizerForm.reset();
        this.optimizerFormSubmitted = false;
      }
    }
  
    VerticallyScrol(content: any) {
      this.modalService.open(content, { backdrop: 'static', keyboard: false, scrollable: true, centered: true, size: 'xl' });
    }
  }