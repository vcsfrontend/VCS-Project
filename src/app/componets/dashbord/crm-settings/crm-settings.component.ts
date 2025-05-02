import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';

@Component({
  selector: 'app-crm-settings',
  standalone: true,
  imports: [NgSelectModule,FormsModule,CommonModule,SharedModule],
  templateUrl: './crm-settings.component.html',
  styleUrl: './crm-settings.component.scss'
})
export class CrmSettingsComponent {
  constructor(private offcanvasService: NgbOffcanvas,){

  }
  leaditems: { checked: boolean;label: string }[] = [];
  leadStatusitems : {checked : boolean; label : string}[] = [];
  selectedType: string = '';
  leadStages = [
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
    this.leaditems.push({ checked: false,label: '' });
  }
  deleteLeadItem(index: number) {
    this.leaditems.splice(index, 1);
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
}
