import { Component,TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbNavModule,NgbDropdownModule ,NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryItem, Gallery, ImageItem, ImageSize, ThumbnailsPosition, GalleryModule } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';


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
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent {
  userData: any = null;
  userEmail: string = "balakrishna@varmagroup.co.in";
  imageData = data; pjData : any;
  items!: GalleryItem[];
  constructor(public gallery: Gallery, public lightbox: Lightbox ,
    public switchService: SwitherService,private toastr: ToastrService,) {}
  ngOnInit() {
    this.getUserInfo(this.userEmail);
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
          console.log("User Data:", this.userData);
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
  
}