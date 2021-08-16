import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DropdownModule } from 'primeng/dropdown';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { AvatarModule } from 'primeng/avatar';

@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmPopupModule,
    DropdownModule,
    TriStateCheckboxModule,
    FormsModule,
    AvatarModule,
  ],
  exports: [GridComponent],
})
export class GridModule { }
