import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { CxcComponent } from './cxc.component';

const routes: Routes = [{
  path: '',
  component: CxcComponent,
  data: {
    permission: [permissions.loan_view],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CxcRoutingModule { }
