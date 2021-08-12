import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  private _badgeCount = 0;

  public visibleSidebar = true;
  public items: MenuItem[] = [
    // Todo: redirect to notification views
    { label: 'Notificaciones', icon: 'pi pi-envelope', badge: '0', badgeStyleClass: 'p-badge-primary' },
    // Todo: add other element
    { separator: true },
    { label: 'Cerrar Sección', icon: 'pi pi-sign-out', command: () => this.ss.logout() },
  ];

  public get badgeCount(): number {
    return this._badgeCount;
  }

  public set badgeCount(value: number) {
    this._badgeCount = value;

    this.items[0].badge = value.toString();
  }

  constructor(private ss: SessionService) { }

  ngOnInit(): void {
    this.badgeCount = 4;
  }

  // capture when closing the windows
  @HostListener('window:beforeunload', ['$event'])
  async beforeunloadHandler($event: any): Promise<void> {
    this.ss.logout();
  }

  // capture when focus the windows
  @HostListener('window:focus', ['$event'])
  async focusHandler($event: any): Promise<void> {
    this.ss.validInactiveTimePolice();
  }
}
