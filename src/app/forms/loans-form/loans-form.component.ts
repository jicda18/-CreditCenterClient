import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Loan } from 'src/app/models/loan.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-loans-form',
  templateUrl: './loans-form.component.html',
  styles: [
  ]
})
export class LoansFormComponent implements OnInit, OnChanges {
  @Input() loan?: Loan;

  @Output() cancel = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;
  public currencyOptions: { value: number | string; label: string; }[] = [];
  public frequencyOptions: { value: number | string; label: string; }[] = [];

  public get currency_key(): AbstractControl | null {
    return this.form.get('currency_key');
  }

  public get frequency_key(): AbstractControl | null {
    return this.form.get('frequency_key');
  }

  public get fee_amount(): AbstractControl | null {
    return this.form.get('fee_amount');
  }

  public get thanks_days(): AbstractControl | null {
    return this.form.get('thanks_days');
  }

  public get next_at(): AbstractControl | null {
    return this.form.get('next_at');
  }

  public get status(): AbstractControl | null {
    return this.form.get('status');
  }

  public get currency_keyInvalid(): boolean {
    return (this.currency_key?.invalid && (this.currency_key?.touched || this.currency_key?.dirty)) ?? false;
  }

  public get frequency_keyInvalid(): boolean {
    return (this.frequency_key?.invalid && (this.frequency_key?.touched || this.frequency_key?.dirty)) ?? false;
  }

  public get fee_amountInvalid(): boolean {
    return (this.fee_amount?.invalid && (this.fee_amount?.touched || this.fee_amount?.dirty)) ?? false;
  }

  public get thanks_daysInvalid(): boolean {
    return (this.thanks_days?.invalid && (this.thanks_days?.touched || this.thanks_days?.dirty)) ?? false;
  }

  public get next_atInvalid(): boolean {
    return (this.next_at?.invalid && (this.next_at?.touched || this.next_at?.dirty)) ?? false;
  }

  public get statusInvalid(): boolean {
    return (this.status?.invalid && (this.status?.touched || this.status?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      currency_key: [null, []],
      frequency_key: [null, [Validators.required]],
      fee_amount: [null, [Validators.required]],
      thanks_days: [null, [Validators.min(0)]],
      next_at: [null, []],
      status: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    selectOption('currencies/select', this.api).then((options) => this.currencyOptions = options);
    selectOption('frequencies/select', this.api).then((options) => this.frequencyOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.loan !== undefined) {
      const currency_key = this.currency_key;
      const frequency_key = this.frequency_key;
      const fee_amount = this.fee_amount;
      const thanks_days = this.thanks_days;
      const next_at = this.next_at;
      const status = this.status;

      if (currency_key !== null) {
        currency_key.setValue(this.loan.currency_key);
        currency_key.disable();
      }

      if (frequency_key !== null) {
        frequency_key.setValue(this.loan.frequency_key);
      }

      if (fee_amount !== null) {
        fee_amount.setValue(this.loan.fee_amount);
      }

      if (thanks_days !== null) {
        thanks_days.setValue(this.loan.thanks_days);
      }

      if (next_at !== null) {
        next_at.setValue(convertToDate(this.loan.next_at));
        next_at.disable();
      }

      if (status !== null) {
        status.setValue(this.loan.status);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid && this.loan !== undefined) {
      const frequency_key = this.frequency_key?.value as string;
      const fee_amount = this.fee_amount?.value as number;
      const thanks_days = this.thanks_days?.value as number;
      const status = this.status?.value as string;

      const form = objectToHttpParams({ frequency_key, fee_amount, thanks_days, status });

      await updateResource<Loan>(this.api, `loans/${this.loan.key}`, form, this.ms, this.updated, (item) => `Deuda fue actualizado exitosamente.`);
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
