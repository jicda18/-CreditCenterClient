import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Transaction } from 'src/app/models/transaction.model';
import { dateStandardFormat, dateTimeStandardFormat, exportExcel, toCurrency } from 'src/app/utils/helpers.utils';

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
  public cols = [
    { field: "was_at", header: "Fecha Pago" },
    { field: "amount", header: "Monto" },
    { field: "balance", header: "Balance" },
    { field: "inserted_at", header: "Usuario" },
    { field: "register", header: "Fecha Creación" },
    { field: "comment", header: "Comentario" },
  ];

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
        was_at: dateTimeStandardFormat(transaction.was_at),
        cash: transaction.cash,
        amount: toCurrency(this.for_loan ? transaction.loan_amount : transaction.bank_amount),
        balance: toCurrency(this.for_loan ? transaction.loan_balance : transaction.bank_balance),
        inserted_at: dateTimeStandardFormat(transaction.inserted_at),
        register: transaction.register?.name,
        comment: transaction.comments,
      };
    });
  }

  public exportAsExcel(): void {
    const data = [];

    for (const item of this.data) {
      const object: any = {};
      for (const col of this.cols) {
        object[col.header] = item[col.field];
      }

      data.push(object);
    }

    exportExcel(data);
  }
}
