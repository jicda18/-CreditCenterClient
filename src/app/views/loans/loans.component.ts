import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fee } from 'src/app/models/fee.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { Loan } from 'src/app/models/loan.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, dateTimeStandardFormat, selectOption, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styles: [
  ]
})
export class LoansComponent implements OnInit {
  public cols: GridCol[] = [
    { key: 'debtor_key', label: 'Cliente', type: 'text', filter: true, enableOptions: true },
    { key: 'amount', label: 'Monto', type: 'text', filter: false },
    { key: 'interest', label: 'Interes', type: 'text', filter: false },
    { key: 'summary', label: 'Capital', type: 'numeric', filter: false },
    { key: 'currency_key', label: 'Moneda', type: 'text', filter: true, enableOptions: true },
    { key: 'next_fee', label: 'Proxima Cuota', type: 'date', filter: false },
    { key: 'overdue', label: 'Cuotas Atrasadas', type: 'numeric', filter: false },
    { key: 'pending', label: 'Monto Pendiente', type: 'date', filter: false },
    { key: 'inserted_at', label: 'Fecha Creación', type: 'date', filter: false },
  ];
  public endpoint = 'loans';
  public includes = ['debtor', 'currency', 'fees', 'transactions'];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    selectOption('debtors/select', this.api).then((options) => this.cols[0].options = options);
    selectOption('currencies/select', this.api).then((options) => this.cols[4].options = options);
  }

  public mapper(loan: Loan): { [key: string]: any } {
    const overdueFee = (array?: Fee[]): Fee[] => {
      return array?.filter((fee) => {
        return fee.status === 'overdue' || fee.status === 'in-thanks';
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

    const debtor = loan.debtor;
    const currency = loan.currency;
    const fees = loan.fees;

    const overdue = overdueFee(fees);
    const nextFee = next(fees);

    return {
      debtor_key: debtor?.name,
      amount: toCurrency(loan.amount ?? 0),
      interest: (loan.interest * 100) + '%',
      summary: toCurrency(loan.summary ?? 0),
      currency_key: currency?.currency,
      next_fee: dateTimeStandardFormat(nextFee?.payment_at ?? loan.next_at),
      overdue: overdue.length,
      pending: toCurrency(pending(overdue)),
      inserted_at: dateTimeStandardFormat(loan.inserted_at),
    };
  }

  public globalFilter(query: string): string {
    return `name=**${query}**`; // Todo update query
  }

  public show(loan: Loan): void {
    this.router.navigate([`loans/${loan.key}`]);
  }
}
