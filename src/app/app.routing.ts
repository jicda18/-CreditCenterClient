import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { SessionGuard } from './guards/session.guard';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { NotFoundLayoutComponent } from './layouts/not-found-layout/not-found-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    canLoad: [SessionGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'prefix' },
    ],
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    canActivate: [LoginGuard],
    canActivateChild: [LoginGuard],
    canLoad: [LoginGuard],
    children: [],
  },
  {
    path: '**',
    component: NotFoundLayoutComponent,
    canActivate: [SessionGuard],
    canActivateChild: [SessionGuard],
    canLoad: [SessionGuard],
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
