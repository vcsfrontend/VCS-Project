import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

export interface Part {
  slNo: number;
  name: string;
  l: number;
  w: number;
  t: number;
  material: string;
  q: number;
  orientationLock: number;
  banding: string;
  cost: number;
}

@Component({
  selector: 'app-partsview',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatDialogModule],
  templateUrl: './partsview.component.html',
  styleUrl: './partsview.component.scss'
})
export class PartsviewComponent {
  partsViewDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'orientationLock','banding','cost'];
  @ViewChild('partsViewPaginator', { static: false }) partsViewPaginator!: MatPaginator;
  //partsViewDataSource: MatTableDataSource<Part>;
  partsViewDataSource = new MatTableDataSource<Part>();
  constructor(
    public dialogRef: MatDialogRef<PartsviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Part[]
  ) {
    this.partsViewDataSource = new MatTableDataSource(data);
  }

  ngAfterViewInit() {    
    if (this.partsViewPaginator) {
      this.partsViewDataSource.paginator = this.partsViewPaginator;
    } else {
      console.error('Paginator is undefined');
    }
  }

  getPartsViewSNo(index: number): number {
    if (this.partsViewPaginator && this.partsViewPaginator.pageIndex !== undefined && this.partsViewPaginator.pageSize !== undefined) {
      return this.partsViewPaginator.pageIndex * this.partsViewPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  

}
