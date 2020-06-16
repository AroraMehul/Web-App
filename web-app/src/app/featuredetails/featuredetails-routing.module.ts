/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { FeaturedetailsComponent } from './featuredetails.component';

/** Feature Details Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'featuredetails',
      component: FeaturedetailsComponent,
      data: { title: extract('FeatureDetails'), breadcrumb: 'FeatureDetails' }
    }
  ])
];

/**
 * Feature Details Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class FeaturedetailsRoutingModule { }
