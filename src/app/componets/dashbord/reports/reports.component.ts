import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModuleModule } from '../../../material-module/material-module.module';
import { NgbDropdownModule,NgbNavModule,NgbModal, NgbModalConfig, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SwitherService } from '../../../shared/services/swither.service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DatePipe, MatFormFieldModule,MaterialModuleModule,SharedModule,NgSelectModule, NgbModule, NgbNavModule, NgbDropdownModule,],
  providers: [NgbModalConfig, NgbModal,],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  displayedColumns: string[] = ['slNo', 'name', 'role', 'number', 'date','totalCallsAttempted','totalCallsConnectd', 'totalCallsNotConnectd','totalInprogressLeads', 'totalConvertedLeads','totalLostleads','startcallingtime'];
  displayedUsersColumns: string[] = ['slNo', 'campaignName','totalLeads','totalConnected','totalNotConnectd'];
  dataSource = new MatTableDataSource<any>();
  dataSources1 = new MatTableDataSource<any>();

  showTable: boolean = false;
   userDataStorage = localStorage.getItem('userDetails');
  userData: any = this.userDataStorage ? JSON.parse(this.userDataStorage) : null;
  userEmail: string = this.userData ? this.userData.email : '';
  userName: string = this.userData ? this.userData.username : '';
  userCompanyCode: string = this.userData ? this.userData.companyCode : '';
  userCompanyName: string = this.userData ? this.userData.companyName : '';
  userType: any = this.userData ? this.userData.type : ''; campaignName :any;
  temp: any[] = [];userList:any[] = [];  
  campaignCount: any; campaignId :string ='';
  newUser: string = '';campaignList: any[] = [];campaignNameLst:any;public leadCounts: { [campaignId: string]: number } = {};
  stageCounts: { [campaignId: string]: { [stage: string]: number } } = {};totalLeadCount: any;
  selectedCampaignId: string | null = null;expandedStages: { [campaignId: string]: boolean } = {};
  totalUsersCount : number =0;allUserLeadCounts: { [userEmail: string]: number } = {};
  totalConnected : number =0; totalNotConnected  : number=0;leadCount : number =0;leadStatusCount:any;
  userStatsList: any[] = [];userOpenIndex: number | null = null;openedCampaignSection: any = {};
  topshowMore = false;showMore = true;dataSourceTable: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 
  pageSize = 10;
   constructor(private modalService: NgbModal,public switchService: SwitherService,  private toastr: ToastrService, ) {
      this.userData = localStorage.getItem('userDetails');
      // super();
      
    }
  ngOnInit(): void {
    this.getUsers();
    this.getCampaignData();
    this.campaignList.forEach(campaign => {
      this.getLeadCountForCampaign(campaign.campgnId);
    });
    this.getfetchLeadsIndividual();
  }
  
  modal: any;
  
  open(content:any) {
    this.modalService.open(content,{ centered: true });
  }
  flatpickrOptions: any = {
    inline: true,
  };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getSNo(index: number): number {
    if ( this.paginator && this.paginator.pageIndex !== undefined &&
         this.paginator.pageSize !== undefined
    ) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }

  dataSources = [
  {
    slNo: 1,
    name: 'John Doe',
    role: 'Sales Executive',
    number: '9876543210',
    date: '2024-05-20',
    totalCallsAttempted: 50,
    totalCallsConnectd: 35,
    totalCallsNotConnectd: 15,
    totalInprogressLeads: 5,
    totalConvertedLeads: 8,
    totalLostleads: 2,
    email: 'john.doe@example.com',
    city: 'New York'
  },
  {
    slNo: 2,
    name: 'Jane Smith',
    role: 'Sales Manager',
    number: '9876512340',
    date: '2024-05-21',
    totalCallsAttempted: 60,
    totalCallsConnectd: 45,
    totalCallsNotConnectd: 15,
    totalInprogressLeads: 7,
    totalConvertedLeads: 10,
    totalLostleads: 3,
    email: 'jane.smith@example.com',
    city: 'Los Angeles'
  },
  {
    slNo: 3,
    name: 'Mike Johnson',
    role: 'Account Manager',
    number: '9876523451',
    date: '2024-05-22',
    totalCallsAttempted: 70,
    totalCallsConnectd: 50,
    totalCallsNotConnectd: 20,
    totalInprogressLeads: 6,
    totalConvertedLeads: 12,
    totalLostleads: 4,
    email: 'mike.johnson@example.com',
    city: 'Chicago'
  },
  ];

  showDetailsMap: { [key: string]: boolean } = {};
  toggleDetails(taskId: string | number) {
    this.showDetailsMap[taskId] = !this.showDetailsMap[taskId];
  }

  getUsers() {
    if (JSON.parse(this.userData).type == 2) {
      let cn = JSON.parse(this.userData).companyName;
      let cc = JSON.parse(this.userData).companyCode;
      this.switchService.cmpnyUsers(cn, cc).subscribe({
        next: (res: any) => {
          if (res) {
            this.userList = res;
            if (this.userList.length >= 0) {
              // this.onSelectUser(this.userList[0]);
            }
            this.totalUsersCount = this.userList.length;
          } else {
            this.toastr.error(res.message, 'signup', {
              timeOut: 3000,
              positionClass: 'toast-top-right',
            });
          }
        },
        // error: (error) => {
        //   this.toastr.error(error.statusText);
        // },
      });
    }
  }
  
  getCampaignData() {
    const payload = {
      email: this.userEmail,
      companyCode: this.userCompanyCode,
      type: this.userType,
    };
    this.switchService.displayCampaignData(payload).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.campaignList = res;
           if (this.campaignList.length > 0) {
              const firstCampaignId = this.campaignList[0].campgnId;
              this.selectCampaign(firstCampaignId);
            }
          this.campaignNameLst= res.map((c: any) => c.campaignName);
          this.campaignCount = this.campaignList.length;
      this.loadAllUserStats();
        } else {
          this.toastr.error("Unexpected response format.");
        }
      },
    });
  }

  
  getLeadCountForCampaign(campaignId: string) {
    this.switchService.FetchLeadData(this.userEmail, campaignId).subscribe({
    next: (res: any) => {
      const executiveList = res.executiveList || [];
      const entryList = res.entryList || [];
      const combined = [...executiveList, ...entryList];

      this.leadCounts[campaignId] = combined.length;

      const stageMap: { [key: string]: number } = {};
      combined.forEach((lead) => {
        const stage = lead.stage || 'Unknown';
        stageMap[stage] = (stageMap[stage] || 0) + 1;
      });

      this.stageCounts[campaignId] = stageMap;

      this.updateTotalLeadCount();
    },
    error: () => {
      this.leadCounts[campaignId] = 0;
      this.stageCounts[campaignId] = {};
      this.updateTotalLeadCount();
    }
    });
  }

  updateTotalLeadCount() {
    this.totalLeadCount = Object.values(this.leadCounts).reduce((sum, count) => sum + count, 0);
  }


  selectCampaign(campaignId: string) {
    this.selectedCampaignId = campaignId;

    if (!this.leadCounts[campaignId]) {
      this.getLeadCountForCampaign(campaignId);
    }
  }

  toggleStages(campaignId: string | null) {
  if (!campaignId) return;

  // Always toggle expanded/collapsed
  this.expandedStages[campaignId] = !this.expandedStages[campaignId];
  }


