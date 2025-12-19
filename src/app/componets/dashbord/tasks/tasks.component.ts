import { Component } from '@angular/core';
import flatpickr from 'flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [SharedModule, NgSelectModule, NgbModule, NgbNavModule, NgbDropdownModule, FlatpickrModule,
    FormsModule, ReactiveFormsModule, CommonModule],
  providers: [NgbModalConfig, NgbModal, FlatpickrDefaults],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : ''; campaignName: any; taskForm!: FormGroup;
  taskList: any[] | null = null;  agentUsers: any[] = []; campaignList: any[] = [];
  modal: any;selectedTaskId: string = '';access : any;
  selectedCampaign: any; currentUser: any;
  adoanAiRole: any;
  inprogressTasks: any[] = [];
  verifyTasks: any[] = [];
  completedTasks: any[] = [];userList:any[]=[];
  constructor(
    private modalService: NgbModal, public switchService: SwitherService,
    private toastr: ToastrService, private fb: FormBuilder,
  ) {
    this.userData = localStorage.getItem('userDetails');
    this.adoanAiRole = JSON.parse(this.userData).adonaiRole;
  }
  open(content: any) {
    this.modalService.open(content, { centered: true });
  }
  flatpickrOptions: any = {
    inline: true,
  };
  ngOnInit(): void {
    this.access = JSON.parse(localStorage.getItem('userAccess') || '{}');
    this.fetchTasks();
    this.getUsers();
    this.taskForm = this.fb.group({
      deadline: ['',],
      taskName: ['',],
      assignedTo: ['',],
      priority: ['',],
      description: ['',],
      currentStatus: [''],
      leadIdList: [''],
      companyCode: [this.userCompanyCode],
      email: [this.userEmail],
      type: [this.userType]
    });
    if (this.adoanAiRole !== 'ADMIN') {
    Object.keys(this.taskForm.controls).forEach(control => {
      if (control !== 'currentStatus') {
        this.taskForm.get(control)?.disable();
      }
    });
  }
    // this.flatpickrOptions = {
    //   enableTime: true,
    //   noCalendar: true,
    //   dateFormat: 'H:i',

    // };
    // flatpickr('#addignedDate', this.flatpickrOptions);
  }

  openEditTaskModal(task: any, modalContent: any) {
     this.selectedTaskId = task.taskGenId; 
    this.taskForm.patchValue({
      taskName: task.taskName,
      currentStatus : task.currentStatus,
      assignedTo: task.assignedTo,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      priority: task.priority,
      description: task.description
    });
    if (this.taskForm.get('currentStatus')?.value === 'Completed') {
      this.taskForm.get('currentStatus')?.disable();
    }
    else{
      this.taskForm.get('currentStatus')?.enable();
    }
    this.modalService.open(modalContent, { backdrop: 'static' });
  }


  // fetchTasks() {
  //   let payload = {
  //     email: this.userEmail,
  //     companyCode: this.userCompanyCode,
  //     type: this.userType,
  //   };
  //   this.switchService.fetchTasks(payload).subscribe({
  //     next: (res) => {
  //       this.taskList = res;
  //     },
  //     error: (err) => {
  //       this.toastr.error('Something went wrong!');
  //     }
  //   });
  // }

  fetchTasks() {
    const payload = {
      currentUser: this.userEmail
    };
    this.switchService.fetchTasksCreatedBy(payload).subscribe({
      next: (res) => {
        this.taskList = [
          ...(res.createdTaskList || []),
          ...(res.assignedTaskList || [])
        ];
        const tasks = [...(res.createdTaskList || []), ...(res.assignedTaskList || [])];
        this.inprogressTasks = tasks.filter((t: any) => t.currentStatus === 'Inprogress');
        this.verifyTasks = tasks.filter((t: any) => t.currentStatus === 'At to Verify');
        this.completedTasks = tasks.filter((t: any) => t.currentStatus === 'Completed');
        if (this.adoanAiRole !== 'ADMIN') {
          Object.keys(this.taskForm.controls).forEach(control => {
            if (control !== 'currentStatus') {
              this.taskForm.get(control)?.disable();
            }
            
          });
        }
      },
      error: (err) => {
        this.toastr.error('Something went wrong!');
      }
    });
  }

  updateTaskSubmit(modal: any) {
    if (this.taskForm.invalid) {
      return;
    }
    const payload = {
      ...this.taskForm.getRawValue(),
      taskGenId: this.selectedTaskId
    };
    this.switchService.updateTasks(payload).subscribe({
      next: (res) => {
        this.toastr.success('Task updated successfully!');
         if (this.taskForm.get('currentStatus')?.value === 'Completed') {
        this.taskForm.get('currentStatus')?.disable();
      }
        modal.close();
        this.fetchTasks();
      },
      error: (err) => {
        this.toastr.error('Failed to update task!');
      }
    });
  }

  getAgentUsers(agentEmails: string[]) {
    const cn = JSON.parse(this.userData).companyName;
    const cc = JSON.parse(this.userData).companyCode;
    this.switchService.cmpnyUsers(cn, cc).subscribe({
      next: (users: any[]) => {
        if (Array.isArray(users)) {
          this.agentUsers = users
            .filter((user) => agentEmails.includes(user.email))
            .map((user) => ({
              email: user.email,
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
            }));
        } else {
          this.toastr.error('Unexpected user data format.');
        }
      },
      error: (err) => {
        this.toastr.error(err.statusText || 'Error while fetching users.');
      },
    });
  }

  getAgentColor(agent: string): string {
    const colors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-info'];
    const index = agent.trim().charCodeAt(0) % colors.length;
    return colors[index];
  }

  getPriorityBadge(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'badge bg-danger-transparent';
      case 'high':
        return 'badge bg-warning-transparent';
      case 'medium':
        return 'badge bg-info-transparent';
      case 'low':
        return 'badge bg-success-transparent';
      default:
        return 'badge bg-secondary-transparent';
    }
  }

  getPriorityBadgeBorder(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'border border-danger';
      case 'high':
        return 'border border-warning';
      case 'medium':
        return 'border border-info';
      case 'low':
        return 'border border-success';
      default:
        return 'border border-secondary';
    }
  }

  getPriorityIconColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'text-danger';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-info';
      case 'low':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  }

  updateLocalTask(payload: any) {
    this.inprogressTasks = this.inprogressTasks.filter(t => t.id !== payload.id);
    this.verifyTasks = this.verifyTasks.filter(t => t.id !== payload.id);
    this.completedTasks = this.completedTasks.filter(t => t.id !== payload.id);
    if (payload.currentStatus === 'Inprogress') {
      this.inprogressTasks.push(payload);
    } else if (payload.currentStatus === 'At to Verify') {
      this.verifyTasks.push(payload);
    } else if (payload.currentStatus === 'Completed') {
      this.completedTasks.push(payload);
    }
  }

  onStatusChange(task: any, newStatus: string) {
    task.currentStatus = newStatus;
    this.updateLocalTask(task);
    this.switchService.updateTasks(task).subscribe();
  }

  getDayLeft(deadline: string | Date): string {
    const today = new Date();
    const dueDate = new Date(deadline);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return `${diffDays} days left`;
    } else if (diffDays === 0) {
      return `Due today`;
    } else {
      return `Expired ${Math.abs(diffDays)} days ago`;
    }
  }

  today: Date = new Date();
  getTaskColor(task: any): string {
    if (!task.deadline) return 'bg-secondary-transparent';
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    if (deadlineDate < today) {
      return 'bg-danger-transparent';
    }
    if (deadlineDate.getTime() === today.getTime()) {
      return 'bg-warning-transparent';
    }
    return 'bg-success-transparent';
  }

  getfullDaysLeft(task: any): string {
    if (!task.deadline) return '';
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day's Due`;
    } else if (diffDays === 0) {
      return `Due today`;
    } else {
      return `${diffDays} day's left`;
    }
  }

  getStatusBadge(status: string): string {
    switch (status?.trim()) { 
      case 'Begin':
        return 'badgess bg-secondary-transparent';
      case 'Inprogress':
        return 'badgess bg-warning-transparent';
      case 'At to Verify':
        return 'badgess bg-info-transparent';
      case 'Completed':
        return 'badgess bg-success-transparent';
      default:
        return 'badgess bg-danger-transparent';
    }
  }






  getOverdueTasks(): any[] {
    if (!this.taskList) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskList.filter(task => {
      if (!task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      return deadlineDate < today;
    });
  }

  getUsers() {
    if (JSON.parse(this.userData).type == 2) {
      // this.switchService.getAllUsers().subscribe({ next: (res:any) => {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
             
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        error: (error) => {
          // this.toastr.error(error.statusText);
        },
      })
    }
  }

  hasPermission(key: string): boolean {
  const access = JSON.parse(localStorage.getItem("userAccess") || "{}");
  return !!access[key];
  }


}

