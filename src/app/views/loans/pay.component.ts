import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Loan } from 'src/app/models/loan.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, overdues, selectOption, toCurrency } from 'src/app/utils/helpers.utils';
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

  public types = [
    {
      value: 'regular', label: 'Regular', disable: () => false
    },
    {
      value: 'capital', label: 'Abono Capital', disable: () => {
        if (this._loan !== undefined && this._loan !== null) {
          return this._loan.pending_summary > 0;
        }

        return true;
      }
    },
    { value: 'total', label: 'Saldo Total', disable: () => false },
  ];

  public loan_details = {
    overdue: '',
    interest: '',
    late: '',
    pay: '',
    capital: '',
    total: '',
    show: false,
  };

  public maxAmount = 0;

  private set loan(value: Loan | undefined) {
    if (value !== undefined && value !== null) {
      this.loan_details.capital = toCurrency(value.summary);
      this.loan_details.overdue = toCurrency(value.pending_summary);
      this.loan_details.total = toCurrency(value.total);

      this.loan_details.interest = toCurrency(value.interest_summary);
      this.loan_details.late = toCurrency(value.late_summary);
      this.loan_details.pay = toCurrency(value.pay_summary);

      this.loan_details.show = true;

      this.maxAmount = value.total;
    } else {
      this.loan_details.show = false;
    }

    this._loan = value;
  }

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

  public get type(): AbstractControl | null {
    return this.form?.get('type') ?? null;
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

  public get typeInvalid(): boolean {
    return (this.type?.invalid && (this.type?.touched || this.type?.dirty)) ?? false;
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
      type: [null, [Validators.required]],
    });

    this.debtor_key?.valueChanges.subscribe((value: string) => {
      const debtor = this.debtorOptions.find((option) => option.value === value);

      if (debtor !== undefined && debtor !== null) {
        this.loanOptions = debtor.custom ?? [];
      }
    });

    this.loan_key?.valueChanges.subscribe(async (value: string) => {
      const loan = this.loanOptions.find((option) => option.value === value);

      if (loan !== undefined && loan !== null) {
        this.loan = await this.getLoan(loan.value);
      } else {
        this.loan = undefined;
      }
    });

    this.type?.valueChanges.subscribe((value: string) => {
      if (value === 'total') {
        this.amount?.setValue(this.maxAmount);
        this.amount?.disable();
      } else {
        this.amount?.reset();
        this.amount?.enable();
      }
    });

    this.amount?.valueChanges.subscribe((value: number) => {
      const type = this.type?.value;

      if (type !== 'total' && value === this.maxAmount) {
        this.type?.setValue('total');
      }
    });

    // Todo: only load bank with currency
  }

  ngOnInit(): void {
    this.init();
  }

  private async getLoan(loan_key: string): Promise<Loan | undefined> {
    return (await this.api.get<Loan>(`loans/${loan_key}?include=debtor`)).data;
  }

  private async init(): Promise<void> {
    this.loading = true;

    const loan_key = this.route.snapshot.paramMap.get('loan_key');

    if (loan_key !== null) {
      this.loan = await this.getLoan(loan_key);
    }

    this.bankOptions = await selectOption('banks/select', this.api);

    if (this._loan === undefined) {
      this.debtorOptions = await selectOption('debtors/loan/select', this.api);
    } else {
      this.debtorOptions = [{ value: this._loan.debtor?.key ?? '', label: this._loan.debtor?.name ?? '', custom: [{ value: this._loan.key, label: this._loan.label }] }];
      this.debtor_key?.setValue(this._loan.debtor?.key ?? '');
      this.debtor_key?.disable();

      this.loan_key?.setValue(this._loan.key ?? '');
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
      const loan_key = this.route.snapshot.paramMap.get('loan_key');

      this.debtor_key?.enable();
      this.loan_key?.enable();
      this.amount?.enable();

      const inputs = this.form?.value;

      if (loan_key !== null) {
        this.debtor_key?.disable();
        this.loan_key?.disable();
      }

      const form = objectToFormData(inputs);

      const transaction = await createResource<Transaction>(this.api, 'transactions', form, this.ms, undefined, (item) => `El pago fue agregado exitosamente.`);

      if (transaction !== false) {
        this.reset();
        this.init();
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }

  private reset(): void {
    this.form?.reset();

    this.cash?.setValue(false);
  }

  ngOnDestroy(): void {
    delete this._loan;
    this.reset();
  }
}
