import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke,
  ApexYAxis, ApexTitleSubtitle, ApexLegend, ApexResponsive, NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making HTTP requests
import { FilePondOptions } from 'filepond';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbDropdownModule,NgbModal, NgbModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { SwitherService } from '../../../shared/services/swither.service';
import { MatTableDataSource } from '@angular/material/table';
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
import { FormControl, FormArray,  } from '@angular/forms' ;
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  fill: ApexFill;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-projects',
  standalone: true,
  // imports: [SharedModule, NgApexchartsModule, CommonModule, FormsModule,
  //   NgbDropdownModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,ReactiveFormsModule],
  //   providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, DatePipe],
    imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule, AngularFireModule,
      AngularFireDatabaseModule, CommonModule,  MatFormFieldModule, MatSelectModule, FlatpickrModule,
      AngularFirestoreModule, ToastrModule, SharedModule, ShowcodeCardComponent, MaterialModuleModule,
      OverlayscrollbarsModule, ShowCodeContentDirective, MatIconModule, NgApexchartsModule,
      NgbDropdownModule,MatDatepickerModule,MatInputModule,MatNativeDateModule,NgSelectModule,],
    providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }, FlatpickrDefaults, DatePipe],
    
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent extends BaseComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['slNo', 'projectId', 'clientName', 'projStatus', 'projectEstimation',
    'projectArea', 'projectStartDate', 'projectEndDate', 
  ];
  displayedColumnss: string[] = [
    'slNo', 'Nameoffile', 'Typeoffile', 'Uploadedby', 'Uploadedon', 'Status', 'Actions'
  ];

  // displayedColumns: string[] = ['slNo', 'projectId', 'projectName', 'clientName', 'businessCategory',
  //   'projectAddress', 'state', 'city', 'projectState', 'projectEstimation',
  //   'projectArea', 'projectStartDate', 'projectEndDate', 'action', 'designId', 'companyName'
  // ];
  pjData : any = {}; isSts:boolean = true; submitted: boolean = false; userData: any;
  projectName: string = ''; clientName: string = ''; businessCategory: string = '';
  projectAddress: string = ''; state: string = ''; city: string = ''; projectArea: string = ''; 
  action: string = ''; designId: string = ''; companyName: string = ''; matcardLst:any; addFilter: string = '1';
  projName: string = ''; projId: string = ''; paymentStages: any; lstData: any; active="Angular"; btnDisable = false; 
  estamount : any; hasAddedRow: boolean = false; displayedCards: any; showMore = false;
  dataSource = new MatTableDataSource<any>(); 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  modal: any; ttlAmtToBeRcvd: any; projectLst: any; userDetails:any; dateDiff: any; 
  roleid:any;  actstatus: any; stageLst: any; pmntStageLst: any; createProjectForm!: FormGroup;
  pondOptions: FilePondOptions; lastField:any; ProDataList:any
  
  updateDisplayedCards(): void {
    this.displayedCards = this.showMore ?  this.matcardLst?.slice(0, 4) : this.matcardLst;
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
    this.updateDisplayedCards();
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    this.getMatCardLst();
  }
  dataSourcee = [
    { Nameoffile: 'Report1.pdf', Typeoffile: 'PDF', Uploadedby: 'John Doe', Uploadedon: '2024-02-15', Status: 'Approved', Actions: 'View' },
    { Nameoffile: 'Image1.jpg', Typeoffile: 'Image', Uploadedby: 'Jane Smith', Uploadedon: '2024-02-14', Status: 'Pending', Actions: 'Edit' },
    { Nameoffile: 'Document.docx', Typeoffile: 'Word', Uploadedby: 'Alex Brown', Uploadedon: '2024-02-13', Status: 'Rejected', Actions: 'Delete' },
    { Nameoffile: 'Quotation.xls', Typeoffile: 'exel', Uploadedby: 'Alex Brown', Uploadedon: '2024-02-13', Status: 'Rejected', Actions: 'Delete' }

  ];
  
  openLg(content10:any) {
    if(this.stageLst?.f1 == '' || this.stageLst?.f1 == null ){
      alert('Please add stages before creating a project')
    }else if(this.stageLst?.f1Percent == 0){
      alert('Please add stages percentage before creating a project')
    }else {
      this.resetForm();
      this.modalService.open(content10, { size: 'lg', centered: true },);
    }
	}
  openLg1(content4: any) {
    this.modalService.open(content4, {size: 'sm',  centered: true},);
  }

  openRights(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  } 
  
  open(content11:any) {
		this.modalService.open(content11, { size: 'lg' },);
	}
  VerticallyScrol(content12:any) {
    if(this.pmntStageLst?.f1 == '' || this.pmntStageLst?.f1 == null ){
      alert('Please add payment stages before adding project Estimation')
    }else if(this.pmntStageLst?.f1Percent == 0){
      alert('Please add payment stages percentage before adding project Estimation')
    }else {
      this.modalService.open(content12, {  scrollable: true,centered: true,size: 'xl' });
    }
	}
  
  constructor(private fb: FormBuilder, private http: HttpClient, private modalService: NgbModal,
    private toastr: ToastrService, public switchService: SwitherService, private dp: DatePipe,
    private router: Router,
     private offcanvasService: NgbOffcanvas,
  ) {
    // Initialize FilePond options if needed
    super();
    this.userDetails = localStorage.getItem('userDetails');
    this.pondOptions = {
      allowMultiple: true,
      // other FilePond options here
    };
  }
 
  ngOnInit(): void {
    this.getLst(); this.getMatCardLst();
    this.onMinDate(); this.onTodayDt(); this.onClkDesign('i');
    this.getAllStages(); this.getAllPmntStages();
    //this.getdesignData();
    // this.fetchPaymentStages();
    this.createProjectForm = this.fb.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      businessCategory: ['', Validators.required],
      projectAddress: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      projectState: [''],
      projectEstimation: ['', [Validators.required, Validators.min(0)]], // Assuming estimation should be a positive number
      projectArea: ['', [Validators.required, Validators.min(0)]], // Assuming area should be a positive number
      projectStartDate: ['', Validators.required],
      projectEndDate: ['', Validators.required],
      action: [''],
      companyName: [JSON.parse(this.userDetails)?.companyName],
      attachments: [null], // Adjust based on your attachment handling
      email: [JSON.parse(this.userDetails)?.email],
      type: [JSON.parse(this.userDetails)?.type],
      username: [JSON.parse(this.userDetails)?.username], 
      companyCode: [JSON.parse(this.userDetails)?.companyCode],
      projStatus: [''],
      percentage: ['']
    });
  }

  get f() {
    return this.createProjectForm.controls;
  }

  minEndDate: string = '';
  onStartDateChange(event: Event): void {
    const startDate = (event.target as HTMLInputElement).value;
    this.minEndDate = startDate; // Set the minimum end date
    const endDate = this.createProjectForm.get('projectEndDate')?.value;
    // Reset the end date if it is earlier than the new start date
    if (endDate && endDate < startDate) {
      this.createProjectForm.get('projectEndDate')?.setValue('');
    }
  }

  dynamicFields: { value: string; percent: number; fieldNm: string; }[] = [];
  initializeDynamicFields() {
    // Loop through f1 to f30 and add only those with non-empty values to dynamicFields
    for (let i = 1; i <= 30; i++) {
      const fieldName = `f${i}`;
      const percentName = `f${i}Percent`;
      if (this.stageLst[fieldName]) {
        this.dynamicFields.push({
          value: this.stageLst[fieldName],
          percent: this.stageLst[percentName],
          fieldNm: fieldName
        });
      }      
    }
    this.lastField = this.dynamicFields[this.dynamicFields.length - 1].value;
    console.log('Last Field:', this.lastField);
    this.getdesignData()
  }

  getAllStages(){
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.getStages(payload).subscribe({ next: (res:any) => {
    if(res){
      this.stageLst = res;
      this.initializeDynamicFields();
      } else {
        this.toastr.error(res.message)
      }
    },
    error: (error) => {
      this.toastr.error(error.statusText);
    },
    })
  }

  dynamicPmntFields: { value: string; percent: number }[] = [];
  initializeDynamicPmntFields() {
    for (let i = 1; i <= 30; i++) {
      const fieldName = `f${i}`;
      const percentName = `f${i}Percent`;
      if (this.pmntStageLst[fieldName]) {
        this.dynamicPmntFields.push({
          value: this.pmntStageLst[fieldName],
          percent: this.pmntStageLst[percentName],
        });
      }
    }
  }

  getAllPmntStages(){
    let payload = {
      "email": JSON.parse(this.userData).email,
      "companyname": JSON.parse(this.userData).companyName,
      "companycode": JSON.parse(this.userData).companyCode,
      "type": JSON.parse(this.userData).type
    }
    this.switchService.getPmntStages(payload).subscribe({ next: (res:any) => {
    if(res){
      this.pmntStageLst = res;
      this.initializeDynamicPmntFields();
      } else{
        this.toastr.error(res.message)
      }
    },
    error: (error) => {
      this.toastr.error(error.statusText);
    },
    })
  }

  onClkDesign(key:string = ''){
    this.userData = localStorage.getItem('userDetails');
    this.switchService.onAdonai(JSON.parse(this.userData)?.email).subscribe({
      next: (res:any) => {
        if(res.status == false){
          alert(res.message)
          return;
        } else {
          if(key == 'i'){
            this.dateDiff = res.datediff;
            this.roleid = res.roleId;
            this.actstatus = res.activityStatus;
          }else{
            window.open(res.newDesign, '_blank');
            this.toastr.success(res.message);
          }
        }
      }
    })
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.createProjectForm.invalid) {
      this.toastr.error('Please fill mandatory fields');
      // this.btnDisable = false;
      return;
    }
    else if (this.createProjectForm.valid) {
      const projectData = this.createProjectForm.value;
      this.btnDisable = true;
      projectData.companyName = JSON.parse(this.userDetails)?.companyName,
      projectData.email = JSON.parse(this.userDetails)?.email,
      projectData.type = JSON.parse(this.userDetails)?.type,
      projectData.username = JSON.parse(this.userDetails)?.username,
      projectData.companyCode = JSON.parse(this.userDetails)?.companyCode,
      projectData.projStatus = this.dynamicFields[0].value,
      projectData.percentage = this.dynamicFields[0].percent,
      // projectData.projectStartDate = this.dp.transform(projectData.projectStartDate, 'dd-MM-yyyy'),
      // projectData.projectEndDate = this.dp.transform(projectData.projectEndDate, 'dd-MM-yyyy'),
      this.switchService.saveProject(projectData).subscribe({
        next: (response) => {
          const parts = response.message.split('<>');
          this.toastr.success(parts[0]);
          this.getLst(); this.getdesignData(); this.getMatCardLst();
          this.modalService.dismissAll(); this.onSubmitTaskDetails(parts[1])
        },
        error: (error) => {
          this.toastr.error('Error creating project', error);
          this.btnDisable = false;
        },
        complete: () => {
          console.log('Project creation process completed.');
          this.resetForm(); // Optionally reset the form after submission
        },
      });
    } else {
      // Mark all controls as touched to show validation errors
      this.createProjectForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }

  onSubmitTaskDetails(id:any){
    let payload = {
      // "id": 0,
      "projectId": id,
      "heading": 'Project created',
      "projectStatus": this.dynamicFields[0].value,
      "description": 'Project start stage',
      updatedBy: JSON.parse(this.userData).username,
      percentage : this.dynamicFields[0].percent,
    }
    this.switchService.onAddTaskDtls(payload).subscribe({ next: (res:any) =>{
    if(res.status == true){
      this.toastr.success(res.message);
      return;
      } else {
        this.toastr.error(res.message);
        }
      },
      error: (error) => {
        this.toastr.error(error.statusText);
      },
    })
  }

  // Optional: You can create a method to reset the form
  resetForm(): void {
    this.createProjectForm.reset();
    this.createProjectForm.get('businessCategory')?.setValue('');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.updateButtons();
  }

  getSNo(index: number): number {
    if (this.paginator && this.paginator.pageIndex !== undefined && this.paginator.pageSize !== undefined) {
        return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1; // Default return if paginator is not yet defined
  }

  addDateDifference() {
    this.projectLst = this.projectLst.map((e:any) => ({
      ...e, dateDifference: this.calculateDateDifference(e.projectEndDate)
    }));
  }

  getLst(){
    let payload = {
      email: JSON.parse(this.userDetails)?.email,
      type: JSON.parse(this.userDetails)?.type,
      companyname: JSON.parse(this.userDetails)?.companyName,
      companycode: JSON.parse(this.userDetails)?.companyCode,
      projectId: '',
      projectname: '',
      filter: 'All',
    }
    this.switchService.projectLst(payload).subscribe({ next: (res:any) => {
      if(res){
        this.projectLst = res.projList;
        this.dataSource.data = res.projList;
        // this.projectLst = this.projectLst.filter((e:any) => e.dateDifference >= 0);
        // this.projectLst.sort((a:any, b:any) => a.dateDifference - b.dateDifference);
        } else {
          this.toastr.error(res.message);
        }
      }
    })
  }
  onFilterChange(id:any){
    // if(id=='2'){ this.projName = ''} else if (id=='3'){ this.projId = ''} else {this.projName = '', this.projId = '', this.getMatCardLst()}
    id === '2' ? this.projName = '' : id === '3' ? this.projId = '' :
    (this.projName = '', this.projId = '', this.getMatCardLst());
  }

  getMatCardLst(){
    if(this.addFilter=='2' && this.projId == ''){
      this.toastr.warning('Please enter Project Id');
    }
    else if(this.addFilter=='3' && this.projName== ''){
      this.toastr.warning('Please enter Project Name');
    } else {
      let payload = {
        email: JSON.parse(this.userDetails)?.email,
        type: JSON.parse(this.userDetails)?.type,
        companyname: JSON.parse(this.userDetails)?.companyName,
        companycode: JSON.parse(this.userDetails)?.companyCode,
        projectId: this.addFilter == '2'? this.projId : '',
        projectname: this.addFilter == '3'? this.projName : '',
        filter: this.addFilter == '1'? 'All' : (this.addFilter == '2'? 'projectid' : 'projectname'),
      }

      this.switchService.projectLst(payload).subscribe({ next: (res:any) => {
      if(res){
        const projLst = res.projList;
        const paymentLastLst = res.paymentLastList;
        const proLastLst = res.projectLastList;
        projLst?.forEach((project:any) => {
          const matchedProject = paymentLastLst.find((lastProject:any) => lastProject.projectId === project.projectId);
          if (matchedProject) {
            project.paymentPercent = matchedProject.paymentPercent;
            project.paymentStage = matchedProject.paymentStage  // Add projPercent to the project
          } else {
            project.paymentPercent = 0;  // If no match, set projPercent to 0 (or handle accordingly)
          }
        });
        projLst?.forEach((e:any) => {
          const matchedProjectstg = proLastLst.find((lastStg:any) => lastStg.projectId === e.projectId);
          if (matchedProjectstg) {
            e.projectPercent = matchedProjectstg.projectPercent;
            e.projectStage = matchedProjectstg.projectStage  // Add projPercent to the project
          } else {
            e.projectPercent = 0;  // If no match, set projPercent to 0 (or handle accordingly)
          }
        });
          this.matcardLst = projLst;
          // this.addDateDifference();
          this.matcardLst?.sort((a:any, b:any) => a.priorityDays - b.priorityDays);
          this.toggleShowMore();
          } else {
            this.toastr.error(res.message);
          }
        }
      })
    }
  }

  getdesignData(){
    let payload = {
      "email": JSON.parse(this.userDetails)?.email,
      "type": JSON.parse(this.userDetails)?.type,
      "companyname": JSON.parse(this.userDetails)?.companyName,
      "companycode": JSON.parse(this.userDetails)?.companyCode,
      lastStage: this.lastField
    }
    this.switchService.designersDbData(payload).subscribe({ next: (res:any) =>{
    if(res){    
      this.pjData = res;
    } else {
      this.toastr.error(res.message,'', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        });
      }
    },
    error: (error) => {
      this.toastr.error(error.statusText);
    },
    })
  }
  

  onProjectDetails(data:any){
    this.projectName = data.projectName; this.clientName = data.clientName; this.businessCategory = data.businessCategory;
    this.projectAddress = data.projectAddress; this.projectArea = data.projectArea; this.state = data.state; 
    this.city = data.city; this.action = data.action; this.designId = data.designId; this.companyName = data.companyName;
  }

  onProjectAdd(data:any){
    this.router.navigate(['/dashboard/mytask'], {queryParams: {projectId : data.projectId}});
  }

  onProjectCycle(id:any){
    this.router.navigate(['/pages/timeline'], {queryParams: {projectId : id.projectId}});
  }

  lastPendingAmount:any; totalReceivedAmount:any
  calculateTotalReceivedAmount(): void {
    this.totalReceivedAmount = this.paymentStages.reduce((sum:any, stage:any) => {
      return sum + parseFloat(stage.receivedAmount);
    }, 0);
    this.ttlAmtToBeRcvd = this.paymentStages.reduce((sum:any, stage:any) => {
      return sum + parseFloat(stage.amountToBeRecieved);
    }, 0);
    this.lastPendingAmount = this.paymentStages.reduce((sum:any, stage:any) => {
      return sum + parseFloat(stage.pendingAmount);
    }, 0);
  }

  fetchPaymentStages(data:any) {
    //   this.http.get('https://api.example.com/payment-stages').subscribe((data: any) => {
    //     this.paymentStages = data.map((item: any) => ({ ...item, isNew: false }));
    //   });
    this.estamount = data.projectEstimation ;
    this.lstData = data
    this.switchService.getProjEstimation(data.projectId).subscribe({ next: (res:any) =>{
    if(res){
      this.paymentStages = res.map((item: any) => ({ ...item, isNew: false }));
      this.paymentStages.forEach((e:any) => {e.updatedTime = this.convertToIST(e.updatedTime);});
    // const lastElement = this.paymentStages[this.paymentStages.length - 1];
    // this.lastPendingAmount = lastElement ? lastElement.pendingAmount : data.projectEstimation;
    this.calculateTotalReceivedAmount();
    } else {
      this.toastr.error(res.message);
      }
    },
    error: (error) => {
      this.toastr.error(error.statusText);
    },
    })
  }

  addRow() {
    const incompleteRow = this.paymentStages.find((e:any) => !e.paymentStage || !e.percantage || !e.receivedAmount);
  
    if (incompleteRow) {
      this.toastr.warning('Please fill all the fields before adding a new row.', 'Validation Error');
      return;
    } else {

    // const totalPercentage = this.paymentStages.reduce((sum:any, payment:any) => {
    //   return sum + (payment.percantage ? parseFloat(payment.percantage) : 0);
    // }, 0);
  
    // if (totalPercentage > 100) {
    //   this.toastr.error('Total percentage cannot exceed 100. Please correct the values.', 'Validation Error');
    //   return;
    // }
      this.hasAddedRow = true;
      this.paymentStages.push({ 
        projectId: this.lstData?.projectId,
        projectEstimation: this.lstData?.projectEstimation,
        totalAmount: '',
        totalPending: '',
        paymentStage: '',
        percantage: '',
        receivedAmount: '',
        pendingAmount: '',
        amountToBeRecieved: '',
        updatedBy: JSON.parse(this.userData)?.username,
        updatedTime: '',
        isNew: true 
      });
    }
  }

  convertToIST(utcDateString: string): Date {
    const utcDate = new Date(utcDateString);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (5 hours 30 minutes)
    return new Date(utcDate.getTime() + istOffset);
  }

  isValueSelected(value: string, currentIndex: number): boolean {
    return this.paymentStages.some((payment:any, index:any) => payment.paymentStage === value && index !== currentIndex);
  }
  
  updatePercent(payment:any){
    const selectedStage = this.dynamicPmntFields.find(item => item.value === payment.paymentStage);
    if (selectedStage) {
      payment.percantage = +selectedStage.percent;
      this.calculateAmountToBeReceived(payment);
    } else {
      payment.percantage = '';
    }
  }

  calculateAmountToBeReceived(payment: any): void {
    if (this.estamount && payment.percantage) {
      payment.amountToBeRecieved = (+this.estamount * parseFloat(payment.percantage) / 100).toFixed(0);
    } else {
      payment.amountToBeRecieved = '0';
    }
  }
  // calculateAmountToBeReceived(payment: any): void {
  //   if (this.estamount && payment.percantage) {
  //     payment.amountToBeRecieved = (+this.estamount * parseFloat(payment.percantage) / 100).toFixed(0);
  //   } else {
  //     payment.amountToBeRecieved = '0';
  //   }
  // }

  onPercentageChange(payment: any): void {
    // Calculate the total percentage excluding the current row
    const totalPercentageExcludingCurrent = this.paymentStages.reduce((sum:any, p:any) => {
      return sum + (p === payment || !p.percantage ? 0 : parseFloat(p.percantage));
    }, 0);
  
    // Check if the new total exceeds 100
    const newTotalPercentage = totalPercentageExcludingCurrent + (payment.percantage ? parseFloat(payment.percantage) : 0);
  
    if (newTotalPercentage > 100) {
      // Show error message and reset the value
      this.toastr.error('Total percentage cannot exceed 100. Please enter a valid value.', 'Validation Error');
      payment.percantage = ''; payment.amountToBeRecieved = '';
    }
  }

  calculatePendingAmount(payment: any): void {
    if (payment.amountToBeRecieved && payment.receivedAmount) {
      payment.pendingAmount = (
        parseFloat(payment.amountToBeRecieved) - parseFloat(payment.receivedAmount)).toFixed(0);
    } else {
      payment.pendingAmount = payment.amountToBeRecieved || '0';
    }
  }

  isPercentageLimitReached(): boolean {
    const totalPercentage = this.paymentStages?.reduce((sum: number, payment: any) => {
      return sum + (parseFloat(payment.percantage) || 0);
    }, 0);
    return totalPercentage >= 100;
  }

  validateField(index: number, field: string): void {
    const payment = this.paymentStages[index];
    if( payment.paymentStage == ''){ payment.percantage = '', payment.amountToBeRecieved = ''; payment.receivedAmount = ''; payment.pendingAmount = '' };
    if( payment.percantage == ''){payment.amountToBeRecieved = ''; payment.receivedAmount = ''; payment.pendingAmount = '' };

    switch (field) {
      case 'paymentStage':
        if (!payment.paymentStage || payment.paymentStage.trim() === '') {
          this.toastr.warning('Please enter the Stage of Payment.', 'Validation Error');
          payment.percantage = ''; payment.amountToBeRecieved = ''; payment.receivedAmount = ''; payment.pendingAmount = '';
        }
        break;

      case 'percantage':
        if (!payment.paymentStage || payment.paymentStage.trim() === '') {
          this.toastr.warning('Please fill the Stage of Payment before entering the Percentage.', 'Validation Error');
          payment.percantage = ''; 
        }
        break;

      case 'amountToBeRecieved':
        if (!payment.percantage) {
          this.toastr.warning('Please fill the Percentage before entering the Amount to be Received.', 'Validation Error');
          payment.amountToBeRecieved = '';
        }
        break;

      case 'receivedAmount':
        if (!payment.amountToBeRecieved) {
          this.toastr.warning('Please fill the Amount to be Received before entering the Received Amount.', 'Validation Error');
          payment.receivedAmount = '';
        }
        break;

      case 'pendingAmount':
        if (!payment.receivedAmount) {
          this.toastr.warning('Please fill the Received Amount before entering the Pending Amount.', 'Validation Error');
          payment.pendingAmount = '';
        }
        break;
      default:
        break;
    }
  }

  savePaymentDetails(){
    const incompleteRow = this.paymentStages.find((e:any) => !e.paymentStage || !e.percantage || !e.receivedAmount);
    if (!this.hasAddedRow) {
      this.toastr.error('Please add a new row before submitting the form.', 'Error');
      return;
    }
    else if (incompleteRow) {
      this.toastr.warning('Please fill all the fields before adding a new row.', 'Validation Error');
      return;
    }else {
      // let totalPendingSum = this.paymentStages.reduce((sum: number, e: any) => {
      //   return sum + (+e.pendingAmount || 0); 
      // }, 0);
      let payload = this.paymentStages.map((e:any) => ({
        id: e.id || 0,
        projectId: e.projectId || "",
        paymentStage: e.paymentStage || "",
        amountToBeRecieved: e.amountToBeRecieved || "",
        percantage: e.percantage || "",
        receivedAmount: e.receivedAmount || "",
        pendingAmount: e.pendingAmount || "",
        updatedTime: e.updatedTime || "",
        updatedBy: e.updatedBy || "",
        projectEstimation: e.projectEstimation || "",
        totalAmount: e.totalAmount || "",
        totalPending: '' //totalPendingSum
      }));
      this.switchService.saveProjEstimation(payload).subscribe({
        next: (response) => {
          this.toastr.success(response.message);
          this.modalService.dismissAll();
        },
        error: (error) => {
          this.toastr.error('Error save payment details', error);
        },
      });
    }
  }

  chartOptions: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      },
    },
    colors: ['var(--primary-color)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
        colorStops: [
          [
            {
              offset: 0,
              color: 'var(--primary02)',
              opacity: 1,
            },
            {
              offset: 60,
              color: 'var(--primary02)',
              opacity: 0.1,
            },
          ],
        ],
      },
    },
  };
  chartOptions1: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      },
    },
    colors: ['rgb(52, 152, 219)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions2: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      },
    },
    colors: ['rgb(46, 204, 113)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions3: any = {
    series: [
      {
        data: [98, 110, 80, 145, 105, 112, 87, 148, 102],
      },
    ],
    chart: {
      height: 70,
      type: 'area',
      fontFamily: 'Poppins, sans-serif',
      foreColor: '#5d6162',
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function (seriesName: any) {
            return '';
          },
        },
      },
      marker: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: '1',
    },
    title: {
      text: undefined,
    },
    grid: {
      borderColor: 'transparent',
    },
    xaxis: {
      crosshairs: {
        show: false,
      },
    },
    colors: ['rgb(231, 76, 60)'],
    stroke1: {
      width: [1],
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 60],
      },
    },
  };
  chartOptions4: any = {
    series: [
      {
        name: 'Income',
        data: [44, 42, 57, 86, 58, 55, 70, 43, 23, 54, 77, 34],
      },
      {
        name: 'Expenses',
        data: [-34, -22, -37, -56, -21, -35, -60, -34, -56, -78, -89, -53],
      },
    ],
    chart: {
      toolbar: {
        show: false,
      },
      type: 'bar',
      fontFamily: "'Poppins', sans-serif",
      height: 380,
      stacked: true,
    },
    colors: ['var(--primary-color)', 'rgb(69, 214, 91)'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '22%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: ['6', '6'],
      curve: 'smooth',
    },
    legend: {
      show: true,
      position: 'top',
      offsetX: 0,
      offsetY: 8,
      markers: {
        width: 5,
        height: 5,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: undefined,
        radius: 12,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0,
      },
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      tickAmount: 4,
    },
  };
  chartOptions5: any = {
    chart: {
      type: 'line',
      height: 45,
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 1,
        color: '#fff',
        opacity: 0.05,
      },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    fill: {
      gradient: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Value',
        data: [54, 38, 56, 35, 65, 43, 53, 45, 62, 80, 35, 48],
      },
    ],
    yaxis: {
      min: 0,
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
    },
    yaxis1: {
      axisBorder: {
        show: false,
      },
    },
    colors: ['rgba(243, 156, 18, 0.2)'],
    tooltip: {
      enabled: true,
    },
  };
  chartOptions6: any = {
    chart: {
      height: 150,
      width: 150,
      type: 'radialBar',
    },

    series: [48],
    colors: ['rgb(69, 214, 91)'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#4b9bfa',
            fontSize: '10px',
            show: false,
          },
          value: {
            offsetY: 5,
            color: '#4b9bfa',
            fontSize: '12px',
            show: true,
            fontWeight: 800,
          },
        },
      },
    },
    stroke: {
      lineCap: "round"
    },
    labels: ['Followers'],
  };
  chartOptions7:any= {
    series: [
      {
        name: "Recieved Income",
        type: "column",
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6,5.6,6.6,7.8,9.7]
      },
      {
        name: "Pending Income",
        type: "column",
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5,9.5,10,8.6,7.6]
      },
      {
        name: "Revenue",
        type: "line",
        data: [20, 29, 37, 36, 44, 45, 50, 58,65,43,55,60]
      }
    ],
    colors:['#b94eed','#44c2e9','#f6c364'],
    chart: {
      height: 350,
      type: "line",
      stacked: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [1, 1, 4]
    },
    title: {
      text: "XYZ - Stock Analysis (2009 - 2016)",
      align: "left",
      offsetX: 110
    },
    xaxis: {
      // categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]
      categories: ['Jan','Feb','March','April','May','June','July','Aug','Sep','Oct','Nov','Dec']
    },
    yaxis: [
      {
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#9673e4"
        },
        labels: {
          style: {
            color: "#9673e4"
          }
        },
        title: {
          text: "Income (thousand crores)",
          style: {
            color: "#9673e4"
          }
        },
      
      },
      {
        
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#44c2e9"
        },
        labels: {
          style: {
            color: "#44c2e9"
          }
        },
        title: {
          text: "Operating Cashflow (thousand crores)",
          style: {
            color: "#44c2e9"
          }
        }
      },
      {
       
        opposite: true,
        axisTicks: {
          show: true
        },
        axisBorder: {
          show: true,
          color: "#FEB019"
        },
        labels: {
          style: {
            color: "#FEB019"
          }
        },
        title: {
          text: "Revenue (thousand crores)",
          style: {
            color: "#FEB019"
          }
        }
      }
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60
      }
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40
    }
  };

  ReadMore:boolean = true

  //hiding info box
  visible:boolean = false


  //onclick toggling both
  onclick()
  {
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visible = !this.visible
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public generateData(count: number, yrange: { max: number; min: number; }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }

  fileName: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = null; // Reset if no file selected
    }
  }
  fields: Array<{ value: string }> = [];

  addMoreFields() {
    this.fields.push({ value: '' });
  }

  deleteField(index: number) {
    this.fields.splice(index, 1);
  }
  @ViewChild('scrollContent') scrollContent!: ElementRef;

  items = [
    { title: 'All Projects' },
    { title: 'Project Created' },
    { title: 'Recce Pending' },
    { title: 'Design Pending' },
    { title: 'Design Freeze' },
    { title: 'Scope approval awaited' },
    { title: 'Partial Scope Approved' },
    { title: 'full Scope Approved' },
    { title: 'Execution in progress' },
    { title: 'Execution completed' },
    { title: 'Hold' },
    { title: 'Lost' },
    { title: 'Rectification' },
    { title: 'Archived' },
  ];

  isAtStart: boolean = true;
  isAtEnd: boolean = false;

  
  scrollLeft() {
    this.scrollContent.nativeElement.scrollBy({ left: -200, behavior: 'smooth' });
    setTimeout(() => this.updateButtons(), 300);
  }

  scrollRight() {
    this.scrollContent.nativeElement.scrollBy({ left: 200, behavior: 'smooth' });
    setTimeout(() => this.updateButtons(), 300);
  }

  updateButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = this.scrollContent.nativeElement;
    this.isAtStart = scrollLeft <= 0;
    this.isAtEnd = scrollLeft + clientWidth >= scrollWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.updateButtons();
  }

}