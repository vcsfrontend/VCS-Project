import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../app/shared/common/sharedmodule';

@Component({
  selector: 'app-recceimagesviewer',
  standalone: true,
  imports: [FormsModule,CommonModule,SharedModule],
  templateUrl: './recceimagesviewer.component.html',
  styleUrl: './recceimagesviewer.component.scss'
})
export class RecceimagesviewerComponent implements OnInit {
  images: string[] = [];
  currentIndex: number = 0;
  currentStage = 'External Environment';
  currentFileName = 'Image.jpg'; 
  zoomLevel: number = 100;
  zoomOptions = [50, 75, 90, 100, 110, 125, 150, 200];
  rotation: number = 0;
  constructor(private router: Router, private location: Location) { }
  ngOnInit() {
    const nav = history.state;

    if (nav && nav.images) {
      this.images = nav.images;
      this.currentIndex = nav.index ?? 0;
    } else {
      this.location.back();
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goBack() {
    this.location.back();
  }
  zoomIn() {
    this.zoomLevel += 10;
  }

  zoomOut() {
    if (this.zoomLevel > 100) {
      this.zoomLevel -= 10;
    }
  }

  rotateImage() {
    this.rotation = (this.rotation + 90) % 360;
  }
  applyZoom() {
    const img = document.querySelector('.main-image') as HTMLElement;
    if (img) {
      img.style.transform = `scale(${this.zoomLevel / 100})`;
    }
  }

  toggleFullscreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  downloadImage(imageUrl: string) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.split('/').pop() || 'image';
    link.click();
  }
}
