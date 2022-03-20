import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { objectToFormData, objectToHttpParams } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styles: [
  ]
})
export class PasswordRecoveryComponent implements OnInit {
  public request?: { key: string, token: string, email: string };

  public form: FormGroup;
  public loading = false;
  public show = {
    new: false,
    rpt: false,
  };

  public get username(): AbstractControl | null {
    return this.form.get('username');
  }

  public get pass(): AbstractControl | null {
    return this.form.get('pass');
  }

  public get rpt(): AbstractControl | null {
    return this.form.get('rpt');
  }

  public get code(): AbstractControl | null {
    return this.form.get('code');
  }

  public get usernameInvalid(): boolean {
    return (this.username?.invalid && (this.username?.touched || this.username?.dirty)) ?? false;
  }

  public get passInvalid(): boolean {
    return (this.pass?.invalid && (this.pass?.touched || this.pass?.dirty)) ?? false;
  }

  public get rptInvalid(): boolean {
    return (this.rpt?.invalid && (this.rpt?.touched || this.rpt?.dirty)) ?? false;
  }

  public get codeInvalid(): boolean {
    return (this.code?.invalid && (this.code?.touched || this.code?.dirty)) ?? false;
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
      username: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  public rptValidate(): void {
    this.rpt?.updateValueAndValidity();

    const rpt = this.rpt?.value;
    const nw = this.pass?.value as string;
    if (rpt !== undefined && rpt !== null && rpt !== '' && rpt !== nw) {
      this.rpt?.setErrors({ different: true }, { emitEvent: true });
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      if (this.request === undefined) {
        const username = this.username?.value as string;

        const form = objectToFormData({ username });

        const request = (await this.api.post<{ key: string, token: string, email: string }>('users/request-change-password', form, false)).data;

        if (request !== undefined) {
          this.form = this.fb.group({
            pass: [null, [Validators.required]],
            rpt: [null, [Validators.required]],
            code: [null, [Validators.required]],
          });

          this.request = request;
        }
      } else {
        const code = this.code?.value as string;
        const password = this.pass?.value as string;

        const params = objectToHttpParams({ code: code.replace(' ', ''), password });

        const request = (await this.api.put<{ msg: string }>(`users/${this.request.key}/change-password-confirm/${this.request.token}`, params, false)).data;

        if (request !== undefined) {
          this.ms.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: request.msg,
            icon: 'pi-check-circle'
          });
        }

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
