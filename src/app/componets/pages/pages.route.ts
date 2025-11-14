

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
  {path:'pages',children:[
    {
      path: 'chat',
      loadComponent: () =>
        import('./chat/chat.component').then((m) => m.ChatComponent),
    },
    // {
    //   path: 'ecommerce/products',
    //   loadComponent: () =>
    //     import('./ecommerce/products/products.component').then((m) => m.ProductsComponent),
    // },
    {
      path: 'faqs',
      loadComponent: () =>
        import('./faqs/faqs.component').then((m) => m.FaqsComponent),
    },
  
    // {
    //   path: 'landing',
    //   loadComponent: () =>
    //     import('./landing/landing.component').then((m) => m.LandingComponent),
    // },
    // {
    //   path: 'jobslanding',
    //   loadComponent: () =>
    //     import('./jobslanding/jobslanding.component').then((m) => m.JobslandingComponent),
    // },
    {
      path: 'notifications',
      loadComponent: () =>
        import('./notifications/notifications.component').then((m) => m.NotificationsComponent),
    },
    {
      path: 'profile',
      loadComponent: () =>
        import('./profile/profile.component').then((m) => m.ProfileComponent),
    },
    {
      path: 'team',
      loadComponent: () =>
        import('./team/team.component').then((m) => m.TeamComponent),
    },
    {
      path: 'timeline',
      loadComponent: () =>
        import('./timeline/timeline.component').then((m) => m.TimelineComponent),
    },
    {
      path: 'to-do-list',
      loadComponent: () =>
      import('./to-do-list/to-do-list.component').then((m) => m.ToDoListComponent), 
    },

  ]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class pagesRoutingModule {
  static routes = admin;
}