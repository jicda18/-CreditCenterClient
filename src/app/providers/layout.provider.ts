import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Event, NavigationEnd, Router } from '@angular/router';
import { Navbar } from '../models/navbar.model';
import { Sidebar } from '../models/sidebar.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutProvider {
  private navbar: undefined | Navbar;
  private sidebar: undefined | Sidebar;

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // const moduleLink = Object.values(modules).map((module) => module.url);
        // moduleLink.push(...Object.values(guests).map((module) => module.url));

        // if (moduleLink.includes(this.router.url)) {
        //   this.withSidebar();
        // }
      }
    });
  }

  public get url(): string {
    return this.router.url;
  }
}
