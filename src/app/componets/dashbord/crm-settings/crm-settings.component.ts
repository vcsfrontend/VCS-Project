import { Component,ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbDropdownModule, NgbModule ,NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,FormGroup ,FormControl, Validators, FormBuilder, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../shared/base/base.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-crm-settings',
  standalone: true,
  imports: [NgSelectModule,FormsModule,CommonModule,SharedModule,NgbModule,NgbDropdownModule,
    MatTableModule, MatPaginator, MatPaginatorModule, MatFormFieldModule, ReactiveFormsModule,
  ],
  templateUrl: './crm-settings.component.html',
  styleUrl: './crm-settings.component.scss'
})
export class CrmSettingsComponent extends BaseComponent{
  crmAllUsersColumn: string[] = ['slNo', 'username', 'phone', 'email', 'Role', 'edit', 'delete'];
  crmUsersColumn: string[] = ['slNo', 'desigRole', 'crmDesigRoleId', 'email', 'edit', 'delete'];
  crmAllDataSource = new MatTableDataSource<any>();
  crmDataSource = new MatTableDataSource<any>();
  @ViewChild('crmAllPaginator') crmAllPaginator!: MatPaginator;
  @ViewChild('crmPaginator') crmPaginator!: MatPaginator;
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: string = this.userData ? this.userData.type : '';
  designCrmForm! : FormGroup;  saveCrmUsersForm!: FormGroup; 
  isSubmitting: boolean = false; usersList: any[] = [];
  public designCrmSubmitted = false;
  public assignRoleSubmitted = false;
  stageLst: any;newItem: string = ''; statusLst :any;
  isStage: boolean = false;showStages: boolean = false;
  addMoreVisible: boolean = false; 

  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas,public switchService: SwitherService,private toastr: ToastrService,
    private fb: FormBuilder,
  ){

    super();
  }
  leaditems: { checked: boolean;label: string }[] = [];
  leadStatusitems : {checked : boolean; label : string}[] = [];
  selectedProgressLeads: any[] = [];
  selectedLostLeads: any[] = [];
  selectedConvertedLeads: any[] = [];
  selectedType: string = '';
  crmStaticStages = [
    { name: 'In Progress Leads', checked: false, isDefault: true },
    { name: 'Lost Leads', checked: false, isDefault: true },
    { name: 'Converted Leads', checked: false, isDefault: true },
  ];
  
  openRight4(content4: any) {
    this.offcanvasService.open(content4, { position: 'end' });
  }
  openRight12(content12: any) {
    this.offcanvasService.open(content12, { position: 'end' });
  }
  addLeadItem() {
    const itemExists = this.crmStaticStages.some(
      (plan) => plan.name.toLowerCase() === this.newItem.trim().toLowerCase()
    );
    if (this.newItem.trim() && !itemExists) {
      this.crmStaticStages.push({
        name: this.newItem.trim(),
        checked: false,
        isDefault: false,
      });
      this.newItem = '';
    } else if (itemExists) {
      this.toastr.warning('This item already exists!');
    }
    this.leaditems.push({ checked: false,label: '' });
  }
  deleteLeadItem(index: number) {
    this.crmStaticStages.splice(index, 1);
  }
  addLeadStatusItem() {
    this.leadStatusitems.push({ checked: false,label: '' });
  }
  leadstatus = [
    { name: 'Quotataion Shared', checked: false, isDefault: true },
    { name: 'Commercial Discussion', checked: false, isDefault: true },
    { name: 'Office Visit', checked: false, isDefault: true },
    { name: 'Hot', checked: false, isDefault: true },
    { name: 'Cold', checked: false, isDefault: true },
    { name: 'Warm', checked: false, isDefault: true },
    { name: 'Call Back', checked: false, isDefault: true },
  ];
  lostLeads = [
    { name: 'not Interested', checked: false, isDefault: true },
    { name: 'Irrelevant', checked: false, isDefault: true },
    { name: 'Given to others', checked: false, isDefault: true },
  ];
  convertedLeads = [
    { name: 'CD done', checked: false, isDefault: true },
    { name: '10% advance Done', checked: false, isDefault: true },
  ];
  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible; // Toggle visibility
  }
  saveData: any;
  saveStageData:any;
  ngOnInit() {
    this.getStatus();this.getCrmStages(); 
    this.getDesignationCrmRloes(); this.getUsers();
    this.saveData = {
      stageId: 0,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      stage: "",
      f1: "",
      f2: "", 
      f3: "", 
      f4: "", 
      f5: "", 
      f6: "",
      f7: "",
      f8: "",
      f9: "", 
      f10: "",
      f11: "",
      f12: "",
      f13: "",
      f14: "",
      f15: "",
      f16: "",
      f17: "",
      f18: "",
      f19: "",
      f20: "",
      f21: "",
      f22: "",
      f23: "",
      f24: "",
      f25: "",
      updatedBy: this.userName,
      updatedTime: new Date().toISOString(),
      stageActivity: "YES",
      type: this.userType
    };
    this.saveStageData = {
      stageId: 0,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
      stage: "",
      f1: "",
      f2: "", 
      f3: "", 
      f4: "", 
      f5: "", 
      f6: "",
      f7: "",
      f8: "",
      f9: "", 
      f10: "",
      f11: "",
      f12: "",
      f13: "",
      f14: "",
      f15: "",
      f16: "",
      f17: "",
      f18: "",
      f19: "",
      f20: "",
      f21: "",
      f22: "",
      f23: "",
      f24: "",
      f25: "",
      updatedBy: this.userName,
      updatedTime: new Date().toISOString(),
      stageActivity: "YES",
      type: this.userType
    };

    this.designCrmForm = this.fb.group({
      desigRole: ['', Validators.required],
      crmDesigRoleId: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });

    this.saveCrmUsersForm = this.fb.group({
      email: [this.userEmail],
      companyCode: [this.userCompanyCode],
      type: [this.userType],
      designationRole: ['', Validators.required],
      designationRoleId: [0, Validators.required,],
      curentUserEmail: [this.userEmail],
      targetUserEmail: ['' ],
      designationId : ['']
    });

    this.saveCrmUsersForm = this.fb.group({
      designationId: [],
      desigRole: ['', Validators.required],
      crmDesigRoleId: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });
  }
  dynamicFields: { value: string;}[] = [];
  initializeDynamicFields(): void {
    this.dynamicFields = [];
  
    if (this.stageLst && this.stageLst.length > 0) {
      const stage = this.stageLst[0]; // Assuming you want to display only the first stage
  
      for (let i = 1; i <= 25; i++) {
        const value = stage[`f${i}`];
        if (value && value.trim() !== '') {
          this.dynamicFields.push({ value: value.trim() });
        }
      }
  
      console.log('Dynamic Fields:', this.dynamicFields);
    }
  }
  
  saveStatus() {
    this.switchService.SaveCrmStatus(this.saveData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getStatus();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }
  getStatus() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      CompanyName:this.userCompanyName,
      type: this.userType
    }
    this.switchService.CrmStatus(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.statusLst = res;
          // this.initializeDynamicFields();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }
  saveStages() {
    console.log(this.saveStageData)
    this.switchService.SaveCrmStages(this.saveStageData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getCrmStages();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }
  getCrmStages(): void {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
  
    this.switchService.CrmStages(payload).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.stageLst = res;
          console.log('CRM Stages Response:', res);
  
          this.initializeDynamicFields(); 
          this.showStages = this.dynamicFields.length > 0;
        } else {
          this.toastr.error(res?.message || 'Invalid response from server.');
        }
      },
      error: (error) => {
        console.error('CRM Stages Error:', error);
        this.toastr.error(error.statusText || 'Something went wrong while fetching stages.');
      },
    });
  }
  onCheckboxChange() {
    const selectedPlans = this.crmStaticStages.filter((plan) => plan.checked);
    // Update f1 to f30 fields dynamically based on selected items
    selectedPlans.forEach((plan, index) => {
      if (index < 30) {
        this.saveStageData[`f${index + 1}`] = plan.name;
      }
    });
    for (let i = selectedPlans.length; i < 30; i++) {
      this.saveStageData[`f${i + 1}`] = '';
    }
  }
  resetForm() {
    this.newItem = ''; // Reset the input field
    this.addMoreVisible = false; // Hide the 'Add More' section
    this.crmStaticStages.forEach(plan => {
      plan.checked = false; // Unselect all checkboxes
    });
  }

  get f() {
    return this.designCrmForm.controls;
  }

  openLg1(content1: any) {
    this.modalService.open(content1, { scrollable: true, centered: true, });
  }
  openLg2(content2: any) {
    this.modalService.open(content2, { scrollable: true, centered: true, });
  }
  openLg3(content3: any) {
    this.modalService.open(content3, { size: 'sm',  scrollable: true, centered: true, });
  }

  ngAfterViewInit() {
    this.crmAllDataSource.paginator = this.crmAllPaginator;
    this.crmDataSource.paginator = this.crmPaginator;
  }

  

  desigCrmSubmit(modal: any) {
    this.designCrmSubmitted = true;
    if (this.designCrmForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    const payload = {
      ...this.designCrmForm.getRawValue(),
      desigRole: this.designCrmForm.get('desigRole')?.value.toUpperCase(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
      this.switchService.saveDesigCrm(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false; 
        if (res.status === true) {
          this.modalService.dismissAll(modal);
          this.designCrmForm.reset();
          this.designCrmSubmitted = false;
          this.getDesignationCrmRloes();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  assignRoleSubmit(modal: any) {
    this.designCrmSubmitted = true;
    if (this.designCrmForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    const payload = {
      ...this.designCrmForm.getRawValue(),
      desigRole: this.designCrmForm.get('desigRole')?.value.toUpperCase(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
      this.switchService.saveDesigCrm(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false; 
        if (res.status === true) {
          this.modalService.dismissAll(modal);
          this.designCrmForm.reset();
          this.designCrmSubmitted = false;
          this.getDesignationCrmRloes();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }

  getUsers() {
    if (this.userData.type == 2) {
      let cn = this.userData.companyName;
      let cc = this.userData.companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.crmAllDataSource.data = res;
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      });
    }
  }

  getDesignationCrmRloes() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.designationCrmRloes(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.crmDataSource.data = res;
          this.usersList = res.map((item: any) => ({
            name: item.desigRole  
          }));
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
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
  getSNo(index: number): number {
    if (this.crmPaginator && this.crmPaginator.pageIndex !== undefined && this.crmPaginator.pageSize !== undefined) {
      return this.crmPaginator.pageIndex * this.crmPaginator.pageSize + index + 1;
    }
    return index + 1; 
  }

  crmUsersgetSNo(index: number): number {
    if (this.crmAllPaginator && this.crmAllPaginator.pageIndex !== undefined && this.crmAllPaginator.pageSize !== undefined) {
      return this.crmAllPaginator.pageIndex * this.crmAllPaginator.pageSize + index + 1;
    }
    return index + 1; 
  }
}
