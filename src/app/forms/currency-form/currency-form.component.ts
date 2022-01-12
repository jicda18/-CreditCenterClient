import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Currency } from 'src/app/models/currency.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, objectToHttpParams, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-currency-form',
  templateUrl: './currency-form.component.html',
  styles: [
  ]
})
export class CurrencyFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currency?: Currency;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get prefix(): AbstractControl | null {
    return this.form.get('prefix');
  }

  public get exchange(): AbstractControl | null {
    return this.form.get('exchange');
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  public get prefixInvalid(): boolean {
    return (this.prefix?.invalid && (this.prefix?.touched || this.prefix?.dirty)) ?? false;
  }

  public get exchangeInvalid(): boolean {
    return (this.exchange?.invalid && (this.exchange?.touched || this.exchange?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      prefix: [null, [Validators.required]],
      exchange: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.currency !== undefined) {
      const name = this.name;
      const prefix = this.prefix;
      const exchange = this.exchange;

      if (name !== null) {
        name.setValue(this.currency.currency);
      }

      if (prefix !== null) {
        prefix.setValue(this.currency.prefix);
      }

      if (exchange !== null) {
        exchange.setValue(this.currency.exchange);
      }
    }
  }

  ngOnInit(): void {

  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const name = this.name?.value as string;
      const prefix = this.prefix?.value as string;
      const exchange = this.exchange?.value as string;

      if (this.currency === undefined) {
        const form = objectToFormData({ currency: name, prefix, exchange });

        await createResource<Currency>(this.api, 'currencies', form, this.ms, this.inserted, (item) => `${item.currency} fue agregado exitosamente.`);
      } else {
        const form = objectToHttpParams({ currency: name, prefix, exchange });

        await updateResource<Currency>(this.api, `currencies/${this.currency.key}`, form, this.ms, this.updated, (item) => `${item.currency} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    delete this.currency;
    this.form.reset();
  }
}
