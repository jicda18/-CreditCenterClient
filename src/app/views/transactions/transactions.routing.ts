import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { TransactionsFilterComponent } from './transactions-filter.component';
import { TransactionsFormComponent } from './transactions-form.component';

const routes: Routes = [
  {
    path: 'form',
    component: TransactionsFormComponent,
    data: {
      permission: [permissions.transactions_bank_store],
    },
  },
  {
    path: 'filter',
    component: TransactionsFilterComponent,
    data: {
      permission: [permissions.transactions_bank_store],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
