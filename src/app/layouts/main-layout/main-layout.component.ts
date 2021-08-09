import { Component, HostListener, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(private ss: SessionService) { }

  ngOnInit(): void {
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
