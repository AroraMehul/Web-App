/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { ConfigurationRoutingModule } from './configuration-routing.module';

/** Custom Components */
import { ConfigurationComponent } from './configuration.component';
import { ConfigService } from './configuration.service';

/**
 * Configuration Module
 *
 * Configuration components should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    ConfigurationRoutingModule
  ],
  declarations: [
    ConfigurationComponent
  ],
  providers: [ConfigService]
})
export class ConfigurationModule { }
