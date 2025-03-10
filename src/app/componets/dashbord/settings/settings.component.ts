import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatTableDataSource } from '@angular/material/table';
import { ELEMENT_DATA1, PeriodicElement } from '../../tables/ang-material/data';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tools } from '../../../shared/common/Enums/Tools';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { FlatpickrModule, FlatpickrDefaults } from 'angularx-flatpickr';
import { BaseComponent } from '../../../shared/base/base.component';
import { MatIconModule } from '@angular/material/icon';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { ShowCodeContentDirective } from '../../../shared/directives/show-code-content.directive';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule, FlatpickrModule,
    AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
    OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgSelectModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent extends BaseComponent implements OnInit {
  stockDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'autoAdd', 'grain', 'trim', 'allowExactFitShapes', 'cost', 'notes'];
  sawDisplayedColumn: string[] = ['slNo', 'bladeWidth', 'stockType', 'cutType', 'cutPreference', 'strategy', 'maxPhase', 'headCuts', 'primaryCompression', 'stackHeight', 'stockSelection', 'minSpacing', 'stackingMode'];

  mainHeader: string[] = ['trim'];
  subHeader: string[] = ['x1', 'x2', 'y1', 'y2'];
  dataSource = new MatTableDataSource<any>(); mailId: any = '';
  stockDataSource = new MatTableDataSource<any>();
  sawDataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  @ViewChild('sawPaginator') sawPaginator!: MatPaginator;
  isAddEdt = false; aeTyp = 'a'; playersList: any; editData: any;
  adonai = false; crm = false; userLst: any = [];
  submitted = false; userData: any; roleid: any;
  // userForm!: FormGroup;
  cnfmPaswrd: any = ''; paswrd: any = '';
  adoanAiRole: any; todayDt = new Date();
  crmRole: any; toolsList = [Tools.Adonai];
  passwordStrengthMessage: string = '';
  passwordStrengthColor: string = ''; // Control message color
  confirmPasswordStrengthMessage: string = '';
  confirmPasswordStrengthColor: string = '';
  isPasswordValid: boolean = false; isPasswrd: boolean = false; isPassValid: boolean = false;
  isCnfmPwd: boolean = false; btnDisable: boolean = false; isBtnDsbl: boolean = false; isResend: boolean = false;
  isEmailDisabled = false; isOtpDisabled = false; isCompany: string = 'col-xl-6';
  isShowUsers = false; pload: any[] = []; isOkBtn = false; showCity: boolean = true;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template
  private modalRef: any; noUsers: any = ''; users: any = ''; city: any = ''; selectedCountry: any = 'India';
  stageLst: any; showStages: boolean = false; pmntStageLst: any; showPmntStages: boolean = false;
  isStage: boolean = false; isPmntStage: boolean = false; userType: any; projectLst: any;
  isStageDel: boolean = false; isPmntStageDel: boolean = false; projPmntLst: any;
  userForm: FormGroup = this.fb.group({
    type: [2],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    country: ['India'],
    dob: [new Date().toISOString().split('T')[0], Validators.required],
    crm: false,
    adonai: false,
    phoneNumber: ['', Validators.required],
    username: [''],
    password: ['', [Validators.required, this.passwordValidator]],
    confirmPassword: ['', Validators.required],
    tools: [[], Validators.required],
    userFlag: ['settings'],
    updatedBy: [localStorage.getItem('username')],
    companyCode: [''],
    city: ['', Validators.required]
  })
  productForm: FormGroup;
  newItem: string = ''; newPmntItem: string = '';
  items: { label: string; checked: boolean }[] = [];

  addMoreVisible: boolean = false; // Flag to toggle visibility
  addMorePmntVisible: boolean = false;
  searchUser: string = '';
  userDetails: any = {};
  public sawForm!: FormGroup;
  public sawSubmitted = false;
  public stockForm!: FormGroup;
  StData: any;

  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible; // Toggle visibility
  }

  togglePmntAddMore() {
    this.addMorePmntVisible = !this.addMorePmntVisible; // Toggle visibility
  }

  addItem() {
    const itemExists = this.planDetails.some(
      (plan) => plan.name.toLowerCase() === this.newItem.trim().toLowerCase()
    );
    if (this.newItem.trim() && !itemExists) {
      this.planDetails.push({
        name: this.newItem.trim(),
        checked: false,
        isDefault: false,
      });
      this.newItem = '';
    } else if (itemExists) {
      alert('This item already exists!');
    }
  }

  deleteItem(index: number) {
    this.planDetails.splice(index, 1);
  }

  addPmntItem() {
    const itemExists = this.paymentDetails.some(
      (plan) => plan.name.toLowerCase() === this.newPmntItem.trim().toLowerCase()
    );
    if (this.newPmntItem.trim() && !itemExists) {
      this.paymentDetails.push({
        name: this.newPmntItem.trim(),
        checked: false,
        isDefault: false,
      });
      this.newPmntItem = '';
    } else if (itemExists) {
      alert('This item already exists!');
    }
  }

  deletePmntItem(index: number) {
    this.paymentDetails.splice(index, 1);
  }

  saveData: any; savePmntData: any;

  planDetails = [
    { name: 'Wall and Demolition Plan', checked: false, isDefault: true },
    { name: 'Proposed Furniture Plan', checked: false, isDefault: true },
    { name: 'Flooring Plan', checked: false, isDefault: true },
    { name: 'Electrical plan', checked: false, isDefault: true },
    { name: 'Moodboard and Renders', checked: false, isDefault: true },
    { name: 'Switch Board Elevations + Legend', checked: false, isDefault: true },
    { name: 'Furniture Details', checked: false, isDefault: true },
    { name: 'Realistic 3D Renders', checked: false, isDefault: true },
    { name: 'Material List', checked: false, isDefault: true },
    { name: 'Section Wall Elevations', checked: false, isDefault: true },
    { name: 'RCP- Reflected Ceiling Plan', checked: false, isDefault: true },
    { name: 'BOQ- Bill of Quantity Estimate', checked: false, isDefault: true },
  ];


  paymentDetails = [
    { name: 'Advance', checked: false, isDefault: true },
    { name: 'Design', checked: false, isDefault: true },
    { name: 'Material Dump', checked: false, isDefault: true },
    { name: 'Snags', checked: false, isDefault: true },
    { name: 'Project Handover', checked: false, isDefault: true }
  ]

  constructor(public fb: FormBuilder, public switchService: SwitherService,
    private toastr: ToastrService, private router: Router, private dp: DatePipe,
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal, private viewContainerRef: ViewContainerRef) {
    super();
    this.userData = localStorage.getItem('userDetails');
    this.userType = JSON.parse(this.userData).type;
    this.formInit();
    this.productForm = this.fb.group({
      name: '',
      quantities: this.fb.array([]),
    });
  }

  onCheckboxChange() {
    const selectedPlans = this.planDetails.filter((plan) => plan.checked);
    // Update f1 to f30 fields dynamically based on selected items
    selectedPlans.forEach((plan, index) => {
      if (index < 30) {
        this.saveData[`f${index + 1}`] = plan.name;
      }
    });
    for (let i = selectedPlans.length; i < 30; i++) {
      this.saveData[`f${i + 1}`] = '';
    }
  }

  onPmntCheckboxChange() {
    const selectedPlans = this.paymentDetails.filter((plan) => plan.checked);

    // Update f1 to f30 fields dynamically based on selected items
    selectedPlans.forEach((plan, index) => {
      if (index < 30) {
        this.savePmntData[`f${index + 1}`] = plan.name;
      }
    });
    for (let i = selectedPlans.length; i < 30; i++) {
      this.savePmntData[`f${i + 1}`] = '';
    }
  }

  ngOnInit() {
    console.log(this.strategy);
    this.getStockData(); this.getSawData();
    this.onClkDesign('i');
    this.formInit(); this.getUsers(); this.getAllStages(); this.getAllPmntStages();
    this.saveData = {
      id: 0,
      companyName: JSON.parse(this.userData).companyName,
      companyCode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      f1: "", f1Percent: 0,
      f2: "", f2Percent: 0,
      f3: "", f3Percent: 0,
      f4: "", f4Percent: 0,
      f5: "", f5Percent: 0,
      f6: "", f6Percent: 0,
      f7: "", f7Percent: 0,
      f8: "", f8Percent: 0,
      f9: "", f9Percent: 0,
      f10: "", f10Percent: 0,
      f11: "", f11Percent: 0,
      f12: "", f12Percent: 0,
      f13: "", f13Percent: 0,
      f14: "", f14Percent: 0,
      f15: "", f15Percent: 0,
      f16: "", f16Percent: 0,
      f17: "", f17Percent: 0,
      f18: "", f18Percent: 0,
      f19: "", f19Percent: 0,
      f20: "", f20Percent: 0,
      f21: "", f21Percent: 0,
      f22: "", f22Percent: 0,
      f23: "", f23Percent: 0,
      f24: "", f24Percent: 0,
      f25: "", f25Percent: 0,
      f26: "", f26Percent: 0,
      f27: "", f27Percent: 0,
      f28: "", f28Percent: 0,
      f29: "", f29Percent: 0,
      f30: "", f30Percent: 0,
      updatedBy: JSON.parse(this.userData).username,
      updatedTime: "",
      stageActivity: "YES",
      type: JSON.parse(this.userData).type
    };

    this.savePmntData = {
      id: 0,
      companyName: JSON.parse(this.userData).companyName,
      companyCode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      f1: "", f1Percent: 0,
      f2: "", f2Percent: 0,
      f3: "", f3Percent: 0,
      f4: "", f4Percent: 0,
      f5: "", f5Percent: 0,
      f6: "", f6Percent: 0,
      f7: "", f7Percent: 0,
      f8: "", f8Percent: 0,
      f9: "", f9Percent: 0,
      f10: "", f10Percent: 0,
      f11: "", f11Percent: 0,
      f12: "", f12Percent: 0,
      f13: "", f13Percent: 0,
      f14: "", f14Percent: 0,
      f15: "", f15Percent: 0,
      f16: "", f16Percent: 0,
      f17: "", f17Percent: 0,
      f18: "", f18Percent: 0,
      f19: "", f19Percent: 0,
      f20: "", f20Percent: 0,
      f21: "", f21Percent: 0,
      f22: "", f22Percent: 0,
      f23: "", f23Percent: 0,
      f24: "", f24Percent: 0,
      f25: "", f25Percent: 0,
      f26: "", f26Percent: 0,
      f27: "", f27Percent: 0,
      f28: "", f28Percent: 0,
      f29: "", f29Percent: 0,
      f30: "", f30Percent: 0,
      updatedBy: JSON.parse(this.userData).username,
      updatedTime: "",
      stageActivity: "YES",
      type: JSON.parse(this.userData).type
    };


    this.sawForm = this.fb.group({
      sawList: this.fb.array([this.createSawGroup()]),
      companyCode: [(JSON.parse(this.userData).companyCode) ? JSON.parse(this.userData).companyCode : ''],
      email: [(JSON.parse(this.userData).email) ? JSON.parse(this.userData).email : ''],
      type: [(JSON.parse(this.userData).type) ? JSON.parse(this.userData).type : '']

    });

    this.stockForm = this.fb.group({
      stockList: this.fb.array([this.createStockGroup()]),
      companyCode: [(JSON.parse(this.userData).companyCode) ? JSON.parse(this.userData).companyCode : ''],
      email: [(JSON.parse(this.userData).email) ? JSON.parse(this.userData).email : ''],
      type: [(JSON.parse(this.userData).type) ? JSON.parse(this.userData).type : '']
    });

    // setTimeout(() => {

    // }, 500);
    this.userForm?.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordStrength(value);
    });
    this.userForm?.get('confirmPassword')?.valueChanges.subscribe((value) => {
      this.checkPasswordMatch(value);
    });

    this.onTodayDt();
    this.onMinDate();
    this.getProjectLst();


  }

  onClkDesign(key: string = '') {
    this.userData = localStorage.getItem('userDetails');
    this.switchService.onAdonai(JSON.parse(this.userData)?.email).subscribe({
      next: (res: any) => {
        if (res.status == false) {
          alert(res.message)
          return;
        } else {
          if (key == 'i') {
            this.roleid = res.roleId;
          } else {
            window.open(res.newDesign, '_blank');
            this.toastr.success(res.message);
          }
        }
      }
    })
  }

  getProjectLst() {
    let payload = {
      email: JSON.parse(this.userData)?.email,
      type: JSON.parse(this.userData)?.type,
      companyname: JSON.parse(this.userData)?.companyName,
      companycode: JSON.parse(this.userData)?.companyCode,
      projectId: '', projectname: '', filter: 'All',
    }
    this.switchService.projectLst(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.projectLst = res.projList;
          this.projPmntLst = res.paymentLastList;
          this.projectLst.length > 0 ? this.isStageDel = true : this.isStageDel = false;
          this.projPmntLst.length > 0 ? this.isPmntStageDel = true : this.isPmntStageDel = false;
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  dynamicFields: { value: string; percent: number }[] = [];
  initializeDynamicFields() {
    this.dynamicFields = [];
    // Loop through f1 to f30 and add only those with non-empty values to dynamicFields
    for (let i = 1; i <= 30; i++) {
      const fieldName = `f${i}`;
      const percentName = `f${i}Percent`;

      if (this.stageLst[fieldName]) {
        this.dynamicFields.push({
          value: this.stageLst[fieldName],
          percent: this.stageLst[percentName],
        });
      }
    }
    this.dynamicFields.length != 0 ? this.isStage = true : false;
  }

  dynamicPmntFields: { value: string; percent: number }[] = [];
  initializeDynamicPmntFields() {
    this.dynamicPmntFields = [];
    for (let i = 1; i <= 30; i++) {
      const fieldName = `f${i}`;
      const percentName = `f${i}Percent`;
      if (this.pmntStageLst[fieldName]) {
        this.dynamicPmntFields.push({
          value: this.pmntStageLst[fieldName],
          percent: this.pmntStageLst[percentName],
        });
      }
    }
    this.dynamicPmntFields.length != 0 ? this.isPmntStage = true : false;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.stockDataSource.paginator = this.stockPaginator;
    this.sawDataSource.paginator = this.sawPaginator;
  }

  get f() {
    return this.userForm.controls;
  }

  preventCopyPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  formInit() {
    // this.userForm = this.fb.group({
    // type : [2],
    // firstName: ['', Validators.required],
    // lastName: ['', Validators.required],
    // email: ['', [Validators.required, Validators.email]],
    // country: ['', Validators.required],
    // dob: [new Date().toISOString().split('T')[0], Validators.required],
    // crm:false,
    // adonai:false,
    // phoneNumber: ['', Validators.required],
    // username: [''],
    // password: ['', [Validators.required, this.passwordValidator]],
    // confirmPassword: ['', Validators.required],
    // tools : [[],Validators.required],
    // })
  }

  // getSNo(index: number): number {
  //   return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
  // }

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

  saveInitialStage() {
    this.switchService.stageSave(this.saveData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getAllStages();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  getAllStages() {
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.getStages(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.stageLst = res;
          this.initializeDynamicFields();
          this.dynamicFields.length != 0 ? this.showStages = true : this.showStages = false;
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  saveLastStages() {
    let totalPercent = 0;

    // Check for zero or empty percent values
    for (const field of this.dynamicFields) {
      const percent = +field.percent; // Convert string to number safely
      if (percent === 0) {
        this.toastr.error('Percent values cannot be zero or empty.', 'Validation Error');
        return;
      }
      totalPercent += percent;
    }
    if (totalPercent === 100) {
      this.dynamicFields.forEach((field, index) => {
        this.stageLst[`f${index + 1}`] = field.value;
        this.stageLst[`f${index + 1}Percent`] = field.percent;
      });
      for (let i = this.dynamicFields.length + 1; i <= 30; i++) {
        this.stageLst[`f${i}`] = '';
        this.stageLst[`f${i}Percent`] = 0;
      }
      this.switchService.stageSave(this.stageLst).subscribe({
        next: (res: any) => {
          if (res) {
            this.toastr.success('Stages saved successfully');
            // this.getAllStages();
          } else {
            this.toastr.error(res.message)
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })
    } else if (totalPercent < 100) {
      this.toastr.error('Total percent is less than 100. Please adjust the values.', 'Validation Error');
    } else {
      this.toastr.error('Total percent exceeds 100. Please adjust the values.', 'Validation Error');
    }
  }

  onDeleteStages() {
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.deleteStage(payload).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          this.toastr.success('stage removed successfully')
          // this.stageLst = [];
          // this.getAllStages();
          this.showStages = false, this.isStage = false;
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  savePmntInitialStage() {
    this.switchService.pmntStageSave(this.savePmntData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getAllPmntStages();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  getAllPmntStages() {
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.getPmntStages(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.pmntStageLst = res;
          this.initializeDynamicPmntFields();
          this.dynamicPmntFields.length != 0 ? this.showPmntStages = true : this.showPmntStages = false;
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  savePmntLastStages() {
    let totalPercent = 0;
    for (const field of this.dynamicPmntFields) {
      const percent = +field.percent;
      if (percent === 0) {
        this.toastr.error('Percent values cannot be zero or empty.', 'Validation Error');
        return;
      }
      totalPercent += percent;
    }
    // Check if total equals 100
    if (totalPercent === 100) {
      this.dynamicPmntFields.forEach((field, index) => {
        this.pmntStageLst[`f${index + 1}`] = field.value;
        this.pmntStageLst[`f${index + 1}Percent`] = field.percent;
      });
      for (let i = this.dynamicPmntFields.length + 1; i <= 30; i++) {
        this.pmntStageLst[`f${i}`] = '';
        this.pmntStageLst[`f${i}Percent`] = 0;
      }
      this.switchService.pmntStageSave(this.pmntStageLst).subscribe({
        next: (res: any) => {
          if (res) {
            this.toastr.success('Stages saved successfully');
            // this.getAllStages();
          } else {
            this.toastr.error(res.message)
          }
        },
        error: (error) => {
          this.toastr.error(error.statusText);
        },
      })
    } else if (totalPercent < 100) {
      this.toastr.error('Total percent is less than 100. Please adjust the values.', 'Validation Error');
    } else {
      this.toastr.error('Total percent exceeds 100. Please adjust the values.', 'Validation Error');
    }
  }

  onDeletePmntStages() {
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.deletePmntStage(payload).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          this.toastr.success('Stages removed successfully')
          // this.stageLst = [];
          // this.getAllStages();
          this.showPmntStages = false, this.isPmntStage = false;
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  getUsers() {
    if (JSON.parse(this.userData).type == 2) {
      // this.switchService.getAllUsers().subscribe({ next: (res:any) => {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userLst = res;
            // this.dataSource = new MatTableDataSource<any>(res);
            this.dataSource.data = res;
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
      })
    }
  }

  passwordValidator(control: any) {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasMinLength = value.length >= 8;
    const valid = hasUpperCase && hasLowerCase && hasSpecialCharacter && hasNumber && hasMinLength;
    return valid ? null : { invalidPassword: true };
  }

  checkPasswordStrength(password: string): void {
    this.cnfmPaswrd = '', this.confirmPasswordStrengthMessage = '', this.isCnfmPwd = false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const lengthCriteria = password.length >= 8;

    // Calculate strength score
    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;
    if (lengthCriteria) strength++;
    if (strength == 0) {
      this.passwordStrengthMessage = '';
      this.isPasswordValid = false;
    }

    // Determine message and color based on strength score
    if (strength == 0 && this.submitted == true) {
      this.passwordStrengthMessage = '';
      this.isPasswordValid = false;
    }
    else if (strength <= 2 && strength > 0) {
      this.passwordStrengthMessage = 'Password is Weak';
      this.passwordStrengthColor = 'red';
      this.isPasswordValid = false; this.isPasswrd = true; this.isPassValid = true;
    } else if (strength === 3 || strength === 4) {
      this.passwordStrengthMessage = 'Password is Medium';
      this.passwordStrengthColor = 'orange';
      this.isPasswordValid = false; this.isPasswrd = true; this.isPassValid = true;
    } else if (strength === 5) {
      this.passwordStrengthMessage = 'Password is Good';
      this.passwordStrengthColor = 'green';
      this.isPasswordValid = true;
    }
  }

  checkPasswordMatch(password: string): void {
    if (this.paswrd != '') {
      // this.toastr.warning("please enter password first")
      // } else {
      if (this.paswrd != password && password != '') {
        this.isCnfmPwd = false;
        this.confirmPasswordStrengthMessage = 'Passwords not matched';
        this.confirmPasswordStrengthColor = 'red'
      } else if (this.paswrd == password) {
        this.isCnfmPwd = true;
        this.confirmPasswordStrengthColor = 'green'
        this.confirmPasswordStrengthMessage = 'Passwords matched';
      } else if (password == '') {
        this.confirmPasswordStrengthMessage = '';
      }
    }
  }

  // onSubmit(){
  //   this.submitted = true, this.isPasswrd = true, this.isPassValid = false;
  //   let payload = this.userForm.getRawValue();
  //   const crm = this.userForm.get('tools')?.value.includes('crm');
  //   const adonai = this.userForm.get('tools')?.value.includes('adonai');
  //   payload.type = +payload.type,
  //   payload.crm = crm,
  //   payload.adonai = adonai, delete payload.tools, delete payload.confirmPassword
  //   payload.phoneNumber = +payload.phoneNumber;
  //   if(this.userForm.invalid){
  //     return;
  //   } else if(this.paswrd != this.cnfmPaswrd){
  //     this.toastr.error('password and confirm password not matched','signup', {
  //       timeOut: 3000,
  //       positionClass: 'toast-top-right',
  //     });
  //     return;
  //   } else {
  //     this.switchService.signupApi(payload).subscribe({next: (res:any) => {
  //       if(res.status == true){
  //         this.isAddEdt=!this.isAddEdt;
  //         this.toastr.success(res.message,'signup', {
  //           timeOut: 3000,
  //           positionClass: 'toast-top-right',
  //         });
  //         } else {
  //           this.toastr.error(res.message,'signup', {
  //             timeOut: 3000,
  //             positionClass: 'toast-top-right',
  //           });
  //         }
  //       }
  //     })
  //   }
  // }

  onCountryChange(data: any) {
    data == 'India' ? (this.showCity = true) : (this.showCity = false, this.city = '');
    this.userForm.patchValue({ country: data });
    const cityFieldControl = this.userForm.get('city');
    if (data == 'India') {
      cityFieldControl?.setValidators([Validators.required])
    } else {
      cityFieldControl?.clearValidators()
    }
    cityFieldControl?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true; this.isPasswrd = true; this.isPassValid = false;
    const crm = this.userForm.get('tools')?.value.includes('CRM');
    const adonai = this.userForm.get('tools')?.value.includes('Adonai');
    let payload = this.userForm.getRawValue();
    payload.username = payload.firstName + ' ' + payload.lastName,
      payload.type = 1,
      payload.crm = crm,
      payload.adonai = adonai,
      payload.companyCode = JSON.parse(this.userData).companyCode,
      payload.phoneNumber = +payload.phoneNumber, delete payload.tools, delete payload.confirmPassword,
      payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy'),
      payload.companyName = JSON.parse(this.userData).companyName,
      this.pload = payload
    if (this.userForm.invalid) {
      this.toastr.error('Please fill mandatory fields');
      this.btnDisable = false;
      return;
    }
    else if (this.paswrd != this.cnfmPaswrd) {
      this.toastr.error('password and confirm password not matched', 'signup', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
      });
      return;
    }
    else {
      this.btnDisable = true;
      this.onMailCheck();
      // this.switchService.signupApi(payload).subscribe({ next: (res:any) => {
      //   if(res.status == true){
      //     this.toastr.success(res.message,'signup', {
      //       timeOut: 3000, positionClass: 'toast-top-right' });
      //     this.router.navigate(['auth/login'])
      //     } else {
      //       this.btnDisable = false;
      //       this.toastr.error(res.message,'signup', {
      //         timeOut: 3000, positionClass: 'toast-top-right' });
      //     }
      //   }
      // })
    }
  }

  onSignupApi() {
    this.switchService.signupApi(this.pload).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          this.closeModal();
          this.isAddEdt = !this.isAddEdt;
          this.getUsers();
          this.toastr.success(res.message);
        } else {
          this.btnDisable = false;
          this.toastr.error(res.message);
        }
      }
    })
  }

  onMailCheck() {
    if (this.mailId == '') {
      this.toastr.warning('Please Enter email', 'signup', {
        timeOut: 3000, positionClass: 'toast-top-right'
      });
    } else {
      this.switchService.onMailValidSignup(this.mailId).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            if (this.isResend == false) {
              this.openModal();
            }
            this.btnDisable = true,
              this.userForm.get('email')?.disable();
            this.toastr.success(res.message, 'signup', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.btnDisable = false;
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
    }
  }

  onClickButton() {
    this.openModal();  // Open the modal on successful response
  }

  openModal() {
    // Create an embedded view from the modal template
    this.modalRef = this.viewContainerRef.createEmbeddedView(this.modalTemplate);
  }

  closeModal() {
    // Destroy the modal view when closing
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
    }
  }

  onOtpCheck() {
    // this.isOtpDisabled = true;
    // this.btnDisable = false;
    // if(this.otp == ''){
    //   this.toastr.warning('Please Enter OTP','signup', {
    //     timeOut: 3000, positionClass: 'toast-top-right' });
    // } 
    const enteredOtp = this.otp.join('');

    // Check if OTP length is less than 6
    if (enteredOtp.length < 6) {
      this.isOtpValid = false;
      this.errorMessage = 'Please enter the complete OTP.';
      return;
    }
    else {
      this.switchService.onOtpSignup(this.mailId, enteredOtp).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            // this.btnDisable = false, this.isOtpDisabled = true, 
            this.isOkBtn = true;
            this.onSignupApi();
            this.toastr.success(res.message, 'signup', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          } else {
            this.isOkBtn = false;
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
    }
  }

  otpArray = Array(6).fill(null);
  otp: string[] = Array(this.otpArray.length).fill('');
  isOtpValid = true;
  errorMessage = '';
  onInputChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.otp[index] = input.value;

    if (input.value && index < this.otpArray.length - 1) {
      (document.querySelectorAll('.otp-container input')[index + 1] as HTMLInputElement)?.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && index > 0 && !this.otp[index]) {
      (document.querySelectorAll('.otp-container input')[index - 1] as HTMLInputElement)?.focus();
    }
  }

  open() {
    this.modalService.open({
      backdrop: 'static', // Disable close on clicking outside
      keyboard: false, centered: true
    });
  }

  showPassword = false;
  showPassword1 = false;
  toggleClass = "off-line";
  toggleClass1 = "off-line";
  createpassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === "off-line") {
      this.toggleClass = "line";
    } else {
      this.toggleClass = "off-line";
    }
  }
  createpassword1() {
    this.showPassword1 = !this.showPassword1;
    if (this.toggleClass1 === "off-line") {
      this.toggleClass1 = "line";
    } else {
      this.toggleClass1 = "off-line";
    }
  }

  toolId(tool: string) {
    // console.log("51",tool,this.adonai,this.crm);
  }

  onRst() {
    this.formInit(); this.getUsers(); this.submitted = false;
    this.userForm.patchValue({
      type: [2],
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      dob: new Date().toISOString().split('T')[0],
      phoneNumber: '',
      username: '',
      password: '',
      confirmPassword: '',
      tools: [],
    })
  }
  stockApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      qty: '',
      price: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }
  openRight(content: any) {
    this.resetForm();
    this.offcanvasService.open(content, { position: 'end' });
  }

  // Resets the input and unselects the checkboxes
  resetForm() {
    this.newItem = ''; // Reset the input field
    this.addMoreVisible = false; // Hide the 'Add More' section
    this.planDetails.forEach(plan => {
      plan.checked = false; // Unselect all checkboxes
    });
  }

  openRights(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  selectedOption: string = '';


  filterUserData() {
    if (this.userLst.length > 0) {
      return this.userLst.filter((item: { firstName: string; lastName: string; email: string; }) =>
        item.firstName.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        item.lastName.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchUser.toLowerCase())
      );
    }
  }

  ViewUserDetails(data: any) {
    this.userDetails = data;
  }


  createSawGroup(): FormGroup {
    return this.fb.group({
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
    });
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

  // Getter for saw FormArray

  get sawList() {
    return this.sawForm.get('sawList') as FormArray;
  }


  // Getter for stock FormArray
  get stockList() {
    return this.stockForm.get('stockList') as FormArray;
  }


  addSaw(): void {
    this.sawList.push(this.createSawGroup());
  }

  addStock(): void {
    this.stockList.push(this.createStockGroup());
  }



  openLg1(content4: any) {
    this.modalService.open(content4, { size: 'lg', scrollable: true, centered: true, });
  }


  getStockData() {
    let payload = {
      "email": JSON.parse(this.userData)?.email,
      "companyCode": JSON.parse(this.userData)?.companyCode,
      "type": JSON.parse(this.userData)?.type
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
      email: JSON.parse(this.userData)?.email,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type
    };

    this.switchService.SawData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.sawDataSource.data = res;
          console.log("Saw Data:", this.sawDataSource.data);



          /*const sawArray = this.sawForm.get('sawList') as FormArray;
          sawArray.clear(); // Clear old values before adding new ones

          res.forEach((saw) => {
            sawArray.push(this.fb.group({
              bladeWidth: [saw.bladeWidth, Validators.required],
              stockType: [saw.stockType],
              cutType: [saw.cutType],
              cutPreference: [saw.cutPreference],
              guillotineOptions: this.fb.group({
                strategy: [saw.guillotineOptions?.strategy ?? ''],
                maxPhase: [saw.guillotineOptions?.maxPhase ?? 0]
              }),
              efficiencyOptions: this.fb.group({
                primaryCompression: [saw.efficiencyOptions?.primaryCompression ?? '']
              }),
              stackHeight: [saw.stackHeight],
              options: this.fb.group({
                stockSelection: [saw.options?.stockSelection ?? ''],
                minSpacing: [saw.options?.minSpacing ?? 0],
                stackingMode: [saw.options?.stackingMode ?? '']
              })
            }));
          });*/


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


  submitSawForm(modal: any): void {
    this.sawSubmitted = true;
    if (this.sawForm.valid) {
      this.switchService.saveSawData(this.sawForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.getSawData();
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
      this.sawSubmitted = false;
    }

  }



}