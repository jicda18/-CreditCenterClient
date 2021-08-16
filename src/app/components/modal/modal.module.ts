import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    DynamicDialogModule,
  ],
  exports: [ModalComponent],
})
export class ModalModule { }
