import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crm-settings',
  standalone: true,
  imports: [NgSelectModule,FormsModule,CommonModule,SharedModule],
  templateUrl: './crm-settings.component.html',
  styleUrl: './crm-settings.component.scss'
})
export class CrmSettingsComponent {
  userData: any;stageLst: any;newItem: string = ''; statusLst :any;
  isStage: boolean = false;showStages: boolean = false;
  addMoreVisible: boolean = false; // Flag to toggle visibility
  constructor(private offcanvasService: NgbOffcanvas,public switchService: SwitherService,private toastr: ToastrService,){
    this.userData = localStorage.getItem('userDetails');

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
    this.getStatus();this.getStages();
    this.saveData = {
      stageId: 0,
      companyName: JSON.parse(this.userData).companyName,
      companyCode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
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
      updatedBy: JSON.parse(this.userData).username,
      updatedTime: "",
      stageActivity: "YES",
      type: JSON.parse(this.userData).type
    };
    this.saveStageData = {
      stageId: 0,
      companyName: JSON.parse(this.userData).companyName,
      companyCode: JSON.parse(this.userData).companyCode,
      email: JSON.parse(this.userData).email,
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
      updatedBy: JSON.parse(this.userData).username,
      updatedTime: "",
      stageActivity: "YES",
      type: JSON.parse(this.userData).type
    };
  }
  dynamicFields: { value: string;}[] = [];
  initializeDynamicFields() {
    this.dynamicFields = [];
    for (let i = 1; i <= 30; i++) {
      const fieldName = `f${i}`;
      if (this.stageLst[fieldName]) {
        this.dynamicFields.push({
          value: this.stageLst[fieldName],
        });
      }
    }
    this.dynamicFields.length != 0 ? this.isStage = true : false;
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
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.GetCrmStatus(payload).subscribe({
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
          this.getStages();
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }
  getStages() {
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.GetCrmStages(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.stageLst = res;
          console.log(res)
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
}
