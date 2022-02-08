import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    RippleModule,
  ],
  exports: [TransactionsComponent]
})
export class TransactionsModule { }
