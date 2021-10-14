import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, createResource, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-debors-form',
  templateUrl: './debors-form.component.html',
  styles: [
  ]
})
export class DeborsFormComponent implements OnInit, OnChanges {
  @Input() debtor?: Debtor;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;
  public Options: { value: number | string; label: string; }[] = [];
  public provinceOptions: { value: number | string; label: string; }[] = [];
  public currencyOptions: { value: number | string; label: string; }[] = [];
  public frequencyOptions: { value: number | string; label: string; }[] = [];
  public bankOptions: { value: number | string; label: string; }[] = [];

  public get guarantor(): AbstractControl | null {
    return this.form.get('guarantor');
  }

  public get business(): AbstractControl | null {
    return this.form.get('business');
  }

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get nick_name(): AbstractControl | null {
    return this.form.get('nick_name');
  }

  public get personal_id(): AbstractControl | null {
    return this.form.get('personal_id');
  }

  public get gender(): AbstractControl | null {
    return this.form.get('gender');
  }

  public get province_key(): AbstractControl | null {
    return this.form.get('province_key');
  }

  public get street(): AbstractControl | null {
    return this.form.get('street');
  }

  public get phone_number(): AbstractControl | null {
    return this.form.get('phone_number');
  }

  public get dob(): AbstractControl | null {
    return this.form.get('dob');
  }

  public get marital_status(): AbstractControl | null {
    return this.form.get('marital_status');
  }

  public get occupation(): AbstractControl | null {
    return this.form.get('occupation');
  }

  public get income(): AbstractControl | null {
    return this.form.get('income');
  }

  public get bank_key(): AbstractControl | null {
    return this.form.get('bank_key');
  }

  public get currency_key(): AbstractControl | null {
    return this.form.get('currency_key');
  }

  public get balance(): AbstractControl | null {
    return this.form.get('balance');
  }

  public get frequency_key(): AbstractControl | null {
    return this.form.get('frequency_key');
  }

  public get fee_amount(): AbstractControl | null {
    return this.form.get('fee_amount');
  }

  public get start_at(): AbstractControl | null {
    return this.form.get('start_at');
  }

  public get thanks_days(): AbstractControl | null {
    return this.form.get('thanks_days');
  }

  public get guarantorInvalid(): boolean {
    return (this.guarantor?.invalid && (this.guarantor?.touched || this.guarantor?.dirty)) ?? false;
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

  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
  }

  public get currency_keyInvalid(): boolean {
    return (this.currency_key?.invalid && (this.currency_key?.touched || this.currency_key?.dirty)) ?? false;
  }

  public get balanceInvalid(): boolean {
    return (this.balance?.invalid && (this.balance?.touched || this.balance?.dirty)) ?? false;
  }

  public get frequency_keyInvalid(): boolean {
    return (this.frequency_key?.invalid && (this.frequency_key?.touched || this.frequency_key?.dirty)) ?? false;
  }

