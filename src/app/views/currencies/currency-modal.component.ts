import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Currency } from 'src/app/models/currency.model';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styles: [
  ]
})
export class CurrencyModalComponent implements OnInit {
  private _grid?: GridComponent;

  public currency?: Currency;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.currency = config.data?.item;
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(currency: Currency): void {
    if (this._grid !== undefined) {
      this._grid.insert(currency);
      this.ref.close();
    }
  }

  public updated(currency: Currency): void {
    if (this._grid !== undefined) {
      this._grid.update(currency);
      this.ref.close();
    }
  }
}
