import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Debtor } from 'src/app/models/debtor.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, selectOption } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: [
  ]
})
export class TransactionsComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public actionOptions = [
    { value: -1, label: 'Cobro' },
    { value: 1, label: 'Prestar' },
  ];
  public bankOptions: { value: string | number, label: string }[] = [];
  public debtorOptions: { value: string | number, label: string }[] = [];
  public currencyOptions: { value: string | number, label: string }[] = [];

  public get action(): AbstractControl | null {
    return this.form.get('action');
  }

  public get bank(): AbstractControl | null {
    return this.form.get('bank');
  }

  public get debtor(): AbstractControl | null {
    return this.form.get('debtor');
  }

  public get income(): AbstractControl | null {
    return this.form.get('income');
  }

  public get currency(): AbstractControl | null {
    return this.form.get('currency');
  }

  public get comment(): AbstractControl | null {
    return this.form.get('comment');
  }

  public get actionInvalid(): boolean {
    return (this.action?.invalid && (this.action?.touched || this.action?.dirty)) ?? false;
  }

  public get bankInvalid(): boolean {
    return (this.bank?.invalid && (this.bank?.touched || this.bank?.dirty)) ?? false;
  }

  public get debtorInvalid(): boolean {
    return (this.debtor?.invalid && (this.debtor?.touched || this.debtor?.dirty)) ?? false;
  }

  public get incomeInvalid(): boolean {
    return (this.income?.invalid && (this.income?.touched || this.income?.dirty)) ?? false;
  }

  public get currencyInvalid(): boolean {
    return (this.currency?.invalid && (this.currency?.touched || this.currency?.dirty)) ?? false;
  }

  public get commentInvalid(): boolean {
    return (this.comment?.invalid && (this.comment?.touched || this.comment?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      action: [null, [Validators.required]],
      bank: [null, [Validators.required]],
      debtor: [null, [Validators.required]],
      income: [null, [Validators.required, Validators.min(1)]],
      currency: [null, [Validators.required]],
      comment: [null, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.bankOptions = await selectOption('banks/select', this.api);
    this.debtorOptions = await selectOption('debtors/loan/select', this.api);
    this.currencyOptions = await selectOption('currencies/select', this.api);

    this.loading = false;
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const action = this.action?.value as number;
      const bank = this.bank?.value as string;
      const debtor = this.debtor?.value as string;
      const income = this.income?.value as number;
      const currency = this.currency?.value as string;
      const comment = this.comment?.value as string;

      const form = objectToFormData({
        loan_key: debtor,
        bank_key: bank,
        currency_key: currency,
        amount: income * action,
        comments: comment
      });

      await createResource<Transaction>(this.api, 'transactions', form, this.ms, undefined, (item) => {
        this.form.reset();

        if (action === 1) {
          return `El credito fue agregado exitosamente.`;
        }

        return `El cobro fue agregado exitosamente.`;
      });
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
