import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeborsFormComponent } from './debors-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    DeborsFormComponent
  ],
  imports: [
    // BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    ProgressBarModule,
    DropdownModule,
    InputMaskModule,
    RadioButtonModule,
    CalendarModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    DeborsFormComponent
  ],
})
export class DeborsFormModule { }
