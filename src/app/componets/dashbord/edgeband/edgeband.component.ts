import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbNavModule, NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../shared/base/base.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@Component({
  selector: 'app-edgeband',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule
  ],
  templateUrl: './edgeband.component.html',
  styleUrl: './edgeband.component.scss'
})
export class EdgebandComponent  extends BaseComponent{
  edgeBandDisplayedColumn: string[] = ['designCode', 'designNo', 'name', 'make', 'material', 'finish', 'width', 'thickness', 'hsnCode', 'premiling', 'isActive', 'image', 'uom', 'internalCode', 'edit', 'image', 'delete'];
  edgeBandDataSource = new MatTableDataSource<any>();
  @ViewChild('edgebandPaginator') edgebandPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  edgeBandForm!: FormGroup; edgeContentForm!: FormGroup;
  edgeBrandMaterial: any[] = []; edgeBrandType: any[] = []; edgeBrandData: any[] = [];
  edgeBrandFinish: any[] = []; makeEdge: any[] = []; 
  edgeContent = '';
  edgePopupTitle = ''; isEditingEdgeband : boolean = false;

  public EdgebandSubmitted = false;
  public edgeContentSubmitted = false;
  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,
  ) {
    super();

  }
  ngOnInit(): void {
    this.getEdgebandData();
    this.getMakeEdgeData('edge_make');
    this.getMakeEdgeData('edge_material');
    this.getMakeEdgeData('edge_type');
    this.getMakeEdgeData('edge_finish');

    //edgebrand form
    this.edgeBandForm = this.fb.group({
      edgeBandId: [{ value: this.generateProductId(), disabled: true }],
      designNo: ['', [Validators.required , Validators.pattern('^[0-9]*$')]],
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
      origin:  [''],
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

  onEdgeContentSubmit(modal: any ) {
    // Set content and type based on the form type
    this.edgeContentForm.patchValue({
      content: this.edgeContent,
      type: this.userType
    });
    this.edgeContentSubmitted = true;
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
          this.toastr.success(`Edge ${this.edgeContent.replace('edge_', '')} saved successfully.`);
          this.edgeContentForm.reset();

          // Reset required values again after form reset
          this.edgeContentForm.patchValue({
            companyCode: this.userCompanyCode,
            email: this.userEmail
          });
          this.getMakeEdgeData(this.edgeContent);
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

  onEdgebandSubmit(modal: any) {
    this.EdgebandSubmitted = true;
    if (this.edgeBandForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.edgeBandForm.patchValue({
      origin: this.isEditingEdgeband ? 'edit' : 'save'
    });
    const payload = {
      ...this.edgeBandForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveEdgebandData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          const message = this.isEditingEdgeband
            ? "Edge band updated successfully."
            : "Edge band saved successfully.";
          this.toastr.success(message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.edgeBandForm.reset();
          this.EdgebandSubmitted = false;
          this.isEditingEdgeband = false;
          this.getEdgebandData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the edge band.");
      }
    });
  }

  onEditEdgeband(edgeband: any, modal: any) {
    this.edgeBandForm.get('edgeId')?.enable(); // If `edgeId` is disabled
    this.edgeBandForm.patchValue({
      ...edgeband,
      origin: 'edit'
    });
    this.edgeBandForm.get('edgeId')?.disable(); // If needed
    this.isEditingEdgeband = true;
    this.modalService.open(modal);
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

  getMakeEdgeData(edgeType: any) {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
      content: edgeType
    };
    this.switchService.getEdgeContentData(payload).subscribe({
      next: (res: any) => {        
        if (!Array.isArray(res) || res.length === 0) {
          // this.toastr.warning("No make data found.");
        } else {
          if (edgeType === 'edge_make') {
            this.makeEdge = res.map(edge => ({
              name: edge.name,
              id: edge.id
            }));
          }
          else if (edgeType === 'edge_material') {
            this.edgeBrandMaterial = res.map(edge => ({
              name: edge.name,
              id: edge.id
            }));
          }
          else if (edgeType === 'edge_type') {
            this.edgeBrandType = res.map(edge => ({
              name: edge.name,
              id: edge.id
            }));
          }
          else if (edgeType === 'edge_finish') {
            this.edgeBrandFinish = res.map(edge => ({
              name: edge.name,
              id: edge.id
            }));
          }
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching make data");
        this.makeEdge = [];
        this.edgeBrandMaterial = [];
        this.edgeBrandType = [];
        this.edgeBrandFinish = [];
      }
    });
  }

  deleteEdgeband(data: any) {
    const edgeBandId = data.edgeBandId;
    if (!edgeBandId) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteEdgeContentData(edgeBandId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getEdgebandData();
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  deleteEdgeContent(data: any, modal: any) {
    const make_id = data.id;
    if (!make_id) {
      alert('Error: Product ID is missing!');
      return;
    }
    let payload = {
      id: make_id,
      content: this.edgeContent
    };
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteEdgeData(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getMakeEdgeData(this.edgeContent);
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

  openEdgeGetPopup(content22: any, edgeType: any, edgeTitle: any) {
    this.modalService.open(content22, { size: 'sm', scrollable: true, centered: true, });
    this.edgePopupTitle = edgeTitle;
    this.edgeContent = edgeType;
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
      content: edgeType
    };
    this.switchService.getEdgeContentData(payload).subscribe({
      next: (res: any) => {
        this.edgeBrandData = [];
        if (!Array.isArray(res) || res.length === 0) {
          // this.toastr.warning("No make data found.");
        } else {
          this.edgeBrandData = res;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching make data");
        this.edgeBrandData = [];
      }
    });
  }

  openLg16(content20: any) {
    this.modalService.open(content20, { scrollable: true, centered: true, });
  }

  openEdgePopup(content21: any, edgeType: any, edgeTitle: any) {
    this.modalService.open(content21, { size: 'sm', scrollable: true, centered: true, });
    this.edgePopupTitle = edgeTitle;
    this.edgeContent = edgeType;
    
  }

  edgeBandApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.edgeBandDataSource.filter = filterValue.trim().toLowerCase();
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

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
  }
  get f() {
    return this.edgeBandForm.controls;
  }
  get gf() {
    return this.edgeContentForm.controls;
  }

}
