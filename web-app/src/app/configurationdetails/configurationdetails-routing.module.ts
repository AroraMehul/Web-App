/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { ConfigurationdetailsComponent } from './configurationdetails.component';

/** Configuration Details Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'configurationdetails',
      component: ConfigurationdetailsComponent,
      data: { title: extract('ConfigurationDetails'), breadcrumb: 'ConfigurationDetails' }
    }
  ])
];

/**
 * Configuration Details Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ConfigurationdetailsRoutingModule { }
