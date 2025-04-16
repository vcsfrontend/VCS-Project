import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbNavModule, NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MatDialog } from '@angular/material/dialog';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule, NgbNavModule, NgbDropdownModule, NgSelectModule, ReactiveFormsModule,
    CommonModule, MatFormFieldModule, MatSelectModule, MaterialModuleModule,
    MatPaginator, MatPaginatorModule, MatCheckboxModule, MatSort, MatSortModule, MatTableModule, OverlayscrollbarsModule,NgbTooltipModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productDisplayedColumn: string[] = ['slNo', 'code', 'name', 'description', 'isActive', 'edit', 'delete'];
  productDataSource = new MatTableDataSource<any>();
  @ViewChild('productPaginator') productPaginator!: MatPaginator;

  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userType: string = this.userData ? this.userData.type : '';
  isEditingProduct: boolean = false; productForm!: FormGroup;

  public productSubmitted = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder, public switchService: SwitherService, private toastr: ToastrService,
    private offcanvasService: NgbOffcanvas, private dialog: MatDialog, private cdRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.getProductData();

    this.productForm = this.fb.group({
      prodId: [{ value: this.generateProductId(), disabled: true }],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      isActive: [true],
      origin: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
      
    });
    
  }

  ngAfterViewInit() {
    this.productDataSource.paginator = this.productPaginator;
  }

  generateProductId(): number {
    return Math.floor(1000 + Math.random() * 9000); 
  }

  onProductSubmit(modal: any) {
    this.productSubmitted = true;
    if (this.productForm.invalid) {
      this.toastr.error("Please fill in all required fields.");
      return;
    }
    this.productForm.patchValue({
      origin: this.isEditingProduct ? 'edit' : 'save'
    });
    let payload = {
      ...this.productForm.getRawValue(),
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.saveOrUpdateProduct(payload).subscribe({
      next: (res: any) => {
        if (res.status === true) {
          const message = this.isEditingProduct
            ? "Product updated successfully."
            : "Product saved successfully.";
          this.toastr.success(message);
          this.modalService.dismissAll(modal);
          this.productForm.reset();
          this.productSubmitted = false;
          this.isEditingProduct = false;
          this.getProductData();
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText || "An error occurred while saving the product.");
      }
    });
  }
  

  onEditProduct(product: any, modal: any) {
    this.productForm.get('prodId')?.enable();
    this.productForm.patchValue({
      ...product,
      origin: 'edit' 
    });
    this.productForm.get('prodId')?.disable();
    this.isEditingProduct = true;
    this.modalService.open(modal);
  }
  

  getProductData() {
    let payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    this.switchService.displayProductData(payload).subscribe({
      next: (res: any) => {
        this.productDataSource.data = res || [];
        if (this.productPaginator) {
          this.productDataSource.paginator = this.productPaginator;
        }
      },
      error: (error) => {
        this.toastr.error("Error fetching product data");
        this.productDataSource.data = [];
      }
    });
  }

  deleteProduct(data: any) {
    const prodId = data.prodId;
    if (!prodId) {
      alert('Error: Product ID is missing!');
      return;
    }
    if (confirm('Are you sure you want to delete this product?')) {
      this.switchService.deleteProductData(prodId).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.getProductData();
        },
        error: (error) => {
          this.toastr.error("id not yed");
        }
      });
    }
  }

  productApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productDataSource.filter = filterValue.trim().toLowerCase();
  }

  get f() {
    return this.productForm.controls;
  }
  
  getStatusClass(isActive: boolean): string {
    return isActive ? "badge bg-success-transparent ps-3 fs-11 order-status complete " : "badge bg-danger-transparent ps-3 fs-11 order-status cancel";
  }

  getStatusText(isActive: boolean): string {
    return isActive ? "Active" : "Inactive";
  }

  productGetSNo(index: number): number {
    if (this.productPaginator && this.productPaginator.pageIndex !== undefined && this.productPaginator.pageSize !== undefined) {
      return this.productPaginator.pageIndex * this.productPaginator.pageSize + index + 1;
    }
    return index + 1;
  }

  openProductPopup() {   
      this.productForm.patchValue({prodId:this.generateProductId(),code:'',name:'',description:'',isActive:true});
  }

  openLg6(content10: any) {
    this.modalService.open(content10, { scrollable: true, centered: true, });
  }
}
