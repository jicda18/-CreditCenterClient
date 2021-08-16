import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuarantorsViewComponent } from './guarantors-view.component';
import { GuarantorsComponent } from './guarantors.component';

const routes: Routes = [
  {
    path: '',
    component: GuarantorsComponent,
    // Todo: set Permission guard and data
  },
  {
    path: ':key',
    component: GuarantorsViewComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuarantorsRoutingModule { }
