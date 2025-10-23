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
  globalTaskForm!: FormGroup; globaltaskList: any[] = []; globalTaskCount:any; selectedTaskId: string | null = null;
  assignedUserLst : any[]=[]; assignTaskForm!: FormGroup; selectedTask: any; selectedUserEmail: string = '';
  assignedTasksList: any[] = []; adminAccessUsers: any[] = []; assignedUserId: number | null = null;
  public globalTaskSubmitted = false;
  public assignTaskSubmitted = false;
  constructor(
    private modalService: NgbModal,
    public switchService: SwitherService,
    private fb: FormBuilder,
    private toastr: ToastrService,) {
    super();
  }
  
  ngOnInit(): void {
    this.getAssignedUsers();
    this.adminAccessAllUsers();
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

    this.assignTaskForm = this.fb.group({
      taskId: [0,Validators.required],
      userDeptId:[0,Validators.required],
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

 

  openGlobalTaskModal(content1: TemplateRef<any>, task?: any): void {
    this.globalTaskForm.reset();
    this.globalTaskSubmitted = false;
    if (task) {
      this.selectedTaskId = task.id;
      this.globalTaskForm.patchValue({
        name: task.name,
        recurringStatus: task.recurringStatus,
        description: task.description,
        result: task.result,
        activityStatus: task.activityStatus === 1
      });
    } else {
      this.selectedTaskId = null;
    }
    this.modalService.open(content1, {  backdrop: 'static' });
  }

  assignTaskModal(content2:any) {
    this.modalService.open(content2, { scrollable: true, centered: true, },);
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
      activityStatus: this.globalTaskForm.value.activityStatus ? 1 : 0
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


  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.switchService.deleteGlobalTaskById(taskId).subscribe((res: any) => {
        this.toastr.success(res.message || 'Task deleted successfully');
        this.getAllGlobalTask();
      });
    }
  }

  deleteAssignTask(selectedTask: any): void {
    if (!selectedTask) return; const payload = {
      taskId: selectedTask.taskId,
      deptRoleId: selectedTask.userDeptId,
      assignmentId: selectedTask.id,
      companyCode: this.userCompanyCode
    };
    if (confirm('Are you sure you want to delete this Assign task?')) {
      console.log(payload)
      // this.switchService.deleteAssignTask(payload).subscribe({
      //   next: (res: any) => {
      //     this.toastr.success(res.message || 'Task deleted successfully');
      //     this.getAllGlobalTask();
      //   },
      //   error: (err) => {
      //     this.toastr.error(err.message || 'Failed to delete task');
      //   }
      // });
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
              userDeptId: assignedUser.id,
              userEmail: assignedUser.userEmail
            });
          } else {
            this.assignedUserId = null;
            this.assignTaskForm.patchValue({
              userDeptId: null,
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

  loadAssignedTasks() {
    const userDeptRole = this.assignTaskForm.get('userDeptId')?.value;
    const companyCode = this.userCompanyCode;
    this.switchService.getAllassignTasks(userDeptRole, companyCode).subscribe({
      next: (assignedRes) => {
        const assignedTasks = assignedRes.data || assignedRes;
        const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
        this.assignedTasksList = assignedTasks
          .map((assigned: any) => {
            const matched = this.globaltaskList.find((task: any) => task.id === assigned.taskId);
            return {
              ...assigned,
              taskName: matched?.name || 'N/A',
              description: matched?.description || 'N/A',
              result: matched?.result || 'N/A',
              recurringStatus: matched?.recurringStatus?.toUpperCase() || 'N/A',
            };
          })
          .filter((task: any) => {
            const status = task.recurringStatus;
            if (status === 'DAILY') return true;
            if (status === 'WEEKLY' && today === 'MONDAY') return true;
            if (status === today) return true;
            if (status === 'SAT_SUN' && (today === 'SATURDAY' || today === 'SUNDAY')) return true;
            if (status === 'MONTHLY' && new Date().getDate() === 1) return true;
            return false;
          });
      }
    });
  }




}
