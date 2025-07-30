import { Component } from '@angular/core';
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

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,SharedModule,NgSelectModule,FormsModule,ReactiveFormsModule,MatTooltipModule],
  providers:[{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent extends BaseComponent {
  campaignForm! : FormGroup;
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  availabilityForm !: FormGroup; leadId :any;
  constructor(private modalService: NgbModal,private fb: FormBuilder,
     public switchService: SwitherService, private toastr: ToastrService,) {
      super()
     
  }
  ngOnInit() {
  this.availabilityForm = this.fb.group({
    duration: ['30'],
    ...this.createWeekControls()
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
      { title: 'All-day Event', date: '2025-07-01' },
      { title: 'Demo', date: '2025-07-09T10:30:00' },
      { title: 'Design Doubts', date: '2025-07-09T12:00:00' },
      { title: 'Birthday', date: '2025-07-13T07:00:00' }
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

getAppointment() {
  const lead_id = this.leadId;
  console.log('Fetching appointment for lead ID:', lead_id);

  this.switchService.fetchAppointment(lead_id).subscribe({
    next: (res) => {
      this.appointmentData = res; // store the appointment data
      this.toastr.success('Appointment fetched successfully');
    },
    error: (err) => {
      console.error('Failed to fetch appointment', err);
      this.toastr.error('Failed to fetch appointment');
    }
  });
}

  
}
