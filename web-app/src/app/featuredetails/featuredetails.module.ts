/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { FeaturedetailsRoutingModule } from './featuredetails-routing.module';

/** Custom Components */
import { FeaturedetailsComponent } from './featuredetails.component';
import { FeatureDetailsService } from './featuredetails.service';

/**
 * Feature Details Module
 *
 * Feature Details components should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    FeaturedetailsRoutingModule
  ],
  declarations: [
    FeaturedetailsComponent
  ],
  providers: [FeatureDetailsService]
})
export class FeaturedetailsModule { }
