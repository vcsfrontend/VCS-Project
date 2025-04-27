import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import {NgbDropdownModule, NgbModal, NgbModalConfig, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseComponent } from '../../../shared/base/base.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/common/sharedmodule';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [NgSelectModule,RouterModule, NgbModule, FormsModule,CommonModule,SharedModule,NgbDropdownModule,ReactiveFormsModule],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent extends BaseComponent {
constructor(config: NgbModalConfig, private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,  private toastr: ToastrService, private fb: FormBuilder,private router: Router,
  ){
    super()
  }
  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
}
