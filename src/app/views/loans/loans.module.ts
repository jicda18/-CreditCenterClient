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
import { LoanViewComponent } from './loan-view.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { FeesModule } from 'src/app/components/fees/fees.module';
import { TransactionsModule } from 'src/app/components/transactions/transactions.module';

@NgModule({
  declarations: [
    LoansComponent,
    LoanFormComponent,
    PayComponent,
    LoanViewComponent
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
    ProgressSpinnerModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    TabViewModule,
    BsDatepickerModule.forRoot(),
    FeesModule,
    TransactionsModule
  ]
})
export class LoansModule { }
