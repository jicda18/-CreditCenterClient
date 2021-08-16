import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormComponent } from './currency-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  declarations: [
    CurrencyFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
  ],
  exports: [
    CurrencyFormComponent
  ],
})
export class CurrencyFormModule { }
