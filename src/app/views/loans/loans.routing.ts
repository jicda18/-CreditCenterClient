import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { LoanFormComponent } from './loan-form.component';
import { LoansComponent } from './loans.component';
import { PayComponent } from './pay.component';

const routes: Routes = [
  {
    path: 'grid',
    component: LoansComponent,
    data: {
      permission: [permissions.loan_view],
    },
  },
  {
    path: 'form',
    component: LoanFormComponent,
    data: {
      permission: [permissions.loan_store],
    },
  },
  {
    path: 'pay',
    component: PayComponent,
    data: {
      permission: [permissions.transantions_store],
    },
  },
  {
    path: 'pay/:loan_key',
    component: PayComponent,
    data: {
      permission: [permissions.transantions_store],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
