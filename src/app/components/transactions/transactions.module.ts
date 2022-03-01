import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    RippleModule,
    ButtonModule
  ],
  exports: [TransactionsComponent]
})
export class TransactionsModule { }
