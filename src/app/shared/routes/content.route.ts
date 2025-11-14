import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardRoutingModule } from '../../componets/dashbord/dashboard.route';
import { pagesRoutingModule } from '../../componets/pages/pages.route';

import { appsRoutingModule } from '../../componets/apps/apps.route';
import { formsRoutingModule } from '../../componets/forms/forms.route';
import { tablesRoutingModule } from '../../componets/tables/tables.route';
import { mapRoutingModule } from '../../componets/map/map.route';
import { iconsRoutingModule } from '../../componets/icons/icons.route';

export const content: Routes = [
  {
    path: '',
    children: [
      ...dashboardRoutingModule.routes,
      ...pagesRoutingModule.routes,
      ...appsRoutingModule.routes,
      ...formsRoutingModule.routes,
      ...tablesRoutingModule.routes,
      ...mapRoutingModule.routes,
      ...iconsRoutingModule.routes,
    ],
  },
];
@NgModule({
  imports: [RouterModule],
  exports: [RouterModule],
})
export class SaredRoutingModule {}
