import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Bank } from 'src/app/models/bank.model';

@Component({
  selector: 'app-banks-modal',
  templateUrl: './banks-modal.component.html',
  styles: [
  ]
})
export class BanksModalComponent implements OnInit {
  private _grid?: GridComponent;

  public bank?: Bank;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.bank = config.data?.item;
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(bank: Bank): void {
    if (this._grid !== undefined) {
      this._grid.insert(bank);
      this.ref.close();
    }
  }

  public updated(bank: Bank): void {
    if (this._grid !== undefined) {
      this._grid.update(bank);
      this.ref.close();
    }
  }
}
