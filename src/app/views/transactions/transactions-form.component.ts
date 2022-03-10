import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, selectOption } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styles: [
  ]
})
export class TransactionsFormComponent implements OnInit {
  public form: FormGroup;

  public loading = false;
  public bankOptions: { value: string; label: string }[] = [];

  public get bank_key(): AbstractControl | null {
    return this.form.get('bank_key');
  }

  public get type(): AbstractControl | null {
    return this.form.get('type');
  }

  public get amount(): AbstractControl | null {
    return this.form.get('amount');
  }

  public get comments(): AbstractControl | null {
    return this.form.get('comments');
  }

  public get bank_keyInvalid(): boolean {
    return (this.bank_key?.invalid && (this.bank_key?.touched || this.bank_key?.dirty)) ?? false;
  }

  public get typeInvalid(): boolean {
    return (this.type?.invalid && (this.type?.touched || this.type?.dirty)) ?? false;
  }

  public get amountInvalid(): boolean {
    return (this.amount?.invalid && (this.amount?.touched || this.amount?.dirty)) ?? false;
  }

  public get commentsInvalid(): boolean {
    return (this.comments?.invalid && (this.comments?.touched || this.comments?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      bank_key: [null, [Validators.required]],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      comments: [null, [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.bankOptions = await selectOption<string, undefined>('banks/select', this.api);

    this.loading = false;
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const { bank_key, type, ...inputs } = this.form.value;
      inputs.amount *= type;

      const form = objectToFormData(inputs);

      const transaction = await createResource<Transaction>(this.api, `banks/${bank_key}/transactions`, form, this.ms, undefined, (item) => `La transación fue agregado exitosamente.`);
      if (transaction !== false) {
        this.form.reset();
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

}
