import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { TransactionsComponent } from './transactions.component';

const routes: Routes = [{
  path: '',
  component: TransactionsComponent,
  data: {
    permission: [permissions.transantions_view],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
