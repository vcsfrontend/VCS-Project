import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

export interface Stock {
  slNo: number;
  name: string;
  l: number;
  w: number;
  t: number;
  material: string;
  q: number;
  grain: string;  
  trim: string;
  cost: number;
}

@Component({
  selector: 'app-stockview',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatDialogModule],
  templateUrl: './stockview.component.html',
  styleUrl: './stockview.component.scss'
})
export class StockviewComponent {
  partsViewDisplayedColumn: string[] = ['slNo', 'name', 'l', 'w', 't', 'material', 'q', 'grain', 'cost', 'trim'];
  @ViewChild('stockViewPaginator', { static: false }) stockViewPaginator!: MatPaginator;
  //stockViewDataSource: MatTableDataSource<Stock>;
  stockViewDataSource = new MatTableDataSource<Stock>();
  constructor(
    public dialogRef: MatDialogRef<StockviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stock[]
  ) {
    this.stockViewDataSource = new MatTableDataSource(data);
  }

  ngAfterViewInit() {
    if (this.stockViewPaginator) {
      this.stockViewDataSource.paginator = this.stockViewPaginator;
    } else {
      console.error('Paginator is undefined');
    }
  }

  getStockViewSNo(index: number): number {
    if (this.stockViewPaginator && this.stockViewPaginator.pageIndex !== undefined && this.stockViewPaginator.pageSize !== undefined) {
      return this.stockViewPaginator.pageIndex * this.stockViewPaginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


}
