import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeesComponent } from './fees.component';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [
    FeesComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    RippleModule,
  ],
  exports: [FeesComponent]
})
export class FeesModule { }
