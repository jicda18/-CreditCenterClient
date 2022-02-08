import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';
import { CustomValidations } from 'src/app/utils/validations.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debors-form',
  templateUrl: './debors-form.component.html',
  styles: [
  ]
})
export class DeborsFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() debtor?: Debtor;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  private _edit: FormGroup;
  private _insert: FormGroup;

  public form?: FormGroup;
  public loading = false;
  public provinceOptions: { value: string; label: string; }[] = [];
  public frequencyOptions: { value: string; label: string; }[] = [];
  public bankOptions: { value: string; label: string; custom?: Currency; }[] = [];
  public currencyOptions: { value: string; label: string; }[] = [];

  public get with_guarantor(): AbstractControl | null {
    return this.form?.get('with_guarantor') ?? null;
  }

  public get guarantor(): AbstractControl | null {
    return this.form?.get('guarantor') ?? null;
  }

  public get guarantor_email(): AbstractControl | null {
    return this.form?.get('guarantor_email') ?? null;
  }

  public get guarantor_phone(): AbstractControl | null {
    return this.form?.get('guarantor_phone') ?? null;
  }

  public get guarantor_personal_id(): AbstractControl | null {
    return this.form?.get('guarantor_personal_id') ?? null;
  }

  public get business(): AbstractControl | null {
    return this.form?.get('business') ?? null;
  }

  public get name(): AbstractControl | null {
    return this.form?.get('name') ?? null;
  }

  public get nick_name(): AbstractControl | null {
    return this.form?.get('nick_name') ?? null;
  }

  public get personal_id(): AbstractControl | null {
    return this.form?.get('personal_id') ?? null;
  }

  public get gender(): AbstractControl | null {
    return this.form?.get('gender') ?? null;
  }

  public get province_key(): AbstractControl | null {
    return this.form?.get('province_key') ?? null;
  }

  public get street(): AbstractControl | null {
    return this.form?.get('street') ?? null;
  }

  public get phone_number(): AbstractControl | null {
    return this.form?.get('phone_number') ?? null;
  }

  public get mail(): AbstractControl | null {
    return this.form?.get('mail') ?? null;
  }

  public get dob(): AbstractControl | null {
    return this.form?.get('dob') ?? null;
  }

  public get marital_status(): AbstractControl | null {
    return this.form?.get('marital_status') ?? null;
  }

  public get occupation(): AbstractControl | null {
    return this.form?.get('occupation') ?? null;
  }

  public get income(): AbstractControl | null {
    return this.form?.get('income') ?? null;
  }

  public get cash(): AbstractControl | null {
    return this.form?.get('cash') ?? null;
  }

  public get bank_key(): AbstractControl | null {
    return this.form?.get('bank_key') ?? null ?? null;
  }

  public get currency_key(): AbstractControl | null {
    return this.form?.get('currency_key') ?? null ?? null;
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

  public get type(): AbstractControl | null {
    return this.form?.get('type') ?? null;
  }

  public get start_at(): AbstractControl | null {
    return this.form?.get('start_at') ?? null;
  }

  public get thanks_days(): AbstractControl | null {
    return this.form?.get('thanks_days') ?? null;
  }

  public get with_guarantorInvalid(): boolean {
    return (this.with_guarantor?.invalid && (this.with_guarantor?.touched || this.with_guarantor?.dirty)) ?? false;
  }

  public get guarantorInvalid(): boolean {
    return (this.guarantor?.invalid && (this.guarantor?.touched || this.guarantor?.dirty)) ?? false;
  }

  public get guarantor_emailInvalid(): boolean {
    return (this.guarantor_email?.invalid && (this.guarantor_email?.touched || this.guarantor_email?.dirty)) ?? false;
  }

  public get guarantor_phoneInvalid(): boolean {
    return (this.guarantor_phone?.invalid && (this.guarantor_phone?.touched || this.guarantor_phone?.dirty)) ?? false;
  }

  public get guarantor_personal_idInvalid(): boolean {
    return (this.guarantor_personal_id?.invalid && (this.guarantor_personal_id?.touched || this.guarantor_personal_id?.dirty)) ?? false;
  }

  public get businessInvalid(): boolean {
    return (this.business?.invalid && (this.business?.touched || this.business?.dirty)) ?? false;
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  public get nick_nameInvalid(): boolean {
    return (this.nick_name?.invalid && (this.nick_name?.touched || this.nick_name?.dirty)) ?? false;
  }

  public get personal_idInvalid(): boolean {
    return (this.personal_id?.invalid && (this.personal_id?.touched || this.personal_id?.dirty)) ?? false;
  }

  public get genderInvalid(): boolean {
    return (this.gender?.invalid && (this.gender?.touched || this.gender?.dirty)) ?? false;
  }

  public get province_keyInvalid(): boolean {
    return (this.province_key?.invalid && (this.province_key?.touched || this.province_key?.dirty)) ?? false;
  }

  public get streetInvalid(): boolean {
    return (this.street?.invalid && (this.street?.touched || this.street?.dirty)) ?? false;
  }

  public get phone_numberInvalid(): boolean {
    return (this.phone_number?.invalid && (this.phone_number?.touched || this.phone_number?.dirty)) ?? false;
  }

  public get mailInvalid(): boolean {
    return (this.mail?.invalid && (this.mail?.touched || this.mail?.dirty)) ?? false;
  }

  public get dobInvalid(): boolean {
    return (this.dob?.invalid && (this.dob?.touched || this.dob?.dirty)) ?? false;
  }

  public get marital_statusInvalid(): boolean {
    return (this.marital_status?.invalid && (this.marital_status?.touched || this.marital_status?.dirty)) ?? false;
  }

  public get occupationInvalid(): boolean {
    return (this.occupation?.invalid && (this.occupation?.touched || this.occupation?.dirty)) ?? false;
  }

  public get incomeInvalid(): boolean {
    return (this.income?.invalid && (this.income?.touched || this.income?.dirty)) ?? false;
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

  public get typeInvalid(): boolean {
    return (this.type?.invalid && (this.type?.touched || this.type?.dirty)) ?? false;
  }

  public get start_atInvalid(): boolean {
    return (this.start_at?.invalid && (this.start_at?.touched || this.start_at?.dirty)) ?? false;
  }

  public get thanks_daysInvalid(): boolean {
    return (this.thanks_days?.invalid && (this.thanks_days?.touched || this.thanks_days?.dirty)) ?? false;
  }

  public get isInsert(): boolean {
    return this.debtor === undefined;
  }

  public get maxDob(): Date {
    const today = convertToDateTime(new Date());

    return convertToDate(today.plus({ years: -18 }));
  }

  public get minStartDay(): Date {
    return new Date();
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this._edit = this.fb.group({
      with_guarantor: [null, []],
      guarantor: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      guarantor_email: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true), Validators.email]],
      guarantor_phone: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      guarantor_personal_id: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      business: [null, []],
      name: [null, [Validators.required]],
      nick_name: [null, []],
      personal_id: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      province_key: [null, [Validators.required]],
      street: [null, [Validators.required]],
      phone_number: [null, []],
      mail: [null, [Validators.email]],
      dob: [null, []],
      marital_status: [null, [Validators.required]],
      occupation: [null, []],
      income: [null, [Validators.required]],
    });

    this._insert = this.fb.group({
      with_guarantor: [false, [Validators.required]],
      guarantor: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      guarantor_email: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true), Validators.email]],
      guarantor_phone: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      guarantor_personal_id: [null, [CustomValidations.fn((value?: string) => this.with_guarantor?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      business: [null, []],
      name: [null, [Validators.required]],
      nick_name: [null, []],
      personal_id: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      province_key: [null, [Validators.required]],
      street: [null, [Validators.required]],
      phone_number: [null, []],
      mail: [null, [Validators.email]],
      dob: [null, []],
      marital_status: [null, [Validators.required]],
      occupation: [null, []],
      income: [null, [Validators.required]],
      cash: [false, [Validators.required]],
      bank_key: [null, [CustomValidations.fn((value?: string) => this.cash?.value === false ? (value !== undefined && value !== null && value !== '') : true)]],
      currency_key: [null, [CustomValidations.fn((value?: string) => this.cash?.value === true ? (value !== undefined && value !== null && value !== '') : true)]],
      balance: [null, [Validators.required, Validators.min(0)]],
      interest: [null, [Validators.required, Validators.min(0)]],
      fees: [null, [Validators.min(1)]],
      frequency_key: [null, [Validators.required]],
      type: [null, [Validators.required]],
      start_at: [null, [Validators.required]],
      thanks_days: [null, [Validators.required, Validators.min(0)]],
    });

    this.form = this._edit;
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.provinceOptions = await selectOption('provinces/select', this.api);
    this.frequencyOptions = await selectOption('frequencies/select', this.api);
    this.bankOptions = await selectOption('banks/select', this.api);
    this.currencyOptions = await selectOption('currencies/select', this.api);

    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.debtor === undefined) {
      this.form = this._insert;
    } else {
      this.form = this._edit;

      this.with_guarantor?.setValue(this.debtor.guarantor !== null);
      this.guarantor?.setValue(this.debtor.guarantor);
      this.guarantor_email?.setValue(this.debtor.guarantor_email);
      this.guarantor_phone?.setValue(this.debtor.guarantor_phone);
      this.guarantor_personal_id?.setValue(this.debtor.guarantor_personal_id);
      this.business?.setValue(this.debtor.business);
      this.name?.setValue(this.debtor.name);
      this.nick_name?.setValue(this.debtor.nick_name);
      this.personal_id?.setValue(this.debtor.personal_id);
      this.gender?.setValue(this.debtor.gender);
      this.province_key?.setValue(this.debtor.province_key);
      this.street?.setValue(this.debtor.street);
      this.phone_number?.setValue(this.debtor.phone_number);
      this.mail?.setValue(this.debtor.mail);
      this.marital_status?.setValue(this.debtor.marital_status);
      this.occupation?.setValue(this.debtor.occupation);
      this.income?.setValue(this.debtor.income);

      if (this.debtor.dob !== undefined) {
        this.dob?.setValue(convertToDate(this.debtor.dob));
      }
    }
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

      if (inputs.phone_number !== undefined && inputs.phone_number !== null && inputs.phone_number !== '') {
        inputs.phone_number = inputs.phone_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
      }

      if (this.debtor === undefined) {
        inputs.interest /= 100;
        inputs.fees = inputs.fees ?? 1;

        const form = objectToFormData(inputs);

        await createResource<Debtor>(this.api, 'debtors?include=province', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams(inputs);

        await updateResource<Debtor>(this.api, `debtors/${this.debtor.key}?province`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    delete this.debtor;
    this.form?.reset();
  }
}
