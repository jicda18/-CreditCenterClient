import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Fee } from 'src/app/models/fee.model';
import { dateStandardFormat, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styles: [
  ]
})
export class FeesComponent implements OnInit, OnChanges {
  @Input() fees: Fee[] = [];

  public data: { [key: string]: any }[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = this._mapper();
  }

  private _mapper(): { [key: string]: any }[] {
    const bgColorFee = (fee: Fee): string => {
      if (fee.status === 'paid') {
        return '';
      }

      if (fee.status === 'in-time') {
        return 'bg-green-500 text-white';
      }

      if (fee.status === 'in-thanks') {
        return 'bg-yellow-500 text-white';
      }

      return 'bg-red-500 text-white';
    };

    return this.fees.map((fee) => {
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
        paid_at: fee.paid_at === null ? '--' : dateStandardFormat(fee.paid_at),
        status: fee.status,
        extra: fee.extra,
        bg_color: bgColorFee(fee),
        late: toCurrency(fee.late_payment),
        pending_late_payment: toCurrency(fee.pending_late_payment),
      };
    });
  }
}
