/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Routing Imports */
import { Route } from '../core/route/route.service';

/** Translation Imports */
import { extract } from '../core/i18n/i18n.service';

/** Custom Components */
import { ConfigurationComponent } from './configuration.component';

/** Configuration Routes */
const routes: Routes = [
  Route.withShell([
    {
      path: 'configuration',
      component: ConfigurationComponent,
      data: { title: extract('Configuration'), breadcrumb: 'Configuration' }
    },
    {
      path: 'configuration/:id',
      component: ConfigurationComponent
    }
  ])
];

/**
 * Configuration Module
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ConfigurationRoutingModule { }
