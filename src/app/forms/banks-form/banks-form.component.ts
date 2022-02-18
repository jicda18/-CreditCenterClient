import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Bank } from 'src/app/models/bank.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { permissions } from 'src/app/utils/const.utils';
import { canEditInsertAndDelete, createResource, objectToFormData, objectToHttpParams, selectOption, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-banks-form',
  templateUrl: './banks-form.component.html',
  styles: [
  ]
})
export class BanksFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() bank?: Bank;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  private _canInsert = false;
  private _canEdit = false;

  public form: FormGroup;
  public readonly = false;
  public loading = false;
  public currencyOptions: { value: string; label: string }[] = [];

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

  public get balance(): AbstractControl | null {
    return this.form.get('balance');
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

  public get balanceInvalid(): boolean {
    return (this.balance?.invalid && (this.balance?.touched || this.balance?.dirty)) ?? false;
  }

  public get isInsert(): boolean {
    return this.bank === undefined;
  }

  public get canSubmit(): boolean {
    if (this.readonly) {
      return false;
    }

    return this.isInsert ? this._canInsert : this._canEdit;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService, private ss: SessionService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      account: [null, [Validators.required]],
      currency_key: [null, [Validators.required]],
      balance: [null, [Validators.required, Validators.min(0)]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.currencyOptions = await selectOption<string, undefined>('currencies/select', this.api);

    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const options = canEditInsertAndDelete(this.ss, permissions.bank_store, permissions.bank_update, permissions.bank_delete);

    this._canInsert = options.insert;
    this._canEdit = options.edit;
    this.readonly = !(this._canInsert || this._canEdit);

    this.name?.enable();
    this.nickname?.enable();
    this.account?.enable();
    this.currency_key?.enable();
    this.balance?.enable();

    if (!this.isInsert) {
      this.name?.setValue(this.bank?.bank);
      this.nickname?.setValue(this.bank?.nickname);
      this.account?.setValue(this.bank?.account);
      this.currency_key?.setValue(this.bank?.currency_key);
      this.balance?.setValue(this.bank?.summary);

      this.balance?.disable();
      this.currency_key?.disable();
    }

    if (this.readonly) {
      this.name?.disable();
      this.nickname?.disable();
      this.account?.disable();
      this.currency_key?.disable();
      this.balance?.disable();
    }
  }

  public async submit(): Promise<void> {
    if (this.readonly || !this.canSubmit) {
      return;
    }

    this.loading = true;

    if (this.form.valid) {
      const name = this.name?.value as string;
      const nickname = this.nickname?.value as string;
      const account = this.account?.value as string;
      const currencyKey = this.currency_key?.value as string;
      const balance = this.balance?.value as string;

      if (this.isInsert) {
        const form = objectToFormData({ bank: name, nickname, account, currency_key: currencyKey, summary: balance });

        await createResource<Bank>(this.api, 'banks?include=currency', form, this.ms, this.inserted, (item) => `${item.bank} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ bank: name, nickname, account });

        await updateResource<Bank>(this.api, `banks/${this.bank?.key}?include=currency`, form, this.ms, this.updated, (item) => `${item.bank} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    delete this.bank;
    this.form.reset();
  }
}
