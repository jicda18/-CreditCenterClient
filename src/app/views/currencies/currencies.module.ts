import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CurrenciesRoutingModule } from './currencies.routing';
import { CurrenciesComponent } from './currencies.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { CurrencyModalComponent } from './currency-modal.component';
import { CurrencyFormModule } from 'src/app/forms/currency-form/currency-form.module';

@NgModule({
  declarations: [
    CurrenciesComponent,
    CurrencyModalComponent
  ],
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    CurrencyFormModule
  ],
  entryComponents: [
    CurrencyModalComponent
  ]
})
export class CurrenciesModule { }
