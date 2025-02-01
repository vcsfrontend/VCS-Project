import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbDropdownModule ,NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from '../../../../shared/base/base.component';
import { RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';
import { FirebaseService } from '../../../../shared/services/firebase.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgbOffcanvas, OffcanvasDismissReasons,} from '@ng-bootstrap/ng-bootstrap';
import { SwitherService } from '../../../../shared/services/swither.service';
@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule, AngularFireModule,
    AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule,
    AngularFirestoreModule, ToastrModule, SharedModule, MaterialModuleModule,
    NgbDropdownModule,NgSelectModule],
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, DatePipe, NgbModalConfig,NgbModal],
  
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss'
})
export class LeadsComponent extends BaseComponent  {
  displayedColumns: string[] = ['slNo', 'phone', ];
  dataSource = new MatTableDataSource<any>();
  Crmusers : any[]=[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template

  constructor(config: NgbModalConfig,	private modalService: NgbModal,
    private offcanvasService: NgbOffcanvas,public switchService: SwitherService, private toastr: ToastrService,
	) {
    super();
  }
  
  
openModal(content1:any) {
  this.modalService.open(content1,{ centered: true });
}
openRight(content: any) {
  this.offcanvasService.open(content, { position: 'end' });
}
openRight1(content1: any) {
  this.offcanvasService.open(content1, { position: 'end' });
}
url1: string = ''; // Assuming url1 is a property in your component

handleFileInput(event: any): void {
  const file = event.target.files[0];
  if (file) { 
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.url1 = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
} 

getSNo(index: number): number {
  if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
  }
  return index + 1; 
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
VerticallyScrol(content12:any) {
  this.modalService.open(content12, {  scrollable: true,centered: true,size: 'xl' });
}
// openLg(content10:any) {
//   this.modalService.open(content10, { size: 'lg' },);
// }


options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];

  // FormControl for search and selection
  searchControl = new FormControl('');
  selectedOption = new FormControl('');
  filteredOptions: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.options);

  ngOnInit(): void {
    this.getCrmUsers();
    // Filter options as the user types in the search bar
    this.searchControl.valueChanges.subscribe((searchText) => {
      if (searchText && typeof searchText === 'string') {
        const filtered = this.options.filter((option) =>
          option.toLowerCase().includes(searchText.toLowerCase())
        );
        this.filteredOptions.next(filtered);
      } else {
        this.filteredOptions.next(this.options); // Reset to all options if searchText is null
      }
    });
  }

  getCrmUsers(){
    this.switchService.CrmUsers().subscribe({ next: (res:any) => {
      if(res){
        this.Crmusers = res.values;
        this.dataSource.data = res.values;
        console.log(res);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  
}
