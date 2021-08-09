import { AlertButton } from './alert-button.model';

export class Alert<T> {
  private _promise: Promise<T>;
  private _resolve?: (value: T | PromiseLike<T>) => void;
  private _reject?: (reason?: any) => void;
  private _close: () => void;

  public type: string;
  public title: string;
  public message: string;
  public comment: string;
  public buttons: AlertButton<T>[];

  public constructor(type: string, title: string, message: string, buttons: AlertButton<T>[], close: () => void, comment: string) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.buttons = buttons;
    this._close = close;
    this.comment = comment;

    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  public get promise(): Promise<T> {
    return this._promise;
  }

  public get close(): () => void {
    return this._close;
  }

  public get resolve(): null | ((value: T | PromiseLike<T>) => void) {
    return this._resolve ?? null;
  }

  public get reject(): null | ((reason?: any) => void) {
    return this._reject ?? null;
  }
}
