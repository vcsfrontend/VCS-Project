import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModuleModule } from '../../../material-module/material-module.module';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, MatFormFieldModule,MaterialModuleModule,SharedModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  displayedColumns: string[] = ['slNo', 'name', 'role', 'number', 'date','totalCallsAttempted','totalCallsConnectd', 'totalCallsNotConnectd','totalInprogressLeads', 'totalConvertedLeads','totalLostleads','startcallingtime'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
   constructor( ) {
      // super();
    }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getSNo(index: number): number {
    if ( this.paginator && this.paginator.pageIndex !== undefined &&
         this.paginator.pageSize !== undefined
    ) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }

  dataSources = [
  {
    slNo: 1,
    name: 'John Doe',
    role: 'Sales Executive',
    number: '9876543210',
    date: '2024-05-20',
    totalCallsAttempted: 50,
    totalCallsConnectd: 35,
    totalCallsNotConnectd: 15,
    totalInprogressLeads: 5,
    totalConvertedLeads: 8,
    totalLostleads: 2,
    email: 'john.doe@example.com',
    city: 'New York'
  },
  {
    slNo: 2,
    name: 'Jane Smith',
    role: 'Sales Manager',
    number: '9876512340',
    date: '2024-05-21',
    totalCallsAttempted: 60,
    totalCallsConnectd: 45,
    totalCallsNotConnectd: 15,
    totalInprogressLeads: 7,
    totalConvertedLeads: 10,
    totalLostleads: 3,
    email: 'jane.smith@example.com',
    city: 'Los Angeles'
  },
  {
    slNo: 3,
    name: 'Mike Johnson',
    role: 'Account Manager',
    number: '9876523451',
    date: '2024-05-22',
    totalCallsAttempted: 70,
    totalCallsConnectd: 50,
    totalCallsNotConnectd: 20,
    totalInprogressLeads: 6,
    totalConvertedLeads: 12,
    totalLostleads: 4,
    email: 'mike.johnson@example.com',
    city: 'Chicago'
  },
  {
    slNo: 4,
    name: 'Sarah Lee',
    role: 'Sales Executive',
    number: '9876534562',
    date: '2024-05-23',
    totalCallsAttempted: 55,
    totalCallsConnectd: 40,
    totalCallsNotConnectd: 15,
    totalInprogressLeads: 8,
    totalConvertedLeads: 9,
    totalLostleads: 1,
    email: 'sarah.lee@example.com',
    city: 'Houston'
  },
  {
    slNo: 5,
    name: 'David Kim',
    role: 'Sales Lead',
    number: '9876545673',
    date: '2024-05-24',
    totalCallsAttempted: 65,
    totalCallsConnectd: 48,
    totalCallsNotConnectd: 17,
    totalInprogressLeads: 9,
    totalConvertedLeads: 11,
    totalLostleads: 5,
    email: 'david.kim@example.com',
    city: 'San Francisco'
  }
];

}
