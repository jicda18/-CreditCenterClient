import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeborsFormComponent } from './debors-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';



@NgModule({
  declarations: [
    DeborsFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
  ],
  exports: [
    DeborsFormComponent
  ],
})
export class DeborsFormModule { }
