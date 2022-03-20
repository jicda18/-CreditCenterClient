import { Component, OnInit, Type } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [DialogService]
})
export class ModalComponent implements OnInit {
  private _ref?: DynamicDialogRef;

  constructor(private dialogService: DialogService) { }

  ngOnInit(): void {
  }

  public show(componentType: Type<any>, header: string, data: { item?: any, grid?: GridComponent }): void {
    if (this._ref === undefined) {
      this._ref = this.dialogService.open(componentType, {
        header,
        width: '80%',
        styleClass: 'cc-modal',
        closeOnEscape: false,
        data
      });

      this._ref.onClose.subscribe(() => {
        this._ref?.destroy();
        this._ref = undefined;
      });
    }
  }

  public hide(): void {
    if (this._ref !== undefined) {
      this._ref.destroy();
      this._ref = undefined;
    }
  }
}
