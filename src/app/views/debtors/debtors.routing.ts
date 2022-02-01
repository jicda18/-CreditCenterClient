import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { DebtorsViewComponent } from './debtors-view.component';
import { DebtorsComponent } from './debtors.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorsComponent,
    data: {
      permission: [permissions.debtor_view],
    },
  },
  {
    path: ':key',
    component: DebtorsViewComponent,
    data: {
      permission: [permissions.debtor_view],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorsRoutingModule { }
