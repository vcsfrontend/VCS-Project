import { Component, TemplateRef, ViewChild, ViewEncapsulation, ViewContainerRef } from '@angular/core';
import { NgbModal, NgbModalConfig,NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule,NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../shared/prismData/advancedUi/models'
import { CommonModule, DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FlatpickrModule, FlatpickrDefaults } from 'angularx-flatpickr';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { ShowCodeContentDirective } from '../../../shared/directives/show-code-content.directive';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatButtonModule } from '@angular/material/button'; 
import { SwitherService } from '../../../shared/services/swither.service';
import { MatCommonModule } from '@angular/material/core';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bom',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,AngularFireModule,
    AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
    AngularFirestoreModule,ToastrModule,  ShowcodeCardComponent, MaterialModuleModule,
    OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgbTooltipModule,
    NgbPopoverModule, NgbDropdownModule,MatCommonModule, NgxEchartsModule],
  providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, 
        FlatpickrDefaults, DatePipe, NgbModalConfig, NgbModal,
        {
          provide: NGX_ECHARTS_CONFIG,
          useFactory: () => ({ echarts: echarts }),
        },],
  templateUrl: './bom.component.html',
  styleUrl: './bom.component.scss'
})
export class BomComponent {
  displayedColumns: string[] = ['slNo', 'brandName', 'name', 'type', 'largeImgUrl', 'imgUrl', 'prodUrl', 'quantity', 'roomName', 'roomId', 'position', 'y', 'z', 'x' ];
  displayedColumnss: string[] = ['slNo', 'roomName', 'roomId', 'totalPrice', 'pricePerArea', 'itemNum', 'itemNumWithoutPrice' ];
  // displayedColumnss: string[] = ['slNo', 'roomName', 'roomId', 'totalPrice', 'pricePerArea', 'itemNum', 'itemNumWithoutPrice', 'assistantMaterialPrice', 'labourPrice', 'formatUnitPrice', 'itemNumWithoutPrice1', 'hasPrice', 'name', 'calType', 'formatQuantity', 'calTypeId' ];
  
  ProjBomList : any; BomLst : any; Aux : any;

  dataSource = new MatTableDataSource<any>(); 
  // adonaiSource = new MatTableDataSource<any>(); 
  // crmSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;  // Access the ng-template
  @ViewChild('template', { static: true }) templateRef!: TemplateRef<any>;
  private modalRef: any;

  constructor(config: NgbModalConfig, private modalService: NgbModal, private viewContainerRef: ViewContainerRef,
    public switchService: SwitherService, private toastr: ToastrService, private dp: DatePipe, private route: ActivatedRoute,) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSnos(index: number): number {
    return this.paginator ? index + 1 + this.paginator.pageIndex * this.paginator.pageSize : index + 1;
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1; 
  }

  ngOnInit() {
    const designId = "3FO3N8OCM23N"; 
    this.getProjBomList(designId);
    this.getAuxilaryCosts(designId);
  }
  
  getProjBomList(designId: string): void {
    this.switchService.ProjBomList(designId).subscribe({
      next: (res: any) => {
        console.log("API Response:", res);
  
        if (res && Array.isArray(res.position)) {
          this.BomLst = res.position.map((item: any) => ({
            brandName: item.brandName || "",
            name: item.name || "",
            type: item.type || "",
            largeImgUrl: item.largeImgUrl || "",
            imgUrl: item.imgUrl || "",
            prodUrl: item.prodUrl || "",
            quantity: Number(item.quantity) || 1,
            roomName: item.roomName || "",
            roomId: item.roomId || "",
            position: item.position || "",
            size: {
              x: Number(item.size?.x) || 0,
              y: Number(item.size?.y) || 0,
              z: Number(item.size?.z) || 0,
            },
          }));
          this.dataSource.data = this.BomLst;
        } else {
          console.warn("Unexpected API structure:", res);
        }
      },
      error: (err: any) => {
        console.error("Error fetching project furniture:", err);
      },
    });
  }  

  getAuxilaryCosts(designId: string) { 
    this.switchService.AuxilaryCosts(designId).subscribe({
        next: (res: any) => {
            console.log('API Response:', res);
            if (res && Array.isArray(res.requestAuxilary)) {
                this.Aux = res.requestAuxilary.map((item: any) => ({
                  roomName: item.roomName,
                  roomId: item.roomId,
                  totalPrice: item.totalPrice,
                  pricePerArea: item.pricePerArea,
                  itemNum: item.itemNum,
                  itemNumWithoutPrice: item.itemNumWithoutPrice,
                  // assistantMaterialPrice :item.assistantMaterialPrice,
                  // labourPrice: item.labourPrice,
                  // totalPrice1: item.totalPrice,
                  // itemNum2: item.itemNum,
                  // formatUnitPrice: item.formatUnitPrice,
                  // itemNum3: item.itemNum,
                  // itemNumWithoutPrice1: item.itemNumWithoutPrice,
                  // hasPrice: item.hasPrice,
                  // name: item.name,
                  // calType: item.calType,
                  // formatQuantity: item.formatQuantity,
                  // calTypeId: item.calTypeId,
                }));
                this.dataSource.data = this.Aux;
            } 
            // else {
            //     console.warn('Unexpected API structure:', res);
            // }
        },
        error: (err: any) => {
            console.error('Error fetching project furniture:', err);
        }
    });
  }

}
