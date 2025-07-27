import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { Router } from '@angular/router';
// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: string;
  dirchange?: boolean;
  title?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  Menusub?: boolean;
  target?: boolean;
  menutype?: string;
  isVisible?: boolean;
  linkType?:string;
}

@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Search Box
  public search = false;

  // Language
  public language = false;

  // Mega Menu
  public megaMenu = false;
  public levelMenu = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen = false;
  active: any;
  public isAdonaiApplicable$ = new BehaviorSubject<boolean>(false);
  public isCRMApplicable$ = new BehaviorSubject<boolean>(false);
  public adonaiRole$ = new BehaviorSubject<string>("USER");
  public crmRole$ = new BehaviorSubject<string>("USER");

  constructor(private router: Router) {
     this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    // Dashboard
    { headTitle: 'MAIN' },
    // {
    //   title: 'Dashboard',
    //   icon: 'bi-house',
    //   dirchange: false,
    //   active: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   path: '/dashboard/sales',
    // },
    // {
    //   title: 'CRM',
    //   icon: 'bi-file-earmark',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   // path : `https://crmexpert.vcs.plus/auth/access_account/${JSON.parse(this.userData).encodeEmail}`
    //   path: '/dashboard/crm'
    // }, 
    {
      title: 'Projects',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      icon: ' bi-layers side-menu__icon',
      active: false,
      selected: false,
      path: '/dashboard/projects',
    },
    {
      title: 'Products',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      icon: ' bi-layers side-menu__icon',
      active: false,
      selected: false,
      path: '/dashboard/products',
    },
    {
      title: 'enterprise',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      icon: 'bi-file-earmark',
      active: false,
      selected: false,
      path: '/dashboard/enterprise',
    },
    {
      title: 'Adonai Users',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      icon: 'bi-file-earmark',
      active: false,
      selected: false,
      path: '/dashboard/adonai-users',
    },
    {
      title: 'bom',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      icon: 'bi bi-graph-up',
      active: false,
      selected: false,
      path: '/dashboard/bom',
    },
    
    // {
    //   title: 'Adonai',
    //   icon: 'bi bi-rulers',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path: '/dashboard/adonai'
    // },
    // {
    //   title: 'To-Do-List',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   icon :'bi-check2-square',
    //   active: false,
    //   selected: false,
    //   path: '/pages/to-do-list',
    // },
    // {
    //   title: 'HRM',
    //   icon: 'bi-file-earmark',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path : "/dashboard/hrm"
    // },
    // {
    //   title: 'Customer',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   icon : 'bi bi-person',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/customer',
    // },
    // {
    //   title: 'Settings',
    //   icon: 'bi bi-gear',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path : "/dashboard/settings"
    // },
    
    // {
    //   title: 'Analytics',
    //   dirchange: false,
    //   type: 'link',
    //   icon : 'bi bi-graph-up',
    //   active: false,
    //   selected: false,
    //   linkType : 'internal',
    //   path: '/dashboard/analytics',
    // },
    
    // {
    //   title: 'Crm',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   icon :'bi-file-earmark',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/crm2',
    // },
    {
      title: 'superadmin',
      icon: 'bi bi-shield-lock',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      active: false,
      path : "/dashboard/superadmin"
    },
    // {
    //   title: 'Dashboard2',
    //   icon: 'bi bi-shield-lock',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path : "/dashboard/dashboard2"
    // },
    
        
    // //PAGES
    // { headTitle: 'PAGES' },
    // {
    //   title: 'Crm & Sales',
    //   icon: 'bi-file-earmark',
    //   type: 'link',
    //   dirchange: false,
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/crm',
    // },
    
    // // authentication
    // { headTitle: 'AUTHENTICATION' },
    // {
    //   title: 'Accounts & Finace',
    //   icon: 'bi-key',
    //   dirchange: false,
    //   type: 'link',
    //   active: false,
    //   selected: false,
    // },
    // // ERROR
    // { headTitle: 'ERROR' },
    // {
    //   title: 'Reports & Controls',
    //   icon: 'bi- bi-exclamation-triangle',
    //   dirchange: false,
    //   type: 'link',
    //   active: false,

    // },
    // {
    //   title: 'Projects',
    //   dirchange: false,
    //   type: 'link',
    //   icon: ' bi-layers side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/projects',
    // },
    {
      title: 'leads',
      icon: 'bi-layout-text-window side-menu__icon',
      dirchange: false,
      type: 'link',
      linkType : 'internal',
      active: false,
      path: '/apps/crm/leads'
    },
    
    
    // {
    //   title: 'reports',
    //   icon: 'bi-layout-text-window side-menu__icon',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path: '/apps/crm/reports'
    // },
    // {
    //   title: 'Designers',
    //   dirchange: false,
    //   type: 'link',
    //   icon: ' bi-file-earmark-text side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/designers',
    // },
    // {
    //   title: 'my-Tasks',
    //   dirchange: false,
    //   type: 'link',
    //   icon: 'bi-layout-text-window side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/mytask',
    // },
    // {
    //   title: 'users',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   icon: 'bi-people',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/users',
    // },
    // {
    //   title: 'optimizer',
    //   icon: 'bi-file-earmark',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path : "/dashboard/optimizer"
    // },
    {
      title: 'Optimization',
      icon: 'bi bi-grid side-menu__icon',
      dirchange: false,
      type: 'sub',
      active: false,
      children: [
        // {
        //   title: 'optimizer',
        //   icon: 'bi-file-earmark',
        //   dirchange: false,
        //   type: 'link',
        //   linkType : 'internal',
        //   active: false,
        //   path : "/dashboard/optimizer"
        // },        
        {
          title: 'Products',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/products',
        },
        {
          title: 'Panel',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/panel',
        },
        {
          title: 'Skin',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/skin',
        },
        {
          title: 'Edgeband',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/edgeband',
        },
        {
          title: 'Process Panel',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/processPanel',
        },
      ],
    },
    {
      title: 'CRM',
      icon: 'bi bi-file-earmark side-menu__icon',
      dirchange: false,
      type: 'sub',
      active: false,
      children: [
        {
          title: 'Campaigns',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          icon: ' bi-layers side-menu__icon',
          active: false,
          selected: false,
          path: '/dashboard/campaigns',
        }, 
        {
          title: 'Deals',
          icon: 'bi-grid side-menu__icon',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          active: false,
          path: '/apps/crm/deals'
        },
        {
          title: 'Tasks',
          icon: 'bi-bag side-menu__icon',
          dirchange: false,
          type: 'link',
          linkType: 'internal',
          active: false,
          path: '/dashboard/tasks'
        },
        {
          title: 'Reports',
          icon: 'bi-layout-text-window side-menu__icon',
          dirchange: false,
          type: 'link',
          linkType : 'internal',
          active: false,
          path: '/dashboard/reports'
        },
        {
          title: 'CRM Settings',
          icon: 'bi-layout-text-window side-menu__icon',
          dirchange: false,
          type: 'link',
          linkType: 'internal',
          active: false,
          path: '/dashboard/crm-settings'
        },
        // {
        //   title: 'Support',
        //   icon: 'bi-layout-text-window side-menu__icon',
        //   dirchange: false,
        //   type: 'link',
        //   linkType: 'internal',
        //   active: false,
        //   path: 'pages/chat'
        // },
        {
          title: 'Support',
          icon: 'bi-layout-text-window side-menu__icon',
          dirchange: false,
          type: 'link',
          linkType: 'internal',
          active: false,
          path: '/dashboard/support'
        },
        
              
      ],
    },
    {
      title: 'Appointment',
      icon: 'bi-layout-text-window side-menu__icon',
      dirchange: false,
      type: 'link',
      linkType: 'internal',
      active: false,
      path: '/dashboard/appointments'
    },
    {
      title: 'Quotation',
      dirchange: false,
      type: 'link',
      icon: ' bi-file-earmark-text side-menu__icon',
      linkType: 'internal',
      active: false,
      selected: false,
      path: '/dashboard/quotation',
    },
    
    // {
    //   title: 'proposal',
    //   icon: 'bi-bag side-menu__icon',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path: '/apps/crm/proposal'
    // },
    // {
    //   title: 'clients',
    //   icon: 'bi-suitcase-lg side-menu__icon',
    //   dirchange: false,
    //   type: 'link',
    //   linkType : 'internal',
    //   active: false,
    //   path: '/apps/crm/clients'
    // },
    // {
    //   title: 'Project-details',
    //   dirchange: false,
    //   type: 'link',
    //   icon: 'bi-layout-text-window side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/Project-details',
    // },
    // {
    //   title: 'Recce',
    //   dirchange: false,
    //   type: 'link',
    //   icon: 'bi-layout-text-window side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/recce',
    // },
    // {
    //   title: 'Order-Details',
    //   dirchange: false,
    //   type: 'link',
    //   icon: ' bi-file-earmark-text side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/Order-Details',
    // },
    // {
    //   title: 'Quotation',
    //   dirchange: false,
    //   type: 'link',
    //   icon: ' bi-file-earmark-text side-menu__icon',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/quotation',
    // },
    // // APPS
    // { headTitle: 'APPS' },
    // {
    //   title: ' 3D Visualizer',
    //   icon: ' bi-grid side-menu__icon',
    //   dirchange: false,
    //   type: 'link',
    //   active: false,

    // },
    // //NESTED-MENU
    // {
    //   title: 'Pricing',
    //   dirchange: false,
    //   icon: 'bi-currency-dollar',
    //   type: 'link',
    //   active: false,
    //   selected: false,
    //   path: '/pages/pricing',
    // },
    
    // {
    //   title: 'Organisation Settings',
    //   dirchange: false,
    //   icon: 'bi bi-gear',
    //   type: 'link',
    //   active: false,
    //   selected: false,
    //   path: '/dashboard/orgSettings',
    // },

    

  ];
  



  
