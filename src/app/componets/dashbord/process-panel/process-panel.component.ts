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
  selector: 'app-process-panel',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule, NgbTooltipModule
  ],
  templateUrl: './process-panel.component.html',
  styleUrl: './process-panel.component.scss'
})
export class ProcessPanelComponent extends BaseComponent {
  processPanelDisplayedColumn: string[] = ['code', 'name', 'panel', 'skin1', 'skin2', 'isActive', 'edit', 'delete'];
  processPanelDataSource = new MatTableDataSource<any>();
  @ViewChild('processPanelPaginator') processPanelPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  processPanelForm!: FormGroup; panelItems: any[] = []; skinItems: any[] = [];
  isEditingProcessPanel: boolean = false; isSubmitting: boolean = false;
  skinIdNameMap: { [key: string]: string } = {};
  panelIdNameMap: { [key: string]: string } = {};


  public processPanelSubmitted = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,
  ) {
    super();

  }
  ngOnInit(): void {
    this.getProcessPanelData();
    this.getPanelData();
    this.getSkinData();

    //process panel form
    this.processPanelForm = this.fb.group({
      processedPanelId: [{ value: this.generateProductId(), disabled: true }],
      code: ['', Validators.required],
      name: ['', Validators.required],
      panel: ['', Validators.required],
      skin1: ['', Validators.required],
      skin2: ['', Validators.required],
      pricePerFt: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      gst: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      finalAmount: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      notes: ['', Validators.required],
      isActive: [true],
      origin: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
    });
  }

  onProcessPanelSubmit(modal: any) {
    this.processPanelSubmitted = true;
    if (this.processPanelForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.isSubmitting = true;
    this.processPanelForm.patchValue({
      origin: this.isEditingProcessPanel ? 'edit' : 'save'
    });
    const payload = {
      ...this.processPanelForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };

    this.switchService.saveProcessPanelData(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.status === true) {
          const message = this.isEditingProcessPanel
            ? "Process Panel updated successfully."
            : "Process Panel saved successfully.";
          this.toastr.success(message);
          if (modal) {
            this.modalService.dismissAll(modal);
          }
          this.processPanelForm.reset();
          this.processPanelSubmitted = false;
          this.isEditingProcessPanel = false;
          this.getProcessPanelData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.statusText || "An error occurred while saving the process panel.");
      }
    });
  }

  onEditProcessPanel(processPanel: any, modal: any) {   
    this.processPanelForm.get('processPanelId')?.enable();
    this.processPanelForm.patchValue({
      ...processPanel,
      origin: 'edit',
      skin1:Number(processPanel.skin1),
      skin2:Number(processPanel.skin2),
      panel:Number(processPanel.panel),
    });
    this.processPanelForm.get('processPanelId')?.disable();    
    this.isEditingProcessPanel = true;
    this.modalService.open(modal);
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
        this.panelIdNameMap = {};
        this.panelItems.forEach((item: any) => {
          this.panelIdNameMap[String(item.panelId)] = item.name;
        });
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
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
        this.skinIdNameMap = {};
        this.skinItems.forEach((item: any) => {
          this.skinIdNameMap[String(item.skinId)] = item.name;
        });
      },
      error: (error) => {
        this.toastr.error("Error fetching skin data");
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


  deleteProcessPanel(data: any) {
    const prodId = data.processedPanelId;
    if (!prodId) {
      alert('Error: Process Panel ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this process panel?')) {
      this.switchService.deleteProcessPanelData(prodId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getProcessPanelData();
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

  ngAfterViewInit() {
    this.processPanelDataSource.paginator = this.processPanelPaginator;
  }

  panelGetSNo(index: number): number {
    if (this.processPanelPaginator && this.processPanelPaginator.pageIndex !== undefined && this.processPanelPaginator.pageSize !== undefined) {
      return this.processPanelPaginator.pageIndex * this.processPanelPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  panelApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.processPanelDataSource.filter = filterValue.trim().toLowerCase();
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

  openLg26(content30: any) {
    this.modalService.open(content30, { size: 'sm', scrollable: true, centered: true, });
  }

  openLg16(content30: any) {
    this.isEditingProcessPanel = false;
    this.processPanelSubmitted = false;
    this.processPanelForm.patchValue({
      processedPanelId: this.generateProductId(),
      code: '',
      name: '',
      panel: '',
      skin1: '',
      skin2: '',
      pricePerFt: 0,
      gst: 0,
      finalAmount: 0,
      notes: '',
      isActive: true,
      origin: 'add',
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      type: this.userType,
    });
    this.processPanelForm.get('processPanelId')?.enable();
    this.modalService.open(content30, { scrollable: true, centered: true, });
  }

  processPanelApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.processPanelDataSource.filter = filterValue.trim().toLowerCase();
  }
  get f() {
    return this.processPanelForm.controls;
  }
  getSkinName(skinId: any): any {    
    const skin = this.skinItems.find(p => p.skinId == skinId);
    return skin ? skin.name : '';
  }

  getPanelName(panelId: any): any {    
    const panel = this.panelItems.find(p => p.panelId == panelId);
    return panel ? panel.name : '';
  }

}