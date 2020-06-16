/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { CriteriaComponent } from './criteria.component';

/** Criteria Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'criteria',
      component: CriteriaComponent,
      data: { title: extract('Criteria'), breadcrumb: 'Criteria' }
    },
    {
      path: 'criteria/:id',
      component: CriteriaComponent
    }
  ])
];

/**
 * Criteria Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class CriteriaRoutingModule { }
