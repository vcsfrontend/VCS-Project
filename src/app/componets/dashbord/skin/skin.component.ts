import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbNavModule, NgbDropdownModule, NgbOffcanvas, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-skin',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule,NgbTooltipModule
  ],
  templateUrl: './skin.component.html',
  styleUrl: './skin.component.scss'
})
export class SkinComponent extends BaseComponent {
  skinDisplayedColumn: string[] = ['designNo', 'name', 'brand', 'skinType', 'length', 'width', 'thickness', 'operation', 'grains', 'uom', 'skinFinish', 'edgeBands', 'isActive', 'isColdPress', 'edit', 'image', 'delete'];
  skinDataSource = new MatTableDataSource<any>();
  @ViewChild('skinPaginator') skinPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  skinForm!: FormGroup; skinTypeForm!: FormGroup; skinFinishForm!: FormGroup; skinBrandForm!: FormGroup;
  skinItems: any[] = []; skinFinish: any[] = [];  skinType: any[] = [];  skinBrand: any[] = [];
  isEditingSkin: boolean = false;

  public skinSubmitted = false;
  public skinBrandSubmitted = false;
  public skinFinishSubmitted = false;
  public skinTypeSubmitted = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,
  ) {
    super();

  }
  ngOnInit(): void {
    this.getSkinData();
    this.getSkinTypeData();
    this.getSkinFinishData();
    this.getSkinTypeData();
    this.getSkinBrandData();

    //skin form
    this.skinForm = this.fb.group({
      skinId: [{ value: this.generateProductId(), disabled: true }],
      designNo: ['', Validators.required],
      name: ['', Validators.required],
      brand: ['', Validators.required],
      skinType: ['', Validators.required],
      length: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      width: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      thickness: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      operation: ['', Validators.required],
      grains: ['', Validators.required],
      uom: ['nos', Validators.required],
      skinFinish: ['', Validators.required],
      isActive: [true],
      isColdPress: [true],
      edgeBands: ['', Validators.required],
      image: ['', Validators.required],
      origin : [''],
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
  }
  

  onSkinSubmit(modal: any) {
    this.skinSubmitted = true;
    if (this.skinForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.skinForm.patchValue({
      origin: this.isEditingSkin ? 'edit' : 'save'
    });
    let payload = {
      ...this.skinForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveSkinData(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          const message = this.isEditingSkin
            ? "Skin updated successfully."
            : "Skin saved successfully.";
          this.toastr.success(message);
          this.modalService.dismissAll(modal);
          this.skinForm.reset();
          this.skinSubmitted = false;
          this.isEditingSkin = false;
          this.getSkinData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the skin.");
      }
    });
  }

  onEditSkin(skin: any, modal: any) {
    this.skinForm.get('skinId')?.enable(); 
    this.skinForm.patchValue({
      ...skin,
      origin: 'edit'
    });
    this.skinForm.get('skinId')?.disable(); 
    this.isEditingSkin = true;
    this.modalService.open(modal);
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
          this.skinTypeForm.reset();
          this.skinTypeSubmitted = false;
          modal.close();
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
          this.skinFinishForm.reset();
          this.skinFinishSubmitted = false;
          modal.close();
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
          this.skinBrandForm.reset();
          this.skinBrandSubmitted = false;
          modal.close();
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

  getSkinData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displaySkinData(payload).subscribe({
      next: (res: any) => {
        this.skinItems = res;
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
          this.skinBrand = [];
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

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000); 
  }

  skinApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.skinDataSource.filter = filterValue.trim().toLowerCase();
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

  get t() {
    return this.skinForm.controls;
  }
  get f() {
    return this.skinBrandForm.controls;
  }
  get gf() {
    return this.skinTypeForm.controls;
  }
  get g() {
    return this.skinFinishForm.controls;
  }
  
  openLg14(content18: any) {
    this.modalService.open(content18, { scrollable: true, centered: true, });
  }

  openLg24(content28: any) {
    this.modalService.open(content28, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg23(content27: any) {
    this.modalService.open(content27, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg22(content26: any) {
    this.modalService.open(content26, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg21(content25: any) {
    this.modalService.open(content25, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg20(content24: any) {
    this.modalService.open(content24, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg25(content29: any) {
    this.modalService.open(content29, { size: 'sm', scrollable: true, centered: true, });
  }


}