//   MENUITEMS: Menu[] = [
//     {
//     title: 'Dashboard',
//       icon: 'bi-house',
//       dirchange: false,
//       active: false,
//       type: 'link',
//       path: '/dashboard/sales',
//     },
//     //PAGES
//     { headTitle: 'PAGES' },
//     {
//       title: 'Crm & Sales',
//       icon: 'bi-file-earmark',
//       type :'link',
//       dirchange: false,
//       active: false,
//       selected: false,
//       path: '/dashboard/crm',
    
//         // ERROR
//     },
//     {
//       title: 'Reports & Controls',
//       icon: 'bi- bi-exclamation-triangle',
//       dirchange: false,
//       type: 'link',
//       active: false,
//       children: [
       
//       ],
//     },
//      {
//         title: 'Projects',
//         dirchange: false,
//         type: 'link',
//         icon: ' bi-layers side-menu__icon',
//         active: false,
//         selected: false,
//         path: '/dashboard/projects',
//       },
//       {
//         title: 'Project-Details',
//         dirchange: false,
//         type: 'link',
//         icon: ' bi-file-earmark-text side-menu__icon',
//         active: false,
//         selected: false,
//         path: '/dashboard/Project-Details',
//       },
      // {
      //   title: 'my-Tasks',
      //   dirchange: false,
      //   type: 'link',
      //   icon: 'bi-layout-text-window side-menu__icon',
      //   active: false,
      //   selected: false,
      //   path: '/dashboard/mytask',
      // },
//       {
//         title: 'Order-Details',
//         dirchange: false,
//         type: 'link',
//         icon: ' bi-file-earmark-text side-menu__icon',
//         active: false,
//         selected: false,
//         path: '/dashboard/Order-Details',
//       },
//       {
//         title: 'Quotation',
//         dirchange: false,
//         type: 'link',
//         icon: ' bi-file-earmark-text side-menu__icon',
//         active: false,
//         selected: false,
//         path: '/dashboard/quotation',
//       },
//     // APPS
//     { headTitle: 'APPS' },
//     {
//       title: ' 3D Visualizer',
//       icon: ' bi-grid side-menu__icon',
//       dirchange: false,
//       type: 'link',
//       active: false,
      
//     },
  
// {
//             title: 'Pricing',
//             dirchange: false,
//             icon : 'bi-currency-dollar',
//             type: 'link',
//             active: false,
//             selected: false,
//             path: '/pages/pricing',
//           },
//           {
//             title: 'Settings',
//             dirchange: false,
//             icon : 'bi bi-gear',
//             type: 'link',
//             active: false,
//             selected: false,
//             path: '/dashboard/orgSettings',
//           },
 //       ]

 
  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