  public get fee_amountInvalid(): boolean {
    return (this.fee_amount?.invalid && (this.fee_amount?.touched || this.fee_amount?.dirty)) ?? false;
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

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.provinceOptions = options);
    selectOption('currencies/select', this.api).then((options) => this.currencyOptions = options);
    selectOption('frequencies/select', this.api).then((options) => this.frequencyOptions = options);
    selectOption('banks/select', this.api).then((options) => this.bankOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.debtor === undefined) {
      this.form = this.fb.group({
        guarantor: [null, []],
        business: [null, []],
        name: [null, [Validators.required]],
        nick_name: [null, []],
        personal_id: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        province_key: [null, [Validators.required]],
        street: [null, [Validators.required]],
        phone_number: [null, []],
        dob: [null, []],
        marital_status: [null, [Validators.required]],
        occupation: [null, []],
        income: [null, [Validators.required]],
        bank_key: [null, [Validators.required]],
        currency_key: [null, [Validators.required]],
        balance: [null, [Validators.required, Validators.min(0)]],
        frequency_key: [null, [Validators.required]],
        fee_amount: [null, [Validators.required]],
        start_at: [null, [Validators.required]],
        thanks_days: [null, []],
      });
    } else {
      this.form = this.fb.group({
        guarantor: [null, []],
        business: [null, []],
        name: [null, [Validators.required]],
        nick_name: [null, []],
        personal_id: [null, [Validators.required]],
        gender: [null, [Validators.required]],
        province_key: [null, [Validators.required]],
        street: [null, [Validators.required]],
        phone_number: [null, []],
        dob: [null, []],
        marital_status: [null, [Validators.required]],
        occupation: [null, [Validators.required]],
        income: [null, [Validators.required]],
      });

      const guarantor = this.guarantor;
      const business = this.business;
      const name = this.name;
      const nick_name = this.nick_name;
      const personal_id = this.personal_id;
      const gender = this.gender;
      const province_key = this.province_key;
      const street = this.street;
      const phone_number = this.phone_number;
      const dob = this.dob;
      const marital_status = this.marital_status;
      const occupation = this.occupation;
      const income = this.income;

      if (guarantor !== null) {
        guarantor.setValue(this.debtor.guarantor);
      }

      if (business !== null) {
        business.setValue(this.debtor.business);
      }

      if (name !== null) {
        name.setValue(this.debtor.name);
      }

      if (nick_name !== null) {
        nick_name.setValue(this.debtor.nick_name);
      }

      if (personal_id !== null) {
        personal_id.setValue(this.debtor.personal_id);
      }

      if (gender !== null) {
        gender.setValue(this.debtor.gender);
      }

      if (province_key !== null) {
        province_key.setValue(this.debtor.province_key);
      }

      if (street !== null) {
        street.setValue(this.debtor.street);
      }

      if (phone_number !== null) {
        phone_number.setValue(this.debtor.phone_number);
      }

      if (dob !== null && this.debtor.dob !== undefined) {
        dob.setValue(convertToDate(this.debtor.dob));
      }

      if (marital_status !== null) {
        marital_status.setValue(this.debtor.marital_status);
      }

      if (occupation !== null) {
        occupation.setValue(this.debtor.occupation);
      }

      if (income !== null) {
        income.setValue(this.debtor.income);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const guarantor = this.guarantor?.value as string;
      const business = this.business?.value as string;
      const name = this.name?.value as string;
      const nick_name = this.nick_name?.value as string;
      const personal_id = this.personal_id?.value as string;
      const gender = this.gender?.value as string;
      const province_key = this.province_key?.value as string;
      const street = this.street?.value as string;
      let phone_number = this.phone_number?.value as string;
      const dob = this.dob?.value as Date;
      const marital_status = this.marital_status?.value as string;
      const occupation = this.occupation?.value as string;
      const income = this.income?.value as number;
      const bank_key = this.bank_key?.value as string;
      const currency_key = this.currency_key?.value as string;
      const balance = this.balance?.value as number;
      const frequency_key = this.frequency_key?.value as string;
      const fee_amount = this.fee_amount?.value as number;
      const start_at = this.start_at?.value as Date;
      const thanks_days = this.thanks_days?.value as number;

      if (phone_number !== undefined && phone_number !== null && phone_number !== '') {
        phone_number = phone_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
      }

      if (this.debtor === undefined) {
        const form = objectToFormData({ guarantor, business, name, nick_name, personal_id, gender, province_key, street, phone_number, dob, marital_status, occupation, income, bank_key, currency_key, balance, frequency_key, fee_amount, start_at, thanks_days });

        await createResource<Debtor>(this.api, 'debtors?include=province', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ guarantor, business, name, nick_name, personal_id, gender, province_key, street, phone_number, dob, marital_status, occupation, income });

        await updateResource<Debtor>(this.api, `debtors/${this.debtor.key}?province`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
