import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { languagePrimeNg } from './utils/const.utils';
import { ApiService } from './services/api.service';
import { SessionService } from './services/session.service';
import { CustomFilterMode } from './class/custom-filter-mode.class';

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

    this.primengConfig.filterMatchModeOptions = {
      text: [
        CustomFilterMode.EQUALS,
        CustomFilterMode.NOT_EQUALS,
        CustomFilterMode.CONTAINS,
        CustomFilterMode.NOT_CONTAINS,
        CustomFilterMode.STARTS_WITH,
        CustomFilterMode.NOT_STARTS_WITH,
        CustomFilterMode.ENDS_WITH,
        CustomFilterMode.NOT_ENDS_WITH,
      ],
      numeric: [
        CustomFilterMode.EQUALS,
        CustomFilterMode.NOT_EQUALS,
        CustomFilterMode.LESS_THAN,
        CustomFilterMode.LESS_THAN_OR_EQUAL_TO,
        CustomFilterMode.GREATER_THAN,
        CustomFilterMode.GREATER_THAN_OR_EQUAL_TO,
        // FilterMatchMode.BETWEEN,
      ],
      date: [
        CustomFilterMode.DATE_IS,
        CustomFilterMode.DATE_BEFORE,
        CustomFilterMode.DATE_AFTER,
        // FilterMatchMode.BETWEEN,
      ]
    };

    this.session.ms = this.ms;
    this.api.ms = this.ms;
  }
}
