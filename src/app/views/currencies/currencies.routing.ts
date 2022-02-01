import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { CurrenciesComponent } from './currencies.component';

const routes: Routes = [{
  path: '',
  component: CurrenciesComponent,
  data: {
    permission: [permissions.currency_view],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrenciesRoutingModule { }
