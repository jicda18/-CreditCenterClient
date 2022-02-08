import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';
import { dateStandardFormat, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ]
})
export class TransactionsComponent implements OnInit, OnChanges {
  @Input() transactions: Transaction[] = [];
  @Input() for_loan = true;

  public data: { [key: string]: any }[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = this._mapper();
  }

  private _mapper(): { [key: string]: any }[] {
    return this.transactions.map((transaction) => {
      return {
        key: transaction.key,
        was_at: dateStandardFormat(transaction.was_at),
        cash: transaction.cash,
        amount: toCurrency(this.for_loan ? transaction.loan_amount : transaction.bank_amount),
        balance: toCurrency(this.for_loan ? transaction.loan_balance : transaction.bank_balance),
        inserted_at: dateStandardFormat(transaction.inserted_at),
        register: transaction.register?.name,
      };
    });
  }
}
