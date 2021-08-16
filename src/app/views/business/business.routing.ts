import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessViewComponent } from './business-view.component';
import { BusinessComponent } from './business.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    // Todo: set Permission guard and data
  },
  {
    path: ':key',
    component: BusinessViewComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
