import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../app/shared/common/sharedmodule';

@Component({
  selector: 'app-recceimagesviewer',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './recceimagesviewer.component.html',
  styleUrl: './recceimagesviewer.component.scss'
})
export class RecceimagesviewerComponent implements OnInit {
  recce: any;
  images: string[] = [];
  currentIndex: number = 0;
  currentStage: string = '';
  currentFileName: string = '';;
  zoomLevel: number = 100;
  zoomOptions = [50, 75, 90, 100, 110, 125, 150, 200];
  rotation: number = 0;
  constructor(private router: Router, private location: Location) { }
  ngOnInit(): void {
    const state: any = history.state;
    if (state.recceData) {
      this.recce = state.recceData;
      this.images = this.recce.imageList;
      this.currentIndex = state.selectedIndex ?? 0;

      this.currentStage = this.recce.recceStage;
      this.currentFileName = this.getFileName(this.images[this.currentIndex]);
    }
  }

  getFileName(url: string): string {
    return url.split('/').pop()?.split('_')[1]?.split('.')[0] || 'Image';
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

  selectImage(index: number): void {
    this.currentIndex = index;
    this.currentFileName = this.getFileName(this.images[index]);
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