selectedUser: any = null;
userCampaignCount: number = 0;
userTotalLeads: number = 0;
loadingUserStats: boolean = false;

// onSelectUser(user: any) {
//   this.selectedUser = user;
//   this.userCampaignCount = 0;
//   this.userTotalLeads = 0;
//   this.totalConnected = 0;
//   this.totalNotConnected = 0;

//   this.loadingUserStats = true;

//   let activeCampaigns = 0;
//   let totalLeads = 0;
//    let connectedLeads = 0;
//   let notConnectedLeads = 0;

//   const requests = this.campaignList.map(campaign =>
//     this.switchService.FetchLeadData(user.email, campaign.campgnId).toPromise()
//       .then((res: any) => {
//         const executiveList = res.executiveList || [];
//         const entryList = res.entryList || [];
//         const combined = [...executiveList, ...entryList];

//         if (combined.length >= 0) {
//           activeCampaigns++;
//           totalLeads += combined.length;
//         }
//         combined.forEach(lead => {
//             if (lead.status?.toLowerCase() === 'connected') {
//               connectedLeads++;
//             } else {
//               notConnectedLeads++;
//             }
//         });
//       })
//       .catch(err => console.error('Error fetching leads for', campaign.campaignName, err))
//   );

//   Promise.all(requests).then(() => {
//     this.userCampaignCount = activeCampaigns;
//     this.userTotalLeads = totalLeads;
//     this.totalConnected = connectedLeads;
//     this.totalNotConnected = notConnectedLeads;
//     this.loadingUserStats = false;

