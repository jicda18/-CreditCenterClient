import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Guarantor } from 'src/app/models/guarantor.model';

@Component({
  selector: 'app-guarantors-modal',
  templateUrl: './guarantors-modal.component.html',
  styles: [
  ]
})
export class GuarantorsModalComponent implements OnInit {
  private _grid?: GridComponent;

  public guarantor?: Guarantor;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.guarantor = config.data?.item;
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(guarantor: Guarantor): void {
    if (this._grid !== undefined) {
      this._grid.insert(guarantor);
      this.ref.close();
    }
  }

  public updated(guarantor: Guarantor): void {
    if (this._grid !== undefined) {
      this._grid.update(guarantor);
      this.ref.close();
    }
  }
}
