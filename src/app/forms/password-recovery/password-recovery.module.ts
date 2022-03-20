import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryComponent } from './password-recovery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputMaskModule } from 'primeng/inputmask';


@NgModule({
  declarations: [
    PasswordRecoveryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressBarModule,
    InputMaskModule
  ],
  exports: [
    PasswordRecoveryComponent
  ],
})
export class PasswordRecoveryModule { }
