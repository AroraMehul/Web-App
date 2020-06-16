/** Angular Imports */
import { NgModule } from '@angular/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { CriteriadetailsRoutingModule } from './criteriadetails-routing.module';

/** Custom Components */
import { CriteriadetailsComponent } from './criteriadetails.component';
import { CriteriaDetailsService } from './criteriadetails.service';

/**
 * Criteria Details Module
 *
 * Criteria Details components should be declared here.
 */
@NgModule({
  imports: [
    SharedModule,
    CriteriadetailsRoutingModule
  ],
  declarations: [
    CriteriadetailsComponent
  ],
  providers: [CriteriaDetailsService]
})
export class CriteriadetailsModule { }
