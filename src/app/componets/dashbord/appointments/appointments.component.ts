import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/common/sharedmodule';


@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FullCalendarModule,SharedModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss'
})
export class AppointmentsComponent {
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
      { title: 'Meeting', date: '2025-07-09T10:30:00' },
      { title: 'Lunch', date: '2025-07-09T12:00:00' },
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
}
