import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { objectToFormData } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styles: [
  ]
})
export class UpdateProfileComponent implements OnInit {
  public form: FormGroup;
  public loading = false;

  public files?: any[];

  public get mail(): AbstractControl | null {
    return this.form.get('mail');
  }

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get mailInvalid(): boolean {
    return (this.mail?.invalid && (this.mail?.touched || this.mail?.dirty)) ?? false;
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private api: ApiService,
    private ms: MessageService,
    private ss: SessionService
  ) {
    this.form = this.fb.group({
      mail: [this.ss.user?.mail, [Validators.email]],
      name: [this.ss.user?.name, []],
    });
  }

  ngOnInit(): void {
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const data = this.form.value;

      if (this.files !== undefined && this.files !== null && this.files.length !== 0) {
        data.avatar = this.files[0];
      } else {
        delete data.avatar;
      }

      data._method = 'PUT';

      const form = objectToFormData(data);

      const user = (await this.api.post<User>('users/me', form)).data;

      if (user !== undefined) {
        this.ss.user = user;

        this.ms.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: 'su perfil ha sido actualizado existosamente.',
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
