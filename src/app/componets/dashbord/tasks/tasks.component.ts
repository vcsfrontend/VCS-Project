import { Component } from '@angular/core';
import flatpickr from 'flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule,NgbNavModule,NgbModal, NgbModalConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule, NgbNavModule, NgbDropdownModule, FlatpickrModule, FormsModule, ReactiveFormsModule],
  providers: [NgbModalConfig, NgbModal, FlatpickrDefaults],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
modal: any;
  constructor(
    private modalService: NgbModal,
  ) {
  }
  open(content:any) {
    this.modalService.open(content,{ centered: true });
  }
  flatpickrOptions: any = {
    inline: true,
  };
  ngOnInit(): void {
    // this.flatpickrOptions = {
    //   enableTime: true,
    //   noCalendar: true,
    //   dateFormat: 'H:i',
  
    // };
    // flatpickr('#addignedDate', this.flatpickrOptions);
}
}
