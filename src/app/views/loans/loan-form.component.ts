import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';
import { Loan } from 'src/app/models/loan.model';
import { convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, selectOption } from 'src/app/utils/helpers.utils';
import { environment } from 'src/environments/environment';
import { Currency } from 'src/app/models/currency.model';
import { CustomValidations } from 'src/app/utils/validations.util';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styles: [
  ]
})
export class LoanFormComponent implements OnInit {
  public form?: FormGroup;
  public loading = false;
  public frequencyOptions: { value: string; label: string; }[] = [];
  public debtorOptions: { value: string; label: string; }[] = [];
  public bankOptions: { value: string; label: string; custom?: Currency; }[] = [];
  public currencyOptions: { value: string; label: string; }[] = [];

  public get debtor_key(): AbstractControl | null {
    return this.form?.get('debtor_key') ?? null;
  }

  public get balance(): AbstractControl | null {
    return this.form?.get('balance') ?? null;
  }

  public get cash(): AbstractControl | null {
    return this.form?.get('cash') ?? null;
  }

  public get bank_key(): AbstractControl | null {
    return this.form?.get('bank_key') ?? null;
  }

  public get currency_key(): AbstractControl | null {
    return this.form?.get('currency_key') ?? null;
  }

  public get frequency_key(): AbstractControl | null {
    return this.form?.get('frequency_key') ?? null;
  }

  public get start_at(): AbstractControl | null {
    return this.form?.get('start_at') ?? null;
  }

  public get thanks_days(): AbstractControl | null {
    return this.form?.get('thanks_days') ?? null;
  }

  public get fees(): AbstractControl | null {
    return this.form?.get('fees') ?? null;
  }

  public get interest(): AbstractControl | null {
    return this.form?.get('interest') ?? null;
  }

  public get type(): AbstractControl | null {
    return this.form?.get('type') ?? null;
  }

  public get debtor_keyInvalid(): boolean {
    return (this.debtor_key?.invalid && (this.debtor_key?.touched || this.debtor_key?.dirty)) ?? false;
  }

  public get balanceInvalid(): boolean {
    return (this.balance?.invalid && (this.balance?.touched || this.balance?.dirty)) ?? false;
  }

  public get cashInvalid(): boolean {
    return (this.cash?.invalid && (this.cash?.touched || this.cash?.dirty)) ?? false;
  }

  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
  }

  public get currency_keyInvalid(): boolean {
    return (this.currency_key?.invalid && (this.currency_key?.touched || this.currency_key?.dirty)) ?? false;
  }

  public get frequency_keyInvalid(): boolean {
    return (this.frequency_key?.invalid && (this.frequency_key?.touched || this.frequency_key?.dirty)) ?? false;
  }

  public get start_atInvalid(): boolean {
    return (this.start_at?.invalid && (this.start_at?.touched || this.start_at?.dirty)) ?? false;
  }

  public get thanks_daysInvalid(): boolean {
    return (this.thanks_days?.invalid && (this.thanks_days?.touched || this.thanks_days?.dirty)) ?? false;
  }

  public get feesInvalid(): boolean {
    return (this.fees?.invalid && (this.fees?.touched || this.fees?.dirty)) ?? false;
  }

  public get interestInvalid(): boolean {
    return (this.interest?.invalid && (this.interest?.touched || this.interest?.dirty)) ?? false;
  }

  public get typeInvalid(): boolean {
    return (this.type?.invalid && (this.type?.touched || this.type?.dirty)) ?? false;
  }

  public get minStartDay(): Date {
    return new Date();
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      debtor_key: [null, [Validators.required]],
      balance: [null, [Validators.required, Validators.min(0)]],
      cash: [false, [Validators.required]],
      bank_key: [null, [CustomValidations.fn((value?: string) => this.cash?.value === false ? (value !== undefined && value !== null && value !== '') : true)]],
      currency_key: [null, [CustomValidations.fn((value?: string) => this.cash?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      frequency_key: [null, [Validators.required]],
      start_at: [null, [Validators.required]],
      thanks_days: [null, [Validators.required, Validators.min(0)]],
      interest: [null, [Validators.required, Validators.min(0)]],
      fees: [null, [Validators.min(1)]],
      type: [null, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.frequencyOptions = await selectOption('frequencies/select', this.api);
    this.debtorOptions = await selectOption('debtors/select', this.api);
    this.bankOptions = await selectOption('banks/select', this.api);
    this.currencyOptions = await selectOption('currencies/select', this.api);

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

      inputs.interest /= 100;
      inputs.fees = inputs.fees ?? 1;

      const form = objectToFormData(inputs);

      const loan = await createResource<Loan>(this.api, `loans`, form, this.ms, undefined, (item) => `Deuda fue creada exitosamente.`);

      if (loan !== false) {
        this.reset();
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }

  public biweekly(): void {
    const frequency_key = this.frequency_key?.value as null | string;
    const start_at = this.start_at?.value as null | Date;

    if (frequency_key !== undefined && start_at !== undefined && frequency_key !== null && start_at !== null) {
      if (frequency_key === environment.biweekly) {
        if (start_at.getDate() !== 15 && start_at.getDate() !== 30) {
          const format = dateFormat(start_at, 'yyyy-LL');
          if (start_at.getDate() < 15) {
            this.start_at?.setValue(convertToDate(`${format}-15`));
          } else {
            if (start_at.getMonth() === 1) {
              const luxon = convertToDateTime(start_at);
              if (luxon.isInLeapYear) {
                this.start_at?.setValue(convertToDate(`${format}-29`));
              } else {
                this.start_at?.setValue(convertToDate(`${format}-28`));
              }
            } else {
              this.start_at?.setValue(convertToDate(`${format}-30`));
            }
          }
        }
      }
    }
  }

  private reset(): void {
    this.form?.reset();

    this.cash?.setValue(false);
  }
}
