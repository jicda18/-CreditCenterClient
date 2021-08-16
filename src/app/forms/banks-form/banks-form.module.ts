import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanksFormComponent } from './banks-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    BanksFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    DropdownModule,
  ],
  exports: [
    BanksFormComponent
  ],
})
export class BanksFormModule { }
