import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { languagePrimeNg } from './utils/const.utils';
import { ApiService } from './services/api.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  providers: [MessageService],
})
export class AppComponent implements OnInit {
  title = 'CreditCenterClient';

  constructor(private primengConfig: PrimeNGConfig, private ms: MessageService, private session: SessionService, private api: ApiService) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation(languagePrimeNg);

    this.session.ms = this.ms;
    this.api.ms = this.ms;
  }
}
