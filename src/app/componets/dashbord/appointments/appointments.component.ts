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
  appointmentsList : any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('newAppointmentModal') newAppointmentModal!: TemplateRef<any>;userList:any;
  constructor(private modalService: NgbModal,private fb: FormBuilder,
     public switchService: SwitherService, private toastr: ToastrService,) {
      super()
  }
  ngOnInit() {
    this.getUsers();
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
  events: [ /* your events */ ],
  dayCellContent: this.renderDayCellContent.bind(this) // 👈 USE THIS
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
  setTimeout(() => {
    const buttons = document.querySelectorAll('.calendar-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (event: any) => {
        const date = event.target.getAttribute('data-date');
        this.getAppointment(date);
      });
    });
  }, 500);

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

  getAppointment(date: string) {
  const payload = {
    ...this.appointmentForm.value,
    startDate: this.formatDateOnly(date),
    endDate: this.formatDateOnly(date),
    companyCode: this.userCompanyCode,
    email: this.userEmail,
    type: this.userType,
  };

  this.switchService.fetchAppointment(payload).subscribe({
    next: (res) => {
      this.appointmentData = res || [];
      this.appointmentsList = res;
      this.modalService.open(this.newAppointmentModal, {
        backdrop: 'static',
      keyboard: false,
      scrollable: true,
      centered: true,
      size: 'lg',
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
 
  renderDayCellContent(args: any): { html: string } {
  const dateStr = args.date.toISOString().split('T')[0]; 
  return {
    html: `
      <div class="fc-day-number">${args.dayNumberText}</div>
      <button 
        class="btn btn-sm btn-primary calendar-btn" 
        data-date="${dateStr}" 
        style="margin-top: 4px; font-size: 10px; padding: 10px 10px;">
        view Demo
      </button>
    `
  };
  }
  getUsers() {
    let cn = this.userCompanyName;
    let cc = this.userCompanyCode;
    this.switchService.cmpnyUsers(cn, cc).subscribe({
      next: (res: any) => {
        if (res) {
          this.userList = res;
          console.log('userlst',this.userList);
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

}
