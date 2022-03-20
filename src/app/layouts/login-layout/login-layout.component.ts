import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { PasswordRecoveryComponent } from 'src/app/forms/password-recovery/password-recovery.component';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
})
export class LoginLayoutComponent implements OnInit {
  public form: FormGroup;
  public show = false;
  public loading = false;

  public get username(): AbstractControl | null {
    return this.form.get('username');
  }

  public get password(): AbstractControl | null {
    return this.form.get('password');
  }

  public get usernameInvalid(): boolean {
    return (this.username?.invalid && (this.username?.touched || this.username?.dirty)) ?? false;
  }

  public get passwordInvalid(): boolean {
    return (this.password?.invalid && (this.password?.touched || this.password?.dirty)) ?? false;
  }

  public get name(): string {
    return environment.name;
  }

  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  constructor(private fb: FormBuilder, private ss: SessionService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  public async authenticate(): Promise<void> {
    this.loading = true;

    if (this.form.valid) {
      const username = this.username?.value as string;
      const password = this.password?.value as string;

      const logged = await this.ss.login(username, password);

      if (logged) {
        if (await this.router.navigate([this.ss.lastUrl])) {
          this.form.reset();
        }
      }
    } else {
      this.form.markAllAsTouched();
    }

    this.loading = false;
  }

  public async passwordRecovery(): Promise<void> {
    this.openModal(PasswordRecoveryComponent, 'Recuperar contaseña');
  }

  private openModal(componentType: Type<any>, title: string): void {
    this._modal?.show(componentType, title, {});
  }
}
