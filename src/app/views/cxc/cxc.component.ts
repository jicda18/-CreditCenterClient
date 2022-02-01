import { Component, OnInit } from '@angular/core';
import { Fee } from 'src/app/models/fee.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { Loan } from 'src/app/models/loan.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, dateStandardFormat, dateTimeStandardFormat, groupBy, selectOption, toCurrency } from 'src/app/utils/helpers.utils';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-cxc',
  templateUrl: './cxc.component.html',
  animations: [
    trigger('rowExpansionTrigger', [
      state('void', style({
        transform: 'translateX(-10%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ],
  styles: [
  ]
})
export class CxcComponent implements OnInit {
  private _endpoint = 'fees/cxc';

  public data: any[] = [];
  public loading = false;

  constructor(private api: ApiService) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    const response = await this.api.get<any[]>(this._endpoint);

    const { data, meta, error } = response;

    if (data !== undefined) {
      this.data = data.map((item) => this._mapper(item));
    }

    this.loading = false;
  }

  private _mapper(fees: Fee[]): { [key: string]: any } {
    const overdues = (array?: Fee[]): Fee[] => {
      return array?.filter((fee) => {
        return fee.status === 'overdue' || fee.status === 'in-thanks';
      }) ?? [];
    };

    const pending = (array?: Fee[]): number => {
      if (array === undefined || array === null || array.length === 0) {
        return 0;
      }

      return array.map((fee) => fee.amount).reduce((previous, current) => previous + current);
    };

    const bgColorFee = (fee: Fee): string => {
      if (fee.status === 'paid') {
        return '';
      }

      if (fee.status === 'in-time') {
        return 'bg-green-500';
      }

      if (fee.status === 'in-thanks') {
        return 'bg-yellow-500';
      }

      return 'bg-red-500';
    };

    const bgColorLoan = (array: Fee[]) => {
      const byStatus = groupBy(array, 'status');

      if (byStatus.overdue ?? 0 > 0) {
        return 'bg-red-500';
      }

      if (byStatus['in-thanks'] ?? 0 > 0) {
        return 'bg-yellow-500';
      }

      if (byStatus['in-time'] ?? 0 > 0) {
        return 'bg-green-500';
      }

      return '';
    };

    const loan = fees[0].loan;
    const debtor = loan?.debtor;
    const currency = loan?.currency;

    const overdue = overdues(fees);

    return {
      key: loan?.key,
      loan_label: loan?.label,
      debtor_key: debtor?.name,
      amount: toCurrency(loan?.amount ?? 0),
      interest: ((loan?.interest ?? 0) * 100) + '%',
      summary: toCurrency(loan?.summary ?? 0),
      currency_key: currency?.currency,
      overdue: overdue.length,
      pending: toCurrency(pending(overdue)),
      inserted_at: dateTimeStandardFormat(loan?.inserted_at),
      bg_color: bgColorLoan(loan?.fees ?? []),
      phone: debtor?.phone_number,
      fees: fees.map((fee) => {
        return {
          key: fee.key,
          amount: toCurrency(fee.amount),
          capital: toCurrency(fee.capital),
          interest: toCurrency(fee.interest),
          pending: toCurrency(fee.pending),
          pending_capital: toCurrency(fee.pending_capital),
          pending_interest: toCurrency(fee.pending_interest),
          payment_at: dateStandardFormat(fee.payment_at),
          limit_at: dateStandardFormat(fee.limit_at),
          paid_at: fee.paid_at === null ? null : dateStandardFormat(fee.paid_at),
          status: fee.status,
          bg_color: bgColorFee(fee),
        };
      }),
    };
  }
}
