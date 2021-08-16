import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Guarantor } from 'src/app/models/guarantor.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-guarantors-form',
  templateUrl: './guarantors-form.component.html',
  styles: [
  ]
})
export class GuarantorsFormComponent implements OnInit, OnChanges {
  @Input() guarantor?: Guarantor;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;
  public provinceOptions: { value: number | string; label: string; }[] = [];

  public get name(): AbstractControl | null {
    return this.form.get('name');
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

  public get occupation(): AbstractControl | null {
    return this.form.get('occupation');
  }

  public get workplace(): AbstractControl | null {
    return this.form.get('workplace');
  }

  public get income(): AbstractControl | null {
    return this.form.get('income');
  }

  public get other_income(): AbstractControl | null {
    return this.form.get('other_income');
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
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

  public get occupationInvalid(): boolean {
    return (this.occupation?.invalid && (this.occupation?.touched || this.occupation?.dirty)) ?? false;
  }

  public get workplaceInvalid(): boolean {
    return (this.workplace?.invalid && (this.workplace?.touched || this.workplace?.dirty)) ?? false;
  }

  public get incomeInvalid(): boolean {
    return (this.income?.invalid && (this.income?.touched || this.income?.dirty)) ?? false;
  }

  public get other_incomeInvalid(): boolean {
    return (this.other_income?.invalid && (this.other_income?.touched || this.other_income?.dirty)) ?? false;
  }


  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      personal_id: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      province_key: [null, [Validators.required]],
      street: [null, [Validators.required]],
      phone_number: [null, []],
      occupation: [null, [Validators.required]],
      workplace: [null, [Validators.required]],
      income: [null, [Validators.required]],
      other_income: [null, []],
    });
  }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.provinceOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.guarantor !== undefined) {
      const name = this.name;
      const personal_id = this.personal_id;
      const gender = this.gender;
      const province_key = this.province_key;
      const street = this.street;
      const phone_number = this.phone_number;
      const occupation = this.occupation;
      const workplace = this.workplace;
      const income = this.income;
      const other_income = this.other_income;

      if (name !== null) {
        name.setValue(this.guarantor.name);
      }

      if (personal_id !== null) {
        personal_id.setValue(this.guarantor.personal_id);
      }

      if (gender !== null) {
        gender.setValue(this.guarantor.gender);
      }

      if (province_key !== null) {
        province_key.setValue(this.guarantor.province_key);
      }

      if (street !== null) {
        street.setValue(this.guarantor.street);
      }

      if (phone_number !== null) {
        phone_number.setValue(this.guarantor.phone_number);
      }

      if (occupation !== null) {
        occupation.setValue(this.guarantor.occupation);
      }

      if (workplace !== null) {
        workplace.setValue(this.guarantor.workplace);
      }

      if (income !== null) {
        income.setValue(this.guarantor.income);
      }

      if (other_income !== null) {
        other_income.setValue(this.guarantor.other_income);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const name = this.name?.value as string;
      const personal_id = this.personal_id?.value as string;
      const gender = this.gender?.value as string;
      const province_key = this.province_key?.value as string;
      const street = this.street?.value as string;
      let phone_number = this.phone_number?.value as string;
      const occupation = this.occupation?.value as string;
      const workplace = this.workplace?.value as string;
      const income = this.income?.value as number;
      const other_income = this.other_income?.value as number;

      if (phone_number !== undefined && phone_number !== '') {
        phone_number = phone_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
      }

      if (this.guarantor === undefined) {
        const form = objectToFormData({ name, personal_id, gender, province_key, street, phone_number, occupation, workplace, income, other_income });

        await createResource<Guarantor>(this.api, 'guarantors?include=province', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ name, personal_id, gender, province_key, street, phone_number, occupation, workplace, income, other_income });

        await updateResource<Guarantor>(this.api, `guarantors/${this.guarantor.key}?include=province`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
