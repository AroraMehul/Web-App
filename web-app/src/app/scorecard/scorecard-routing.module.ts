/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { ScorecardComponent } from './scorecard.component';

/** Scorecard Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'scorecard',
      component: ScorecardComponent,
      data: { title: extract('Scorecard'), breadcrumb: 'Scorecard' }
    }
  ])
];

/**
 * Scorecard Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ScorecardRoutingModule { }
