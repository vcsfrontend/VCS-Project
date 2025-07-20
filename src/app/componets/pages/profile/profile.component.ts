import { Component,TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbNavModule,NgbDropdownModule ,NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, Gallery, ImageItem, ImageSize, ThumbnailsPosition, GalleryModule } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';


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
    DatePipe,CommonModule
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
  imageData = data; pjData : any;
  items!: GalleryItem[];lastField: any;stageLst: any;
  constructor(public gallery: Gallery, public lightbox: Lightbox ,
    public switchService: SwitherService,private toastr: ToastrService,) {}
  ngOnInit():void {
    this.getUserInfo(this.userEmail);
    this.getAllStages();
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

  getUserInfo(email: string) {
    if (!email) {
      console.error("Invalid email passed to getUserInfo.");
      return;
    }
    this.switchService.userInfo(email).subscribe({
      next: (res: any) => {
        if (res) {
          this.userData = res;
        } else {
          this.toastr.error("User not found.");
        }
      },
      error: (err: any) => {
        console.error("Error fetching user data:", err);
        this.toastr.error("Failed to fetch user data. Please try again.");
      }
    });
  }

  dynamicFields: { value: string; percent: number; fieldNm: string; }[] = [];
  initializeDynamicFields() {
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
    this.lastField = this.dynamicFields[this.dynamicFields.length - 1].value;
    this.getdesignData()
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
        } else {
          this.toastr.error(res.message)
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
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
        } else {
          this.toastr.error(res.message, '', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }
  
}