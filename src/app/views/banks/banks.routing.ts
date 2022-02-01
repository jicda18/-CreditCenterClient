import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { BanksComponent } from './banks.component';
import { ViewComponent } from './view.component';

const routes: Routes = [
  {
    path: '',
    component: BanksComponent,
    data: {
      permission: [permissions.bank_view],
    },
  },
  {
    path: ':key',
    component: ViewComponent,
    data: {
      permission: [permissions.bank_view],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksRoutingModule { }
