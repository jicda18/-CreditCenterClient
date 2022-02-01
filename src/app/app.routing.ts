import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { PolicyGuard } from './guards/policy.guard';
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
      {
        path: 'home',
        loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'banks',
        loadChildren: () => import('./views/banks/banks.module').then(m => m.BanksModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'currencies',
        loadChildren: () => import('./views/currencies/currencies.module').then(m => m.CurrenciesModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'debtors',
        loadChildren: () => import('./views/debtors/debtors.module').then(m => m.DebtorsModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'users',
        loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'transactions',
        loadChildren: () => import('./views/transactions/transactions.module').then(m => m.TransactionsModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'loans',
        loadChildren: () => import('./views/loans/loans.module').then(m => m.LoansModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
      {
        path: 'cxc',
        loadChildren: () => import('./views/cxc/cxc.module').then(m => m.CxcModule),
        canActivate: [PolicyGuard],
        canActivateChild: [PolicyGuard],
        canLoad: [PolicyGuard],
        data: {
          permission: [],
        },
      },
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
