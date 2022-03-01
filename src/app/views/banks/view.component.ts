import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bank } from 'src/app/models/bank.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { getModel } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styles: [
  ]
})
export class ViewComponent implements OnInit {
  public bank?: Bank;
  public transactions: Transaction[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<Bank>(key, 'banks', this.api, this.router, '/banks', 'transactions').then((bank) => {
      this.bank = bank;
      this.transactions = this.bank?.transactions ?? [];
    });
  }
}
