import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../shared/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [NgSelectModule, RouterModule, NgbModule, FormsModule, CommonModule, SharedModule, NgbDropdownModule, ReactiveFormsModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent extends BaseComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  campaignForm!: FormGroup;
  isSubmitting: boolean = false; modal: any;
  public campaignSubmitted = false; campaignList: any[] = [];
  public userList: any; newItem: string = ''; leaditems: { checked: boolean; label: string }[] = [];
  addMoreVisible: boolean = false; crmStageData: any; isAddStagesDisabled: boolean = false;
  newOptionName: string = ''; statusOptionsByStage: { [stageName: string]: any[] } = {};
  statusOptionsByStageforDisplay: any = {}; selectedStage: string = ''; checkboxStageOptions: any[] = [];
  anyChecked: any; stageLst: any; crmStatusData: any; showValidationError = false; showCheckboxError = false; showNameError = false;
  isStagesLoading: boolean = true; statusLst: any;
  userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];
  newItemColor: string = '#000000'; listNew: any;
  crmStaticStages = [
    { name: 'In Progress Leads', checked: false, isDefault: true, isCustom: false, color: '#007bff' },
    { name: 'Lost Leads', checked: false, isDefault: true, isCustom: false, color: '#dc3545' },
    { name: 'Converted Leads', checked: false, isDefault: true, isCustom: false, color: '#28a745' }
  ];


  constructor(private modalService: NgbModal, public switchService: SwitherService,
    private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private fb: FormBuilder, private router: Router,
  ) {
    super()
  }
  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible;
  }

  ngOnInit(): void {
    this.getCrmStages();
    this.getUsers();
    this.getCampaignData();
    this.getCampaignSecific();
    this.campaignForm = this.fb.group({
      campaignId: [0],
      campaignName: ['', Validators.required],
      pipeline: ['', Validators.required],
      campaignPoc: [''],
      agents: [['']],
      campaignPriority: [''],
      leadDuplicacy: [''],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
      createdDate: new Date().toISOString(),
      campgnId: [''],

    });
  }

  submitCampaign(modal: any) {
    this.campaignSubmitted = true;
    if (this.campaignForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.isSubmitting = true;
    let agents = this.campaignForm.get('agents')?.value;
    if (Array.isArray(agents)) {
      agents = agents.join(',');
    }
    let payload = {
      ...this.campaignForm.value,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
      agents: agents,
    };
    this.switchService.saveCampaignData(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.status === true || res.campaignId || res.createdDate) {
          const name = res.campaignName;
          this.toastr.success(`${name} created successfully!`);
          this.modalService.dismissAll(modal);
          this.campaignForm.reset();
          this.campaignForm.patchValue({
            companyName: this.userCompanyName,
            companyCode: this.userCompanyCode,
            email: this.userEmail,
            type: this.userType,
          });
          this.campaignSubmitted = false;
          this.getCampaignData();
        } else {
          this.toastr.error(res.message || "Something went wrong while creating the campaign.");
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
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
        this.toastr.error(error.statusText || 'Something went wrong while fetching stages.');
      },
    });
  }

  getCrmStatus(): void {
    let completedRequests = 0;
    for (let i = 0; i < this.stageLst.length; i++) {
      const stageName = this.stageLst[i].stageName;
      const payload = {
        email: this.userEmail,
        companyCode: this.userCompanyCode,
        type: this.userType,
        stage: stageName,
      };
      const fields = Array.from({ length: 25 }, (_, i) => `f${i + 1}`);
      this.switchService.CrmStatus(payload).subscribe({
        next: (res: any) => {
          if (res.length == 1) {
            const options = Array.isArray(res)
              ? fields
                .filter(field => res[0][field]) // skip empty values
                .map(field => ({
                  name: res[0][field],
                  checked: false,
                  isCustom: false
                }))
              : [];
            this.statusOptionsByStageforDisplay[stageName] = options;
          }
        },
        error: (error) => {
          const errorMessage = error.statusText || 'Something went wrong while fetching stages.';
          this.toastr.error(errorMessage);
          this.statusOptionsByStageforDisplay[stageName] = [];
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
          }
        }

      });
    }
  }

  

  getCampaignData() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayCampaignData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.campaignList = res;
        } else {
          this.toastr.error("Unexpected response format.");
        }
      },
      error: (err) => {
        this.toastr.error(err.statusText || "An error occurred while fetching data.");
      }
    });
  }
  getCampaignSecific() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.sepecificCampaign(payload).subscribe({
      next: (res: any) => {
        this.listNew = res;
      },
      error: (err) => {
        this.toastr.error(err.statusText || "An error occurred while fetching data.");
      }
    });
  }
  getUsers() {
    if (this.userData.type == 2) {
      let cn = this.userCompanyName;
      let cc = this.userCompanyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
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

  getAgentColor(name: string): string {
    const index = Math.abs(this.hashString(name.trim())) % this.userColors.length;
    return this.userColors[index];
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  viewCampaignLeads(campaign: any) {
    this.router.navigate(['/apps/crm/leads'], {
      queryParams: { 
        campaignId: campaign.campgnId ,
        agents: campaign.agents
      }
    });
  }

  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
  // step = 1;

  // nextStep() {
  //   if (this.step < 3) {
  //     this.step++;
  //   }
  // }


  // prevStep() {
  //   if (this.step > 1) this.step--;
  // }



  addLeadItem() {
    const newItemName = this.newItem?.trim();
    if (!newItemName) {
      this.toastr.error('Please enter a lead Stage.');
      return;
    }

    const itemExists = this.crmStaticStages.some(
      (plan) => plan.name.toLowerCase() === newItemName.toLowerCase()
    );

    if (!itemExists) {
      this.crmStaticStages.push({
        name: newItemName,
        checked: false,
        isDefault: false,
        isCustom: true,
        color: this.newItemColor || '#000000'  // Assign the selected or default color
      });
      this.toastr.info('Item added Successfully');
    } else {
      this.toastr.warning('This item already exists!');
    }

    this.newItem = '';
    this.newItemColor = '#000000'; // Reset color picker
  }

  deleteLeadItem(index: number) {
    const deleted = this.crmStaticStages[index]?.name;
    this.crmStaticStages.splice(index, 1);
    this.toastr.error(`'${deleted}' has been deleted`);

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
    if (!this.statusOptionsByStage[this.selectedStage]) {
      this.statusOptionsByStage[this.selectedStage] = [];
    }
    this.checkboxStageOptions = this.statusOptionsByStage[this.selectedStage];
    if (this.statusOptionsByStageforDisplay[this.selectedStage]) {
      this.checkboxStageOptions = this.statusOptionsByStage[this.selectedStage].map(item => {
        const existsInSelected = this.statusOptionsByStageforDisplay[this.selectedStage].some((selected: { name: any; }) => selected.name === item.name);
        return { ...item, checked: existsInSelected };
      });
      this.anyChecked = true;
    }
    else {
      this.anyChecked = false;
    }

    // this.anyChecked = this.checkboxStageOptions.some(
    //   (item) => {console.log(item.checked);return item.checked === true}
    // );


  }

}
