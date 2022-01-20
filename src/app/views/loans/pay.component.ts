import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Loan } from 'src/app/models/loan.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, selectOption } from 'src/app/utils/helpers.utils';
import { CustomValidations } from 'src/app/utils/validations.util';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styles: [
  ]
})
export class PayComponent implements OnInit, OnDestroy {
  private _loan?: Loan;

  public form?: FormGroup;
  public loading = false;
  public bankOptions: { value: string; label: string; custom?: Currency; }[] = [];
  public debtorOptions: { value: string; label: string; custom?: { value: string; label: string; }[] }[] = [];
  public loanOptions: { value: string; label: string; }[] = [];

  public get debtor_key(): AbstractControl | null {
    return this.form?.get('debtor_key') ?? null;
  }

  public get loan_key(): AbstractControl | null {
    return this.form?.get('loan_key') ?? null;
  }

  public get cash(): AbstractControl | null {
    return this.form?.get('cash') ?? null;
  }

  public get bank_key(): AbstractControl | null {
    return this.form?.get('bank_key') ?? null;
  }

  public get amount(): AbstractControl | null {
    return this.form?.get('amount') ?? null;
  }

  public get comments(): AbstractControl | null {
    return this.form?.get('comments') ?? null;
  }

  public get debtor_keyInvalid(): boolean {
    return (this.debtor_key?.invalid && (this.debtor_key?.touched || this.debtor_key?.dirty)) ?? false;
  }

  public get loan_keyInvalid(): boolean {
    return (this.loan_key?.invalid && (this.loan_key?.touched || this.loan_key?.dirty)) ?? false;
  }

  public get cashInvalid(): boolean {
    return (this.cash?.invalid && (this.cash?.touched || this.cash?.dirty)) ?? false;
  }

  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
  }

  public get amountInvalid(): boolean {
    return (this.amount?.invalid && (this.amount?.touched || this.amount?.dirty)) ?? false;
  }

  public get commentsInvalid(): boolean {
    return (this.comments?.invalid && (this.comments?.touched || this.comments?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      debtor_key: [null, [Validators.required]],
      loan_key: [null, [Validators.required]],
      cash: [false, [Validators.required]],
      bank_key: [null, [CustomValidations.fn((value?: string) => this.cash?.value === false ? (value !== undefined && value !== null && value !== '') : true)]],
      amount: [null, [Validators.required, Validators.min(0)]],
      comments: [null, [Validators.required]],
    });

    this.debtor_key?.valueChanges.subscribe((value: string) => {
      const debtor = this.debtorOptions.find((option) => option.value === value);

      if (debtor !== undefined && debtor !== null) {
        this.loanOptions = debtor.custom ?? [];
      }
    });

    // Todo: only load bank with currency
    // this.loan_key?.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
    this.init();
  }

  private async init(): Promise<void> {
    this.loading = true;

    const loan_key = this.route.snapshot.paramMap.get('loan_key');
    let loan: Loan | undefined;

    if (loan_key !== null) {
      loan = (await this.api.get<Loan>(`loans/${loan_key}?include=debtor`)).data;
    }

    this.bankOptions = await selectOption('banks/select', this.api);

    if (loan === undefined) {
      this.debtorOptions = await selectOption('debtors/loan/select', this.api);
    } else {
      this.debtorOptions = [{ value: loan.debtor?.key ?? '', label: loan.debtor?.name ?? '', custom: [{ value: loan.key, label: loan.label }] }];
      this.debtor_key?.setValue(loan.debtor?.key ?? '');
      this.debtor_key?.disable();

      this.loan_key?.setValue(loan.key ?? '');
      this.loan_key?.disable();
    }

    this.loading = false;
  }

  public async submit(): Promise<void> {
    this.loading = true;

    for (const key in this.form?.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form?.controls, key)) {
        const control = this.form?.controls[key];

        control?.updateValueAndValidity();
      }
    }

    if (this.form?.valid) {
      const inputs = this.form?.value;

      const form = objectToFormData(inputs);

      const transaction = await createResource<Transaction>(this.api, 'transactions', form, this.ms, undefined, (item) => `El pago fue agregado exitosamente.`);

      if (transaction !== false) {
        this.form?.reset();
        this.init();
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    delete this._loan;
    this.form?.reset();
  }
}
