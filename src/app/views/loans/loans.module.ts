import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans.routing';
import { LoansComponent } from './loans.component';
import { LoanFormComponent } from './loan-form.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PayComponent } from './pay.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    LoansComponent,
    LoanFormComponent,
    PayComponent
  ],
  imports: [
    CommonModule,
    LoansRoutingModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class LoansModule { }
