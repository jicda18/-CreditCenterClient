import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { Business } from 'src/app/models/business.model';

@Component({
  selector: 'app-business-modal',
  templateUrl: './business-modal.component.html',
  styles: [
  ]
})
export class BusinessModalComponent implements OnInit {
  private _grid?: GridComponent;

  public business?: Business;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.business = config.data?.item;
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(business: Business): void {
    if (this._grid !== undefined) {
      this._grid.insert(business);
      this.ref.close();
    }
  }

  public updated(business: Business): void {
    if (this._grid !== undefined) {
      this._grid.update(business);
      this.ref.close();
    }
  }
}
