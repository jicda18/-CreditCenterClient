import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BanksComponent } from './banks.component';
import { ViewComponent } from './view.component';

const routes: Routes = [
  {
    path: '',
    component: BanksComponent,
    // Todo: set Permission guard and data
  },
  {
    path: ':key',
    component: ViewComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksRoutingModule { }
