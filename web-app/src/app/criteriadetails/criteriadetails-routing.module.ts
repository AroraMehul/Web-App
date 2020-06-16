/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { CriteriadetailsComponent } from './criteriadetails.component';

/** Criteria Details Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'criteriadetails',
      component: CriteriadetailsComponent,
      data: { title: extract('CriteriaDetails'), breadcrumb: 'CriteriaDetails' }
    }
  ])
];

/**
 * Criteria Details Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CriteriadetailsRoutingModule { }
