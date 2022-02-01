import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionStatus } from '../enums/session-status.enum';
import { SessionService } from '../services/session.service';
import { hasAll, sleep } from '../utils/helpers.utils';

@Injectable({
  providedIn: 'root'
})
export class PolicyGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private ss: SessionService) { }

  private success(): true {
    return true;
  }

  private fail(reason: string): boolean {
    if (environment.production) {
      return false;
    }

    const msg = `Can't access to the path because: ${reason}`;

    // console.warn(msg);
    alert(msg);

    return this.success();
  }

  private unprotected(msg: string): boolean {
    return this.fail(`This route isn\'t correctly protected. ${msg}`);
  }

  private async validate(next: ActivatedRouteSnapshot): Promise<boolean> {
    const data = next.routeConfig?.data;

    if (data === undefined || data === null) {
      return this.unprotected('Routing data was not provided.');
    }

    const permissions = data.permission;

    if (permissions === undefined || permissions === null) {
      return this.unprotected('Route permit not provided.');
    }

    if (!Array.isArray(permissions)) {
      return this.unprotected('permissions must be an array.');
    }

    while (this.ss.waiting_user) {
      await sleep(250);
    }

    const user = this.ss.user;

    if (user === undefined || user === null) {
      return this.fail('Can\'t get user.');
    }

    // Validate if admin
    if (user.administrator) {
      return this.success();
    }

    if (data.admin ?? false) {
      return this.fail('Path required admin.');
    }

    return hasAll(user.permissions.map((permission) => permission.id), permissions) ? this.success() : this.fail('User don\'t have required permissions');
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate(route);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate(childRoute);
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
