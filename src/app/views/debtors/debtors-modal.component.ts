import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Debtor } from 'src/app/models/debtor.model';

@Component({
  selector: 'app-debtors-modal',
  templateUrl: './debtors-modal.component.html',
  styles: [
  ]
})
export class DebtorsModalComponent implements OnInit {
  private _grid?: GridComponent;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(debtor: Debtor): void {
    if (this._grid !== undefined) {
      this._grid.insert(debtor);
      this.ref.close();
    }
  }

  public updated(debtor: Debtor): void {
    if (this._grid !== undefined) {
      this._grid.update(debtor);
      this.ref.close();
    }
  }
}
