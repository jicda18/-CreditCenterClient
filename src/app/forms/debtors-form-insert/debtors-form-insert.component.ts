import { Component, EventEmitter, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { permissions } from 'src/app/utils/const.utils';
import { biweeklyCheck, canEditInsertAndDelete, convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';
import { CustomValidations } from 'src/app/utils/validations.util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-debtors-form-insert',
  templateUrl: './debtors-form-insert.component.html',
  styles: [
  ]
})
export class DebtorsFormComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public readonly = false;
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

  public get maxDob(): Date {
    const today = convertToDateTime(new Date());

    return convertToDate(today.plus({ years: -18 }));
  }

  public get minStartDay(): Date {
    return new Date();
  }

  public get canSubmit(): boolean {
    return !this.readonly;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService, private ss: SessionService) {
    this.form = this.fb.group({
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
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.provinceOptions = await selectOption('provinces/select', this.api);
    this.frequencyOptions = await selectOption('frequencies/select', this.api);
    this.bankOptions = await selectOption('banks/select', this.api);
    this.currencyOptions = await selectOption('currencies/select', this.api);

    const options = canEditInsertAndDelete(this.ss, permissions.debtor_store, permissions.debtor_update, permissions.debtor_delete);

    this.readonly = !options.insert;

    this.with_guarantor?.enable();
    this.guarantor?.enable();
    this.guarantor_email?.enable();
    this.guarantor_phone?.enable();
    this.guarantor_personal_id?.enable();
    this.business?.enable();
    this.name?.enable();
    this.nick_name?.enable();
    this.personal_id?.enable();
    this.gender?.enable();
    this.province_key?.enable();
    this.street?.enable();
    this.phone_number?.enable();
    this.mail?.enable();
    this.dob?.enable();
    this.marital_status?.enable();
    this.occupation?.enable();
    this.income?.enable();
    this.cash?.enable();
    this.bank_key?.enable();
    this.currency_key?.enable();
    this.balance?.enable();
    this.interest?.enable();
    this.fees?.enable();
    this.frequency_key?.enable();
    this.type?.enable();
    this.start_at?.enable();
    this.thanks_days?.enable();

    if (this.readonly) {
      this.with_guarantor?.disable();
      this.guarantor?.disable();
      this.guarantor_email?.disable();
      this.guarantor_phone?.disable();
      this.guarantor_personal_id?.disable();
      this.business?.disable();
      this.name?.disable();
      this.nick_name?.disable();
      this.personal_id?.disable();
      this.gender?.disable();
      this.province_key?.disable();
      this.street?.disable();
      this.phone_number?.disable();
      this.mail?.disable();
      this.dob?.disable();
      this.marital_status?.disable();
      this.occupation?.disable();
      this.income?.disable();
      this.cash?.disable();
      this.bank_key?.disable();
      this.currency_key?.disable();
      this.balance?.disable();
      this.interest?.disable();
      this.fees?.disable();
      this.frequency_key?.disable();
      this.type?.disable();
      this.start_at?.disable();
      this.thanks_days?.disable();
    }

    this.loading = false;
  }

  public biweekly(): void {
    const frequency_key = this.frequency_key?.value as null | undefined | string;
    const start_at = this.start_at?.value as null | undefined | Date;

    const value = biweeklyCheck(frequency_key, start_at);

    if (value !== null) {
      this.start_at?.setValue(value);
    }
  }

  public async submit(): Promise<void> {
    if (this.readonly || !this.canSubmit) {
      return;
    }

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

      if (!inputs.with_guarantor) {
        inputs.guarantor = null;
        inputs.guarantor_email = null;
        inputs.guarantor_phone = null;
        inputs.guarantor_personal_id = null;
      }

      inputs.interest /= 100;
      inputs.fees = inputs.fees ?? 1;

      const form = objectToFormData(inputs);

      await createResource<Debtor>(this.api, 'debtors?include=province', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente.`);
    } else {
      this.form?.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    this.form?.reset();
  }
}
