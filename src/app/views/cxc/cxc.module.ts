import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CxcRoutingModule } from './cxc.routing';
import { CxcComponent } from './cxc.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { OverviewCardModule } from 'src/app/components/overview-card/overview-card.module';

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
    OverviewCardModule,
  ]
})
export class CxcModule { }
