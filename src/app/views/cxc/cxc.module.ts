import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CxcRoutingModule } from './cxc.routing';
import { CxcComponent } from './cxc.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [
    CxcComponent
  ],
  imports: [
    CommonModule,
    CxcRoutingModule,
    TableModule,
    ButtonModule,
    RippleModule,
  ]
})
export class CxcModule { }
