import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-debtors-view',
  templateUrl: './debtors-view.component.html',
  styles: [
  ]
})
export class DebtorsViewComponent implements OnInit {
  public debtor?: Debtor;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Debtor>(key, 'debtors', this.api, this.router, '/debtors').then((debtor) => this.debtor = debtor);
  }
}
