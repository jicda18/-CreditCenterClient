import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorsRoutingModule } from './debtors.routing';
import { DebtorsComponent } from './debtors.component';
import { DebtorsViewComponent } from './debtors-view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { DebtorsModalComponent } from './debtors-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { DeborsFormModule } from 'src/app/forms/debors-form/debors-form.module';
import { TabViewModule } from 'primeng/tabview';
import { LoansFormModule } from 'src/app/forms/loans-form/loans-form.module';

@NgModule({
  declarations: [
    DebtorsComponent,
    DebtorsViewComponent,
    DebtorsModalComponent
  ],
  imports: [
    CommonModule,
    DebtorsRoutingModule,
    GridModule,
    ModalModule,
    DeborsFormModule,
    TabViewModule,
    LoansFormModule,
  ],
  entryComponents: [
    DebtorsModalComponent
  ]
})
export class DebtorsModule { }