//     console.log(`User: ${user.email} → Campaigns: ${activeCampaigns}, Leads: ${totalLeads}`);

//     this.dataSources1.data = [
//       {
//         slNo: 1,
//         name: user.username || user.email,
//         role: user.role || '',
//         number: user.phoneNumber || '',
//         date: new Date().toLocaleDateString(),
//         totalCampaigns: this.userCampaignCount,
//         totalCallsAttempted: totalLeads, 
//         totalCallsConnectd: this.totalConnected,           
//         totalCallsNotConnectd: 0,        
//         totalInprogressLeads: 0,         
//         totalConvertedLeads: 0,          
//         totalLostleads: 0,           
//         email: user.email,
//         city: user.city || ''
//       }
//     ];
//   });
// }

getfetchLeadsIndividual() {
    const userType = this.userType;
    this.campaignId = (userType == 1)
      ? 'SINGLE9DD1748413866634'
      : 'DUMMY9DD1748413866634';
    const payload = {
        currentUser : this.userEmail,
        campaignId:this.campaignId

    }
    this.switchService.fetchLeadsIndividual(payload).subscribe({
      next: (res: any) => {
          const now = new Date();
          const executiveList = (res.executiveList || []).map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'executive',
          }));
          const entryList = (res.entryList || []).map((item: any) => ({
            ...item,
            followUpDue: item.followUpDate
              ? new Date(item.followUpDate) < now
              : false,
            followUpDateObj: item.followUpDate
              ? new Date(item.followUpDate)
              : null,
            source: 'entry',
            
          }));
          const combined = [...executiveList, ...entryList];
          this.leadCount = combined.length;
           this.leadStatusCount = combined;
          const statusCounts: { [status: string]: number } = {};
          const statusCompletion : { [completionStatus: string]: number } = {};
          combined.forEach(lead => {
            const status = lead.status?.trim() || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            const completionStatus = lead.completionStatus;
            statusCompletion[completionStatus]= (statusCompletion[completionStatus] || 0) + 1;

          });

          // this.activeCount = statusCounts['active'] || 0;
          this.totalConnected = statusCounts['completed'] || 0;
          this.totalNotConnected= statusCounts['Not Connected'] || 0;
          this.dataSource.data = combined;
          const sortedByFollowUpDate = combined
            .filter((item) => item.followUpDateObj)
            .sort(
              (a, b) =>
                a.followUpDateObj.getTime() - b.followUpDateObj.getTime()
            );
          const nextLead = sortedByFollowUpDate.length
            ? sortedByFollowUpDate[0]
            : null;
        },
      error: (error) => {
        // this.toastr.error(error.statusText || 'Server Error');
      },
    });
  }
loadAllUserStats() {
  this.loadingUserStats = true;

  this.userStatsList = []; // reset
  const userRequests = this.userList.map((user:any) => {

    let activeCampaigns = 0;
    let totalLeads = 0;
    let connectedLeads = 0;
    let notConnectedLeads = 0;
    const campaignRequests = this.campaignList.map(campaign =>
      this.switchService.FetchLeadData(user.email, campaign.campgnId).toPromise()
        .then((res: any) => {

          const executiveList = res.executiveList || [];
          const entryList = res.entryList || [];
          const combined = [...executiveList, ...entryList];

          if (combined.length > 0) activeCampaigns++;

          totalLeads += combined.length;

          combined.forEach(lead => {
            if ((lead.status || "").toLowerCase() === 'connected') {
              connectedLeads++;
            } else {
              notConnectedLeads++;
            }
          });

        })
    );

    return Promise.all(campaignRequests).then(() => {
     const userCampaigns = this.campaignList.filter(camp => {
    const isPoc = camp.campaignPoc?.toLowerCase() === user.email.toLowerCase();
    const isAgent = camp.agents?.toLowerCase().includes(user.email.toLowerCase());

    return isPoc || isAgent;
    });
      console.log('user campaigns',userCampaigns);
      this.userStatsList.push({
        email: user.email,
        username: user.username,
        campaignCount: activeCampaigns,
        totalLeads: totalLeads,
        connected: connectedLeads,
        notConnected: notConnectedLeads,
        campaigns: userCampaigns,
        campaignsLenght : userCampaigns.length,
      });
      this.dataSourceTable = this.userStatsList.flatMap(u =>
        (u.campaigns || []).map((c:any) => ({
          username: u.username,
          campaignName: c.campaignName,
          totalLeads: u.totalLeads,
          connected: u.connected,
          notConnected: u.notConnected
        }))
      );

    this.dataSources1 = new MatTableDataSource(this.dataSourceTable);
    this.dataSources1.paginator = this.paginator;
    this.dataSources1.sort = this.sort;


    });

  });
  Promise.all(userRequests).then(() => {
    this.loadingUserStats = false;
  });
}

  getCampaignLeadCount(email: string, campgnId: any) {
  const user = this.userStatsList.find(u => u.email === email);
  if (!user || !user.leadDetails) {
    return { totalLeads: 0, connected: 0, notConnected: 0 };
  }

  const record = user.leadDetails.find((l: any) => String(l.campgnId) === String(campgnId));
  console.log('record', record);
 
  return {
    totalLeads: user.totalLeads ,
    connected: record.connected ?? 0,
    notConnected: record.notConnected ?? 0
  };
}


  getConnectedCount(email: string, campgnId: number) {
  const user = this.userStatsList.find(u => u.email === email);
  if (!user || !user.leadDetails) return 0;

  const record = user.leadDetails.find((l: any) => l.campgnId === campgnId);
  return record ? (record.connected || 0) : 0;
}

