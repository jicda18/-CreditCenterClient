import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { LoanFormComponent } from './loan-form.component';
import { LoanViewComponent } from './loan-view.component';
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
      permission: [permissions.transactions_store],
    },
  },
  {
    path: 'pay/:loan_key',
    component: PayComponent,
    data: {
      permission: [permissions.transactions_store],
    },
  },
  {
    path: ':loan_key',
    component: LoanViewComponent,
    data: {
      permission: [permissions.loan_view],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
