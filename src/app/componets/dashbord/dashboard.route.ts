import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { salesOnlyGuard } from '../../guards/sales-only.guard';

export const admin: Routes = [
 {path:'dashboard',children:[
   {
  path: 'sales',
  loadComponent: () =>
    import('./sales/sales.component').then((m) => m.SalesComponent),
},
{
  path: 'analytics',
  loadComponent: () =>
    import('./analytics/analytics.component').then(
      (m) => m.AnalyticsComponent
    ),
},
{
  path: 'ecommerce',
  loadComponent: () =>
    import('./ecommerce/ecommerce.component').then(
      (m) => m.EcommerceComponent
    ),
},
// {
//   path: 'crm',
//   loadComponent: () =>
//     import('./crm/crm.component').then((m) => m.CrmComponent),
// },
{
  path: 'adonai',
  loadComponent: () =>
    import('./adonai/adonai.component').then((m) => m.AdonaiComponent),
},
{
  path: 'crm2',
  loadComponent: () =>
    import('./crm2/crm2.component').then((m) => m.CRM2Component),
},
{
  path: 'dashboard2',
  loadComponent: () =>
    import('./dashboard2/dashboard2.component').then((m) => m.Dashboard2Component),
},
{
  path: 'hrm',
  loadComponent: () =>
    import('./hrm/hrm.component').then((m) => m.HrmComponent),
},
{
  path: 'superadmin',
  loadComponent: () =>
    import('./superadmin/superadmin.component').then((m) => m.SuperadminComponent),
},
{
  path: 'nft',
  loadComponent: () =>
    import('./nft/nft.component').then((m) => m.NftComponent),
},
{
  path: 'crypto',
  loadComponent: () =>
    import('./crypto/crypto.component').then((m) => m.CryptoComponent),
},
{
  path: 'jobs',
  loadComponent: () =>
    import('./jobs/jobs.component').then((m) => m.JobsComponent),
},
{
  path: 'projects',
  loadComponent: () =>
    import('./projects/projects.component').then((m) => m.ProjectsComponent),
},
{
  path: 'boq',
  loadComponent: () =>
    import('./boq/boq.component').then((m) => m.BoqComponent),
},
{
  path: 'support',
  loadComponent: () =>
    import('./support/support.component').then((m) => m.SupportComponent),
},
{
  path: 'adonai-users',
  loadComponent: () =>
    import('./adonai-users/adonai-users.component').then((m) => m.AdonaiUsersComponent),
  canActivate: [salesOnlyGuard],
},

{
  path: 'products',
  loadComponent: () =>
    import('./products/products.component').then((m) => m.ProductsComponent),
},
{
  path: 'panel',
  loadComponent: () =>
    import('./panel/panel.component').then((m) => m.PanelComponent),
},
{
  path: 'edgeband',
  loadComponent: () =>
    import('./edgeband/edgeband.component').then((m) => m.EdgebandComponent),
},
{
  path: 'skin',
  loadComponent: () =>
    import('./skin/skin.component').then((m) => m.SkinComponent),
},
{
  path: 'processPanel',
  loadComponent: () =>
    import('./process-panel/process-panel.component').then((m) => m.ProcessPanelComponent),
},
{
  path: 'designers',
  loadComponent: () =>
    import('./Designers/designers.component').then((m) => m.DesignersComponent),
},
{
  path: 'mytask',
  loadComponent: () =>
    import('./my-tasks/my-tasks.component').then((m) => m.MyTasksComponent),
},
{
  path: 'design',
  loadComponent: () =>
    import('./design/design.component').then((m) => m.DesignComponent),
},
{
  path: 'Project-details',
  loadComponent: () =>
    import('./project-details/project-details.component').then((m) => m.ProjectDetailsComponent),
},
{
  path: 'recce',
  loadComponent: () =>
    import('./recce/recce.component').then((m) => m.RecceComponent),
},
{
  path: 'Order-Details',
  loadComponent: () =>
    import('./order-details/order-details.component').then((m) => m.OrderDetailsComponent),
},
{
  path: 'quotation',
  loadComponent: () =>
    import('./quotation/quotation.component').then((m) => m.QuotationComponent),
},
{
  path: 'courses',
  loadComponent: () =>
    import('./courses/courses.component').then((m) => m.CoursesComponent),
},
{
  path: 'enterprise',
  loadComponent: () =>
    import('./enterprise/enterprise.component').then((m) => m.EnterpriseComponent),
},
{
  path: 'optimizer',
  loadComponent: () =>
    import('./optimizer/optimizer.component').then((m) => m.OptimizerComponent),
},
{
  path: 'bom',
  loadComponent: () =>
    import('./bom/bom.component').then((m) => m.BomComponent),
},
{
  path: 'stocks',
  loadComponent: () =>
    import('./stocks/stocks.component').then((m) => m.StocksComponent),
},
{
  path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'orgSettings',
    loadComponent: () =>
    import('./org-settings/org-settings.component').then((m) => m.OrgSettingsComponent),
  },
  {
    path: 'campaigns',
    loadComponent: () =>
    import('./campaigns/campaigns.component').then((m) => m.CampaignsComponent),
  },
  {
    path: 'leads',
    loadComponent: () =>
    import('../apps/crm/leads/leads.component').then((m) => m.LeadsComponent),
  },
  
  {
    path: 'crm-settings',
    loadComponent: () =>
      import('./crm-settings/crm-settings.component').then((m) => m.CrmSettingsComponent),
  },
  
  
  
  // {
  //   path: 'contacts',
  //   loadComponent: () =>
  //   import('../pages/contacts/contacts.component').then((m) => m.ContactsComponent),
  // },
  
  {
    path: 'deals',
    loadComponent: () =>
    import('../apps/crm/deals/deals.component').then((m) => m.DealsComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
    import('./reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'appointments',
    loadComponent: () =>
    import('../apps/crm/appointments/appointments.component').then((m) => m.AppointmentsComponent),
  },
  {
    path: 'chatbot',
    loadComponent: () =>
    import('./chatbot/chatbot.component').then((m) => m.ChatbotComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
    import('./tasks/tasks.component').then((m) => m.TasksComponent),
  },
{
  path: 'personal',
  loadComponent: () =>
    import('./personal/personal.component').then((m) => m.PersonalComponent),
},
{
  path: 'users',
  loadComponent: () =>
    import('./users/users.component').then((m) => m.UsersComponent),
},

]},
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class dashboardRoutingModule {
  static routes = admin;
}
