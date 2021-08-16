import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Bank } from 'src/app/models/bank.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-banks-form',
  templateUrl: './banks-form.component.html',
  styles: [
  ]
})
export class BanksFormComponent implements OnInit, OnChanges {
  @Input() bank?: Bank;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;
  public currencyOptions: { value: number | string; label: string }[] = [];

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get nickname(): AbstractControl | null {
    return this.form.get('nickname');
  }

  public get account(): AbstractControl | null {
    return this.form.get('account');
  }

  public get currency_key(): AbstractControl | null {
    return this.form.get('currency_key');
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  public get nicknameInvalid(): boolean {
    return (this.nickname?.invalid && (this.nickname?.touched || this.nickname?.dirty)) ?? false;
  }

  public get accountInvalid(): boolean {
    return (this.account?.invalid && (this.account?.touched || this.account?.dirty)) ?? false;
  }

  public get currencyKeyInvalid(): boolean {
    return (this.currency_key?.invalid && (this.currency_key?.touched || this.currency_key?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      account: [null, [Validators.required]],
      currency_key: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    selectOption('currencies/select', this.api).then((options) => this.currencyOptions = options);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bank !== undefined) {
      const name = this.name;
      const nickname = this.nickname;
      const account = this.account;
      const currencyKey = this.currency_key;

      if (name !== null) {
        name.setValue(this.bank.bank);
      }

      if (nickname !== null) {
        nickname.setValue(this.bank.nickname);
      }

      if (account !== null) {
        account.setValue(this.bank.account);
      }

      if (currencyKey !== null) {
        currencyKey.setValue(this.bank.currency_key);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const name = this.name?.value as string;
      const nickname = this.nickname?.value as string;
      const account = this.account?.value as string;
      const currencyKey = this.currency_key?.value as string;

      if (this.bank === undefined) {
        const form = objectToFormData({ bank: name, nickname, account, currency_key: currencyKey });

        await createResource<Bank>(this.api, 'banks?include=currency', form, this.ms, this.inserted, (item) => `${item.bank} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ bank: name, nickname, account });

        await updateResource<Bank>(this.api, `banks/${this.bank.key}?include=currency`, form, this.ms, this.updated, (item) => `${item.bank} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
