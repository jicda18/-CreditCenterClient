import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MessageService } from 'primeng/api';
import { Loan } from 'src/app/models/loan.model';
import { convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, selectOption } from 'src/app/utils/helpers.utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styles: [
  ]
})
export class LoanFormComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public frequencyOptions: { value: number | string; label: string; }[] = [];
  public debtorOptions: { value: number | string; label: string; }[] = [];
  public bankOptions: { value: number | string; label: string; }[] = [];

  public get debtor_key(): AbstractControl | null {
    return this.form.get('debtor_key');
  }
  public get balance(): AbstractControl | null {
    return this.form.get('balance');
  }
  public get fee_amount(): AbstractControl | null {
    return this.form.get('fee_amount');
  }
  public get bank_key(): AbstractControl | null {
    return this.form.get('bank_key');
  }
  public get frequency_key(): AbstractControl | null {
    return this.form.get('frequency_key');
  }
  public get start_at(): AbstractControl | null {
    return this.form.get('start_at');
  }
  public get thanks_days(): AbstractControl | null {
    return this.form.get('thanks_days');
  }

  public get debtor_keyInvalid(): boolean {
    return (this.debtor_key?.invalid && (this.debtor_key?.touched || this.debtor_key?.dirty)) ?? false;
  }
  public get balanceInvalid(): boolean {
    return (this.balance?.invalid && (this.balance?.touched || this.balance?.dirty)) ?? false;
  }
  public get fee_amountInvalid(): boolean {
    return (this.fee_amount?.invalid && (this.fee_amount?.touched || this.fee_amount?.dirty)) ?? false;
  }
  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
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

  public get minStartDay(): Date {
    return new Date();
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      debtor_key: [null, [Validators.required]],
      balance: [null, [Validators.required, Validators.min(0)]],
      fee_amount: [null, [Validators.required, Validators.min(0)]],
      bank_key: [null, [Validators.required]],
      frequency_key: [null, [Validators.required]],
      start_at: [null, [Validators.required]],
      thanks_days: [null, [Validators.required, Validators.min(0)]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.frequencyOptions = await selectOption('frequencies/select', this.api);
    this.debtorOptions = await selectOption('debtors/select', this.api);
    this.bankOptions = await selectOption('banks/select', this.api);

    this.loading = false;
  }


  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const debtor_key = this.debtor_key?.value as string;
      const balance = this.balance?.value as number;
      const fee_amount = this.fee_amount?.value as number;
      const bank_key = this.bank_key?.value as string;
      const frequency_key = this.frequency_key?.value as string;
      const start_at = this.start_at?.value as Date;
      const thanks_days = this.thanks_days?.value as number;

      const form = objectToFormData({ debtor_key, balance, fee_amount, bank_key, frequency_key, start_at, thanks_days });

      const loan = await createResource<Loan>(this.api, `loans`, form, this.ms, undefined, (item) => `Deuda fue creada exitosamente.`);

      if (loan !== false) {
        this.form.reset();
      }
    } else {
      this.form.markAllAsTouched();
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
}
