import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { objectToFormData, objectToHttpParams } from 'src/app/utils/helpers.utils';
import { CustomValidations } from 'src/app/utils/validations.util';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public show = {
    old: false,
    new: false,
    rpt: false,
  };

  public get old(): AbstractControl | null {
    return this.form.get('old');
  }

  public get new(): AbstractControl | null {
    return this.form.get('new');
  }

  public get rpt(): AbstractControl | null {
    return this.form.get('rpt');
  }

  public get oldInvalid(): boolean {
    return (this.old?.invalid && (this.old?.touched || this.old?.dirty)) ?? false;
  }

  public get newInvalid(): boolean {
    return (this.new?.invalid && (this.new?.touched || this.new?.dirty)) ?? false;
  }

  public get rptInvalid(): boolean {
    return (this.rpt?.invalid && (this.rpt?.touched || this.rpt?.dirty)) ?? false;
  }

  public get rptErrors(): { [key: string]: boolean } {
    return (this.rpt?.errors) ?? {};
  }

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private api: ApiService,
    private ms: MessageService
  ) {
    this.form = this.fb.group({
      old: [null, [Validators.required]],
      new: [null, [Validators.required]],
      rpt: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  public rptValidate(): void {
    this.rpt?.updateValueAndValidity();

    const rpt = this.rpt?.value;
    const nw = this.new?.value as string;
    if (rpt !== undefined && rpt !== null && rpt !== '' && rpt !== nw) {
      this.rpt?.setErrors({ different: true }, { emitEvent: true });
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const old = this.old?.value as string;
      const nw = this.new?.value as string;

      const form = objectToHttpParams({ old_password: old, password: nw });

      const user = (await this.api.put<User>('users/me', form)).data;

      if (user !== undefined) {
        this.ms.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'Su contraseña ha sido actualizada existosamente.',
          icon: 'pi-check-circle'
        });
        this.cancel();
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

  public cancel(): void {
    this.ref.close();
  }
}
