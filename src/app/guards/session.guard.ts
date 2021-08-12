import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStatus } from '../enums/session-status.enum';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private ss: SessionService, private router: Router) { }

  private validate(url?: string): boolean {
    if (this.ss.status === SessionStatus.Login) {
      return true;
    }

    if (url !== undefined) {
      this.ss.lastUrl = url;
    }

    this.router.navigate(['/login']);

    return false;
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate();
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate();
  }

  public canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.validate();
  }
}
