import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { createResource, objectToFormData, objectToHttpParams, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnChanges {
  private _defaultPassword = 'Password1*';

  @Input() user?: User;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public form: FormGroup;
  public loading = false;

  public get username(): AbstractControl | null {
    return this.form.get('username');
  }

  public get name(): AbstractControl | null {
    return this.form.get('name');
  }

  public get mail(): AbstractControl | null {
    return this.form.get('mail');
  }

  public get usernameInvalid(): boolean {
    return (this.username?.invalid && (this.username?.touched || this.username?.dirty)) ?? false;
  }

  public get nameInvalid(): boolean {
    return (this.name?.invalid && (this.name?.touched || this.name?.dirty)) ?? false;
  }

  public get mailInvalid(): boolean {
    return (this.mail?.invalid && (this.mail?.touched || this.mail?.dirty)) ?? false;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      name: [null, [Validators.required]],
      mail: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.user !== undefined) {
      const username = this.username;
      const name = this.name;
      const mail = this.mail;

      if (username !== null) {
        username.setValue(this.user.user);
      }
      if (name !== null) {
        name.setValue(this.user.name);
      }
      if (mail !== null) {
        mail.setValue(this.user.mail);
      }
    }
  }

  public async submit(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const username = this.username?.value as string;
      const name = this.name?.value as string;
      const mail = this.mail?.value as string;

      if (this.user === undefined) {
        const form = objectToFormData({ user: username, password: this._defaultPassword, name, mail });

        await createResource<User>(this.api, 'users', form, this.ms, this.inserted, (item) => `${item.name} fue agregado exitosamente. Su contraseña es: ${this._defaultPassword}`);
      } else {
        const form = objectToHttpParams({ name, mail });

        await updateResource<User>(this.api, `users/${this.user.key}`, form, this.ms, this.updated, (item) => `${item.name} fue actualizado exitosamente.`);
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }
}
