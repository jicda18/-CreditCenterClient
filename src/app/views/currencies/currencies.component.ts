import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Currency } from 'src/app/models/currency.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { ApiService } from 'src/app/services/api.service';
import { SessionService } from 'src/app/services/session.service';
import { permissions } from 'src/app/utils/const.utils';
import { apiDelete, canEditInsertAndDelete, dateTimeStandardFormat } from 'src/app/utils/helpers.utils';
import { CurrencyModalComponent } from './currency-modal.component';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styles: [
  ]
})
export class CurrenciesComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'currency', label: 'Nombre', type: 'text', filter: true },
    { key: 'prefix', label: 'Simbolo', type: 'text', filter: false },
    { key: 'root', label: 'Principal', type: 'boolean', filter: true },
    { key: 'exchange', label: 'Tasa', type: 'numeric', filter: true, minFractionDigits: 2, prefix: '$' },
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'currencies';

  public canInsert = false;
  public canEdit = false;
  public canDelete = false;

  constructor(private api: ApiService, private ms: MessageService, private ss: SessionService) { }

  ngOnInit(): void {
    const config = canEditInsertAndDelete(this.ss, permissions.currency_store, permissions.currency_update, permissions.currency_delete);

    this.canInsert = config.insert;
    this.canEdit = config.edit;
    this.canDelete = config.delete;
  }

  public mapper(currency: Currency): { [key: string]: any } {
    return {
      key: currency.key,
      currency: currency.currency,
      prefix: currency.prefix,
      root: currency.root,
      exchange: '$' + currency.exchange.toFixed(2),
      inserted_at: dateTimeStandardFormat(currency.inserted_at),
      edited_at: dateTimeStandardFormat(currency.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `currency=**${query}**`;
  }

  public add(): void {
    this._modal?.show(CurrencyModalComponent, 'Crear Moneda', { grid: this._grid });
  }

  public edit(currency: Currency): void {
    this._modal?.show(CurrencyModalComponent, `Editar ${currency.currency}`, { item: currency, grid: this._grid });
  }

  public delete(currency: Currency): void {
    apiDelete<Currency>(this.api, this.ms, `currencies/${currency.key}`, this._grid, (item) => `${item.currency} fue eliminado`);
  }
}
