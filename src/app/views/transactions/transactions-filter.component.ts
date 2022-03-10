import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { basicTypeToString, dateTimeStandardFormat, exportExcel, selectOption, toCurrency } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  styles: [
  ]
})
export class TransactionsFilterComponent implements OnInit {
  public form: FormGroup;

  public loading = false;
  public bankOptions: { value: string; label: string }[] = [];
  public currencyOptions: { value: string; label: string }[] = [];

  public data: { [key: string]: any }[] = [];
  public cols = [
    { field: 'was_at', header: 'Fecha' },
    { field: 'register', header: 'Creado Por' },
    { field: 'currency', header: 'Moneda' },
    { field: 'amount', header: 'Monto' },
    { field: 'bank', header: 'Banco' },
    { field: 'balance', header: 'Balance' },
    { field: 'comment', header: 'Comentario' },
  ];

  public get bank_key(): AbstractControl | null {
    return this.form.get('bank_key');
  }

  public get currency_key(): AbstractControl | null {
    return this.form.get('currency_key');
  }

  public get from(): AbstractControl | null {
    return this.form.get('from');
  }

  public get to(): AbstractControl | null {
    return this.form.get('to');
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      bank_key: [null, []],
      currency_key: [null, []],
      from: [null, []],
      to: [null, []],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.bankOptions = await selectOption<string, undefined>('banks/select', this.api);
    this.currencyOptions = await selectOption<string, undefined>('currencies/select', this.api);

    this.loading = false;
  }

  public async submit(): Promise<void> {
    this.loading = true;

    this.data = [];

    const { bank_key, currency_key, from, to } = this.form.value;

    let query = '';
    if (bank_key !== null && bank_key !== undefined && bank_key !== '') {
      query += `&bank_key=${bank_key}`;
    }

    if (currency_key !== null && currency_key !== undefined && currency_key !== '') {
      query += `&currency_key=${currency_key}`;
    }

    if (from !== null && from !== undefined && from !== '' && to !== null && to !== undefined && to !== '') {
      query += `&was_at=${basicTypeToString(from)}||${basicTypeToString(to)}`;
    } else {
      if (from !== null && from !== undefined && from !== '') {
        query += `&was_at=~>${basicTypeToString(from)}`;
      }

      if (to !== null && to !== undefined && to !== '') {
        query += `&was_at=~<${basicTypeToString(to)}`;
      }
    }

    this.data = this._mapper((await this.api.get<Transaction[]>(`transactions?include=currency,bank,register&per_page=128${query}`)).data ?? []);

    this.loading = false;
  }

  private _mapper(transactions: Transaction[]): { [key: string]: any }[] {
    return transactions.map((transaction) => {
      return {
        key: transaction.key,
        was_at: dateTimeStandardFormat(transaction.was_at),
        cash: transaction.cash,
        amount: toCurrency(Math.abs(transaction.amount)),
        balance: transaction.bank_balance === null ? '' : toCurrency(transaction.bank_balance),
        inserted_at: dateTimeStandardFormat(transaction.inserted_at),
        register: transaction.register?.name,
        comment: transaction.comments,
        currency: transaction.currency?.currency,
        bank: transaction.bank?.bank,
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
