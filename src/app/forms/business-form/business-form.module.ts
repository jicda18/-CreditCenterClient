import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessFormComponent } from './business-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';

@NgModule({
  declarations: [
    BusinessFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    DropdownModule,
    RadioButtonModule,
    InputMaskModule,
  ],
  exports: [
    BusinessFormComponent
  ],
})
export class BusinessFormModule { }
