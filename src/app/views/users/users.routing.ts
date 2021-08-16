import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersViewComponent } from './users-view.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    // Todo: set Permission guard and data
  },
  {
    path: ':key',
    component: UsersViewComponent,
    // Todo: set Permission guard and data
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
