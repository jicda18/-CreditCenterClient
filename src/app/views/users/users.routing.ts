import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from 'src/app/utils/const.utils';
import { UsersViewComponent } from './users-view.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: {
      permission: [permissions.user_view],
    },
  },
  {
    path: ':key',
    component: UsersViewComponent,
    data: {
      permission: [permissions.user_view],
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
