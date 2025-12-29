import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
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
import { flatMap } from 'rxjs';

type PermissionName = 'CRM' | 'SALES' | 'HR'| 'Projects';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule, NgbModule, FormsModule, ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule, MatFormFieldModule, MatSelectModule, FlatpickrModule,
    AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
    OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgSelectModule],
  providers: [FirebaseService, { provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent extends BaseComponent implements OnInit {
  stockDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'autoAdd', 'grain', 'allowExactFitShapes', 'cost', 'notes', 'trim'];
  sawDisplayedColumn: string[] = ['select', 'slNo', 'bladeWidth', 'stockType', 'cutType', 'cutPreference', 'strategy', 'maxPhase', 'headCuts', 'primaryCompression', 'stackHeight', 'stockSelection', 'minSpacing', 'stackingMode'];
  partsDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'trim', 'banding', 'finish', 'orientationLock', 'notes'];

  mainHeader: string[] = ['trim'];
  subHeader: string[] = ['x1', 'x2', 'y1', 'y2'];
  dataSource = new MatTableDataSource<any>(); mailId: any = '';
  stockDataSource = new MatTableDataSource<any>();
  sawDataSource = new MatTableDataSource<any>();
  partsDataSource = new MatTableDataSource<any>();
  selectedSawIdList: Set<any> = new Set<any>();
  selectedSawRow: any = null; topshowMore = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stockPaginator') stockPaginator!: MatPaginator;
  @ViewChild('sawPaginator') sawPaginator!: MatPaginator;
  @ViewChild('partsPaginator') partsPaginator!: MatPaginator;
  isAddEdt = false; aeTyp = 'a'; playersList: any; editData: any;
  adonai = false; crm = false; userLst: any = [];
  submitted = false; userData: any; roleid: any;
  // userForm!: FormGroup;
  cnfmPaswrd: any = ''; paswrd: any = '';
  adoanAiRole: any; todayDt = new Date();
  crmRole: any;
  toolsList = Object.keys(Tools).map(key => ({
    label: Tools[key as keyof typeof Tools],
    value: key
  }));
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
  isStageDel: boolean = false; isPmntStageDel: boolean = false; projPmntLst: any; quoteMarignForm!: FormGroup;
  createRoleForm!: FormGroup; createDepartmentForm!: FormGroup; cutListForm!: FormGroup;
  projectConfigForm!: FormGroup; projectConfigList: string[] = []; projectMarginList: any;
  quotationNumber: any; previousMarginResponse: any = {}; previousConfigResponse: any = {};
  quotationSubmitted = false; quotationmarginsubmit: boolean = false; projectconfigsubmit: boolean = false;
  submittedQuotationNumber: any; addmargindisable: boolean = false; f1submitCount: number = 0;
  userEmail: any; roleForm !: FormGroup; roleLst: any; roleCreationId: number = 0; roleName: string = "";
  deptName: string = "";
  isEditmode: boolean = false; departmentList: any[] = []; departmentId: number = 0; departmentName: string = "";
  departmentDescription: string = ""; roleDescription: string = ''; roleSubmitted: boolean = false;
  createPermissionForm !: FormGroup; permissionFormSubmitted: boolean = false;
  permissionList: any[] = []; permissionId: number = 0; permissionName: string = ''; permissionDescription: string = '';
  appointmentId: number = 0; assignRoleForm !: FormGroup; selectedDepartment: any = {}; selectedPermission: any = {};
  selectedRole: any = {}; assignedRoleLst: any[] = []; depId: number = 0; responseList: any; selectedAssignedRole: any = {};
  selectedPermissionRole: any = {}; assignRoleResponse: any = {}; selectedRoleObj: any; selectedDeptObj: any;
  selectedId: number = 0;selectedPermissionId : number =0;subPermissionupdateId :any;
  savedRoles: { [companyCode: string]: any[] } = {};
  savedDepartmentRoles: any[] = []; assignedPermissionLst: any[] = [];
  assignPermissionForm !: FormGroup; assignUserForm !: FormGroup; assignUserEmail: string = '';
  assignedUserLst: any[] = []; modal: any; permissiondeptroleId: number = 0; assignPermissionId: number = 0;
  userdeptroleId: any; email: string = ''; departroleId: number = 0; adminAccessUsersLst: any[] = [];
  departmentIds: any; assignedRoleIds: any; active6 = 'Home'; filteredRoleList: any[] = []; filteredPermissionList: any[] = [];
  assignPerm: any; filteredUserList: any[] = []; showUser: boolean = false; selectedUser: any;
  departmentListTable: any[] = []; optimizerCuts: any[] = []; submittedModels: string[] = [];fullCutListItems :any[]=[];
  isCutListFull : boolean = false;existingCuts: any[] = []; originalCutItems : any[]=[];
  userPermissions : any[]=[];selectedrole: number = 0;userPermissionSet = new Set<string>();
  selectedSubPermissions: string[] = [];selectedPermissionName : string ='';SubpermissionId : number=0;
  showSubPermissionDropdown = false;editSubpermissionForm !:FormGroup;
  codeLabels: { [key: string]: string } = { AK_PA: 'Panel', AK_SH: 'Shutter'};
  
  allPermissions: Record<PermissionName, string[]> = {
    CRM: ['deals_delete', 'deals_edit', 'deals_stage_status','leads_add','leads_delete','deals_add','leads_edit','leads_view','deals_access','campaign_create','campaign_deletion',
      'campaign_edit','leads_stage_status','lead_mail_template_creation','appointmnet_creation','campaign_access','leads_allocate',
      'completion_lead','leads_move_campaign','analytics_display','Campaign_Users','leads_view','deals_view','deals_mail_create','deals_mail_teamplet_create',
      'deals_campaign_move','deals_appointment','deals_task_create','leads_task_create','deal_completion','deals_analytics','deals_allocate','campaign_users_dispaly',
      'users_dispaly','task_edit', 'task_access', 'client_access', 'appointment_access'
    ],
    Projects :['project_create','Top_Projects','my_projects_table','add_project_stage','view_project_cycle','recce_access','project_assign','project_estimation', 'recce_stage', 'design_stage', 'edit_design',
      'boq_stage', 'project_scope', 'payments_from_client',  'client_invoice', 'client_orders', 'proposal_for_client', 'project_boq_data','cut_list', 'create_proposal', 'custom_element', 
      'import_items', 'proposal_approve', 'proposal_share', 'cutlist_change','cutlist_download', 'move_item',
    ],
    SALES: ['products_add', 'products_edit'],
    HR: ['employee_add', 'employee_edit']
  };

selectedPermissions: any[] = [];
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

  addMoreVisible: boolean = false;
  addMorePmntVisible: boolean = false;
  searchUser: string = '';
  userDetails: any = {};
  public sawForm!: FormGroup;
  public sawSubmitted = false;
  public partsSubmitted = false;
  public quoteSubmitted = false;
  public cutListSubmitted = false;
  public DepartmentFormSubmitted = false;
  public stockForm!: FormGroup;
  public partsForm!: FormGroup;
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
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
    const selectedSawRow = localStorage.getItem('selectedSawRow');
    this.selectedSawRow = selectedSawRow ? JSON.parse(selectedSawRow) : null;

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
    this.onClkDesign('i');
    this.formInit(); this.getUsers(); this.getAllStages(); this.getAllPmntStages();
    this.getProjectConfig();
    this.getAllDepartments();
    this.getAssignedUsers();
    this.buildDepartmentView();
    this.getOptimizerCut();
    this.userEmail = JSON.parse(this.userData).email;
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

    this.partsForm = this.fb.group({
      partList: this.fb.array([this.createPartGroup()]),
      companyCode: [(JSON.parse(this.userData).companyCode) ? JSON.parse(this.userData).companyCode : ''],
      email: [(JSON.parse(this.userData).email) ? JSON.parse(this.userData).email : ''],
      type: [(JSON.parse(this.userData).type) ? JSON.parse(this.userData).type : '']
    });

    this.cutListForm = this.fb.group({
      code: ['', Validators.required],
      l1: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      w1: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      l2: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      w2: [0, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      email: this.userEmail,
      companyCode: [(JSON.parse(this.userData).companyCode) ? JSON.parse(this.userData).companyCode : ''],
      companyName: [(JSON.parse(this.userData).companyName) ? JSON.parse(this.userData).companyName : ''],
    });

    this.projectConfigForm = this.fb.group({
      quotationNumber: [''],
      configId: 0,
      companyName: [JSON.parse(this.userData)?.companyName,],
      companyCode: [JSON.parse(this.userData)?.companyCode,],
      email: [JSON.parse(this.userData)?.email,],
      type: [JSON.parse(this.userData)?.type,],
      updatedBy: [localStorage.getItem('username')],
      updatedTime: [],
      f1: ['', Validators.required],
      f2: [''],
      f3: [''],
      f4: [''],
      f5: [''],
      f6: [''],
      f7: [''],
      f8: [''],
      f9: [''],
      f10: ['']
    });
    this.roleForm = this.fb.group({
      name: [''],
      description: [''],
    });
    this.assignRoleForm = this.fb.group({
      depRole: [0],
      roleRole: [0],
      description: [''],

    });
    this.assignPermissionForm = this.fb.group({
      permissionRole: [0],
      depRole: [0],
      description: [''],
      subPermission: this.fb.array([])   
    })

    this.assignUserForm = this.fb.group({
      userEmail: [''],
      depRole: [0],
      description: [''],
    })



    // setTimeout(() => {

    // }, 500);
    this.userForm?.get('password')?.valueChanges.subscribe((value) => {
      this.checkPasswordStrength(value);
    });
    this.userForm?.get('confirmPassword')?.valueChanges.subscribe((value) => {
      this.checkPasswordMatch(value);
    });

    this.quoteMarignForm = this.fb.group({
      f1: ['', [Validators.required]],
      f1Percent: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      f2: [''],
      f2Percent: [0],
      f3: [''],
      f3Percent: [0],
      f4: [''],
      f4Percent: [0],
      f5: [''],
      f5Percent: [0],
      f6: [''],
      f6Percent: [0],
      f7: [''],
      f7Percent: [0],
      f8: [''],
      f8Percent: [0],
      f9: [''],
      f9Percent: [0],
      f10: [''],
      f10Percent: [0],
      f11: [''],
      f11Percent: [0],
      f12: [''],
      f12Percent: [0],
      f13: [''],
      f13Percent: [0],
      f14: [''],
      f14Percent: [0],
      f15: [''],
      f15Percent: [0],
      companyName: [JSON.parse(this.userData)?.companyName,],
      companyCode: [JSON.parse(this.userData)?.companyCode,],
      email: [JSON.parse(this.userData)?.email,],
      type: [JSON.parse(this.userData)?.type,],
      updatedBy: [localStorage.getItem('username')],
      updatedTime: [],
    });

    this.createRoleForm = this.fb.group({
      name: [''],
      description: [''],
      companyId: ['']
    })


    this.createDepartmentForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type
    })
    this.createPermissionForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      // subPermission : this.fb.array([]),
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type
    })
    this.editSubpermissionForm = this.fb.group({
      subPermission: this.fb.array([])
    })
    this.onTodayDt();
    this.onMinDate();
    this.getMarginData();
    // this.createPermissionForm.get('name')?.valueChanges.subscribe(value => {
    //   this.onPermissionSelect(value);
    // });
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
  getPartsSNo(index: number): number {
    if (this.partsPaginator && this.partsPaginator.pageIndex !== undefined && this.partsPaginator.pageSize !== undefined) {
      return this.partsPaginator.pageIndex * this.partsPaginator.pageSize + index + 1;
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
        } 
      }
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
        } 
      }
    })
  }

  saveLastStages() {
    let totalPercent = 0;
    for (const field of this.dynamicFields) {
      const percent = +field.percent; 
      if (percent === 0) {
        this.toastr.warning('Percent values cannot be zero or empty.', 'Validation Error');
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
          }
        }
      })
    } else if (totalPercent < 100) {
      this.toastr.warning('Total percent is less than 100. Please adjust the values.', 'Validation Error');
    } else {
      this.toastr.warning('Total percent exceeds 100. Please adjust the values.', 'Validation Error');
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
        } 
      }
    })
  }

  savePmntInitialStage() {
    this.switchService.pmntStageSave(this.savePmntData).subscribe({
      next: (res: any) => {
        if (res) {
          this.toastr.success('Stages saved successfully');
          this.offcanvasService.dismiss();
          this.getAllPmntStages();
        }
      }
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
        }
      }
    })
  }

  savePmntLastStages() {
    let totalPercent = 0;
    for (const field of this.dynamicPmntFields) {
      const percent = +field.percent;
      if (percent === 0) {
        this.toastr.warning('Percent values cannot be zero or empty.', 'Validation Error');
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
          }
        },
      })
    } else if (totalPercent < 100) {
      this.toastr.warning('Total percent is less than 100. Please adjust the values.', 'Validation Error');
    } else {
      this.toastr.warning('Total percent exceeds 100. Please adjust the values.', 'Validation Error');
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
        }
      }
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
            this.dataSource.data = res;
          }
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
      payload.type = 2,
      payload.crm = crm,
      payload.adonai = adonai,
      payload.companyCode = JSON.parse(this.userData).companyCode,
      payload.phoneNumber = +payload.phoneNumber, delete payload.tools, delete payload.confirmPassword,
      payload.dob = this.dp.transform(payload.dob, 'dd-MM-yyyy'),
      payload.companyName = JSON.parse(this.userData).companyName,
      this.pload = payload
    if (this.userForm.invalid) {
      this.toastr.warning('Please fill mandatory fields');
      this.btnDisable = false;
      return;
    }
    else if (this.paswrd != this.cnfmPaswrd) {
      this.toastr.warning('password and confirm password not matched', 'signup', );
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
  openLg(content112: any) {
    this.isEditmode = false;
    this.modalService.open(content112, { size: 'sm', scrollable: true, centered: true, },);
  }

  cutList(content46: any) {
    // this.cutListSubmitted = false; 
    this.cutListForm.reset();
    this.filterDropdownUsingSavedValues();
    this.modalService.open(content46, { centered: true });
  }

  departmentModal(content113: any) {
    this.isEditmode = false;
    this.createDepartmentForm.reset();
    this.modalService.open(content113, { scrollable: true, centered: true, });
  }

  closeModal() {
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
    this.stockDataSource.filter = filterValue.trim().toLowerCase();
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
  openRight4(content4: any) {
    this.offcanvasService.open(content4, { position: 'end' });
  }
  openRight12(content12: any) {
    this.offcanvasService.open(content12, { position: 'end' });
  }
  openRight13(content13: any) {
    this.modalService.open(content13, { centered: true, });
  }
  permissionModal(content16: any) {
    this.getAllPermissions()
    this.modalService.open(content16, { centered: true, scrollable : true });
    
  }
  openRight14(content14: any) {
    this.modalService.open(content14, { centered: true, });
  }

  assginRoles(content15: any) {
    this.getRoles();        
    this.getAssignedRoles(); 
    this.modalService.open(content15, { centered: true });
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


  filterUserData(value?: string) {
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
      bladeWidth: [0, [Validators.required]],
      stockType: ['', [Validators.required]],
      cutType: ['', [Validators.required]],
      cutPreference: ['', [Validators.required]],
      guillotineOptions: this.fb.group({
        strategy: ['', [Validators.required]],
        maxPhase: [0, [Validators.required]]
      }),
      efficiencyOptions: this.fb.group({
        primaryCompression: ['', [Validators.required]]
      }),
      stackHeight: [0, [Validators.required]],
      options: this.fb.group({
        stockSelection: ['', [Validators.required]],
        minSpacing: [0, [Validators.required]],
        stackingMode: ['', [Validators.required]]
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
  createPartGroup(): FormGroup {
    return this.fb.group({
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


  // Getter for saw FormArray

  get sawList() {
    return this.sawForm.get('sawList') as FormArray;
  }


  // Getter for stock FormArray
  get stockList() {
    return this.stockForm.get('stockList') as FormArray;
  }
  addParts(): void {
    this.partsList.push(this.createPartGroup());
  }
  removeParts(index: number): void {
    this.partsList.removeAt(index);
  }
  get partsList() {
    return this.partsForm.get('partList') as FormArray;
  }
  addPopupParts(): void {
    this.partsList.push(this.createPartGroup());
  }
  addPopupStock(): void {
    this.stockList.push(this.createStockGroup());
  }

  addSaw(): void {
    this.sawList.push(this.createSawGroup());
  }
  removeSaw(index: number): void {
    this.sawList.removeAt(index);
  }

  addStock(): void {
    this.stockList.push(this.createStockGroup());
  }
  removeStock(index: number): void {
    this.stockList.removeAt(index);
  }



  openLg1(content6: any) {
    this.modalService.open(content6, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg2(content5: any) {
    this.modalService.open(content5, { size: 'xl', scrollable: true, centered: true, });
  }
  openLg3(content7: any) {
    this.modalService.open(content7, { size: 'xl', scrollable: true, centered: true, });
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
          if (this.stockPaginator) {
            this.stockDataSource.paginator = this.stockPaginator;
          }
        } else {
          this.stockDataSource.data = [];
        }
      },
      error: (error) => {
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
          if (this.sawPaginator) {
            this.sawDataSource.paginator = this.sawPaginator;
          }
        } else {
          this.sawDataSource.data = [];
        }
      },
      error: (error) => {
        this.sawDataSource.data = [];
      },
    });
  }
  onSawRowCheckboxChange(row: any, event: any) {
    if (event.checked) {
      this.selectedSawRow = row;
      localStorage.setItem('selectedSawRow', JSON.stringify(this.selectedSawRow));
    } else {
      this.selectedSawRow = null;
      localStorage.removeItem('selectedSawRow');
    }
  }

  isCheckboxSawDisabled(row: any): boolean {
    return this.selectedSawRow && this.selectedSawRow.sawId !== row.sawId; // Disable others
  }

  // Handle "select all" checkbox
  onSawSelectAllChange(event: any) {
    if (event.checked) {
      //this.selectedSawIdList = new Set(this.sawDataSource.data.map((row) => row));
    } else {
      this.selectedSawIdList.clear();
    }
  }

  isSawAllSelected() {
    return this.selectedSawIdList.size === this.sawDataSource.data.length;
  }

  isSawIndeterminate() {
    return this.selectedSawIdList.size > 0 && this.selectedSawIdList.size < this.sawDataSource.data.length;
  }

  isSawSelected(data: any) {
    return this.selectedSawIdList.has(data);
  }

  getPartsData() {
    let payload = {
      email: JSON.parse(this.userData)?.email,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type
    };
    this.switchService.PartsData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res) && res.length > 0) {
          this.partsDataSource.data = res;
          // Ensure paginator is set only if it exists
          if (this.partsPaginator) {
            this.partsDataSource.paginator = this.partsPaginator;
          }
        } else {
          this.sawDataSource.data = [];
        }
      },
      error: (error) => {
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
            this.sawForm.reset();
            this.getSawData();
            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.sawSubmitted = false;
    }
  }

  submitStockForm(modal: any): void {
    this.sawSubmitted = true;
    if (this.stockForm.valid) {
      this.switchService.saveStockData(this.stockForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.stockForm.reset();
            this.getStockData();
            this.toastr.success(res.message, 'optimizer', {
              timeOut: 3000, positionClass: 'toast-top-right'
            });
          }
        }
      })
      this.sawSubmitted = false;
    }
  }

  resetPartList() {
    this.partsForm.setControl('partList', this.fb.array([this.createPartGroup()]));
  }
  submitPartsForm(modal: any): void {
    this.partsSubmitted = true;
    if (this.partsForm.valid) {
      this.switchService.savePartsData(this.partsForm.value).subscribe({
        next: (res: any) => {
          if (res.status == true) {
            modal.close();
            this.resetPartList();
            this.getPartsData();
            this.toastr.success(res.message, 'optimizer',);
          } 
        }
      })
      this.partsSubmitted = false;
    }
  }

  toggleTopShowMore() {
    this.topshowMore = !this.topshowMore;
    if (this.topshowMore) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.scrollable-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  }

  getUserColor(contact: any): string {
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];
    if (contact && contact.email) {
      const index = contact.email.charCodeAt(0) % colors.length;
      return colors[index];
    }
    return 'bg-secondary';
  }

  quoteMarginSubmit(modal: any) {
    this.quotationmarginsubmit = true;
    if (this.quoteMarignForm.invalid) {
      this.toastr.warning("Please fill in all required fields.");
      return;
    }
    const newMarginName = this.quoteMarignForm.get('f1')?.value || '';
    const newMarginPercent = this.quoteMarignForm.get('f1Percent')?.value || 0;
    let mergedMargins = this.previousMarginResponse ? { ...this.previousMarginResponse } : {};

    let nextIndex = -1;
    for (let i = 1; i <= 15; i++) {
      if (!mergedMargins[`f${i}`]) {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex === -1) {
      this.toastr.warning("Maximum 15 margin entries reached.");
      return;
    }

    mergedMargins[`f${nextIndex}`] = newMarginName;
    mergedMargins[`f${nextIndex}Percent`] = newMarginPercent;

    // 5. Ensure all f1–f15 & f1Percent–f15Percent keys exist
    for (let i = 1; i <= 15; i++) {
      const fKey = `f${i}`;
      const pKey = `f${i}Percent`;

      if (!mergedMargins.hasOwnProperty(fKey)) {
        mergedMargins[fKey] = '';
      }

      if (!mergedMargins.hasOwnProperty(pKey)) {
        mergedMargins[pKey] = 0;
      }
    }


    const companyInfo = {
      companyName: JSON.parse(this.userData).companyName,
      companyCode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      type: JSON.parse(this.userData).type,
      updatedBy: localStorage.getItem('username'),
      updatedTime: new Date().toISOString(),
    };

    const finalPayload = {
      ...mergedMargins,
      ...companyInfo
    };
    this.switchService.savedynamicMargins(finalPayload).subscribe({
      next: (res: any) => {
        if (res && res.marginId !== undefined) {
          this.toastr.success('Margin Saved Successfully!');
          this.quoteMarignForm.reset();
          this.previousMarginResponse = res;
          // localStorage.setItem('previousMarginResponse', JSON.stringify(res));
          modal.close();
          this.quoteMarignForm.reset({ f1: '', f1Percent: 0 });
          this.getMarginData();
        } 
      }
    });
  }

  getMarginData() {
    let payload = {
      companycode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      type: JSON.parse(this.userData).type
    };
    this.switchService.fetchDynamicMargin(payload).subscribe({
      next: (res: any) => {
        if (res && res.marginId) {
          this.previousMarginResponse = res;
          const configs: { name: string, percent: number }[] = [];
          for (let i = 1; i <= 10; i++) {
            const name = res[`f${i}`];
            const percent = res[`f${i}Percent`];
            if (name) {
              configs.push({ name, percent: percent || 0 });
            }
          }
          this.projectMarginList = configs;
        }
      }
    });
  }

  onProjectConfigSubmit(modal: any) {
    this.projectconfigsubmit = true;
    this.quoteSubmitted = true;
    const quotationValue = this.projectConfigForm.get('quotationNumber')?.value;
    if (this.projectConfigForm.invalid) {
      this.toastr.warning("Please enter Project Configuration.");
      return;
    }
    const rawQuote = this.projectConfigForm.get('quotationNumber')?.value || '';

    const newConfigValue = this.projectConfigForm.get('f1')?.value || '';

    let mergedPayload = this.previousConfigResponse ? { ...this.previousConfigResponse } : {};

    let nextIndex = -1;
    for (let i = 1; i <= 10; i++) {
      if (!mergedPayload[`f${i}`]) {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex === -1) {
      this.toastr.warning("Maximum 10 Project Configurations reached.");
      return;
    }

    mergedPayload[`f${nextIndex}`] = newConfigValue;

    this.projectConfigForm.get('f1')?.reset();

    for (let i = 1; i <= 10; i++) {
      const key = `f${i}`;
      if (!mergedPayload[key]) mergedPayload[key] = '';
    }

    const companyInfo: any = {
      configId: 0,
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      email: JSON.parse(this.userData)?.email,
      type: JSON.parse(this.userData)?.type,
      updatedBy: localStorage.getItem('username'),
      updatedTime: new Date().toISOString()
    };

    if (Object.keys(this.previousConfigResponse).length === 0 && rawQuote) {
      companyInfo.quotationNumber = rawQuote;
    }
    const finalPayload = {
      ...companyInfo,
      ...mergedPayload
    };
    if (this.quotationSubmitted && this.submittedQuotationNumber) {
      finalPayload.quotationNumber = this.submittedQuotationNumber;
    }
    this.switchService.saveProjectConfig(finalPayload).subscribe({
      next: (res: any) => {
        if (res && res.configId !== undefined) {
          this.toastr.success('Project Configuration saved!');
          this.previousConfigResponse = res;

          const enteredQuotation = this.projectConfigForm.get('quotationNumber')?.value;
          this.quotationSubmitted = true;
          // localStorage.setItem('quotationSubmitted', 'true');
          // localStorage.setItem('submittedQuotationNumber', enteredQuotation);
          modal.close();
          this.projectConfigForm.reset({
            projectConfigs: [],
          });
          this.getProjectConfig();
        }
      },
     
    });
  }

  getProjectConfig() {
    let payload = {
      companycode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
      type: JSON.parse(this.userData).type
    };
    this.switchService.fetchProjectConfig(payload).subscribe({
      next: (res: any) => {
        if (res && res.configId) {
          this.previousConfigResponse = res;
          this.quotationSubmitted = true;
          this.submittedQuotationNumber = res.quotationNumber;
          const configs: string[] = [];
          for (let i = 1; i <= 10; i++) {
            const value = res[`f${i}`];
            if (value) configs.push(value);
          }
          this.projectConfigList = configs;
          this.quotationNumber = res.quotationNumber;
        }
      },
      
    });
  }

  allowOnlynum(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  get g() {
    return this.quoteMarignForm.controls;
  }

  get h() {
    return this.projectConfigForm.controls;
  }
  openEditFromSelected(element: any, content112: any) {
    this.isEditmode = true;
    this.openEditForm(element, content112);
  }

  openEditForm(element: any, content112: any) {
    this.isEditmode = true;
    this.roleCreationId = element.id;
    this.selectRole(element);
    this.roleForm.patchValue({
      name: element.name,
      description: element.description
    });
    this.modalService.open(content112, { size: 'sm', scrollable: true, centered: true, });
  }

  selectRole(index: number) {
    if (Array.isArray(this.roleLst) && this.roleLst.length > index) {
      const selectedRole = this.roleLst[index];

      this.roleCreationId = selectedRole.id;
      this.roleName = selectedRole.name;
      this.roleDescription = selectedRole.description;
    }
  }
  selectDepartment(index: number) {
    if (Array.isArray(this.departmentList) && this.departmentList.length > index) {
      const selectedDept = this.departmentList[index];
      this.deptName = selectedDept.name;
      this.roleDescription = selectedDept.description;
    }
  }

  get i() {
    return this.roleForm.controls;
  }

  editDepartmentFormSelected(element: any, content113: any) {
    this.isEditmode = true;
    this.openEditDepartmentForm(element, content113);
  }

  openEditDepartmentForm(element: any, content113: any) {
    this.isEditmode = true;
    this.departmentId = element.id;
    this.createDepartmentForm.reset();
    this.createDepartmentForm.patchValue({
      name: element.name,
      description: element.description
    });
    const modalRef = this.modalService.open(content113, { size: 'sm', scrollable: true, centered: true });
    modalRef.result.finally(() => {
      this.createDepartmentForm.reset();
      this.isEditmode = false;
    });
  }

  editPermissionFormSelected(element: any, content114: any) {
    this.isEditmode = true;
    this.openEditAppointmentForm(element, content114);
  }
  openEditAppointmentForm(element: any, content114: any) {
    this.isEditmode = true;
    this.permissionId = element.id;
    this.permissionName = element.name;
    this.permissionDescription = element.description;
    this.createPermissionForm.reset();
    this.createPermissionForm.patchValue({
      name: element.name,
      description: element.description
    });
    const modalRef = this.modalService.open(content114, { size: 'sm', scrollable: true, centered: true });
    modalRef.result.finally(() => {
      this.createPermissionForm.reset();
      this.isEditmode = false;
    });
  }

  onRoleSubmit(modal?: any) {
    if (this.isEditmode) {
      this.updateRoles();
    }
    else {
      this.addRoles(modal);
    }
  }

  onDepartmentSubmit(modal?: any) {
    this.DepartmentFormSubmitted = true;

    if (this.createDepartmentForm.invalid) {
      return;
    }

    if (this.isEditmode) {
      this.updateDepartment(modal);
    } else {
      this.createDepartment(modal);
    }
  }
  onPermissionSubmit(modal?: any) {
    this.permissionFormSubmitted = true;
    if (this.createPermissionForm.invalid) {
      return;
    }
    if (this.isEditmode) {
      this.updateSubPermissions(modal);
    } else {
      this.createPermission(modal);
    }
  }

  isAdminRoleExists(): boolean {
    return this.roleLst?.some(
      (role: any) => role.name?.trim().toLowerCase() === 'admin'
    );
  }


  addRoles(modal: any) {
    const roleName = this.roleForm.value.name?.trim();
    if (roleName?.toLowerCase() === 'admin' && this.isAdminRoleExists()) {
      this.toastr.warning('Admin role already exists');
      return;
    }
    if (this.isRoleExists(roleName)) {
      this.toastr.warning('Role already exists!');
      return;
    }
    this.roleSubmitted = true;
    if (this.roleForm.invalid) {
      this.toastr.warning('Please fill all mandatory fields.');
      return;
    }
    const payload = {
      ...this.roleForm.value,
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type,
    };
    this.switchService.addRole(payload).subscribe({
      next: () => {
        this.toastr.success('Role added successfully');
        modal.close();
        this.roleSubmitted = false;
        this.getRoles();
      }
    });
  }


  getRoles() {
    const companyCode = JSON.parse(this.userData)?.companyCode;
    this.switchService.getRole(companyCode).subscribe({
      next: (res: any[]) => {
        this.roleLst = res || [];
        if (!this.isAdminRoleExists()) {
          this.createDefaultAdminRole();
        }
      },
    });
  }

  createDefaultAdminRole() {
    const payload = {
      name: 'Admin',
      description: 'Default Admin Role',
      permissions: [], 
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type,
      isSystemRole: true
    };

    this.switchService.addRole(payload).subscribe({
      next: () => {
        this.getRoles();
      },
    });
  }



  updateRoles() {
    const roleId = this.roleCreationId;
    const roleName = this.roleForm.value.name;
    const description = this.roleForm.value.description;
    this.switchService.updateRole(roleId, roleName, description).subscribe({
      next: (res: any) => {
        this.toastr.success('role updated successfully');
        this.getRoles();
      },
    })
  }
  deleteRole(id: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this Role?')) {
      this.switchService.deleteRole(id).subscribe({
        next: (res: any) => {
          this.toastr.success('Role deleted successfully');
          this.getRoles();
        },
      });
    }
  }

  createDepartment(modal: any) {
    const deptName = this.createDepartmentForm.value.name;
    if (this.isDepartmentExists(deptName)) {
      this.toastr.warning("department already exists!");
      return;
    }
    this.DepartmentFormSubmitted = true;
    if (this.createDepartmentForm.invalid) {
      return;
    }
    const payload = this.createDepartmentForm.value;
    this.switchService.createDepartment(payload).subscribe({
      next: (res) => {
        this.toastr.success('Department created successfully');
        this.DepartmentFormSubmitted = false;
        if (modal) { modal.close(); }
        modal.dismiss();
        this.getAllDepartments();
      }
    });
  }

  getAllDepartments() {
    const companyCode = JSON.parse(this.userData)?.companyCode;
    this.switchService.getDepartment(companyCode).subscribe({
      next: (res: any[]) => {
        this.departmentList = res;
        if (res.length > 0) {
          this.departmentId = res[0].id;
          this.departmentName = res[0].name;
          this.departmentDescription = res[0].description;
        }
      }
    });
  }

  onViewDepartment(department: any) {
    if (!department?.id) return;
    this.toggleTable(department);
    this.getAssignedRoles([department.id]);
  }


  updateDepartment(modal: any) {
    const departmentId = this.departmentId;
    const departmentName = this.departmentName;
    const description = this.departmentDescription;
    this.switchService.updateDepartment(departmentId, departmentName, description).subscribe({
      next: (res: any) => {
        this.toastr.success('Department updated successfully');
        modal.close();
        this.getAllDepartments();
      },
    });
  }

  deleteDepartment(id: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this department?')) {
      this.switchService.deleteDepartment(id).subscribe({
        next: (res: any) => {
          this.toastr.success('Department deleted successfully');
          this.getAllDepartments();
        }
      });
    }
  }

  showRoles = false;

  backToDepartments() {
    this.showRoles = false;
  }
  backToPermissions() {
    this.showPermissions = false;
  }
  backToUsers() {
    this.showUser = false;
  }

  get df() {
    return this.createDepartmentForm.controls;
  }

  getDeptColor(name: string): string {
    if (!name) return 'bg-secondary';
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-danger',
      'bg-warning',
      'bg-info',
      'bg-dark'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }
  get pf() {
    return this.createPermissionForm.controls;
  }

  createPermission(modal?: any) {
    const permissionName = this.createPermissionForm.value.name;
    if (this.isPermissionExists(permissionName)) {
      this.toastr.warning("permission already exists!");
      return;
    }
    this.permissionFormSubmitted = true;
    if (this.createPermissionForm.invalid) {
      return;
    }
    const formValue = this.createPermissionForm.value;
    //  const selectedKeys = this.subPermissionArray.controls
    // .filter(ctrl => ctrl.value.enabled === true)
    // .map(ctrl => ctrl.value.key);

    // const commaSeparated = selectedKeys.join(',');
    const payload ={
      ...formValue,
    }
    this.switchService.createPermission(payload).subscribe({
      next: (res) => {
        this.toastr.success('Permission created successfully');
        this.permissionFormSubmitted = false;
        modal.close();
        this.getAllPermissions();
      }
    });
  }

  getAllPermissions() {
    const companyCode = JSON.parse(this.userData)?.companyCode;
    const defaultPermissions = [
      { name: 'Projects', description: 'Projects access' },
      { name: 'CRM', description: 'CRM access' },
      { name: 'Settings', description: 'Settings access' }
    ];
    this.switchService.getPermissions(companyCode).subscribe({
      next: (res: any[]) => {
        const apiPermissionMap = new Map(
          res.map(p => [p.name, p])
        );
        const mergedPermissions = defaultPermissions.map(def => {
          return apiPermissionMap.get(def.name) || {
            id: null,
            name: def.name,
            description: def.description,
            subPermission: ''
          };
        });
        this.permissionList = mergedPermissions;
        if (mergedPermissions.length > 0) {
          this.permissionId = mergedPermissions[0].id;
          this.permissionName = mergedPermissions[0].name;
          this.permissionDescription = mergedPermissions[0].description;
        }
        this.userPermissions = mergedPermissions.map(item => ({
          permission: item.name,
          subPermissions: item.subPermission
            ? item.subPermission.split(',')
            : []
        }));
      }
    });
  }

  // updatePermission(modal: any) {
  //   const permissionId = this.permissionId;
  //   const permissionName = this.permissionName;
  //   const description = this.permissionDescription;
  //    const selectedKeys = this.subPermissionArray.controls
  //   .filter(ctrl => ctrl.value.enabled === true)
  //   .map(ctrl => ctrl.value.key);
  //   const commaSeparated = selectedKeys.join(',');
  //   const subPermission = commaSeparated
  //   this.switchService.updatePermission(permissionId, permissionName, description,subPermission).subscribe({
  //     next: (res: any) => {
  //       this.toastr.success('Department updated successfully');
  //       this.getAllPermissions();
  //       modal.close()
  //     },
  //   });
  // }
  deletePermission(id: number) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this Permission?')) {
      this.switchService.deletePermission(id).subscribe({
        next: (res: any) => {
          this.toastr.success('permission deleted successfully');
          this.getAllPermissions();
        }
      });
    }
  }
  isRoleExists(roleName: string): boolean {
    return this.roleLst.some(
      (role: any) => role.name.toLowerCase() === roleName.toLowerCase()
    );
  }
  isDepartmentExists(deptName: string): boolean {
    return this.departmentList.some(
      (dept: any) => dept.name.toLowerCase() === deptName.toLowerCase()
    );
  }
  isPermissionExists(permissionName: string): boolean {
    return this.permissionList.some(
      (permission: any) => permission.name.toLowerCase() === permissionName.toLowerCase()
    );
  }
  // assignRole(modal:any) {
  //   const payload = {
  //     depRole: this.assignRoleForm.value.depRole,
  //     roleRole: this.assignRoleForm.value.roleRole,
  //     department: this.selectedDepartment,
  //     role: this.selectedRole,
  //     description: this.assignRoleForm.value.description,
  //     companyName: JSON.parse(this.userData)?.companyName,
  //     companyCode: JSON.parse(this.userData)?.companyCode,
  //     type: JSON.parse(this.userData)?.type,
  //   };
  //   this.switchService.assignRoleToDepartment(payload).subscribe({
  //     next: (res) => {
  //       this.toastr.success('Assigned successfully');
  //       modal.close();
  //       this.assignRoleResponse = res;
  //       this.savedDepartmentRoles.push(res);
  //       this.depId = res.id;
  //       this.getAssignedRoles();
  //     },
  //   });
  // }
  assignRole(modal: any) {
    const payload = {
      depRole: this.selectedDepartment.id,
      roleRole: this.assignRoleForm.value.roleRole,
      department: this.selectedDepartment,
      role: this.selectedRole,
      description: this.assignRoleForm.value.description,
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type,
    };
    this.switchService.assignRoleToDepartment(payload).subscribe({
      next: (res) => {
        this.toastr.success('Assigned successfully');
        modal.close();
        this.assignRoleResponse = res;
        this.savedDepartmentRoles.push(res);
        this.depId = res.department.id;
        this.getAssignedRoles([this.depId]);
      }
    });
  }

  onDepartmentChange(id: number) {
    this.selectedDepartment = id;
  }
  toggleTable(department?: any) {
    this.filteredRoleList = this.assignedRoleLst.filter(
      role => role.departmentId === department.id
    );
    this.selectedDepartment = department;
    this.showRoles = true;
  }
  showPermissions = false;
  tablePermissionView(assignedRole?: any) {
    this.filteredPermissionList = this.assignedPermissionLst.filter(
      permission => permission.departmentRoleId === assignedRole.id
    );
    this.selectedPermission = assignedRole;
    this.subPermissionupdateId = [assignedRole.id];
    this.getAssignedDeptRolePermissions([assignedRole.id]);
    this.showPermissions = true;
  }

  onRoleChange(id: number) {
    this.selectedRole = id;
  }

  getAssignedRoles(departmentIds?: number[]) {
    const companyCode = JSON.parse(this.userData)?.companyCode;
    const idsToUse = departmentIds && departmentIds.length > 0 ? departmentIds : this.departmentIds;

    if (!idsToUse || idsToUse.length === 0) {
      return;
    }
    this.switchService.getAssignedRoles(idsToUse, companyCode).subscribe({
      next: (res) => {
        this.assignedRoleLst = res;
        this.filteredRoleList = this.assignedRoleLst;
        this.departroleId = res[0].departmentId;
        const assignedRoleIds: number[] = Array.from(
          new Set(
            this.assignedRoleLst
              .map((dept: any) => Number(dept?.id))
              .filter((id: any) => !isNaN(id))
          )
        );
        this.assignedRoleIds = departmentIds;
      }
    });
  }

  deleteDepartmentRole(id: number) {
    if (!id) return;
    const companyCode = JSON.parse(this.userData)?.companyCode;
    if (confirm('Are you sure you want to delete this department?')) {
      this.switchService.deleteAssignedRoles(id).subscribe({
        next: (res: any) => {
          this.toastr.success('permission deleted successfully');
          this.getAssignedRoles();
          if (this.savedRoles[companyCode]) {
            this.savedRoles[companyCode] = this.savedRoles[companyCode].filter(
              (r: any) => r.id !== id
            );
          }
        }
      });
    }
  }

  onAssignRoleChange(id: any) {
    this.selectedRoleObj = this.assignedRoleLst.find((r: any) => r.id === id);
    this.selectedPermission = id
  }

  onPermissionChange(selectP: any) {
    this.selectedPermissionRole = selectP;
    this.selectedPermissionId = selectP.id;
    const selected = this.permissionList.find(
      (p: any) => p.id === this.selectedPermissionId
    );
    if (!selected) return;
    const permissionName = selected.name;
    const features =
    this.allPermissions[permissionName as keyof typeof this.allPermissions] || [];
    this.subPermissionArray.clear();
    features.forEach(feature => {
      this.subPermissionArray.push(
        this.fb.group({
          key: feature,
          label: this.formatLabel(feature),
          enabled: false
        })
      );
    });
  }



  
  // onPermissionChange(selectP: any) {
  // this.selectedPermissionRole = selectP.id;
  // console.log('id',selectP.id);

  // const selected = this.permissionList.find((p:any) => p.id === selectP.id);
  // console.log('selecte ',this.permissionList);
  // console.log('selected id',selected);
  // const sub = selected?.subPermission || '';

  // if (sub && sub.length > 0) {
  //   this.selectedSubPermissions = sub.split(',').map((s:any) => s.trim());
  //   this.showSubPermissionDropdown = true;
  // } else {
  //   this.selectedSubPermissions = [];
  //   this.showSubPermissionDropdown = false;
  // }
  // }

  getSavedDepartmentRoleById(companyCode: string, selectedId: any) {
    return this.assignedRoleLst.find(
      (role) => role.companyCode === companyCode && role.departmentId === selectedId
    );
  }
  // assignPermission(modal:any){
  //   let companyCode = JSON.parse(this.userData)?.companyCode;
  //   let selectedId = this.assignPermissionForm.value.depRole;
  //   const departmentRole = this.getSavedDepartmentRoleById(companyCode, selectedId);
  //   const payload = {
  //     depRole : this.assignPermissionForm.value.depRole,
  //     permissionRole : this.assignPermissionForm.value.permissionRole,
  //     departmentRole : departmentRole,
  //     permission : this.selectedPermissionRole,
  //     description : this.assignPermissionForm.value.description,
  //     companyName: JSON.parse(this.userData)?.companyName,
  //     companyCode: JSON.parse(this.userData)?.companyCode,
  //     type: JSON.parse(this.userData)?.type,
  //   }
  //   this.switchService.assignPermissionToRole(payload).subscribe({
  //     next: (res) => {
  //       this.toastr.success('assigned successfully');
  //       modal.close();
  //       this.getAssignedRoles();
  //     }
  //   });
  // }

  assignPermission(modal: any) {
    let companyCode = JSON.parse(this.userData)?.companyCode;
    let selectedId = this.selectedPermission.id;
    const departmentRole = this.getSavedDepartmentRoleById(companyCode, selectedId);
      const selectedKeys = this.subPermissionArray.controls
    .filter(ctrl => ctrl.value.enabled === true)
    .map(ctrl => ctrl.value.key);
    const commaSeparated = selectedKeys.join(',');
    const payload = {
      depRole: this.selectedPermission.id,
      permissionRole: this.assignPermissionForm.value.permissionRole,
      departmentRole: departmentRole,
      permission: this.selectedPermissionRole,
      description: this.assignPermissionForm.value.description,
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type,
      subPermission :commaSeparated,
    }
    this.switchService.assignPermissionToRole(payload).subscribe({
      next: (res) => {
        this.toastr.success('assigned successfully');
        modal.close();
        this.getAssignedRoles();
      }
    });
  }
  
  getAssignedDeptRolePermissions(assignedRoleIds?: number[]) {
    const user = JSON.parse(this.userData);
    const companyCode = user?.companyCode;
    const idsToUse =
      assignedRoleIds && assignedRoleIds.length > 0
        ? assignedRoleIds
        : this.assignedRoleIds;

    if (!idsToUse || idsToUse.length === 0) return;

    this.switchService.getAssignPermissions(idsToUse, companyCode).subscribe({
      next: (res: any[]) => {
         this.filteredPermissionList = res;
        if (!this.roleLst || this.roleLst.length === 0) {
          return;
        }
        const selectedRole = this.roleLst.find(
          (r: any) => idsToUse.includes(r.departmentRoleId)
        );
        const isAdmin =
          selectedRole?.name?.toLowerCase() === 'admin';
        if (isAdmin && (!res || res.length === 0)) {
          this.switchService.getPermissions(companyCode).subscribe({
            next: (allPermissions: any[]) => {

              let completed = 0;

              allPermissions.forEach(permission => {

                const payload = {
                  depRole: selectedRole.departmentRoleId,
                  permissionRole: permission.permissionId,
                  departmentRole: selectedRole.departmentRoleId,
                  permission: permission.permissionName,
                  description: 'Admin full access',
                  companyName: user.companyName,
                  companyCode: user.companyCode,
                  type: user.type,
                  subPermission: permission.subPermission 
                };

                this.switchService.assignPermissionToRole(payload).subscribe({
                  next: () => {
                    completed++;
                    if (completed === allPermissions.length) {
                      this.getAssignedDeptRolePermissions(idsToUse);
                    }
                  }
                });
              });
            }
          });

          return; 
        }
        const uniqueMap = new Map<string, any>();

        res.forEach(item => {
          const key = `${item.departmentRoleId}_${item.permissionId}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        this.assignedPermissionLst = Array.from(uniqueMap.values());
        this.filteredPermissionList = [...this.assignedPermissionLst];

        if (this.assignedPermissionLst.length > 0) {
          this.permissiondeptroleId =
            this.assignedPermissionLst[0].departmentRoleId;
          this.assignPermissionId =
            this.assignedPermissionLst[0].permissionId;
        }
      }
    });
  }



  deleteAssignPermission(assignedPermission: any) {
    const deptRoleId = assignedPermission?.departmentRoleId || assignedPermission?.depRoleId;
    const permissionId = assignedPermission?.permissionId || assignedPermission?.id;
    const companyCode = JSON.parse(this.userData)?.companyCode;
    if (confirm('Are you sure you want to delete this department?')) {
      this.switchService.deleteAssignedPermission(deptRoleId, permissionId, companyCode).subscribe({
        next: (res: any) => {
          this.toastr.success('permission deleted successfully');
          this.getAssignedRoles();
        }
      });
    }
  }

  tableUserView(assigneUser?: any) {
    this.showUser = true;
    this.selectedUser = assigneUser;
    this.adminAccessAllUsers();
  }
  assignUserToDeptRole(modal?: any) {
    let companyCode = JSON.parse(this.userData)?.companyCode;
    let selectedId = this.selectedPermission.id;
    const departmentRole = this.getSavedDepartmentRoleById(companyCode, selectedId);
    const payload = {
      userEmail: this.assignUserForm.value.userEmail,
      depRole: this.selectedPermission.id,
      departmentRole: departmentRole,
      description: this.assignUserForm.value.description,
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      type: JSON.parse(this.userData)?.type,
    }
    this.switchService.assignUserToDeptRole(payload).subscribe({
      next: (res) => {
        this.toastr.success('assigned User to department Role successfully');
        const userEmail = res?.userEmail || res?.email;
        if (userEmail) {
          localStorage.setItem('userEmail', userEmail);
        }
        modal.close();
        this.getAssignedUsers();
        this.adminAccessAllUsers();

      }
    });
  }
  getAssignedUsers() {
    const email = JSON.parse(this.userData).email;
    const companyCode = JSON.parse(this.userData)?.companyCode;
    this.switchService.getAssignUser(email, companyCode).subscribe({
      next: (res) => {
        this.assignedUserLst = res;
        if (this.assignedUserLst.length > 0) {
          this.userdeptroleId = this.assignedUserLst[0].departmentRoleId;
          this.email = this.assignedUserLst[0].userEmail;
        }
      }
    });
  }

  deleteAssignUsers() {
    const email = JSON.parse(this.userData).email;
    const companyCode = JSON.parse(this.userData)?.companyCode;
    const deptRoleId = this.userdeptroleId;
    if (confirm('Are you sure you want to delete this department?')) {
      this.switchService.deleteAssignUser(email, companyCode, deptRoleId,).subscribe({
        next: (res: any) => {
          this.toastr.success('user deleted successfully');
          this.getAssignedUsers();
        }
      })
    }
  }
  getUsersAccess() {
    const email = JSON.parse(this.userData).email;
    this.switchService.getUserAccess(email).subscribe({
      next: (res) => {
      }
    });
  }

  adminAccessAllUsers() {
    const companyCode = JSON.parse(this.userData).companyCode;
    const loggedEmail = localStorage.getItem('userEmail');
    this.switchService.adminAccessAllUsers(companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.adminAccessUsersLst = res;
          this.buildDepartmentView();
        }
      }
    });
  }

  openDepartments: { [key: string]: boolean } = {};
  openRoles: { [key: string]: boolean } = {};
  toggleDepartment(deptIndex: number) {
    this.openDepartments[deptIndex] = !this.openDepartments[deptIndex];
  }
  isDepartmentOpen(deptIndex: number): boolean {
    return this.openDepartments[deptIndex];
  }

  toggleRole(deptIndex: number, roleIndex: number) {
    const key = `${deptIndex}-${roleIndex}`;
    this.openRoles[key] = !this.openRoles[key];
  }
  isRoleOpen(deptIndex: number, roleIndex: number): boolean {
    return this.openRoles[`${deptIndex}-${roleIndex}`];
  }
  
 getTotalPermissions(dep: any): number {
  if (!dep || !dep.roles) return 0;

  let total = 0;
  dep.roles.forEach((role: any) => {
    const permObject = role.permissions;   
    if (permObject && typeof permObject === 'object') {
      Object.values(permObject).forEach((value: any) => {
        if (typeof value === 'string' && value.trim() !== '') {
          const permissions = value.split(',').map(p => p.trim()).filter(p => p);
          total += permissions.length;
        }
      });
    }
  });

  return total;
  }

  getTotalUsers(dept: any): number {
    return dept.users?.length || 0;
  }

  buildDepartmentView() {
    const deptMap = new Map<string, any>();
    this.userPermissionSet.clear();
    for (const user of this.adminAccessUsersLst || []) {
      for (const dept of user.departments || []) {
        if (!deptMap.has(dept.departmentName)) {
          deptMap.set(dept.departmentName, {
            departmentName: dept.departmentName,
            roles: [],
            users: new Set()
          });
        }
        const deptEntry = deptMap.get(dept.departmentName);
        deptEntry.users.add(user.userEmail);
        for (const role of dept.roles || []) {
          for (const [key, value] of Object.entries(role.permissions || {})) {

            this.userPermissionSet.add(key);
            const val = String(value);
            val.split(',').forEach((sub: string) => {
              if (sub.trim()) this.userPermissionSet.add(sub.trim());
            });
          }
          const existingRole = deptEntry.roles.find(
            (r: any) => r.roleName === role.roleName
          );
          let safePermissions: string[] = [];

          if (role.permissions && typeof role.permissions === "object") {
            Object.values(role.permissions).forEach((value: any) => {
              if (typeof value === "string") {
                safePermissions.push(
                  ...value
                    .split(",")
                    .map(p => p.trim())
                    .filter(p => p)
                );
              }
            });
          }
          if (existingRole) {
            for (const perm of safePermissions) {
              if (!existingRole.permissions.includes(perm)) {
                existingRole.permissions.push(perm);
              }
            }
          } else {
            deptEntry.roles.push({
              roleName: role.roleName,
              permissions: [...safePermissions]
            });
          }
        }
      }
    }
    const finalData = Array.from(deptMap.values()).map(d => ({
      ...d,
      users: Array.from(d.users)
    }));
    this.departmentListTable = finalData;
  }


  cutListSubmit(modal:any) {
    this.cutListSubmitted = true;
    if (this.cutListForm.invalid) {
      this.toastr.warning('Please enter required fields');
      return;
    }
    const selectedCode = this.cutListForm.get('code')?.value;
    if (selectedCode && !this.submittedModels.includes(selectedCode)) {
      this.submittedModels.push(selectedCode);
    }
    const payload = {
      ...this.cutListForm.value,
      l1: parseInt(this.cutListForm.value.l1, 10),
      l2: parseInt(this.cutListForm.value.l2, 10),
      w1: parseInt(this.cutListForm.value.w1, 10),
      w2: parseInt(this.cutListForm.value.w2, 10),
      companyName: JSON.parse(this.userData)?.companyName,
      companyCode: JSON.parse(this.userData)?.companyCode,
      email: JSON.parse(this.userData)?.email,
    };
    this.switchService.saveOptimizerCut(payload).subscribe({
      next: () => {
        this.toastr.success('Optimizer Cut saved');
        modal.close();
        this.getOptimizerCut();
        this.cutListForm.reset();
      },
    });
  }

  getOptimizerCut() {
    const payload = {
      companyname: JSON.parse(this.userData)?.companyName,
      companycode: JSON.parse(this.userData)?.companyCode,
      email: JSON.parse(this.userData)?.email,
      type: JSON.parse(this.userData)?.type,
    };
    this.originalCutItems = [...this.cutListItems];
    this.switchService.getOptimizerCut(payload).subscribe({
      next: (res: any) => {
        this.optimizerCuts = Array.isArray(res) ? res : [];
        this.fullCutListItems = [...this.originalCutItems];
          this.filterDropdownUsingSavedValues();
          this.isCutListFull = this.optimizerCuts.length >= 2;
        },
    });
  }
 filterDropdownUsingSavedValues() {
  if (!this.optimizerCuts || this.optimizerCuts.length === 0) {
    this.cutListItems = [...this.fullCutListItems]; 
    return;
  }
  const savedCodes = this.optimizerCuts.map(x => x.code);

  this.cutListItems = this.fullCutListItems.filter(
    item => !savedCodes.includes(item.code)
  );
}

   
  deleteOptimizerCut() {
    const payload = {
      companycame: JSON.parse(this.userData)?.companyName,
      companycode: JSON.parse(this.userData)?.companyCode,
      email: JSON.parse(this.userData)?.email,
      type: JSON.parse(this.userData)?.type,
    };
    this.switchService.deleteOptimizerCut(payload).subscribe({
      next: () => {
        this.toastr.success('Optimizer Cut Deleted');
         this.optimizerCuts = [];
        this.getOptimizerCut();
        this.submittedModels = [];

      },
    });
  }

  get cl() {
    return this.cutListForm.controls;
  }

  
  get subPermissionArray() {
    return this.assignPermissionForm.get('subPermission') as FormArray;
  }

  onPermissionSelect(selected: any) {
    const value = (selected?.name || selected)?.toUpperCase() as PermissionName;
    const subPermissionArray = this.createPermissionForm.get('subPermission') as FormArray;
    // subPermissionArray.clear();
    if (!this.allPermissions[value]) return;
    this.allPermissions[value].forEach(feature => {
      subPermissionArray.push(
        this.fb.group({
          key: feature,
          label: this.formatLabel(feature),
          enabled: false
        })
      );
    });
  }
  
  formatLabel(value: string): string {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  get editsubPermissionArray(): FormArray {
    return this.editSubpermissionForm.get('subPermission') as FormArray;
  }

  editSubpermmissions(permission: any, content115: any) {
    this.selectedPermissionName = permission.permissionName;
    this.SubpermissionId = permission.id;
    this.editsubPermissionArray.clear();
    const assignedList = permission.subPermission
      ? permission.subPermission.split(',').map((p: string) => p.trim())
      : [];
    const fullList = this.allPermissions[permission?.permissionName as PermissionName] ?? [];

    fullList.forEach((sub: any) => {
      this.editsubPermissionArray.push(
        this.fb.group({
          label: [sub],
          enabled: [assignedList.includes(sub)]
        })
      );
    });
    this.modalService.open(content115, { size: 'lg' });
  }

  updateSubPermissions(modal: any,departmentIds?: number[]) {
    const permissionId = this.SubpermissionId;
    const selectedKeys = this.editsubPermissionArray.controls
      .filter(ctrl => ctrl.value.enabled === true)
      .map(ctrl => ctrl.value.label.trim());
    const subPermission = selectedKeys.join(',');
    this.switchService.updateSubPermission(permissionId, subPermission).subscribe({
      next: () => {
        this.toastr.success('SubPermissions updated successfully');
        this.getAllPermissions();
         const assignedRoleIds: number[] = Array.from(
          new Set(
            this.assignedRoleLst
              .map((dept: any) => Number(dept?.id))
              .filter((id: any) => !isNaN(id))
          )
        );
        this.assignedRoleIds = departmentIds;
        this.getAssignedDeptRolePermissions(this.subPermissionupdateId);
        this.refreshUserAccess();
        modal.close();
      }
    });
  }

  refreshUserAccess() {
    const email = JSON.parse(this.userData || '{}')?.email;
    if (!email) return;
    this.switchService.getUserAccess(email).subscribe({
      next: (res: any) => {
        const formatted: Record<string, boolean> = {};
        (res?.departments || []).forEach((dept: any) => {
          (dept?.roles || []).forEach((role: any) => {
            const perms = role?.permissions || {};
            Object.keys(perms).forEach(permissionName => {
              formatted[permissionName] = true;
              const subString = perms[permissionName];
              if (!subString) return;
              subString
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
                .forEach((sub: string) => {
                  formatted[`${permissionName}_${sub}`] = true;
                });
            });
          });
        });

        localStorage.setItem('userAccess', JSON.stringify(formatted));
      }
    });
  }



  hasPermission(key: string): boolean {
    return this.userPermissionSet.has(key);
  }



}