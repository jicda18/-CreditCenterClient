import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { permissions } from 'src/app/utils/const.utils';
import { canEditInsertAndDelete, createResource, objectToFormData, objectToHttpParams, updateResource } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styles: [
  ]
})
export class UsersFormComponent implements OnInit, OnChanges, OnDestroy {
  private _defaultPassword = 'Password1*';

  @Input() user?: User;

  @Output() cancel = new EventEmitter<void>();
  @Output() inserted = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  private _canInsert = false;
  private _canEdit = false;

  public form: FormGroup;
  public readonly = false;
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

  public get isInsert(): boolean {
    return this.user === undefined;
  }

  public get canSubmit(): boolean {
    if (this.readonly) {
      return false;
    }

    return this.isInsert ? this._canInsert : this._canEdit;
  }

  constructor(private fb: FormBuilder, private api: ApiService, private ms: MessageService, private ss: SessionService) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      name: [null, [Validators.required]],
      mail: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const options = canEditInsertAndDelete(this.ss, permissions.user_store, permissions.user_update, permissions.user_delete);

    this._canInsert = options.insert;
    this._canEdit = options.edit;
    this.readonly = !(this._canInsert || this._canEdit);

    this.username?.enable();
    this.name?.enable();
    this.mail?.enable();

    if (this.user !== undefined) {
      this.username?.setValue(this.user.user);
      this.name?.setValue(this.user.name);
      this.mail?.setValue(this.user.mail);
    }

    if (this.readonly) {
      this.username?.disable();
      this.name?.disable();
      this.mail?.disable();
    }
  }

  public async submit(): Promise<void> {
    if (this.readonly || !this.canSubmit) {
      return;
    }

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

  ngOnDestroy(): void {
    delete this.user;
    this.form.reset();
  }
}
