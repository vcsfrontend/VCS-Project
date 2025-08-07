import { Component, ViewChild , TemplateRef} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormGroup,FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas ,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModuleModule } from '../../../material-module/material-module.module';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,SharedModule,NgSelectModule,FormsModule,ReactiveFormsModule,MatTooltipModule,MaterialModuleModule],
  providers:[{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent extends BaseComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: any = this.userData ? this.userData.type : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  displayedColumns: string[] = [ 'slNo','Appointment','Date','Description','Duration','Current','assigned'];
  appointmentDataSource = new MatTableDataSource<any>();
  campaignForm! : FormGroup; appointmentData: any[] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  availabilityForm !: FormGroup; leadId :any; appointmentForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('newAppointmentModal') newAppointmentModal!: TemplateRef<any>;
  constructor(private modalService: NgbModal,private fb: FormBuilder,
     public switchService: SwitherService, private toastr: ToastrService,) {
      super()
  }
  ngOnInit() {
    this.availabilityForm = this.fb.group({
      duration: ['30'],
      ...this.createWeekControls()
    });
    this.appointmentForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      companyCode: this.userCompanyCode,
      emial: this.userEmail,
      type: this.userType,
    });
  }
  
 calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  selectable: false,
  editable: false,
  navLinks: false,
  eventDisplay: 'block',
  events: [
    {
      title: `Appointment #47 • Demo Booking • mahima@designadonai.com`,
      start: '2025-08-06T12:21:00',
      extendedProps: {
        appointmentId: 47,
        appointmenType: 'Demo Booking',
        description: 'demo',
        duration: '30 mins',
        currentUser: 'sriharshini@designadonai.com',
        assignedDesigner: 'mahima@designadonai.com'
      }
    }
  ]
};

  onDateClick(arg: any) {
    alert('Date clicked: ' + arg.dateStr);
  }

  onEventClick(arg: any) {
    alert('Event clicked: ' + arg.event.title);
  }

  renderEventContent(arg: any) {
    return { domNodes: [] };
  }
  open(content7: any) {
    this.modalService.open(content7, { centered: true });
  }
  openRight(content1: any) {
    this.modalService.open(content1, { centered: true });
  }

  createWeekControls(): { [key: string]: FormControl } {
  const controls: { [key: string]: FormControl } = {};
  for (let i = 0; i < 5; i++) {
    controls['start_' + i] = new FormControl('09:00');
    controls['end_' + i] = new FormControl('03:00');
  }
  return controls;
  }

  submitAvailability() {
    if (this.availabilityForm.valid) {
      console.log(this.availabilityForm.value);
      // Add your logic here
    }
  }

  ngAfterViewInit() {
    this.appointmentDataSource.paginator = this.paginator;
  }
  getSNo(index: number): number {
    if (
      this.paginator &&
      this.paginator.pageIndex !== undefined &&
      this.paginator.pageSize !== undefined
    ) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }

  getAppointment(currentModalRef: NgbModalRef) {
  const payload = {
    ...this.appointmentForm.value,
    startDate: this.formatDateOnly(this.appointmentForm.get('startDate')?.value),
    endDate: this.formatDateOnly(this.appointmentForm.get('endDate')?.value),
    companyCode: this.userCompanyCode,
    email: this.userEmail,
    type: this.userType,
  };

  this.switchService.fetchAppointment(payload).subscribe({
    next: (res) => {
      this.appointmentData = res || [];
      currentModalRef.close();

      // Open the new modal with the fetched data
      this.modalService.open(this.newAppointmentModal, {
        size: 'lg',
        centered: true,
      });
    },
    error: () => {
      this.toastr.error('Failed to fetch appointment');
    }
  });
}

  openFirstModal(template: TemplateRef<any>) {
    const modalRef = this.modalService.open(template, { size: 'lg', centered: true });
  }

  formatDateOnly(dateTimeString: string): string {
    return dateTimeString ? dateTimeString.split('T')[0] : '';
  }

}
