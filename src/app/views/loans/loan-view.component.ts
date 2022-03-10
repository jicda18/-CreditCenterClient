import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Fee } from 'src/app/models/fee.model';
import { Loan } from 'src/app/models/loan.model';
import { Transaction } from 'src/app/models/transaction.model';
import { ApiService } from 'src/app/services/api.service';
import { biweeklyCheck, convertToDate, objectToHttpParams, selectOption, toCurrency, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-loan-view',
  templateUrl: './loan-view.component.html',
  styles: [
  ]
})
export class LoanViewComponent implements OnInit {
  private _loan?: Loan;
  public fees_array: Fee[] = [];
  public transactions: Transaction[] = [];
  private _debtor_name?: string;
  private _currency?: string;
  private _inserted_at?: Date;
  private _amount?: string;
  private _summary?: string;
  private _fee_amount?: string;
  private _pending_summary?: string;

  public form?: FormGroup;
  public mainLoading = true;
  public secondaryLoading = false;

  public frequencyOptions: { value: string; label: string; }[] = [];

  public get loan(): Loan {
    return this._loan!;
  }

  public set loan(value: Loan | undefined) {
    this._loan = value;
    this.fees_array = value?.fees ?? [];
    this.transactions = value?.transactions ?? [];
  }

  public get debtor(): string | undefined {
    if (this._debtor_name === undefined || this._debtor_name === null) {
      this._debtor_name = this.loan.debtor?.name;
    }

    return this._debtor_name;
  }

  public get currency(): string | undefined {
    if (this._currency === undefined || this._currency === null) {
      this._currency = this.loan.currency?.currency;
    }

    return this._currency;
  }

  public get inserted_at(): Date {
    if (this._inserted_at === undefined || this._inserted_at === null) {
      this._inserted_at = convertToDate(this.loan.inserted_at);
    }

    return this._inserted_at!;
  }

  public get amount(): string {
    if (this._amount === undefined || this._amount === null) {
      this._amount = toCurrency(this.loan.amount);
    }

    return this._amount!;
  }

  public get capital(): string {
    if (this._summary === undefined || this._summary === null) {
      this._summary = toCurrency(this.loan.summary);
    }

    return this._summary!;
  }

  public get fee_amount(): string {
    if (this._fee_amount === undefined || this._fee_amount === null) {
      this._fee_amount = toCurrency(this.loan.fee_amount);
    }

    return this._fee_amount!;
  }

  public get pending_summary(): string {
    if (this._pending_summary === undefined || this._pending_summary === null) {
      this._pending_summary = toCurrency(this.loan.pending_summary);
    }

    return this._pending_summary!;
  }

  public get frequency_key(): AbstractControl | null {
    return this.form?.get('frequency_key') ?? null;
  }

  public get next_at(): AbstractControl | null {
    return this.form?.get('next_at') ?? null;
  }

  public get thanks_days(): AbstractControl | null {
    return this.form?.get('thanks_days') ?? null;
  }

  public get fees(): AbstractControl | null {
    return this.form?.get('fees') ?? null;
  }

  public get interest(): AbstractControl | null {
    return this.form?.get('interest') ?? null;
  }

  public get type(): AbstractControl | null {
    return this.form?.get('type') ?? null;
  }

  public get frequency_keyInvalid(): boolean {
    return (this.frequency_key?.invalid && (this.frequency_key?.touched || this.frequency_key?.dirty)) ?? false;
  }

  public get next_atInvalid(): boolean {
    return (this.next_at?.invalid && (this.next_at?.touched || this.next_at?.dirty)) ?? false;
  }

  public get thanks_daysInvalid(): boolean {
    return (this.thanks_days?.invalid && (this.thanks_days?.touched || this.thanks_days?.dirty)) ?? false;
  }

  public get feesInvalid(): boolean {
    return (this.fees?.invalid && (this.fees?.touched || this.fees?.dirty)) ?? false;
  }

  public get interestInvalid(): boolean {
    return (this.interest?.invalid && (this.interest?.touched || this.interest?.dirty)) ?? false;
  }

  public get typeInvalid(): boolean {
    return (this.type?.invalid && (this.type?.touched || this.type?.dirty)) ?? false;
  }

  public get minStartDay(): Date {
    return new Date();
  }

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private ms: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.form = this.fb.group({
      frequency_key: [null, [Validators.required]],
      next_at: [null, [Validators.required]],
      thanks_days: [null, [Validators.required, Validators.min(0)]],
      interest: [null, [Validators.required, Validators.min(0)]],
      fees: [null, [Validators.min(1)]],
      type: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.init();
  }

  private async init(): Promise<void> {
    this.mainLoading = true;

    const loan_key = this.route.snapshot.paramMap.get('loan_key');

    if (loan_key !== null) {
      this.loan = (await this.api.get<Loan>(`loans/${loan_key}?include=debtor,transactions,fees,currency`)).data;
    }

    if (this._loan === undefined || this._loan === null) {
      this.location.back();
      return;
    }

    this.initValues();

    this.mainLoading = false;
  }

  public async initValues(): Promise<void> {
    this.secondaryLoading = true;

    this._debtor_name = undefined;
    this._currency = undefined;
    this._inserted_at = undefined;
    this._amount = undefined;
    this._summary = undefined;
    this._fee_amount = undefined;
    this._pending_summary = undefined;

    this.form?.reset();

    this.interest?.setValue(this.loan.interest * 100);
    this.type?.setValue(this.loan.type);
    this.frequency_key?.setValue(this.loan.frequency_key);
    this.next_at?.setValue(convertToDate(this.loan.next_at));
    this.thanks_days?.setValue(this.loan.thanks_days);
    this.fees?.setValue(this.loan.number_fees);

    this.frequencyOptions = await selectOption('frequencies/select', this.api);

    this.secondaryLoading = false;
  }

  public async submit(): Promise<void> {
    this.secondaryLoading = true;
    for (const key in this.form?.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form?.controls, key)) {
        const control = this.form?.controls[key];

        control?.updateValueAndValidity();
      }
    }

    if (this.form?.valid) {
      const inputs = this.form?.value;

      inputs.interest /= 100;
      inputs.fees = inputs.fees ?? 1;

      const form = objectToHttpParams(inputs);

      const loan = await updateResource<Loan>(this.api, `loans/${this.loan.key}`, form, this.ms, undefined, (item) => `Deuda fue actualizada exitosamente.`);

      if (loan !== false) {
        this.loan = loan;
        this.initValues();
      }
    } else {
      this.form?.markAllAsTouched();
    }

    this.secondaryLoading = false;
  }

  public biweekly(): void {
    const frequency_key = this.frequency_key?.value as null | undefined | string;
    const next_at = this.next_at?.value as null | undefined | Date;

    const value = biweeklyCheck(frequency_key, next_at);

    if (value !== null) {
      this.next_at?.setValue(value);
    }
  }

  public goToPay(): void {
    this.router.navigate([`loans/pay/${this.loan.key}`]);
  }
}
