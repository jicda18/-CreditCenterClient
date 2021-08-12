import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

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
    this.loading = true;

    this.loading = false;
  }
}
