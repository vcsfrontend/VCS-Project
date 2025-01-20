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
import { elementAt } from 'rxjs';
@Component({
  selector: 'app-enterprise',
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
  templateUrl: './enterprise.component.html',
  styleUrl: './enterprise.component.scss'
})
export class EnterpriseComponent {
  displayedColumns: string[] = ['slNo', 'created', 'planPic', 'commName', 'name', 'specName',  'city', 'modifiedTime', 'coverPic', 'Bom', 'Auxx','designId', 'planId',  'status', 'renders' ]; // 'designPanoUrl' 'tagId',

  dataSource = new MatTableDataSource<any>(); 
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>; 
  @ViewChild('template', { static: true }) templateRef!: TemplateRef<any>;
  private modalRef: any;
  PjList : any; furnitureData : any; ProjBasicInfo : any; BomLst : any; AuxList : any; Renders: any;
  
  
  constructor(config: NgbModalConfig, private modalService: NgbModal, private viewContainerRef: ViewContainerRef,
    public switchService: SwitherService, private toastr: ToastrService, private dp: DatePipe) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
  ngOnInit(){
    this.getLst();
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

  getLst(){
    this.switchService.ProjectList().subscribe({ next: (res:any) => {
      if(res){
        this.PjList = res.values;
        this.dataSource.data = res.values;
        console.log(res);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  // getProjectFurniture(data: any) { 
  //   this.switchService.ProjFurniture(data.designId).subscribe({
  //       next: (res: any) => {
  //           if (res) {
  //               this.furnitureData = res; 
  //               console.log(res); 
  //           }
  //       },
  //       error: (err: any) => {
  //           console.error("Error fetching project furniture:", err); // Handle errors
  //       }
  //   });
  // }
  getProjectFurniture(data: any) { 
    this.switchService.ProjFurniture(data.designId).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res)) {
          this.furnitureData = res.map((room: any) => ({
              name: room.name,
              roomId: room.roomId,
              roomTypeId: room.roomTypeId,
              levelId: room.levelId,
              level: room.level,
              finfo: room.finfo.map((finfoItem: any) => ({
                furnitureName: finfoItem.name,
                angle: finfoItem.angle,
                y: finfoItem.coOrdinate?.y || null,
                x: finfoItem.coOrdinate?.x || null,
                furnitureId: finfoItem.furnitureId
              }))
          }));
        }
      },
    });
  }
  getProjBomList(data: any): void {
    this.switchService.ProjBomList(data.designId).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.position)) {
          this.BomLst = res.position.map((position: any) => ({
            totalCount: res.totalCount || "",
            count: res.count || "",
            hasMore: res.hasMore || "",
            brandName: position.brandName || "",
            name: position.name || "",
            type: position.type || "",
            largeImgUrl: position.largeImgUrl || "",
            imgUrl: position.imgUrl || "",
            prodUrl: position.prodUrl || "",
            quantity: Number(position.quantity) || 1,
            roomName: position.roomName || "",
            roomId: position.roomId || "",
            position: position.position || "",
            x: Number(position.size?.x) || 0,
            y: Number(position.size?.y) || 0,
            z: Number(position.size?.z) || 0,
          }));
          console.log("Mapped BomLst:", this.BomLst);
        } else {
          console.warn("Unexpected API structure:", res);
        }
      },
      error: (err: any) => {
        console.error("Error fetching project furniture:", err);
      },
    });
  }

  getAuxilaryCosts(data: any): void {
    this.switchService.AuxilaryCosts(data.designId).subscribe({
      next: (res: any) => {
        // console.log('API Response:', res);
         if (res && Array.isArray(res[0].requestAuxilary)) {

          console.log('API Response:', res[0].requestAuxilary);
          
          this.AuxList = res[0].requestAuxilary.map((requestAuxilary: any) => ({
            roomName: res.roomName, 
            roomId: res.roomId,     
            totalPrice: res.totalPrice, 
            pricePerArea: res.pricePerArea, 
            itemNum: requestAuxilary.itemNum, 
            itemNumWithoutPrice: requestAuxilary.itemNumWithoutPrice, 
            assistantMaterialPrice: requestAuxilary.assistantMaterialPrice,
            labourPrice: requestAuxilary.labourPrice,
            totalPrice1: requestAuxilary.totalPrice,
            formatUnitPrice: requestAuxilary.formatUnitPrice,
            hasPrice: requestAuxilary.hasPrice,
            name: requestAuxilary.name,
            calType: requestAuxilary.calType,
            formatQuantity: requestAuxilary.formatQuantity,
            calTypeId: requestAuxilary.calTypeId
          }));
          
          // Set the data for the table
          // this.dataSource.data = this.AuxList; 
        } 
      },
      error: (err: any) => {
        console.error('Error fetching auxiliary costs:', err);
      }
    });
  }
  getProjBasicInfo(data: any) { 
    this.switchService.ProjBasicInfo(data.designId).subscribe({
        next: (res: any) => {
            if (res) {
                this.ProjBasicInfo = res.levelInfos.map((levelInfo: any) => ({
                    ...res.basicInfo, 
                    ...levelInfo    
                }));
                console.log(this.ProjBasicInfo);
            }
        },
        error: (err: any) => {
            console.error("Error fetching project furniture:", err); 
        }
    });
  }
  getRenderings(data: any): void {
    console.log('Calling getRenderings API with designId:', data.designId); // Debug log for input

    this.switchService.Renderings(data.designId).subscribe({
        next: (res: any) => {
            console.log('API Response:', res); // Debug log for API response
            if (res && Array.isArray(res.rendersList)) {
                // Map and handle null values explicitly
                this.Renders = res.rendersList.map((render: any) => ({
                  count: render.count || '',
                  hasMore: render.hasMore || '', // Handle null or missing values
                  totalCount: render.totalCount || '',
                    // panoLink: render.panoLink || 'No Pano Link',
                    // picId: render.picId || 'N/A',
                    // picType: render.picType || 'Unknown',
                    // picDetailType: render.picDetailType || 'Unknown',
                    // roomName: render.roomName || 'Unknown Room',
                    // level: render.level || 'N/A',
                    // roomIndex: render.roomIndex || 'N/A',
                    // roomTypeId: render.roomTypeId || 'N/A',
                }));

                console.log('Processed Renderings:', this.Renders);
            } else {
                console.warn('Unexpected API response structure or empty rendersList:', res);
            }
        },
        error: (err: any) => {
            console.error('Error fetching renderings:', err); // Debug log for API error
        }
    });
  }


  openLg(content10:any) {
		this.modalService.open(content10, { size: 'lg' },);
	}

  VerticallyScrol(content12:any) {
    this.modalService.open(content12, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScroll(content13:any) {
    this.modalService.open(content13, {  scrollable: true,centered: true,size: 'xl' });
  }
  openScrollableContent(content14:any) {
		this.modalService.open(content14, { scrollable: true,centered: true,size: 'lg' });
	}
  VerticallyScrolling(content15:any) {
    this.modalService.open(content15, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScrolling2(content16:any) {
    this.modalService.open(content16, {  scrollable: true,centered: true,size: 'xl' });
  }
  VerticallyScrolling3(content17:any) {
    this.modalService.open(content17, {  scrollable: true,centered: true,size: 'xl' });
  }


}
