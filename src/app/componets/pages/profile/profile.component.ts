import { Component,TemplateRef, ViewChild ,NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { NgbNavModule,NgbDropdownModule ,NgbModal, NgbModalConfig, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, Gallery, ImageItem, ImageSize, ThumbnailsPosition, GalleryModule } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { take ,filter} from 'rxjs';


const data = [
  {
    srcUrl: './assets/images/media/media-40.jpg',
    previewUrl: './assets/images/media/media-40.jpg',
  },
  {
    srcUrl: './assets/images/media/media-41.jpg',
    previewUrl: './assets/images/media/media-41.jpg',
  },
  {
    srcUrl: './assets/images/media/media-42.jpg',
    previewUrl: './assets/images/media/media-42.jpg',
  },
  {
    srcUrl: './assets/images/media/media-43.jpg',
    previewUrl: './assets/images/media/media-43.jpg',
  },
  {
    srcUrl: './assets/images/media/media-44.jpg',
    previewUrl: './assets/images/media/media-44.jpg',
  },
  {
    srcUrl: './assets/images/media/media-45.jpg',
    previewUrl: './assets/images/media/media-45.jpg',
  },
  {
    srcUrl: './assets/images/media/media-46.jpg',
    previewUrl: './assets/images/media/media-46.jpg',
  },
  {
    srcUrl: './assets/images/media/media-60.jpg',
    previewUrl: './assets/images/media/media-60.jpg',
  },
];
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule,NgbNavModule,NgbDropdownModule,GalleryModule,LightboxModule, OverlayscrollbarsModule,
    DatePipe,CommonModule,NgbAccordionModule,NgbTooltipModule,FormsModule,ReactiveFormsModule 
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage
    ? JSON.parse(this.userDataStorage)
    : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : '';
  adonaiToolActivity: any = this.userData ? this.userData.adonai : '';
  adoanAiRole :any = this.userData ? this.userData.adonaiRole:'';
  crmRole : any = this.userData ? this.userData. crmRole:'';
  imageData = data; pjData : any;isCollapsed = true;
  items!: GalleryItem[];lastField: any;stageLst: any;
  userLst: any = []; searchUser: string = '';topshowMore = false;
  taskList: any[] | null = null; profilePicForm!: FormGroup;
  inprogressTasks: any[] = [];  modal: any;
  verifyTasks: any[] = [];
  completedTasks: any[] = [];userList:any[]=[];
  userDetails: any = {};taskStats : any; userProfilePic:any;
  //  isCollapsed = true;
  isCollapsed1 = true;
  isCollapsed2 = true; profilePic: string | null = null;
  constructor(public gallery: Gallery, public lightbox: Lightbox ,
    public switchService: SwitherService,private toastr: ToastrService,private fb: FormBuilder,
  private offcanvasService: NgbOffcanvas, private modalService: NgbModal,) {
      
    }
  ngOnInit():void {
    this.switchService.userInfoLoaded
    .pipe(
      filter(loaded => loaded),
      take(1)
    )
    .subscribe(() => {
      const cached = this.switchService.userInfoCache;
      if (!cached) return;

      this.userData = cached;
      this.userName = cached.username || cached.name;
      this.profilePic = cached.profilePic
        ? this.addBaseUrlIfNeeded(cached.profilePic)
        : 'assets/images/brand-logos/profile1.jpg';
    });

    this.getAllStages();
    this.getUsers();
    this.fetchTasks();
    this.profilePicForm = this.fb.group({
      profilePic: [''],
      email: [this.userEmail],
      action: ['']
    });
    this.items = this.imageData.map(
      (item) => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );
    const lightboxRef = this.gallery.ref('lightbox');
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });

   
    lightboxRef.load(this.items);
  }

  addBaseUrlIfNeeded(pic: string) {
    if (!pic) return null;

    if (!pic.startsWith('http')) {
      return environment.imageBaseUrl + pic;
    }
    return pic;
  }
  dynamicFields: { value: string; percent: number; fieldNm: string; }[] = [];
  initializeDynamicFields() {
  if (!this.stageLst) return; // safeguard

  this.dynamicFields = []; // reset before populating

  for (let i = 1; i <= 30; i++) {
    const fieldName = `f${i}`;
    const percentName = `f${i}Percent`;

    if (this.stageLst[fieldName]) {
      this.dynamicFields.push({
        value: this.stageLst[fieldName],
        percent: this.stageLst[percentName],
        fieldNm: fieldName
      });
    }
  }

  if (this.dynamicFields.length > 0) {
    this.lastField = this.dynamicFields[this.dynamicFields.length - 1].value;
  }

  this.getdesignData();
  }
  
  getUserInfo(email: string) {
    this.switchService.userInfo(email).subscribe({
      next: (res: any) => {
        if (!res) return;

        this.userData = res;
        this.profilePic = res.profilePic
          ? res.profilePic
          : 'assets/images/brand-logos/profile1.jpg';
      }
    });
  }
  getAllStages() {
    let payload = {
      "email": this.userEmail,
      "type": this.userType,
      "companyname": this.userCompanyName,
      "companycode": this.userCompanyCode,
    }
    this.switchService.getStages(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.stageLst = res;
          this.initializeDynamicFields();
        } 
      }
    })
  }
  getdesignData() {
    let payload = {
      "email": this.userEmail,
      "type": this.userType,
      "companyname": this.userCompanyName,
      "companycode": this.userCompanyCode,
      lastStage: this.lastField
    }
    this.switchService.designersDbData(payload).subscribe({
      next: (res: any) => {
        if (res) {
          this.pjData = res;
        } 
      }
    })
  }
  
  filterUserData() {
    if (this.userLst.length > 0) {
      return this.userLst.filter((item: { firstName: string; lastName: string; email: string; }) =>
        item.firstName.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        item.lastName.toLowerCase().includes(this.searchUser.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchUser.toLowerCase())
      );
    }
  }

  getUsers() {
    if (this.userType == 2) {
      let cn = this.userCompanyName;
      let cc = this.userCompanyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userLst = res;
            // this.dataSource = new MatTableDataSource<any>(res);
            // this.dataSource.data = res;
          } 
        }
      })
    }
  }
  getUserColor(contact: any): string {
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary'];
    if (contact && contact.email) {
      const index = contact.email.charCodeAt(0) % colors.length;
      return colors[index];
    }
    return 'bg-secondary';
  }

  getUserBgColor(contact: any): string {
    const colors = ['bg-primary-transparent', 'bg-success-transparent', 'bg-warning-transparent', 'bg-danger-transparent', 'bg-info-transparent', 'bg-secondary-transparent'];
    if (contact && contact.email) {
      const index = contact.email.charCodeAt(0) % colors.length;
      return colors[index];
    }
    return 'bg-secondary-transparent';
  }

  toggleTopShowMore() {
    this.topshowMore = !this.topshowMore;
    if (this.topshowMore) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.scrollable-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  }
  openRight(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

   ViewUserDetails(data: any) {
    this.userDetails = data;
  }
  fetchTasks() {
    const payload = {
      currentUser: this.userEmail
    };
    this.switchService.fetchTasksCreatedBy(payload).subscribe({
      next: (res) => {
        this.taskList = [
          ...(res.createdTaskList || []),
          ...(res.assignedTaskList || [])
        ];
        const tasks = [...(res.createdTaskList || []), ...(res.assignedTaskList || [])];
        this.inprogressTasks = tasks.filter((t: any) => t.currentStatus === 'Inprogress');
        this.verifyTasks = tasks.filter((t: any) => t.currentStatus === 'At to Verify');
        this.completedTasks = tasks.filter((t: any) => t.currentStatus === 'Completed');
       this.taskStats = {
        total: tasks.length,
        inprogress: this.inprogressTasks.length,
        verify: this.verifyTasks.length,
        completed: this.completedTasks.length
        };
      },
    });
  }
  
  profileUpdate(content12: any) {
    this.modalService.open(content12, { centered: true });
  }

  updateProfile() {
    if (this.profilePicForm.valid) {
      const file: File = this.profilePicForm.get('profilePic')?.value;
      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('email', this.userData.email);
      formData.append('action', '');
      this.switchService.updateProfilePic(formData).subscribe({
        next: (res: any) => {
          if (res) {
            this.modal.close();
            this.toastr.success('Profile updated successfully!',);
            this.getUserInfo(this.userEmail);
          }
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const file = input.files[0];
    if (file) {
      this.profilePicForm.patchValue({
        profilePic: file
      });
      this.profilePicForm.get('profilePic')?.updateValueAndValidity();
    }
  }
 


}