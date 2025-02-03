import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke,
  ApexYAxis, ApexTitleSubtitle, ApexLegend, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import { FilePondOptions } from 'filepond';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbDropdownModule,NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import { ShowCodeContentDirective } from '../../../shared/directives/show-code-content.directive';
import { BaseComponent } from '../../../shared/base/base.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormArray,  } from '@angular/forms'  
import { MatSort, MatSortModule } from '@angular/material/sort';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule, AngularFireModule,
      AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
      AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
      OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgApexchartsModule,
      NgbDropdownModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,NgSelectModule, MatTableModule,MatSortModule],
    providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  displayedColumns: string[] = ['id', 'name','userId','email','reporting_to','status','action'];
  dataSource = new MatTableDataSource<any>(); 
  pageSize = 5;

  @ViewChild('paginator') paginator!: MatPaginator;
  //@ViewChild('sort') sort!: MatSort;
  @ViewChild(MatSort) sort!: MatSort;
  

  constructor() {   
    
  }

  ngOnInit()
  {
    this.getList();
  }

  getList()
  {
    this.dataSource =new MatTableDataSource<Element>([
      { id: 1, name: 'John', userId: 25, email: 'john@gmail.com',reporting_to:'Pavan',status:'Active' },
      { id: 2, name: 'Jane', userId: 30, email: 'Jane@gmail.com',reporting_to:'Pavan',status:'Active' },
      { id: 3, name: 'Mike', userId: 35, email: 'mike@gmail.com',reporting_to:'Pavan',status:'Active' },
      { id: 4, name: 'Alice', userId: 28, email: 'alice@gmail.com',reporting_to:'Pavan',status:'Active' },
      { id: 6, name: 'John', userId: 25, email: 'mikejohn@gmail.com',reporting_to:'Sasi',status:'In Active' },
      { id: 7, name: 'Jane', userId: 30, email: 'vimal@gmail.com',reporting_to:'Sasi',status:'In Active' },
      { id: 8, name: 'Mike', userId: 35, email: 'pavan@gmail.com',reporting_to:'Sasi',status:'In Active' },
      { id: 9, name: 'Alice', userId: 28, email: 'alice@gmail.com',reporting_to:'Sasi',status:'In Active' },
      { id: 10, name: 'John', userId: 25, email: 'mikejohn@gmail.com',reporting_to:'Vengamma',status:'Pending' },
      { id: 11, name: 'Jane', userId: 30, email: 'vimal@gmail.com',reporting_to:'Vengamma',status:'Pending' },
      { id: 12, name: 'Mike', userId: 35, email: 'pavan@gmail.com',reporting_to:'Vengamma',status:'Pending' },
      { id: 13, name: 'Alice', userId: 28, email: 'alice@gmail.com',reporting_to:'Vengamma',status:'' },
      // Add more sample data
    ]);
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;    
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageIndex !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageIndex + index + 1;
    }
    return index + 1; 
  }

  // Pagination event handler
  pageEvent(event: any) {
    console.log('Page changed: ', event);
  }

  edit(element: any) {
    console.log('Edit clicked for:', element);
  }

  view(element: any) {
    console.log('View clicked for:', element);
  }

  delete(element: any) {
    console.log('Delete clicked for:', element);
  }

}


export interface Element {
  id: number;
  name: string;
  userId: number;
  email: string;
  reporting_to:string;
  status:string;
}