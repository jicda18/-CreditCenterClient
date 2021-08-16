import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Business } from 'src/app/models/business.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styles: [
  ]
})
export class BusinessFormComponent implements OnInit, OnChanges {
  @Input() business?: Business;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;
  public provinceOptions: { value: number | string; label: string }[] = [];

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get relation(): AbstractControl | null {
    return this.form.get('relation');
  }

  public get noe(): AbstractControl | null {
    return this.form.get('noe');
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

  public get comments(): AbstractControl | null {
    return this.form.get('comments');
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  public get relationInvalid(): boolean {
    return (this.relation?.invalid && (this.relation?.touched || this.relation?.dirty)) ?? false;
  }

  public get noeInvalid(): boolean {
    return (this.noe?.invalid && (this.noe?.touched || this.noe?.dirty)) ?? false;
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

  public get commentsInvalid(): boolean {
    return (this.comments?.invalid && (this.comments?.touched || this.comments?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      relation: [null, [Validators.required]],
      noe: [null, []],
      province_key: [null, [Validators.required]],
      street: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      comments: [null, []],
    });
  }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.provinceOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.business !== undefined) {
      const name = this.name;
      const relation = this.relation;
      const noe = this.noe;
      const province_key = this.province_key;
      const street = this.street;
      const phone_number = this.phone_number;
      const comments = this.comments;

      if (name !== null) {
        name.setValue(this.business.business);
      }

      if (relation !== null) {
        relation.setValue(this.business.relation);
      }

      if (noe !== null) {
        noe.setValue(this.business.noe);
      }

      if (province_key !== null) {
        province_key.setValue(this.business.province_key);
      }

      if (street !== null) {
        street.setValue(this.business.street);
      }

      if (phone_number !== null) {
        phone_number.setValue(this.business.phone_number);
      }

      if (comments !== null) {
        comments.setValue(this.business.comments);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const name = this.name?.value as string;
      const relation = this.relation?.value as string;
      const noe = this.noe?.value as number;
      const province_key = this.province_key?.value as string;
      const street = this.street?.value as string;
      let phone_number = this.phone_number?.value as string;
      const comments = this.comments?.value as string;

      if (phone_number !== undefined && phone_number !== '') {
        phone_number = phone_number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
      }

      if (this.business === undefined) {
        const form = objectToFormData({ business: name, relation, noe, province_key, street, phone_number, comments });

        await createResource<Business>(this.api, 'businesses?include=province', form, this.ms, this.inserted, (item) => `${item.business} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ business: name, relation, noe, province_key, street, phone_number, comments });

        await updateResource<Business>(this.api, `businesses/${this.business.key}?include=province`, form, this.ms, this.updated, (item) => `${item.business} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
