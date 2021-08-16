import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Bank } from 'src/app/models/bank.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { ApiService } from 'src/app/services/api.service';
import { apiDelete, dateTimeStandardFormat, selectOption } from 'src/app/utils/helpers.utils';
import { BanksModalComponent } from './banks-modal.component';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styles: [
  ]
})
export class BanksComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'bank', label: 'Banco', type: 'text', filter: true },
    { key: 'account', label: '# Cuenta', type: 'text', filter: true },
    { key: 'nickname', label: 'Apodo', type: 'text', filter: true },
    { key: 'currency_key', label: 'Moneda', type: 'text', filter: true, enableOptions: true },
    { key: 'summary', label: 'Tasa', type: 'numeric', filter: true, minFractionDigits: 2, prefix: '$' },
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'banks';
  public includes = ['currency'];

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {
    selectOption('currencies/select', this.api).then((options) => this.cols[3].options = options);
  }

  public mapper(bank: Bank): { [key: string]: any } {
    const currency = bank.currency;

    return {
      key: bank.key,
      bank: bank.bank,
      account: bank.account,
      nickname: bank.nickname,
      currency_key: currency?.currency,
      summary: currency?.prefix + bank.summary.toFixed(2),
      inserted_at: dateTimeStandardFormat(bank.inserted_at),
      edited_at: dateTimeStandardFormat(bank.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `bank=**${query}**`;
  }

  public show(bank: Bank): void {
    this.router.navigate(['/banks/', bank.key], { state: { data: bank } });
  }

  public add(): void {
    this._modal?.show(BanksModalComponent, 'Crear Banco', { grid: this._grid });
  }

  public edit(bank: Bank): void {
    this._modal?.show(BanksModalComponent, `Editar ${bank.bank}`, { item: bank, grid: this._grid });
  }

  public delete(bank: Bank): void {
    apiDelete<Bank>(this.api, this.ms, `banks/${bank.key}`, this._grid, (item) => `${item.bank} fue eliminado`);
  }
}
