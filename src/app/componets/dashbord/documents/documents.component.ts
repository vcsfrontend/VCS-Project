import { Component ,} from '@angular/core';
import flatpickr from 'flatpickr';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule,NgbNavModule,NgbModal, NgbModalConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,NgbNavModule,NgbDropdownModule,FlatpickrModule,
    FormsModule,ReactiveFormsModule,CommonModule],
  providers: [NgbModalConfig, NgbModal,FlatpickrDefaults],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
modal: any;
  constructor(
		// config: NgbModalConfig,
		private modalService: NgbModal,
	) {
		// customize default values of modals used by this component tree
		// config.backdrop = 'static';
		// config.keyboard = false;
	}
  open(content:any) {
		this.modalService.open(content,{ centered: true });
	}
  flatpickrOptions: any = {
    inline: true,
  };
  ngOnInit(): void {
    this.flatpickrOptions = {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
  
    };
    flatpickr('#addignedDate', this.flatpickrOptions);
}

products = [
    { name: 'Floor Plan', image: '/assets/images/media/media-54.jpg' },
    { name: 'Another Plan', image: '/assets/images/media/media-55.jpg' },
  ];

  selectedImage: string = '';

  openModal(content: any, imageUrl: string) {
    this.selectedImage = imageUrl;
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  folders = [
    {
      name: 'Contracts',
      owner: 'Robert Wilson',
      items: [
        { name: 'Floor Plan', image: '/assets/images/media/media-54.jpg' },
        { name: 'Agreement', image: '/assets/images/media/media-55.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    },
    {
      name: 'Contracts',
      owner: 'Robert Wilson',
      items: [
        { name: 'Floor Plan', image: '/assets/images/media/media-54.jpg' },
        { name: 'Agreement', image: '/assets/images/media/media-55.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    },
    {
      name: 'Contracts',
      owner: 'Robert Wilson',
      items: [
        { name: 'Floor Plan', image: '/assets/images/media/media-54.jpg' },
        { name: 'Agreement', image: '/assets/images/media/media-55.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    },
    {
      name: 'Invoices',
      owner: 'John Doe',
      items: [
        { name: 'Invoice 01', image: '/assets/images/media/media-56.jpg' },
        { name: 'Invoice 02', image: '/assets/images/media/media-57.jpg' },
      ]
    }
  ];

  selectedFolder: any = null;
  openFolder(folder: any) {
    this.selectedFolder = folder;
  }
  task = {
    id: 1,
    taskName: 'Email follow-up with client',
    priority: 'Overdue',
    assignedTo: 'Bala',
    avatar: 'assets/images/avatar.png',
    deadline: new Date('2025-10-08') // yesterday for demo
  };

  // ✅ Priority Badge Colors
  getPriorityBadge(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'overdue':
        return 'bg-danger text-white';
      case 'medium':
        return 'bg-warning text-dark';
      case 'low':
        return 'bg-success text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  // ✅ Deadline Color Based on Date
  getTaskBgColor(task: any): string {
    if (!task.deadline) return 'bg-secondary text-white';
    const today = new Date();
    const deadline = new Date(task.deadline);
    return deadline < today ? 'bg-danger text-white' : 'bg-success text-white';
  }

  // ✅ Days Left or Overdue Calculation
  getfullDaysLeft(task: any): string {
    if (!task.deadline) return 'No deadline';
    const today = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `${Math.abs(diffDays)} days overdue`;
    }
  }

  // ✅ Check if Task is Overdue
  isOverdue(task: any): boolean {
    if (!task.deadline) return false;
    const today = new Date();
    const deadline = new Date(task.deadline);
    return deadline < today;
  }
}
