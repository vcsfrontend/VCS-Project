import { Component, ViewChild } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbDropdownModule, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../../shared/base/base.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-crm-settings',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule, SharedModule, NgbModule, NgbDropdownModule,
    MatTableModule, MatPaginator, MatPaginatorModule, MatFormFieldModule, ReactiveFormsModule,
  ],
  templateUrl: './crm-settings.component.html',
  styleUrl: './crm-settings.component.scss'
})
export class CrmSettingsComponent extends BaseComponent {
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
  designCrmForm!: FormGroup; saveCrmUsersForm!: FormGroup;
  isSubmitting: boolean = false; usersList: any[] = [];
  public designCrmSubmitted = false;
  public assignRoleSubmitted = false;
  stageLst: any; newItem: string = ''; statusLst: any;
  isStage: boolean = false; showStages: boolean = false;
  leaditems: { checked: boolean; label: string }[] = [];
  leadStatusitems: { checked: boolean; label: string }[] = [];
  selectedProgressLeads: any[] = [];
  selectedLostLeads: any[] = [];
  selectedConvertedLeads: any[] = [];
  selectedType: string = '';
  addMoreVisible: boolean = false; isAddStagesDisabled: boolean = false; isAddStatusDisabled: boolean = true;
  crmStageData: any; crmStatusData: any; selectedStage: string = ''; checkboxStageOptions: any[] = [];
  newOptionName: string = ''; status: string = 'In Progress Leads';
  isStagesLoading: boolean = true; showValidationError = false;
  showCheckboxError = false;showNameError = false;
  statusOptionsByStage: { [stageName: string]: any[] } = {};
  statusOptionsByStageforDisplay : any = {};
  constructor(private modalService: NgbModal, private offcanvasService: NgbOffcanvas, public switchService: SwitherService, private toastr: ToastrService,
    private fb: FormBuilder,
  ) {

    super();
    this.statusOptionsByStage = {
      'In Progress Leads': [...this.inPorgressLeads],
      'Lost Leads': [...this.lostLeads],
      'Converted Leads': [...this.convertedLeads],
    };
  }

  crmStaticStages = [
    { name: 'In Progress Leads', checked: false, isDefault: true,isCustom:false },
    { name: 'Lost Leads', checked: false, isDefault: true,isCustom:false },
    { name: 'Converted Leads', checked: false, isDefault: true,isCustom:false },
  ];


