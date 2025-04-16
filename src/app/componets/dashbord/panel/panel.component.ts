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
  selector: 'app-panel',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule,NgbTooltipModule
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent extends BaseComponent {
  panelDisplayedColumn: string[] = ['slNo', 'designNo', 'name', 'length', 'width', 'thickness', 'uom', 'basePanel', 'make', 'grade', 'hotpress', 'grains', 'isActive', 'edit', 'image', 'delete'];
  panelDataSource = new MatTableDataSource<any>();
  @ViewChild('panelPaginator') panelPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  panelForm!: FormGroup;  panelItems: any[] = []; gradePanel: any[] = []; makePanel: any[] = [];
  gradeForm!: FormGroup; makeForm!: FormGroup;  basePanelForm!: FormGroup; basePanel: any[] = [];
  isEditingPanel: boolean = false;

  public panelSubmitted = false;
  public gradeSubmitted = false;
  public makeSubmitted = false;
  public basePanelSubmitted = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,
    ) {
      super();

  }
  ngOnInit(): void {
    this.getPanelData();
    this.getGradeData();
    this.getMakeData();
    this.getBasePanelData();
    

    //panel form
    this.panelForm = this.fb.group({
      panelId: [{ value: this.generateProductId(), disabled: true }],
      designNo: ['', Validators.required],
      name: ['', Validators.required],
      pressing: ['', Validators.required],
      basePanel: ['', Validators.required],
      make: ['', Validators.required],
      grade: ['', Validators.required],
      length: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      width: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      thickness: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      isActive: [true],
      isColdPress: [true],
      grains: ['', Validators.required],
      image: ['', Validators.required],
      origin : [''],
      hotpress: [2],
      uom: ['nos'],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //base panel form
    this.basePanelForm = this.fb.group({
      basePanelId: [{ value: this.generateProductId(), disabled: true }],
      basePanleName: ['', Validators.required],
      abbr: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //make form
    this.makeForm = this.fb.group({
      makeId: [{ value: this.generateProductId(), disabled: true }],
      makeName: ['', Validators.required],
      abbr: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });

    //base panel grade form
    this.gradeForm = this.fb.group({
      gradePanelId: [{ value: this.generateProductId(), disabled: true }],
      gradeName: ['', Validators.required],
      abbr: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });
  }

  onPanelSubmit(modal: any) {
    this.panelSubmitted = true;
    if (this.panelForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.panelForm.patchValue({
      origin: this.isEditingPanel ? 'edit' : 'save'
    });
    let payload = {
      ...this.panelForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveOrUpdatePanel(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          const message = this.isEditingPanel
            ? "Panel updated successfully."
            : "Panel saved successfully.";
          this.toastr.success(message);
          this.modalService.dismissAll(modal);
          this.panelForm.reset();
          this.panelSubmitted = false;
          this.isEditingPanel = false;
          this.getPanelData(); 
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the panel.");
      }
    });
  }
  
  
  
  onEditPanel(panel: any, modal: any) {
    this.panelForm.get('panelId')?.enable();
    this.panelForm.patchValue({
      ...panel,
      origin: 'edit'
    });
    this.panelForm.get('panelId')?.disable();
    this.isEditingPanel = true;
    this.modalService.open(modal);
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
            modal.close();
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
            modal.close();
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
            modal.close();
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

  openLg6(content11: any) {
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

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000); 
  }

  get q() {
    return this.panelForm.controls;
  }

  get gf() {
    return this.gradeForm.controls;
  }
  get f() {
    return this.makeForm.controls;
  }

  get h() {
    return this.basePanelForm.controls;
  }

  ngAfterViewInit() {
    this.panelDataSource.paginator = this.panelPaginator;
  }

  panelGetSNo(index: number): number {
    if (this.panelPaginator && this.panelPaginator.pageIndex !== undefined && this.panelPaginator.pageSize !== undefined) {
      return this.panelPaginator.pageIndex * this.panelPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  panelApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.panelDataSource.filter = filterValue.trim().toLowerCase();
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
