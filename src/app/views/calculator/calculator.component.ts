import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CalculatorItem } from 'src/app/models/calculator-item.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, convertToDateTime, dateFormat, dateStandardFormat, objectToFormData, selectOption, toCurrency } from 'src/app/utils/helpers.utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styles: [
  ]
})
export class CalculatorComponent implements OnInit {
  private _items?: CalculatorItem[];

  public form?: FormGroup;
  public loading = false;

  public frequencyOptions: { value: string; label: string; }[] = [];

  public get items(): { [key: string]: string }[] {
    if (this._items === undefined || this._items === null) {
      return [];
    }

    return this._items.map((item) => {
      return {
        paid_at: dateStandardFormat(item.paid_at),
        preview: toCurrency(item.preview),
        amount: toCurrency(item.amount),
        payment: toCurrency(item.payment),
        interest: toCurrency(item.interest),
        pending: toCurrency(item.pending),
      };
    });
  }

  public get balance(): AbstractControl | null {
    return this.form?.get('balance') ?? null;
  }

  public get fees(): AbstractControl | null {
    return this.form?.get('fees') ?? null;
  }

  public get interest(): AbstractControl | null {
    return this.form?.get('interest') ?? null;
  }

  public get frequency_key(): AbstractControl | null {
    return this.form?.get('frequency_key') ?? null;
  }

  public get start_at(): AbstractControl | null {
    return this.form?.get('start_at') ?? null;
  }

  public get balanceInvalid(): boolean {
    return (this.balance?.invalid && (this.balance?.touched || this.balance?.dirty)) ?? false;
  }

  public get feesInvalid(): boolean {
    return (this.fees?.invalid && (this.fees?.touched || this.fees?.dirty)) ?? false;
  }

  public get interestInvalid(): boolean {
    return (this.interest?.invalid && (this.interest?.touched || this.interest?.dirty)) ?? false;
  }

  public get frequency_keyInvalid(): boolean {
    return (this.frequency_key?.invalid && (this.frequency_key?.touched || this.frequency_key?.dirty)) ?? false;
  }

  public get start_atInvalid(): boolean {
    return (this.start_at?.invalid && (this.start_at?.touched || this.start_at?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      balance: [null, [Validators.required, Validators.min(0)]],
      interest: [null, [Validators.required, Validators.min(0)]],
      fees: [null, [Validators.min(1)]],
      frequency_key: [null, [Validators.required]],
      start_at: [null, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.frequencyOptions = await selectOption('frequencies/select', this.api);

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

      const items = (await this.api.post<CalculatorItem[]>('calculator', form)).data ?? false;

      if (items !== false) {
        this._items = items;
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }
}
