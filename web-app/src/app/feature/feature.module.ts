/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { FeatureRoutingModule } from './feature-routing.module';

/** Custom Components */
import { FeatureComponent } from './feature.component';
import { FeatureService} from './feature.service';

/**
 * Feature Screen Module
 *
 * Feature Screen components should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    FeatureRoutingModule
  ],
  declarations: [
    FeatureComponent,
  ],
  providers: [FeatureService]
})
export class FeatureModule { }
