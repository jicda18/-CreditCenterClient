import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions.routing';
import { TransactionsFormComponent } from './transactions-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TransactionsFilterComponent } from './transactions-filter.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    TransactionsFormComponent,
    TransactionsFilterComponent
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    DropdownModule,
    RadioButtonModule,
    InputTextareaModule,
    BsDatepickerModule.forRoot(),
    TableModule,
  ]
})
export class TransactionsModule { }
