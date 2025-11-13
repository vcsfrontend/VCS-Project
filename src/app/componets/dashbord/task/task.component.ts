import { Component, TemplateRef } from '@angular/core';
import flatpickr from 'flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { ToastrService } from 'ngx-toastr';
import { SwitherService } from '../../../shared/services/swither.service';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../shared/base/base.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule, NgbNavModule, NgbDropdownModule, FlatpickrModule,
    FormsModule, ReactiveFormsModule, CommonModule],
  providers: [NgbModalConfig, NgbModal, FlatpickrDefaults],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent extends BaseComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: string = this.userData ? this.userData.type : '';
  adonaiRole: string = this.userData ? this.userData.adonaiRole : '';
  crmRole: string = this.userData ? this.userData.crmRole : '';
  globalTaskForm!: FormGroup; manualTaskForm!: FormGroup; globaltaskList: any[] = [];
  manualTaskList: any[] = []; manualTaskCount: any; selectedManualTaskId: string | null = null;
  globalTaskCount: any; selectedTaskId: string | null = null;
  assignedUserLst: any[] = []; assignTaskForm!: FormGroup; selectedTask: any; selectedUserEmail: string = '';
  assignedTasksList: any[] = []; adminAccessUsers: any[] = []; assignedUserId: number | null = null;
  userList: any[] = []; adminList: any; assignedTasksCount: any; filteredAllUsers: any[] = [];
  manualAssignTaskList: any[] = []; isAdmin: boolean = false; manualAssignTaskCount: number = 0;
  showAllUsers: boolean = false;  todayTasks: any[] = []; yesterdayTasks: any[] = []; thisWeekTasks: any[] = [];

  userColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info', 'bg-secondary',
    'bg-pink', 'bg-teal', 'bg-indigo', 'bg-orange', 'bg-dark', 'bg-light'];
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
    this.isAdmin = this.adonaiRole === 'ADMIN';
    this.globalTaskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      result: ['', Validators.required],
      activityStatus: [0],
      recurringStatus: ['',],
      createdBy: [this.userName],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      type: [this.userType],
    });

    this.manualTaskForm = this.fb.group({
      name: [''],
      description: [''],
      assignedTo: [''],
      result: [''],
      leadApproval: [''],
      managerApproval: [''],
      currentStatus: [''],
      companyName: [this.userCompanyName],
      companyCode: [this.userCompanyCode],
      type: [this.userType],
    });

    this.assignTaskForm = this.fb.group({
      taskId: [Validators.required],
      userDeptId: [Validators.required],
      assignedBy: [this.userEmail],
      assignedAt: [new Date().toISOString()],
      activityStatus: [''],
      companyCode: [this.userCompanyCode],
      userEmail: [''],
      type: [this.userType],
    });

    this.adminAccessAllUsers();
    this.getUsers();
    this.getAssignedUsers();
    this.getAllGlobalTask();
    if (this.adonaiRole === 'ADMIN' || this.crmRole === 'ADMIN') {
      this.isAdmin = true;
      this.getALLManualTasks();
      this.fetchTasksAssignedBy();
    }
    else {
      this.isAdmin = false;
      this.fetchTasksAssignedTo();
    }

  }

  taskModal(content1: any) {
    this.modalService.open(content1, { centered: true });
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
    this.manualTaskSubmitted = false;
    if (task) {
      this.selectedManualTaskId = task.id ?? task.taskId ?? null;
      const matchedUser = this.userList?.find(
        (u: any) => u.email === task.assignedTo
      );
      this.manualTaskForm.patchValue({
        name: task.name || '',
        description: task.description || '',
        result: task.result || '',
        assignedTo: matchedUser ? matchedUser.email : task.assignedTo || '',
        currentStatus: task.currentStatus || '',
        leadApproval: task.leadApproval || '',
        managerApproval: task.managerApproval || ''
      });
      if (this.adonaiRole === 'ADMIN') {
        this.manualTaskForm.enable();
      } else {
        this.manualTaskForm.disable();
        this.manualTaskForm.get('currentStatus')?.enable();
      }
    } else {
      this.selectedManualTaskId = null;
      this.manualTaskForm.enable();
    }
    this.modalService.open(content3, { backdrop: 'static', });
  }

  assignTaskModal(content2: any) {
    this.modalService.open(content2, { scrollable: true, centered: true, },);
  }

  adminAccessAllUsers() {
    const companyCode = this.userCompanyCode;
    this.switchService.adminAccessAllUsers(companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.adminAccessUsers = res.data || res;
          const currentValue = this.assignTaskForm.get('userDeptId')?.value;
          if (!currentValue && this.adminAccessUsers.length > 0) {
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

  createManualTask(modal: any): void {
    this.manualTaskSubmitted = true;
    if (this.manualTaskForm.invalid) {
      this.toastr.error('Please fill in required fields.');
      return;
    }
    const payload = {
      name: this.manualTaskForm.value.name,
      description: this.manualTaskForm.value.description,
      assignedTo: this.manualTaskForm.value.assignedTo,
      result: this.manualTaskForm.value.result,
      companyName: this.userCompanyName,
      companyCode: this.userCompanyCode,
      type: this.userType
    };
    console.log(payload)
    this.switchService.createManualTask(payload).subscribe({
      next: () => {
        this.toastr.success('Manual Task Created ');
        this.getALLManualTasks();
        modal.close();
      }
    });
  }

  updateManualTask(modal: any): void {
    this.manualTaskSubmitted = true;
    if (this.manualTaskForm.invalid) {
      this.toastr.error('Please fill in required fields.');
      return;
    }
    const formValue = this.manualTaskForm.getRawValue();
    const existingTask = this.manualAssignTaskList?.find(
      (task: any) => task.id === this.selectedManualTaskId
    );
    let payload: any;
    if (this.adonaiRole === 'ADMIN') {
      payload = {
        ...formValue,
        id: this.selectedManualTaskId,
        companyName: this.userCompanyName,
        companyCode: this.userCompanyCode,
        type: this.userType
      };
    } else {
      payload = {
        id: this.selectedManualTaskId,
        name: existingTask?.name,
        description: existingTask?.description,
        result: existingTask?.result,
        assignedTo: existingTask?.assignedTo,
        leadApproval: existingTask?.leadApproval,
        managerApproval: existingTask?.managerApproval,
        companyName: this.userCompanyName,
        companyCode: this.userCompanyCode,
        type: this.userType,
        currentStatus: formValue.currentStatus
      };
    }
    console.log('Payload sent to backend:', payload);
    // this.switchService.updateManualTask(payload).subscribe({
    //   next: () => {
    //     this.toastr.success('Task updated successfully');
    //     this.adonaiRole === 'ADMIN' ? this.getALLManualTasks() : this.loadAssignedTasks();
    //     modal.close();
    //   }
    // });
  }

  resetManualTaskForm(modal: any) {
    this.manualTaskForm.reset();
    this.manualTaskSubmitted = false;
    this.selectedManualTaskId = null;
    modal.close();
  }




  deleteManualTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.switchService.deleteManualTaskById(taskId).subscribe((res: any) => {
        this.toastr.success('Manual Task deleted');
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
        this.toastr.success(res.message || 'Task updated');
        modal.close();
        this.globalTaskForm.reset();
        this.selectedTaskId = null;
        this.globalTaskSubmitted = false;
        this.getAllGlobalTask();
      });
    } else {
      payload.createdBy = this.userName;
      this.switchService.createGloabalTaks(payload).subscribe((res: any) => {
        this.toastr.success(res.message || 'Task created');
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
          this.categorizeTasks();
        }
      }
    });
  }

  fetchTasksAssignedTo() {
    const email = this.userEmail;
    const companyCode = this.userCompanyCode;
    this.switchService.getTasksAssignTo(email, companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.manualAssignTaskList = res.data || res;
          this.manualAssignTaskCount = this.manualAssignTaskList.length;
          this.categorizeTasks();
        }
      }
    });
  }

 categorizeTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  const list = this.isAdmin ? this.manualTaskList : this.manualAssignTaskList;
  this.yesterdayTasks = [];
  this.todayTasks = [];
  this.thisWeekTasks = [];
  list.forEach(task => {
    const taskDate = new Date(task.createdTime);
    const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate()).getTime();
    if (taskDay === today.getTime()) {
      this.todayTasks.push(task);
    } else if (taskDay === yesterday.getTime()) {
      this.yesterdayTasks.push(task);
    }
    else if (taskDay >= weekStart.getTime() && taskDay < yesterday.getTime()) {
      this.thisWeekTasks.push(task);
    }
  });
}

  deleteGlobalTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.switchService.deleteGlobalTaskById(taskId).subscribe((res: any) => {
        this.toastr.success('Global Task deleted');
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
          this.toastr.success('Task deleted');
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
    this.switchService.assignTasksRoles(payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Task assigned');
        modal.close();
        this.loadAssignedTasks();
        this.assignTaskForm.reset();
        this.assignTaskSubmitted = false;
      },
    });
  }

  onUserChange(selectedUser: any) {
    if (selectedUser) {
      const email = this.showAllUsers ? selectedUser : selectedUser.userEmail;
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
            this.assignedUserId = 0;
            this.assignTaskForm.patchValue({
              userDeptId: selectedUser.userEmail,
              userEmail: selectedUser.email
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
            taskName: matched?.name,
            description: matched?.description,
            result: matched?.result,
            recurringStatus: matched?.recurringStatus?.toUpperCase(),
          };
        });
        this.assignedTasksCount = this.assignedTasksList.length;
      },
    });
  }

  fetchTasksAssignedBy() {
    const email = this.userEmail;
    const companyCode = this.userCompanyCode;
    this.switchService.fetchTasksAssignedBy(email, companyCode).subscribe({
      next: (res: any) => {
        if (res) {
          this.adminList = res;
        }
      }
    });
  }

  getUserColor(user: any): string {
    const key =
      user?.email ||
      user?.userEmail ||
      user?.followUpBy ||
      user?.executive ||
      user?.assignedTo ||
      user?.assignedBy ||
      'default';
    const index = this.hashString(key) % this.userColors.length;
    return this.userColors[index];
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  getRecurringStatusBadge(status: string): string {
    switch (status) {
      case 'DAILY':
        return 'bg-primary';
      case 'WEEKLY':
        return 'bg-success';
      case 'SATURDAY':
        return 'bg-warning';
      case 'SUNDAY':
        return 'bg-danger';
      case 'MONTHLY':
        return 'bg-info';
      case 'SAT_SUN':
        return 'bg-secondary';
      case 'NONE':
        return 'bg-danger';
      default:
        return 'bg-light';
    }
  }

  
  toggleAllUsers(event: any) {
    this.showAllUsers = event.target.checked;
    if (this.showAllUsers) {
      const deptUserIds = this.adminAccessUsers.map(u => u.id);
      const deptUserEmails = this.adminAccessUsers.map(u => u.userEmail);
      this.filteredAllUsers = this.userList.filter(
        (user: any) =>
          !deptUserIds.includes(user.id) && !deptUserEmails.includes(user.email)
      );
    } else {
      this.filteredAllUsers = [];
    }
  }

  getStageClass(status: string): string {
    if (!status) return 'badge';
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'badge badge-stage in-progress';
    if (s.includes('start')) return 'badge badge-stage not-started';
    if (s.includes('complete') || s.includes('done')) return 'badge badge-stage completed';
    return 'badge badge-stage';
  }

  getPriorityClass(priority: string): string {
    if (!priority) return 'badge';
    const p = priority.toLowerCase();
    if (p === 'high') return 'badge badge-priority high';
    if (p === 'medium') return 'badge badge-priority medium';
    if (p === 'low') return 'badge badge-priority low';
    return 'badge badge-priority';
  }





}
