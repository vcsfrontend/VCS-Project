import { Component,TemplateRef } from '@angular/core';
import flatpickr from 'flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule,NgbNavModule,NgbModal, NgbModalConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { ToastrService } from 'ngx-toastr';
import { SwitherService } from '../../../shared/services/swither.service';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../shared/base/base.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgbModule,NgbNavModule,NgbDropdownModule,FlatpickrModule,
    FormsModule,ReactiveFormsModule,CommonModule],
  providers: [NgbModalConfig, NgbModal,FlatpickrDefaults],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent extends BaseComponent{
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: string = this.userData ? this.userData.type : '';
  globalTaskForm!: FormGroup; manualTaskForm!: FormGroup; globaltaskList: any[] = []; 
  manualTaskList: any[] = []; manualTaskCount: any
  globalTaskCount:any; selectedTaskId: string | null = null;
  assignedUserLst : any[]=[]; assignTaskForm!: FormGroup; selectedTask: any; selectedUserEmail: string = '';
  assignedTasksList: any[] = []; adminAccessUsers: any[] = []; assignedUserId: number | null = null;
  userList:any[]=[];
  public globalTaskSubmitted = false;
  public manualTaskSubmitted = false;
  public assignTaskSubmitted = false;
  constructor(
    private modalService: NgbModal,
    public switchService: SwitherService,
    private fb: FormBuilder,
    private toastr: ToastrService,) {
    super();
  }
  
  ngOnInit(): void {
    this.getALLManualTasks();
    this.getAssignedUsers();
    this.adminAccessAllUsers();
    this.getUsers();
    this.globalTaskForm = this.fb.group({
      name: ['',Validators.required],
      description:['',Validators.required],
      result:['',Validators.required],
      activityStatus:[0],
      recurringStatus:['',],
      createdBy:[this.userName],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      type: [this.userType],
    });

    this.manualTaskForm = this.fb.group({
      name: ['',Validators.required],
      description: ['',Validators.required],
      assignedTo:['',Validators.required],
      result:[''],
      leadApproval:[''],
      managerApproval:[''],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      type: [this.userType],
    });

    this.assignTaskForm = this.fb.group({
      taskId: [Validators.required],
      userDeptId:[Validators.required],
      assignedBy:[this.userEmail],
      assignedAt:[new Date().toISOString()],
      activityStatus:[''],
      companyCode: [this.userCompanyCode],
      userEmail:[''],
      type: [this.userType],
    });

    this.getAllGlobalTask();
  }

  taskModal(content1:any) {
		this.modalService.open(content1,{ centered: true });
	}

  get gf() {
    return this.globalTaskForm.controls;
  }

  get mf() {
    return this.manualTaskForm.controls;
  }

  openGlobalTaskModal(content1: TemplateRef<any>, task?: any): void {
    this.globalTaskForm.reset();
    this.globalTaskSubmitted = false;
    if (task) {
      this.selectedTaskId = task.id;
      this.globalTaskForm.patchValue({
        name: task.name,
        recurringStatus: task.recurringStatus ? task.recurringStatus : 'NONE',
        description: task.description,
        result: task.result,
        activityStatus: task.activityStatus === 1
      });
    } else {
      this.selectedTaskId = null;
    }
    this.modalService.open(content1, { backdrop: 'static' });
  }

  openManualTaskModal(content3: TemplateRef<any>, task?: any): void {
    this.manualTaskForm.reset();
    this.globalTaskSubmitted = false;
    if (task) {
      this.selectedTaskId = task.id;
      this.manualTaskForm.patchValue({
        name: task.name,
        description: task.description,
        result: task.result,
        leadApproval: task.leadApproval,
        managerApproval: task.managerApproval
      });
    } else {
      this.selectedTaskId = null;
    }
    this.modalService.open(content3, { backdrop: 'static' });
  }

  manulaTaskModal(content3:any) {
    this.modalService.open(content3, { scrollable: true, centered: true, },);
  }

  assignTaskModal(content2:any) {
    this.modalService.open(content2, { scrollable: true, centered: true, },);
  }

  manualTaskSubmit(modal: any) {
    this.manualTaskSubmitted = true;
    if (this.manualTaskForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    const payload: any = {
      ...this.manualTaskForm.value,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      type: this.userType,
    };
    if (!this.selectedTaskId) {
      delete payload.leadApproval;
      delete payload.managerApproval;
    } else {
      payload.id = this.selectedTaskId;
    }
    this.switchService.createManualTask(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Task submitted successfully!');
        this.manualTaskForm.reset();
        this.manualTaskSubmitted = false;
        modal.close();
      }
    });
  }

  updateManualTask(modal: any) {
    this.manualTaskSubmitted = true;
    if (this.manualTaskForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    const payload: any = {
      ...this.manualTaskForm.value,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      type: this.userType,
      id: this.selectedTaskId, 
    };
    console.log(payload)
    // this.switchService.updateManualTask(payload).subscribe({
    //   next: (res: any) => {
    //     this.toastr.success('Task updated successfully!');
    //     this.manualTaskForm.reset();
    //     this.manualTaskSubmitted = false;
    //     this.selectedTaskId = null;
    //     modal.close();
    //   }
    // });
  }

  deleteManualTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.switchService.deleteManualTaskById(taskId).subscribe((res: any) => {
        this.toastr.success('Task deleted successfully');
        this.getALLManualTasks();
      });
    }
  }

  globalTaskSubmit(modal: any): void {
    this.globalTaskSubmitted = true;
    if (this.globalTaskForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    const payload: any = {
      ...this.globalTaskForm.value,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      type: this.userType,
      activityStatus: this.globalTaskForm.value.activityStatus ? 1 : 0,
      recurringStatus: this.globalTaskForm.value.recurringStatus || 'NONE'
    };
    if (this.selectedTaskId) {
      payload['id'] = this.selectedTaskId;
      payload['updatedBy'] = this.userName;
      delete payload.createdBy;
      this.switchService.updateGlobalTask(payload).subscribe((res: any) => {
        this.toastr.success(res.message || 'Task updated successfully');
        modal.close();
        this.globalTaskForm.reset();
        this.selectedTaskId = null;
        this.globalTaskSubmitted = false;
        this.getAllGlobalTask();
      });
    } else {
      payload.createdBy = this.userName;
      this.switchService.createGloabalTaks(payload).subscribe((res: any) => {
        this.toastr.success(res.message || 'Task created successfully');
        modal.close();
        this.globalTaskForm.reset();
        this.globalTaskSubmitted = false;
        this.getAllGlobalTask();
      });
    }
  }

  getAllGlobalTask() {
    const companyCode = this.userCompanyCode;
    this.switchService.getAllGlobalTasks(companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.globaltaskList = res.data || res;
          this.globalTaskCount = this.globaltaskList.length;
        }
      }
    });
  }

  getALLManualTasks() {
    this.switchService.getManualTasks().subscribe({
      next: (res: any) => {
        if (res) {
          this.manualTaskList = res.data || res;
          this.manualTaskCount = this.manualTaskList.length;
        }
      }
    });
  }

  adminAccessAllUsers() {
    const companyCode = this.userCompanyCode;
    this.switchService.adminAccessAllUsers(companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.adminAccessUsers = res.data || res;
          if (this.adminAccessUsers.length > 0) {
            const firstUser = this.adminAccessUsers[0];
            this.assignTaskForm.patchValue({
              userDeptId: firstUser.id,       
              userEmail: firstUser.userEmail
            });
          }
        }
      }
    });
  }

  deleteGlobalTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.switchService.deleteGlobalTaskById(taskId).subscribe((res: any) => {
        this.toastr.success('Task deleted successfully');
        this.getAllGlobalTask();
      });
    }
  }

  deleteAssignTask(selectedTask: any): void {
    if (!selectedTask) return;
    const taskId = selectedTask.taskId;
    const deptRoleId = selectedTask.userDeptId;
    const assignmentId = selectedTask.id;
    const companyCode = this.userCompanyCode;
    if (confirm('Are you sure you want to delete this assigned task?')) {
      this.switchService.deleteAssignTasks(taskId, deptRoleId, assignmentId, companyCode).subscribe({
        next: (res: any) => {
          this.toastr.success('Task deleted successfully');
          this.getAllGlobalTask();
          this.loadAssignedTasks();
        }
      });
    }
  }

  getAssignedUsers() {
    const email = this.userEmail;
    const companyCode = this.userCompanyCode;
    this.switchService.getAssignUser(email, companyCode).subscribe({
      next: (res: any[]) => {
        this.assignedUserLst = res;
        if (res.length > 0) {
          const userId = res[0].id;
          this.assignTaskForm.patchValue({
            userDeptId: userId,
            userEmail: res[0].userEmail
          });
          this.loadAssignedTasks();
        }
      }
    });
  }

  assignTaskSubmit(modal: any) {
    this.assignTaskSubmitted = true;
    if (this.assignTaskForm.invalid) {
      this.toastr.error('Please fill in all required fields.');
      return;
    }
    const payload: any = {
      ...this.assignTaskForm.value,
      assignedAt: new Date().toISOString(),
      companyCode: this.userCompanyCode,
      assignedBy: this.userEmail,
      type: this.userType,
      activityStatus: String(this.assignTaskForm.value.activityStatus),
      userDeptId: this.assignedUserId
    };
    console.log(payload)
    // this.switchService.assignTasksRoles(payload).subscribe({
    //   next: (res: any) => {
    //     this.toastr.success(res.message || 'Task assigned successfully');
    //     modal.close();
    //     this.loadAssignedTasks();
    //     this.assignTaskForm.reset();
    //     this.assignTaskSubmitted = false;
    //   },
    // });
  }

  onUserChange(selectedUser: any) {
    if (selectedUser) {
      this.switchService.getAssignUser(selectedUser.userEmail, this.userCompanyCode)
        .subscribe((res: any[]) => {
          if (res.length > 0) {
            const assignedUser = res[0];
            this.assignedUserId = assignedUser.id;

            this.assignTaskForm.patchValue({
              userDeptId: selectedUser.userEmail,
              userEmail: selectedUser.userEmail
            });
          } else {
            this.assignedUserId = null;
            this.assignTaskForm.patchValue({
              userDeptId: selectedUser.userEmail,
              userEmail: selectedUser.userEmail
            });
          }
        });
    }
  }

  onTaskChange(selectedTask: any) {
    if (selectedTask) {
      this.assignTaskForm.patchValue({
        taskId: selectedTask.id,
        activityStatus: String(selectedTask.activityStatus)
      });
    }
  }

  getUsers() {
    let cn = this.userCompanyName;
    let cc = this.userCompanyCode;
    this.switchService.cmpnyUsers(cn, cc).subscribe({
      next: (res: any) => {
        if (res) {
          this.userList = res;
        }
      }
    })
  }

  loadAssignedTasks() {
    const userDeptRole = this.assignTaskForm.get('userDeptId')?.value;
    const companyCode = this.userCompanyCode;
    const userEmail = this.userEmail;
    this.switchService.getAllAssignTasks(userDeptRole, companyCode).subscribe({
      next: (assignedRes) => {
        const allAssignedTasks = assignedRes.data || assignedRes;
        const filteredTasks = allAssignedTasks.filter(
          (task: any) => task.userEmail === userEmail
        );
        this.assignedTasksList = filteredTasks.map((assigned: any) => {
          const matched = this.globaltaskList.find(
            (task: any) => task.id === assigned.taskId
          );
          return {
            ...assigned,
            taskName: matched?.name || 'N/A',
            description: matched?.description || 'N/A',
            result: matched?.result || 'N/A',
            recurringStatus:
              matched?.recurringStatus?.toUpperCase() || 'N/A',
          };
        });
      },
    });
  }






}
