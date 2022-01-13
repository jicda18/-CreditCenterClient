import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';
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

  public form: FormGroup;
  public loading = false;
  public Options: { value: number | string; label: string; }[] = [];
  public provinceOptions: { value: number | string; label: string; }[] = [];
  public frequencyOptions: { value: number | string; label: string; }[] = [];
  public currencyOptions: { value: number | string; label: string; }[] = [];
  public bankOptions: { value: number | string; label: string; custom?: Currency; }[] = [];

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

  public get mail(): AbstractControl | null {
    return this.form.get('mail');
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

  public get balance(): AbstractControl | null {
    return this.form.get('balance');
  }

  public get fees(): AbstractControl | null {
    return this.form.get('fees');
  }

  public get interest(): AbstractControl | null {
    return this.form.get('interest');
  }

  public get frequency_key(): AbstractControl | null {
    return this.form.get('frequency_key');
  }

  public get type(): AbstractControl | null {
    return this.form.get('type');
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

  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
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
      guarantor: [null, []],
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
      occupation: [null, [Validators.required]],
      income: [null, [Validators.required]],
    });

    this._insert = this.fb.group({
      guarantor: [null, []],
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
      bank_key: [null, [Validators.required]],
      balance: [null, [Validators.required, Validators.min(0)]],
      interest: [null, [Validators.required, Validators.min(0)]],
      fees: [null, [Validators.min(1)]],
      frequency_key: [null, [Validators.required]],
      type: [null, [Validators.required]],
      start_at: [null, [Validators.required]],
      thanks_days: [null, []],
    });

    this.form = this._edit;
  }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.provinceOptions = options);
    selectOption('frequencies/select', this.api).then((options) => this.frequencyOptions = options);
    selectOption('currencies/select', this.api).then((options) => this.currencyOptions = options);
    selectOption<Currency>('banks/select', this.api).then((options) => this.bankOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.debtor === undefined) {
      this.form = this._insert;
    } else {
      this.form = this._edit;

      this.guarantor?.setValue(this.debtor.guarantor);
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
      let mail = this.mail?.value as string;
      const dob = this.dob?.value as Date;
      const marital_status = this.marital_status?.value as string;
      const occupation = this.occupation?.value as string;
      const income = this.income?.value as number;
      const bank_key = this.bank_key?.value as string;
      const balance = this.balance?.value as number;
      const interest = this.interest?.value as number;
      const frequency_key = this.frequency_key?.value as string;
      const type = this.type?.value as number;
      const start_at = this.start_at?.value as Date;
      const thanks_days = this.thanks_days?.value as number;
      const fees = this.fees?.value as number;

      if (phone_number !== undefined && phone_number !== null && phone_number !== '') {
        phone_number = phone_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
      }

      if (this.debtor === undefined) {
        const form = objectToFormData({ guarantor, business, name, nick_name, personal_id, gender, province_key, street, phone_number, mail, dob, marital_status, occupation, income, bank_key, balance, interest: (interest / 100), frequency_key, type, start_at, thanks_days, fees: (fees ?? 1) });

        await createResource<Debtor>(this.api, 'debtors?include=province', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ guarantor, business, name, nick_name, personal_id, gender, province_key, street, phone_number, mail, dob, marital_status, occupation, income });

        await updateResource<Debtor>(this.api, `debtors/${this.debtor.key}?province`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    delete this.debtor;
    this.form.reset();
  }
}
