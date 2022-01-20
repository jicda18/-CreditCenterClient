import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanFormComponent } from './loan-form.component';
import { LoansComponent } from './loans.component';
import { PayComponent } from './pay.component';

const routes: Routes = [
  {
    path: 'grid',
    component: LoansComponent,
    // Todo: set Permission guard and data
  },
  {
    path: 'form',
    component: LoanFormComponent,
    // Todo: set Permission guard and data
  },
  {
    path: 'pay',
    component: PayComponent,
    // Todo: set Permission guard and data
  },
  {
    path: 'pay/:loan_key',
    component: PayComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
