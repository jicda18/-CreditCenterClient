import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business.routing';
import { BusinessComponent } from './business.component';
import { BusinessViewComponent } from './business-view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { BusinessModalComponent } from './business-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { BusinessFormModule } from 'src/app/forms/business-form/business-form.module';

@NgModule({
  declarations: [
    BusinessComponent,
    BusinessViewComponent,
    BusinessModalComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    GridModule,
    ModalModule,
    BusinessFormModule,
  ],
  entryComponents: [
    BusinessModalComponent
  ]
})
export class BusinessModule { }
