import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtorsFormComponent } from './debtors-form-insert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    DebtorsFormComponent
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
    InputMaskModule,
    RadioButtonModule,
    CheckboxModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    DebtorsFormComponent
  ],
})
export class DebtorsFormInsertModule { }
