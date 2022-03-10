import { Component, OnInit } from '@angular/core';
import { Fee } from 'src/app/models/fee.model';
import { Loan } from 'src/app/models/loan.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, dateStandardFormat, dateTimeStandardFormat, groupBy, selectOption, toCurrency } from 'src/app/utils/helpers.utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

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
  public totals: { title: string, icon: string, value: string | number, description?: string, theme: string }[] = [];
  public loading = false;

  constructor(private api: ApiService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    const response = await this.api.get<any[]>(this._endpoint);

    const { data, meta, error } = response;

    if (data !== undefined) {
      this.data = data.map((item) => this._mapper(item));
      const hash: { [key: string]: number } = {};

      for (const item of this.data) {
        if (Object.prototype.hasOwnProperty.call(hash, item.currency_key)) {
          const index = hash[item.currency_key];

          this.totals[index].value += item.for_total;
        } else {
          hash[item.currency_key] = this.totals.length;

          this.totals.push({ title: item.currency_key, icon: 'fas fa-dollar-sign', value: item.for_total, theme: 'red' });
        }
      }
    }

    this.loading = false;
  }

  private _mapper(fees: Fee[]): { [key: string]: any } {
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

    return {
      key: loan?.key,
      loan_label: loan?.label,
      debtor_key: debtor?.name,
      amount: toCurrency(loan?.amount ?? 0),
      interest: ((loan?.interest ?? 0) * 100) + '%',
      summary: toCurrency(loan?.summary ?? 0),
      currency_key: currency?.currency,
      overdue: fees.length,
      for_total: loan?.pending_summary ?? 0,
      pending: toCurrency(loan?.pending_summary ?? 0),
      next_at: dateStandardFormat(fees[0]?.payment_at),
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
          late: toCurrency(fee.late_payment),
          pending_late_payment: toCurrency(fee.pending_late_payment),
        };
      }),
    };
  }

  public currencyToString(value: number): string {
    return toCurrency(value);
  }

  public goToPay(loan: Loan): void {
    this.router.navigate([`loans/pay/${loan.key}`]);
  }
}
