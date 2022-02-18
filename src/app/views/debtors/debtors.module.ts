import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebtorsRoutingModule } from './debtors.routing';
import { DebtorsComponent } from './debtors.component';
import { DebtorsViewComponent } from './debtors-view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { DebtorsModalComponent } from './debtors-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { TabViewModule } from 'primeng/tabview';
import { DebtorsFormEditModule } from 'src/app/forms/debtors-form-edit/debtors-form-edit.module';
import { DebtorsFormInsertModule } from 'src/app/forms/debtors-form-insert/debtors-form-insert.module';

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
    DebtorsFormInsertModule,
    DebtorsFormEditModule,
    TabViewModule,
  ]
})
export class DebtorsModule { }
