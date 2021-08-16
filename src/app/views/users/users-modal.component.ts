import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styles: [
  ]
})
export class UsersModalComponent implements OnInit {
  private _grid?: GridComponent;

  public user?: User;

  constructor(public ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.user = config.data?.item;
    this._grid = config.data?.grid;
  }

  ngOnInit(): void {
  }

  public inserted(user: User): void {
    if (this._grid !== undefined) {
      this._grid.insert(user);
      this.ref.close();
    }
  }

  public updated(user: User): void {
    if (this._grid !== undefined) {
      this._grid.update(user);
      this.ref.close();
    }
  }
}
