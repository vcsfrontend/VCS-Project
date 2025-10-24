import { Component, ViewChild , TemplateRef} from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { FormGroup,FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { NgbDropdownModule, NgbModal, NgbModule, NgbOffcanvas ,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SwitherService } from '../../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,SharedModule,NgSelectModule,FormsModule,ReactiveFormsModule,MatTooltipModule,MaterialModuleModule,NgbTooltipModule,
    OverlayscrollbarsModule
  ],
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
  adoanAiRole : string = this.userData ? this.userData.adoanAiRole : '';

  userType: any = this.userData ? this.userData.type : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  displayedColumns: string[] = [ 'slNo','Appointment','Date','Description','Duration','Current','assigned'];
  appointmentDataSource = new MatTableDataSource<any>();
  campaignForm! : FormGroup; appointmentData: any[] = [];
  weekdays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  availabilityForm !: FormGroup; leadId :any; appointmentForm!: FormGroup;
  appointmentsList : any;appointments: any[] = [];
  monthlyAppointments: any[] = []; 
  editMode = false; saving = false;                 
  selectedAppointment: any = null;crmRole : any;
  appointmentDates: Set<string> = new Set();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('appointment1') appointment1!: TemplateRef<any>;
  @ViewChild('newAppointmentModal') newAppointmentModal!: TemplateRef<any>;userList:any;
  typeColors: { [key: string]: string } = {
    "Designing Doubts": 'btn-warning',  
    "Demo Booking": 'btn-info',   
    "Follow Up": 'btn-warning',  
    "Interview": 'btn-info',   
    "Default": 'btn-secondary'
  };
  constructor(private modalService: NgbModal,private fb: FormBuilder,
     public switchService: SwitherService, private toastr: ToastrService,) {
      
      super()
      this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;

  }
  ngOnInit() {
    this.getUsers();
    this.availabilityForm = this.fb.group({
      duration: ['30'],
      ...this.createWeekControls()
    });
    this.appointmentForm = this.fb.group({
        appointmenType: [''],
        date: [''],
        description: [''],
        duration: [''],
        currentUser: [this.userEmail],
        assignedDesigner:[''],
        leadEntry: this.fb.group({
          leadId: [0],
          name: [''],
          companyName: [''],
          executive: [''],
          products: [''],
          stage: [''],
          leadSource: [''],
          zipCode: [''],
          followUpDate: [''],
          state: [''],
          city: [''],
          address: [''],
          contact: [''],
          email: [''],
          currentStage: [''],
          updatedBy: [''],
          updatedTime: [''],
          entryBy: [''],
          campaignId: [''],
          companyCode: [''],
          individualEmail: [''],
          type: 0
        }),
        createdTime:['']
    });
    // this.getAppointment();
  }
  
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    datesSet: () => this.getAppointment(),
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
      // console.log(this.availabilityForm.value);
      // Add your logic here
    }
  }

  ngAfterViewInit() {
  const calendarEl = document.querySelector('.fc');
  if (calendarEl) {
    calendarEl.addEventListener('click', (event: any) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('calendar-btn')) {
        const date = target.getAttribute('data-date');
        const type = target.getAttribute('data-type'); // or data-index if using index
        if (date && type) {
          this.showAppointmentsByType(date, type); // make sure this function exists
        }
      }
    });
  }
  }

  showAppointmentsByType(date: string, type: string) {
    this.appointmentData = this.monthlyAppointments.filter(
      a => this.formatDateOnly(a.date) === date && a.appointmenType === type
    );

    if (this.appointmentData.length > 0) {
      this.modalService.open(this.newAppointmentModal, {
        backdrop: 'static',
        keyboard: false,
        scrollable: true,
        centered: true,
        size: 'lg',
      });
    } else {
      this.toastr.info('No appointments found');
    }
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

  onDatesSet(arg: any) {
  const startDate = this.formatDateOnly(arg.start);
  const endDate = this.formatDateOnly(arg.end);

  this.switchService.fetchAppointment({
    // ...this.appointmentForm.value,
    startDate,
    endDate,
    companyCode: this.userCompanyCode,
    email: this.userEmail,
    type: this.userType,
  }).subscribe({
    next: (res) => {
      this.appointments = res || [];
    },
    error: () => this.toastr.error('Failed to fetch month appointments')
  });
  }


  // getAppointment(date: string) {
  // const payload = {
  //   ...this.appointmentForm.value,
  //   startDate: this.formatDateOnly(date),
  //   endDate: this.formatDateOnly(date),
  //   companyCode: this.userCompanyCode,
  //   email: this.userEmail,
  //   type: this.userType,
  // };

  // this.switchService.fetchAppointment(payload).subscribe({
  //   next: (res) => {
  //     this.appointmentData = res || [];
  //     if (this.appointmentData.length > 0) {
  //       this.modalService.open(this.newAppointmentModal, {
  //         backdrop: 'static',
  //         keyboard: false,
  //         scrollable: true,
  //         centered: true,
  //         size: 'lg',
  //       });
  //     } else {
  //       this.toastr.info('No appointments found for this date');
  //     }
  //   },
  //   error: () => {
  //     this.toastr.error('Failed to fetch appointment');
  //   }
  // });
  // }
  openFirstModal(template: TemplateRef<any>) {
    const modalRef = this.modalService.open(template, { size: 'lg', centered: true });
  }

  formatDateOnly(dateInput: string | Date): string {
  let date: Date;

  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
  }

 
  getUsers() {
    let cn = this.userCompanyName;
    let cc = this.userCompanyCode;
    this.switchService.cmpnyUsers(cn, cc).subscribe({
      next: (res: any) => {
        if (res) {
          this.userList = res;
        } else {
          this.toastr.error(res.message, 'signup',);
        }
      },
      error: (error) => {
        // this.toastr.error(error.statusText);
      },
    })
  }
 getDesignerColor(emailOrName: string): string {
  const user = this.userList.find(
    (u:any) => u.email?.trim().toLowerCase() === emailOrName.trim().toLowerCase()
  );
  if (user?.color) return user.color;

  // fallback color based on hash of name/email
  return this.getDefaultColor(emailOrName);
  }
  getDesignerLetter(emailOrName: string): string {
  // Prefer user name first letter if available
  const user = this.userList.find(
    (u:any) => u.email?.trim().toLowerCase() === emailOrName.trim().toLowerCase()
  );
  const nameSource = user?.name || emailOrName;
  return nameSource.trim().charAt(0).toUpperCase();
}

private getDefaultColor(str: string): string {
  // deterministic pastel colors
  const colors = ['#F39C12', '#3498DB', '#9B59B6', '#E67E22', '#1ABC9C'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

  getAppointment() {
  const startOfMonth = this.formatDateOnly(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const endOfMonth = this.formatDateOnly(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const isAdmin = this.adoanAiRole === 'ADMIN' || this.crmRole === 'ADMIN';

  const payload = {
    // ...this.appointmentForm.value,
    startDate: startOfMonth,
    endDate: endOfMonth,
    companyCode: this.userCompanyCode,
    email: this.userEmail,
    type: this.userType,
    currentUser : isAdmin ? 'from_admin' : this.userEmail
  };

  this.switchService.fetchAppointment(payload).subscribe({
    next: (res) => {
      this.selectedAppointment = res;
      this.appointmentData = res || [];
      this.monthlyAppointments = res || [];
      this.appointmentDates = new Set(
        this.appointmentData.map((item: any) => this.formatDateOnly(item.date))
      );

      this.calendarOptions = {
        ...this.calendarOptions,
        dayCellContent: this.renderDayCellContent.bind(this)
      };
    },
    error: () => this.toastr.error('Failed to fetch appointments')
  });
  }

  renderDayCellContent(args: any): { html: string } {
  const dateStr = `${args.date.getFullYear()}-${('0' + (args.date.getMonth() + 1)).slice(-2)}-${('0' + args.date.getDate()).slice(-2)}`;

  const appointmentsForDay = this.monthlyAppointments?.filter(
    a => this.formatDateOnly(a.date) === dateStr
  ) || [];

  if (appointmentsForDay.length) {
    // Group by appointmentType and count
    const typeCounts: { [key: string]: number } = {};
    appointmentsForDay.forEach(a => {
      const type = a.appointmenType;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Build buttons
    const buttonsHtml = Object.keys(typeCounts).map(type => {
      const count = typeCounts[type];
      const btnClass = this.typeColors[type] || this.typeColors['Default'];

      return `
        <button
          class="btn btn-sm ${btnClass} calendar-btn"
          data-date="${dateStr}"
          data-type="${type}"
          style="margin: 2px 0; font-size: 10px; padding: 4px 6px; display: block; width: 100%; height: 25px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${type} (${count})
        </button>
      `;
    }).join('');

    return {
      html: `
        <div class="fc-day-number">${args.dayNumberText}</div>
        ${buttonsHtml}
      `
    };
  }

  return { html: `<div class="fc-day-number">${args.dayNumberText}</div>` };
}


  
  openEditModal(appointmentObj: any) {
    this.editMode = true;
    this.selectedAppointment = appointmentObj;

    this.appointmentForm.patchValue({
      appointmentId: appointmentObj.appointmentId ?? appointmentObj.id ?? null,
      appointmenType: appointmentObj.appointmenType,
      date: this.toDatetimeLocalInputString(appointmentObj.date),
      description: appointmentObj.description,
      duration: appointmentObj.duration,
      assignedDesigner: appointmentObj.assignedDesigner,
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
    });
    this.modalService.dismissAll();
    this.modalService.open(this.appointment1, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    });
  }
  toDatetimeLocalInputString(dateLike: any): string {
    const d = new Date(dateLike);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  toIsoString(datetimeLocal: string): string {
    return new Date(datetimeLocal).toISOString();
  }
  onSubmit(modal: any) {
  if (this.appointmentForm.invalid) return;

  let payload: any;

  if (this.editMode && this.selectedAppointment) {
     payload = { ...this.selectedAppointment };
    payload.appointmenType = this.appointmentForm.value.appointmenType;
    payload.date = this.appointmentForm.value.date;
    payload.description = this.appointmentForm.value.description;
    payload.duration = this.appointmentForm.value.duration;
    payload.assignedDesigner = this.appointmentForm.value.assignedDesigner;
    payload.leadEntry = this.selectedAppointment.leadEntry;
  } else {
    payload = this.appointmentForm.value;
  }
  this.switchService.saveAppointment(payload).subscribe({
    next: (res) => {
      this.toastr.success(this.editMode ? 'Appointment updated' : 'Appointment created');
      modal.close();
      this.getAppointment();
    },
    error: () => this.toastr.error('Failed to save appointment'),
  });
}
  getPriorityBadgeBorder(appointmenType: string): string {
    switch (appointmenType) {
      case 'Designing Doubts':
        return 'border border-warning';
      case 'Demo Booking':
        return 'border border-info';
      case 'medium':
        return 'border border-info';
      case 'low':
        return 'border border-success';
      default:
        return 'border border-secondary';
    }
  }
 getPriorityIconColor(appointmenType: string): string {
    switch (appointmenType) {
      case 'Designing Doubts':
        return 'text-warning';
      case 'Demo Booking':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  }

  getAgentColor(agent: string): string {
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];
    const index = agent.trim().charCodeAt(0) % colors.length;
    return colors[index];
  }
 getTaskColor(task: any): string {
  if (!task.deadline) return 'btn-secondary-transparent';

  const deadline = new Date(task.deadline);   // assuming API gives a deadline datetime
  const now = new Date();
  const diffMinutes = (deadline.getTime() - now.getTime()) / (1000 * 60);
  if (diffMinutes <= 0) {
    return 'btn-danger-transparent';
  }

  if (diffMinutes <= 30) {
    return 'btn-warning-transparent';
  }
  return 'btn-success-transparent';
}
 formatMobileNumber(mobile: any): string {
    if (!mobile) return "";
    return Number(mobile).toFixed(0); // Convert to normal number
  }

}
