import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../shared/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup,FormBuilder, FormsModule, ReactiveFormsModule,Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [NgSelectModule,RouterModule, NgbModule, FormsModule,CommonModule,SharedModule,NgbDropdownModule,ReactiveFormsModule],
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
  isSubmitting: boolean = false;  modal:any;
  public campaignSubmitted = false; campaignList: any[] = [];
  public userList: any;
  userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];

  constructor(private modalService: NgbModal, public switchService: SwitherService,
    private offcanvasService: NgbOffcanvas,  private toastr: ToastrService, private fb: FormBuilder,private router: Router,
  ){
    super()
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCampaignData();
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
      campgnId: ['']
      
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
    console.log(payload)
    this.switchService.saveCampaignData(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.status === true) {
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
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
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
      queryParams: { campaignId: campaign.campgnId }
    });
  }
  
  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
}
