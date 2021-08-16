import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuarantorsRoutingModule } from './guarantors.routing';
import { GuarantorsComponent } from './guarantors.component';
import { GuarantorsViewComponent } from './guarantors-view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { GuarantorsModalComponent } from './guarantors-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { GuarantorsFormModule } from 'src/app/forms/guarantors-form/guarantors-form.module';

@NgModule({
  declarations: [
    GuarantorsComponent,
    GuarantorsViewComponent,
    GuarantorsModalComponent
  ],
  imports: [
    CommonModule,
    GuarantorsRoutingModule,
    GridModule,
    ModalModule,
    GuarantorsFormModule
  ],
  entryComponents: [
    GuarantorsModalComponent
  ]
})
export class GuarantorsModule { }
