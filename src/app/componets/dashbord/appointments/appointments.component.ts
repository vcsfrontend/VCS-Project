import { Component, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormGroup,FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../shared/base/base.component';
import { NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
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
  campaignForm! : FormGroup;
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  availabilityForm !: FormGroup; leadId :any; appointmentForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
    events: [
      {
        title: 'Client Meeting - John',
        start: '2025-08-05T10:00:00',
        end: '2025-08-05T11:00:00'
      },
      {
        title: 'Team Sync',
        start: '2025-08-07T09:00:00',
        end: '2025-08-07T09:30:00'
      },
      {
        title: 'Project Review',
        start: '2025-08-10T15:00:00',
        end: '2025-08-10T16:00:00'
      },
      {
        title: 'On-site Visit',
        start: '2025-08-11',
        allDay: true
      },
      {
        title: 'Doctor Appointment',
        start: '2025-08-15T08:30:00',
        end: '2025-08-15T09:00:00'
      },
      {
        title: 'Interview with Candidate',
        start: '2025-08-18T14:00:00',
        end: '2025-08-18T14:45:00'
      },
      {
        title: 'Release Planning',
        start: '2025-08-20T11:00:00',
        end: '2025-08-20T12:30:00'
      },
      {
        title: 'Annual Leave - Ram',
        start: '2025-08-21',
        end: '2025-08-23',
        allDay: true
      },
      {
        title: 'Birthday Celebration - Priya',
        start: '2025-08-25T17:00:00',
        end: '2025-08-25T18:00:00'
      }
    ],
    selectable: true,
    dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventContent: this.renderEventContent.bind(this)
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

  appointmentData: any;

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

  getAppointment(modal:any) {
    const payload = this.appointmentForm.value;
    console.log(payload)
    // this.switchService.fetchAppointment(payload).subscribe({
    //   next: (res) => {
    //     this.appointmentData = res;
    //     this.appointmentDataSource = res;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching appointment:', err);
    //     this.toastr.error('Failed to fetch appointment');
    //   }
    // });
  }



  
}
