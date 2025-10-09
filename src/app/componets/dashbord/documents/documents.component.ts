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
}
