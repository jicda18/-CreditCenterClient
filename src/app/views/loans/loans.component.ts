import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Fee } from 'src/app/models/fee.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { Loan } from 'src/app/models/loan.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, dateTimeStandardFormat, selectOption, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styles: [
  ]
})
export class LoansComponent implements OnInit {
  // @ViewChild('grid', { static: false }) private _grid?: GridComponent;

  public cols: GridCol[] = [
    { key: 'debtor_key', label: 'Cliente', type: 'text', filter: true, enableOptions: true },
    { key: 'amount', label: 'Monto', type: 'text', filter: false },
    { key: 'currency_key', label: 'Moneda', type: 'text', filter: true, enableOptions: true },
    { key: 'interest', label: 'Interes', type: 'text', filter: false },
    { key: 'next_fee', label: 'Proxima Cuota', type: 'date', filter: false },
    { key: 'overdue', label: 'Cuotas Atrasadas', type: 'numeric', filter: false },
    { key: 'pending', label: 'Monto Pendiente', type: 'date', filter: false },
    { key: 'inserted_at', label: 'Fecha Creación', type: 'date', filter: false },
  ];
  public endpoint = 'loans';
  public includes = ['debtor', 'currency', 'fees', 'transactions'];

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {
    selectOption('debtors/select', this.api).then((options) => this.cols[0].options = options);
    selectOption('currencies/select', this.api).then((options) => this.cols[2].options = options);
  }

  public mapper(loan: Loan): { [key: string]: any } {
    const overdueFee = (array?: Fee[]): Fee[] => {
      return array?.filter((fee) => {
        const now = new Date();
        const payment = convertToDate(fee.payment_at);

        return fee.paid_at === null && payment < now;
      }) ?? [];
    };

    const next = (array?: Fee[]) => {
      if (array === undefined || array === null || array.length === 0) {
        return null;
      }

      return array.reduce((previous, current) => {
        if (current.paid_at === null) {
          const p = convertToDate(previous.payment_at);
          const c = convertToDate(current.payment_at);

          return p < c ? previous : current;
        }

        return previous;
      });
    };

    const pending = (array?: Fee[]): number => {
      if (array === undefined || array === null || array.length === 0) {
        return 0;
      }

      return array.map((fee) => fee.amount).reduce((previous, current) => previous + current);
    };

    const loanAmount = (array?: Transaction[]): number => {
      if (array === undefined || array === null || array.length === 0) {
        return 0;
      }

      return array.map((transaction) => transaction.loan_amount).reduce((previous, current) => {
        const p = previous < 0 ? 0 : previous;

        return current > 0 ? p + current : p;
      });
    };

    const debtor = loan.debtor;
    const currency = loan.currency;
    const transactions = loan.transactions;
    const fees = loan.fees;

    const amount = loanAmount(transactions);
    const overdue = overdueFee(fees);
    const nextFee = next(fees);

    return {
      debtor_key: debtor?.name,
      amount: toCurrency(amount ?? 0),
      currency_key: currency?.currency,
      interest: 0,
      next_fee: nextFee?.payment_at,
      overdue: overdue.length,
      pending: toCurrency(pending(overdue)),
      inserted_at: dateTimeStandardFormat(loan.inserted_at),
    };
  }

  public globalFilter(query: string): string {
    return `name=**${query}**`; // Todo update query
  }

  public show(loan: Loan): void {
    // this.router.navigate(['/users/', user.key], { state: { data: user } });
    // Todo: implement
  }
}