// ✅ Returns not connected leads count for the selected campaign
getNotConnectedCount(email: string, campgnId: number) {
  const user = this.userStatsList.find(u => u.email === email);
  if (!user || !user.leadDetails) return 0;

  const record = user.leadDetails.find((l: any) => l.campgnId === campgnId);
  return record ? (record.notConnected || 0) : 0;
}


openedUsers: any = {};
openedCampaigns: any = {};

isUserOpen(i: number) {
  return this.openedUsers[i];
}
toggleCampaignSection(userIndex: number) {
  this.openedCampaignSection[userIndex] = !this.openedCampaignSection[userIndex];
}
isCampaignSectionOpen(userIndex: number) {
  return this.openedCampaignSection[userIndex];
}


toggleCampaign(userIndex: number, campIndex: number) {
  if (!this.openedCampaigns[userIndex]) this.openedCampaigns[userIndex] = {};
  this.openedCampaigns[userIndex][campIndex] = !this.openedCampaigns[userIndex][campIndex];
}
isCampaignOpen(userIndex: number, campIndex: number) {
  return this.openedCampaigns[userIndex]?.[campIndex];
}
 toggleTopShowMore() {
    this.topshowMore = !this.topshowMore;
    if (this.topshowMore) {
      setTimeout(() => {
        const scrollContainer = document.querySelector('.scrollable-container');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 0);
    }
  }

 onUserSelect(selected: any) {
  const selectedEmail = typeof selected === 'string' ? selected : selected?.email;
  if (!selectedEmail) return;

  this.selectedUser = this.userStatsList.find(u =>
    u.email?.toLowerCase() === selectedEmail.toLowerCase()
  );

  if (!this.selectedUser) return;

  // Initialize storage
  this.selectedUser.leadDetails = [];

  // Fetch lead counts for each campaign
  this.fetchCampaignLeadCounts(this.selectedUser);
  }

  fetchCampaignLeadCounts(user: any) {
  user.campaigns.forEach((c: any) => {
    const campgnId = c.campgnId;
    if (!campgnId) return; // Skip campaigns without ID

    this.switchService.FetchLeadData(user.email, campgnId).subscribe((res: any) => {
      const combined = [...(res.executiveList || []), ...(res.entryList || [])];

      const leadData = {
        campgnId: campgnId,
        campaignName: c.campaignName,
        totalLeads: combined.length,
        connected: combined.filter(l => l.stage === 'Connected').length,
        notConnected: combined.filter(l => l.stage !== 'Connected').length
      };

      // Store the result
      user.leadDetails.push(leadData);

      // Update UI after each API resolves
      this.updateCampaignTable(user);
    });
  });
  }
  updateCampaignTable(user: any) {
  this.dataSourceTable = user.leadDetails.map((l: any) => ({
    campaignName: l.campaignName,
    totalLeads: l.totalLeads,
    connected: l.connected,
    notConnected: l.notConnected
  }));

  this.dataSources1 = new MatTableDataSource(this.dataSourceTable);
  this.dataSources1.paginator = this.paginator;
  this.dataSources1.sort = this.sort;
  }




}
