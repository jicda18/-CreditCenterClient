import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuarantorsFormComponent } from './guarantors-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    GuarantorsFormComponent
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
    GuarantorsFormComponent
  ],
})
export class GuarantorsFormModule { }
