import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../shared/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatTableDataSource } from '@angular/material/table';

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
  userType: any = this.userData ? this.userData.type : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  campaignForm!: FormGroup; adoanAiRole: any;
  isSubmitting: boolean = false; modal: any;
  public campaignSubmitted = false; campaignList: any[] = [];
  public userList: any; newItem: string = ''; leaditems: { checked: boolean; label: string }[] = [];
  addMoreVisible: boolean = false; crmStageData: any; isAddStagesDisabled: boolean = false;
  newOptionName: string = ''; statusOptionsByStage: { [stageName: string]: any[] } = {};
  statusOptionsByStageforDisplay: any = {}; selectedStage: string = ''; checkboxStageOptions: any[] = [];
  anyChecked: any; stageLst: any; crmStatusData: any; showValidationError = false; showCheckboxError = false; showNameError = false;
  isStagesLoading: boolean = true; statusLst: any;  public leadCounts: { [campaignId: string]: number } = {};
  stageCounts: { [campaignId: string]: { [stage: string]: number } } = {}; campaignCount: any; totalLeadCount: any;
  fetchCrmLeadsList: any[] = [];topshowMore = false;showMore = true;
  matcardLst: any; topDisplayedCards: any;filteredUserList: any[] = [];
  userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];
  newItemColor: string = '#000000'; listNew: any;
  dataSource = new MatTableDataSource<any>();  campaignId!: string;selectedCampaignId:any;selectedCampgnId:any;

  displayedColumns: string[] = [
    'sourceFlag',
    'select',
    'slNo',
    'action',
    'name',
    'executive',
    'stage',
    'status',
    'followUpDate',
    'contact',
    'email',
  ];

  constructor(private modalService: NgbModal, public switchService: SwitherService,
    private offcanvasService: NgbOffcanvas, private toastr: ToastrService, private fb: FormBuilder, private router: Router,
        private route: ActivatedRoute
        
    
  ) {
    super()
    this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
  }
  toggleAddMore() {
    this.addMoreVisible = !this.addMoreVisible;
  }

  ngOnInit(): void {
    this.getCrmStages();
    this.getUsers();
    if(this.adoanAiRole == 'ADMIN'|| this.userType == 1){
      this.getCampaignData();
    }
    // this.getCampaignData();
    if(this.userType == 2){
      this.getCampaignSecific();
    }
    
    this.campaignList.forEach(campaign => {
      this.getLeadCountForCampaign(campaign.campgnId);
    });
    

    this.campaignForm = this.fb.group({
      campaignId: [0],
      campaignName: ['', [Validators.required, Validators.minLength(4)]],
      pipeline: ['', Validators.required],
      campaignPoc: [''],
      agents: [[]],
      campaignPriority: [''],
      leadDuplicacy: [''],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType],
      createdDate: new Date().toISOString(),
      campgnId: [''],

    });
    if (this.userType === 1) {
      this.campaignForm.patchValue({ campaignPoc: this.userEmail });
    }
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
      campaignPoc : this.userEmail,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
      agents: agents,
    };
    if (this.selectedCampgnId && this.selectedCampaignId) {
      payload.campgnId = this.selectedCampgnId;
      payload.campaignId = this.selectedCampaignId;
    }
    console.log(payload);
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
          this.getLeadCountForCampaign(res.campgnId)
          this.getCampaignData();
          this.selectedCampgnId = null;
          this.selectedCampaignId = null;
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
        // this.toastr.error(error.statusText || 'Something went wrong while fetching stages.');
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
                .filter(field => res[0][field])
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
            this.statusLst = Object.entries(this.statusOptionsByStageforDisplay)
              .filter(([stage]) => selectedStageNames.includes(stage))
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
          this.campaignCount = this.campaignList.length;
          this.campaignList.forEach(campaign => {
          this.getLeadCountForCampaign(campaign.campgnId);
      });
        } else {
          this.toastr.error("Unexpected response format.");
        }
      },
      error: (err) => {
        // this.toastr.error(err.statusText || "An error occurred while fetching data.");
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
        if(this.userType == 2){
        this.listNew.forEach((campaign:any) => {
          this.getLeadCountForCampaign(campaign.campgnId);
      });
      }
      },
      error: (err) => {
        // this.toastr.error(err.statusText || "An error occurred while fetching data.");
      }
    });
  }
  getUsers() {
   if (JSON.parse(this.userData).type == 2) {
      let cn = this.userCompanyName;
      let cc = this.userCompanyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
             this.filteredUserList = this.userList.filter(
              (user: any) => user.adonaiRole?.toUpperCase() !== 'ADMIN'
            );
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          // this.toastr.error(error.statusText);
        },
      })
    }
  }

  getAgentColor(name: string | null | undefined): string {
    if (!name || !name.trim()) {
      return this.userColors[0]; // fallback color (pick index 0 or any default)
    }
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
    this.getLeadCountForCampaign(campaign.campgnId);
    this.router.navigate(['/apps/crm/leads'], {
      queryParams: { campaignId: campaign.campgnId },
      state: { agents: campaign.agents }
    });
  }

  getLeadCountForCampaign(campaignId: string) {
    this.switchService.FetchLeadData(this.userEmail, campaignId).subscribe({
      next: (res: any) => {
        const executiveList = res.executiveList || [];
        const entryList = res.entryList || [];
        const combined = [...executiveList, ...entryList];
        this.leadCounts[campaignId] = executiveList.length + entryList.length;
        const stageMap: { [key: string]: number } = {};
        const count = combined.length;
        this.leadCounts[campaignId] = count;
        this.updateTotalLeadCount();
        combined.forEach(lead => {
          const stage = lead.stage || 'Unknown';
          stageMap[stage] = (stageMap[stage] || 0) + 1;
        });
        this.stageCounts[campaignId] = stageMap;
      },
      error: () => {
        this.leadCounts[campaignId] = 0;
      }
    });
  }
  updateTotalLeadCount() {
    this.totalLeadCount = Object.values(this.leadCounts).reduce((sum, count) => sum + count, 0);
  }


  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }

  get s() {
    return this.campaignForm.controls;
  }
  deleteCampaignById(data: any) {
    const campaign_Id = data.campgnId;
    if (confirm('Are you sure you want to delete this Campaign?')) {
      this.switchService.deleteCampaign(campaign_Id).subscribe({
        next: (res: any) => {
          this.toastr.success('Campaign Deleted successfully');
          this.getCampaignData();
        },
        error: (error) => {
          this.toastr.error("Failed to delete campaign.");
        }
      });
    }
  }
  openEditModal(content: any, campgnId: string) {
  // this.selectedCampaignId = campgnId;  
  console.log('Editing campaign ID:', this.selectedCampaignId);

  const campaignData = this.campaignList.find(
    (item: any) => item.campgnId === campgnId
  );
    console.log('campaign data',campaignData)
  if (campaignData) {
    this.selectedCampgnId = campaignData.campgnId;   // short ID
    this.selectedCampaignId = campaignData.campaignId; // long ID

    console.log('Editing campgnId:', this.selectedCampgnId);
    console.log('Editing campaignId:', this.selectedCampaignId);
    this.campaignForm.patchValue({
      campaignName: campaignData.campaignName,
      pipeline: campaignData.pipeline,
      campaignPoc: campaignData.campaignPoc,
      agents: (Array.isArray(campaignData.agents)
             ? campaignData.agents
             : campaignData.agents?.split(',') ?? []),
      campaignPriority: campaignData.campaignPriority,
      leadDuplicacy: campaignData.leadDuplicacy
    });
  }
  this.open(content);
  }
  openCreateModal(content: any) {
  // Clear previously selected campaign IDs
  this.selectedCampgnId = null;
  this.selectedCampaignId = null;

  // Reset the form completely
  this.campaignForm.reset();

  // Open the modal using your existing open method
  this.open(content);
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


}
