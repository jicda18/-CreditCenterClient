import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { SessionService } from 'src/app/services/session.service';
import { sleep, userNavs } from 'src/app/utils/helpers.utils';
import { navs as menuItems } from 'src/app/utils/const.utils';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  private _badgeCount = 0;

  public navs: undefined | MenuItem[];

  public visibleSidebar = true;

  public items: MenuItem[] = [
    // Todo: redirect to notification views
    { label: 'Notificaciones', icon: 'pi pi-envelope', badge: '0', badgeStyleClass: 'p-badge-primary' },
    { label: 'Change Password', icon: 'fas fa-key', command: () => null },
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

  public get name(): string {
    return this.ss.user?.name ?? '';
  }

  public get image(): string {
    return this.ss.user?.avatar ?? 'assets/images/no-user.png';
  }

  constructor(private ss: SessionService, private ms: MessageService) { }

  ngOnInit(): void {
    this.ms.add({ detail: 'hola mundo 1' });

    this.getNavs();

    // Todo: set dageCount;
    this.badgeCount = 4;
  }

  private async getNavs(): Promise<void> {
    while (this.ss.user === undefined) {
      await sleep(250);
    }

    // Todo: add Permissions
    this.navs = userNavs(menuItems, this.ss.user.administrator, []);
  }

  // capture when closing the windows
  @HostListener('window:beforeunload', ['$event'])
  async beforeunloadHandler($event: any): Promise<void> {
    // this.ss.logout();
  }

  // capture when focus the windows
  @HostListener('window:focus', ['$event'])
  async focusHandler($event: any): Promise<void> {
    this.ss.validInactiveTimePolice();
  }
}
