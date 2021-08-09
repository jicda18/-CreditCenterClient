import { Injectable } from '@angular/core';
import { Alert } from '../models/alert.model';
import { AlertButton } from '../models/alert-button.model';

@Injectable({
  providedIn: 'root'
})
export class AlertProvider {
  private _alerts: Alert<any>[] = [];

  public get alerts(): Alert<any>[] {
    return this._alerts;
  }

  private removeAlert(id: number): void {
    this._alerts.splice(id, 1);
  }

  public addAlert<T>(type: string, title: string, msg: string, buttons: AlertButton<T>[], comment: string): Alert<T> {
    const i = this._alerts.length;

    const alert = new Alert<T>(type, title, msg, buttons, () => {
      this.removeAlert(i);
    }, comment);

    this._alerts.push(alert);

    return alert;
  }

  public yesNoQuestion(type: string, title: string, msg: string, comment = '', yesIcon = 'fas fa-check', noIcon = 'fas fa-times'): Alert<boolean> {
    return this.addAlert<boolean>(type, title, msg, [
      { title: 'No', value: false, type: 'gray-light', icon: noIcon },
      { title: 'Yes', value: true, type: 'outline-gray-light', icon: yesIcon },
    ], comment);
  }

  public okAlert(type: string, title: string, msg: string, comment = '', okIcon = 'fas fa-check'): Alert<void> {
    return this.addAlert<void>(type, title, msg, [
      { title: 'Ok', value: undefined, type: 'outline-gray-light', icon: okIcon },
    ], comment);
  }
}