  addLeadItem() {
    const newItemName = this.newItem?.trim();
    if (!newItemName) {
      this.toastr.error('Please enter a lead Stage.');
      return;
    }
    const itemExists = this.crmStaticStages.some(
      (plan) => plan.name.toLowerCase() === this.newItem.trim().toLowerCase()
    );
    if (this.newItem.trim() && !itemExists) {
      this.crmStaticStages.push({
        name: this.newItem.trim(),
        checked: false,
        isDefault: false,
        isCustom: true,

      });
      this.toastr.info('Item added Successfully');
    } else if (itemExists) {
      this.toastr.warning('This item already exists!');
    }
    this.newItem = '';

    this.leaditems.push({ checked: false, label: '' });
  }
  deleteLeadItem(index: number) {
    const deleted = this.crmStaticStages[index]?.name;
    this.crmStaticStages.splice(index, 1);
    this.toastr.error(`'${deleted}' has been deleted`);

  }
  addLeadStatusItem() {
    this.leadStatusitems.push({ checked: false, label: '' });
  }
  inPorgressLeads = [
    { name: 'Quotataion Shared', checked: false, isDefault: true },
    { name: 'Commercial Discussion', checked: false, isDefault: true },
    { name: 'Office Visit', checked: false, isDefault: true },
    { name: 'Hot', checked: false, isDefault: true },
    { name: 'Cold', checked: false, isDefault: true },
    { name: 'Warm', checked: false, isDefault: true },
    { name: 'Call Back', checked: false, isDefault: true },
  ];
  lostLeads = [
    { name: 'Not Interested', checked: false, isDefault: true },
    { name: 'Irrelevant', checked: false, isDefault: true },
    { name: 'Given to others', checked: false, isDefault: true },
  ];
  convertedLeads = [
    { name: 'CD done', checked: false, isDefault: true },
    { name: '10% advance Done', checked: false, isDefault: true },
  ];
  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible;
  }

  ngOnInit() {
    this.getCrmStages();
    // this.getCrmStatus(); 
    this.getDesignationCrmRloes(); this.getUsers();
    this.crmStageData = {
      stageId: 0,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      email: this.userEmail,
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
    this.crmStatusData = {
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
      targetUserEmail: [''],
      designationId: ['']
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
  dynamicFields: { value: string; }[] = [];
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
  saveCrmStatus():void {
    if (!this.selectedStage) {
      this.showValidationError = true;
      this.toastr.error('Please select a stage before saving.');
      return;
    } else {
      this.showValidationError = false;
    }
    this.crmStatusData.stage = this.selectedStage;
    const selectedOptions = this.checkboxStageOptions.filter(option => option.checked);
    const currentStageOptions = this.statusOptionsByStage[this.selectedStage] || [];
    if (selectedOptions.length === 0) {
      this.showCheckboxError = true;
      this.toastr.error('Please select at least one status.');
      return;
    } else {
      this.showCheckboxError = false;
    }
    const allNames = selectedOptions.map(option => option.name);
    const uniqueNames = [...new Set(allNames)];
  
    const dynamicFields = uniqueNames.map((name, index) => {
      return { [`f${index + 1}`]: name };
    });
    const customStatuses = currentStageOptions
  .filter(opt => opt.isCustom)
  .map(opt => opt.name);
    this.crmStatusData = {
      ...this.crmStatusData,
      customStatuses, 
      ...Object.assign({}, ...dynamicFields),
    };
  
    console.log(this.crmStatusData);
  
    // ✅ Optional: call the API
    this.switchService.SaveCrmStatus(this.crmStatusData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Status saved successfully');
          this.offcanvasService.dismiss();
          this.getCrmStages();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    });
  }
  
  getCrmStatus(): void {
    let completedRequests = 0;
  
    for (let i = 0; i < this.stageLst.length; i++) {
      const stageName = this.stageLst[i].stageName; // fix: capture value locally
      console.log('stages are',stageName)
      const payload = {
        email: this.userEmail,
        companyCode: this.userCompanyCode,
        type: this.userType,
        stage: stageName,
      };
  
      
      console.log(this.statusOptionsByStageforDisplay)
      const fields = Array.from({ length: 25 }, (_, i) => `f${i + 1}`);
      this.switchService.CrmStatus(payload).subscribe({
        next: (res: any) => {
          if(res.length==1){
          const options = Array.isArray(res)
            ? fields
                .filter(field => res[0][field]) // skip empty values
                .map(field => ({
                  name: res[0][field],
                  checked: false,
                  isCustom: false
                }))
            : [];
  
          this.statusOptionsByStageforDisplay[stageName] = options;  // use local stageName
          console.log(this.statusOptionsByStageforDisplay)
          }
        },
        error: (error) => {
          const errorMessage = error.statusText || 'Something went wrong while fetching stages.';
          this.toastr.error(errorMessage);
          this.statusOptionsByStageforDisplay[stageName] = [];
          console.error('Error fetching CRM status:', error);
        },
        complete: () => {
          completedRequests++;
          if (completedRequests === this.stageLst.length) {
            const selectedStageNames = this.stageLst.map((s: { stageName: string }) => s.stageName);
        
            // Filter only selected stages from all statusOptionsByStage
            this.statusLst = Object.entries(this.statusOptionsByStageforDisplay)
              .filter(([stage]) => selectedStageNames.includes(stage)) // ✅ Only show selected stages
              .map(([stage, fields]) => ({
                stage,
                fields
              }));
        
            console.log("Filtered status list (only selected stages):", this.statusLst);
          }
        }
          
      });
    }
  }  
  
  getDynamicFields(status: any): string[] {
    const dynamicFields = [];
    for (let i = 1; i <= 25; i++) {
      const fieldName = `f${i}`;
      if (status[fieldName]) {
        dynamicFields.push(status[fieldName]);
      }
    }
    return dynamicFields;
  }


  isHighlightedStatus(status: string): boolean {
    const highlighted = ['In Progress Leads', 'Lost Leads', 'Converted Leads', 'Wrong Leads'];
    return highlighted.includes(status);
  }


  saveCrmStages() {
    this.prepareCrmStageData();
    console.log("saved crmstages",this.crmStageData);
    const selectedStages = this.crmStaticStages.filter(stage => stage.checked);
    if (selectedStages.length === 0) {
      this.toastr.error('Please select at least one stage before saving.');
      return;
    }
    this.switchService.SaveCrmStages(this.crmStageData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getCrmStages();
          this.isAddStagesDisabled = true;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      }
    });
  }
  addNewOption() {
    const newName = this.newOptionName?.trim();
  
    if (!newName) {
      this.toastr.error('Please enter a status name.');
      return;
    }
  
    const currentStageOptions = this.statusOptionsByStage[this.selectedStage];
  
    // Check if the item already exists in current options
    const isDuplicate = currentStageOptions.some(
      opt => opt.name.toLowerCase() === newName.toLowerCase()
    );
  
    if (this.newOptionName.trim() && !isDuplicate) {
      currentStageOptions.push({
        name: this.newOptionName,
        checked: false,
        isCustom: true
      });
  
      this.checkboxStageOptions = [...currentStageOptions];
      this.toastr.info('item added.');
    } else {
      this.toastr.warning(`'${newName}' already exists`);
    }
  
    this.newOptionName = '';
  }

  prepareCrmStageData() {
    const selectedStages = this.crmStaticStages
      .filter(stage => stage.checked)
      .map(stage => stage.name);

    console.log("Selected Stages: ", selectedStages);
    for (let i = 0; i < 25; i++) {
      this.crmStageData[`f${i + 1}`] = selectedStages[i] || "";
    }
  }

  getCrmStages(): void {
    this.isStagesLoading = true;
    this.isAddStagesDisabled = true;
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };

    this.switchService.CrmStages(payload).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res) && res.length > 0) {
          const stageObj = res[0];
          const extractedStages = [];
          for (let i = 1; i <= 25; i++) {
            const key = `f${i}`;
            if (stageObj[key] && stageObj[key].trim() !== "") {
              extractedStages.push({ stageName: stageObj[key].trim() });
            }
          }
          this.stageLst = extractedStages;
          console.log("extracted stages are ",extractedStages);
          this.getCrmStatus(); 
          this.isAddStagesDisabled = this.stageLst.length > 0;
        }
        else {
          this.stageLst = [];
          this.isAddStagesDisabled = false;
        }
        this.isStagesLoading = false;
      },
      error: (error) => {
        console.error('CRM Stages Error:', error);
        this.toastr.error(error.statusText || 'Something went wrong while fetching stages.');
      },
    });
  }
  deleteOption(index: number) {
    const deletedOption = this.checkboxStageOptions[index];

    this.checkboxStageOptions.splice(index, 1);

    const currentStageOptions = this.statusOptionsByStage[this.selectedStage];
    const mainIndex = currentStageOptions.findIndex(
      opt => opt.name.toLowerCase() === deletedOption.name.toLowerCase()
    );

    if (mainIndex !== -1) {
      currentStageOptions.splice(mainIndex, 1);
    }

    this.toastr.error(`'${deletedOption.name}' has been deleted`);
  }


  onStageChange() {
    this.checkboxStageOptions = [];
    console.log(this.checkboxStageOptions)

    console.log('Selected Stage:', this.selectedStage);
    if (!this.statusOptionsByStage[this.selectedStage]) {
      this.statusOptionsByStage[this.selectedStage] = []; 
    }
    
    this.checkboxStageOptions = this.statusOptionsByStage[this.selectedStage];
    console.log(this.checkboxStageOptions)
    
    if(this.statusOptionsByStageforDisplay[this.selectedStage]){
    this.checkboxStageOptions = this.statusOptionsByStage[this.selectedStage].map(item => {
      const existsInSelected = this.statusOptionsByStageforDisplay[this.selectedStage].some((selected: { name: any; }) => selected.name === item.name);
      return { ...item, checked: existsInSelected };
    });
    this.anyChecked = true;
  }
  else{
    this.anyChecked = false;
  }
  
  // this.anyChecked = this.checkboxStageOptions.some(
  //   (item) => {console.log(item.checked);return item.checked === true}
  // );
  
    
  console.log(this.checkboxStageOptions, this.anyChecked);
  }

  anyChecked:any;


  onCheckboxChange() {
    const selectedPlans = this.crmStaticStages.filter((plan) => plan.checked);
    // Update f1 to f30 fields dynamically based on selected items
    selectedPlans.forEach((plan, index) => {
      if (index < 30) {
        this.crmStatusData[`f${index + 1}`] = plan.name;
      }
    });
    for (let i = selectedPlans.length; i < 30; i++) {
      this.crmStatusData[`f${i + 1}`] = '';
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
    this.modalService.open(content3, { size: 'sm', scrollable: true, centered: true, });
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

  openRight4(content4: any) {
    this.offcanvasService.open(content4, { position: 'end' });
  }
  openRight12(content12: any) {
    this.offcanvasService.open(content12, { position: 'end' });
  }
}
