import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { Debtor } from 'src/app/models/debtor.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { permissions } from 'src/app/utils/const.utils';
import { canEditInsertAndDelete, convertToDate, convertToDateTime, createResource, dateFormat, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';
import { CustomValidations } from 'src/app/utils/validations.util';

@Component({
  selector: 'app-debtors-form-edit',
  templateUrl: './debtors-form-edit.component.html',
  styles: [
  ]
})
export class DebtorsFormEditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() debtor?: Debtor;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public readonly = false;
  public loading = false;
  public provinceOptions: { value: string; label: string; }[] = [];

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
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.provinceOptions = await selectOption('provinces/select', this.api);

    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const options = canEditInsertAndDelete(this.ss, permissions.debtor_store, permissions.debtor_update, permissions.debtor_delete);

    this.readonly = !options.edit;

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

    this.with_guarantor?.setValue(this.debtor?.guarantor !== null);
    this.guarantor?.setValue(this.debtor?.guarantor);
    this.guarantor_email?.setValue(this.debtor?.guarantor_email);
    this.guarantor_phone?.setValue(this.debtor?.guarantor_phone);
    this.guarantor_personal_id?.setValue(this.debtor?.guarantor_personal_id);
    this.business?.setValue(this.debtor?.business);
    this.name?.setValue(this.debtor?.name);
    this.nick_name?.setValue(this.debtor?.nick_name);
    this.personal_id?.setValue(this.debtor?.personal_id);
    this.gender?.setValue(this.debtor?.gender);
    this.province_key?.setValue(this.debtor?.province_key);
    this.street?.setValue(this.debtor?.street);
    this.phone_number?.setValue(this.debtor?.phone_number);
    this.mail?.setValue(this.debtor?.mail);
    this.marital_status?.setValue(this.debtor?.marital_status);
    this.occupation?.setValue(this.debtor?.occupation);
    this.income?.setValue(this.debtor?.income);

    if (this.debtor?.dob !== undefined) {
      this.dob?.setValue(convertToDate(this.debtor?.dob));
    }

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

      const form = objectToHttpParams(inputs);

      await updateResource<Debtor>(this.api, `debtors/${this.debtor?.key}?province`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
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
