import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
  {path:'apps',children:[
    {
      path: 'crm/companies',
      loadComponent: () =>
        import('./crm/companies/companies.component').then(
          (m) => m.CompaniesComponent
        ),
    },
    {
      path: 'crm/contacts',
      loadComponent: () =>
        import('./crm/contacts/contacts.component').then(
          (m) => m.ContactsComponent
        ),
    },
    {
      path: 'crm/deals',
      loadComponent: () =>
        import('./crm/deals/deals.component').then((m) => m.DealsComponent),
    },
    {
      path: 'crm/leads',
      loadComponent: () =>
        import('./crm/leads/leads.component').then((m) => m.LeadsComponent),
    },
    {
      path: 'crm/proposal',
      loadComponent: () =>
        import('./crm/proposal/proposal.component').then((m) => m.ProposalComponent),
    },
    {
      path: 'crm/clients',
      loadComponent: () =>
        import('./crm/clients/clients.component').then((m) => m.ClientsComponent),
    },
  ]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class appsRoutingModule {
  static routes = admin;
}