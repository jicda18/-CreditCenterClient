import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtorsViewComponent } from './debtors-view.component';
import { DebtorsComponent } from './debtors.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorsComponent,
    // Todo: set Permission guard and data
  },
  {
    path: ':key',
    component: DebtorsViewComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebtorsRoutingModule { }
