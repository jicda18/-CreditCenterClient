import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DateTime } from 'luxon';
import { SessionStatus } from '../enums/session-status.enum';
import { User } from '../models/user.model';
import { LayoutProvider } from '../providers/layout.provider';
import { StorageProvider } from '../providers/storage.provider';
import { TokenProvider } from '../providers/token.provider';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly _defaultPath = '/home';
  public readonly INACTIVE_TIME = 1 * 3600; // 12 Hours

  private _user?: User;
  private _status?: SessionStatus;
  private _lastUrl?: string;
  private _waiting = false;
  private _userWaiting = false;
  private _interval: undefined | number;
  private _lastAction = DateTime.now();
  private _inactiveStep = 5;

  private _ms: undefined | MessageService;

  public onLogging: EventEmitter<DateTime> = new EventEmitter<DateTime>();
  public onLogged: EventEmitter<DateTime> = new EventEmitter<DateTime>();
  public onLogouting: EventEmitter<DateTime> = new EventEmitter<DateTime>();
  public onLogouted: EventEmitter<DateTime> = new EventEmitter<DateTime>();

  public set ms(value: MessageService) {
    this._ms = value;
  }

  public get lastUrl(): string {
    if (this._lastUrl === undefined) {
      this._lastUrl = this._defaultPath;
    }

    return this._lastUrl;
  }

  public set lastUrl(value: string) {
    if (value !== '/login' && value !== '' && value !== '/') {
      this._lastUrl = value;
    }
  }

  public get status(): SessionStatus {
    if (this._status === undefined) {
      this._status = SessionStatus.Logout;

      if (!this.tp.exists) {
        this.clear();
      } else {
        if (this.tp.token.expired === undefined || this.tp.token.expired()) {
          this.Status = SessionStatus.Logout;
        } else {
          this.Status = SessionStatus.Login;
        }
      }
    }

    return this._status;
  }

  private set Status(status: SessionStatus) {
    if (this._status === status) {
      return;
    }
    this._status = status;

    if (this._status === SessionStatus.Logging) {
      this.onLogging.emit(DateTime.now());
      return;
    }

    if (this._status === SessionStatus.Login) {
      this.onLogged.emit(DateTime.now());
      return;
    }

    if (this._status === SessionStatus.Logouting) {
      this.onLogouting.emit(DateTime.now());
      return;
    }

    this.onLogouted.emit(DateTime.now());
  }

  public get working(): boolean {
    return this._waiting;
  }

  public get lastAction(): DateTime {
    return this._lastAction;
  }

  public get user(): undefined | User {
    return this._user;
  }

  public get admin(): boolean {
    return this._user?.administrator ?? false;
  }

  constructor(private tp: TokenProvider, private api: ApiService, private router: Router, private sp: StorageProvider, private lp: LayoutProvider) {
    this.api.onUnauthorized.subscribe(async () => {
      const logout = await this.logout();

      if (logout === false) {
        this._ms?.add({ severity: 'error', summary: 'Error inesperado.', detail: 'Error inesperado mienstra se cerraba su sección.' });
      }
    });

    this.api.onCall.subscribe(() => this._lastAction = DateTime.now());

    this.onLogged.subscribe(async () => {
      if (await this.setUser()) {
        this.startTimer();
      } else {
        this.Status = SessionStatus.Logout;
      }
    });

    this.onLogouted.subscribe(() => this.logouted(false));
  }

  private startTimer(): void {
    if (this._interval !== undefined) {
      return;
    }

    this._interval = setInterval(this.timerHandler, this._inactiveStep * 1000);
  }

  private stopTimer(): void {
    if (this._interval === undefined) {
      return;
    }

    clearInterval(this._interval);
    this._interval = undefined;
  }

  private clear(): void {
    this.tp.clear();

    this.stopTimer();

    this._user = undefined;
  }

  private async logouted(emit: boolean): Promise<void> {
    this.clear();

    if (emit) {
      this.Status = SessionStatus.Logout;
    } else {
      this._status = SessionStatus.Logout;
    }

    await this.router.navigate(['/login']);
  }

  private async setUser(): Promise<boolean> {
    if (this._userWaiting) {
      this._ms?.add({ detail: 'Estamos trabajando. Favor intenar mas tarde.', summary: 'Ocupado', severity: 'warn' });
      return false;
    }

    this._userWaiting = true;

    if (this._user === undefined) {
      this._user = (await this.api.get<User>('users/me'))?.data;
    }

    this._userWaiting = false;

    return this._user !== undefined;
  }

  private timerHandler: TimerHandler = () => {
    if (this._lastAction === undefined || DateTime.now().diff(this._lastAction, 'seconds').seconds > this.INACTIVE_TIME) {
      this._ms?.add({ severity: 'info', summary: 'Logout', detail: 'Se sección fue cerrada por politicas de seguridad por largo periodo de inactividad.' });

      this.logout();
    }
  }

  public validInactiveTimePolice(): void {
    if (this.timerHandler instanceof Function) {
      this.timerHandler();
    }
  }

  public async login(username: string, password: string): Promise<boolean> {
    if (this._waiting) {
      this._ms?.add({ detail: 'Estamos trabajando. Favor intenar mas tarde.', summary: 'Ocupado', severity: 'warn' });
      return false;
    }

    this._waiting = true;
    this._ms?.clear();

    if (this.status !== SessionStatus.Logout) {
      this._ms?.add({ detail: 'Su sección se encuentra activa.', summary: 'Error', severity: 'error' });
      this._waiting = false;
      return false;
    }

    this.Status = SessionStatus.Logging;

    const token = await this.tp.generateToken(username, password);

    if ('access_token' in token) {
      this.tp.token = token;

      this.Status = SessionStatus.Login;

      this._waiting = false;

      return true;
    }

    this.Status = SessionStatus.Logout;

    this._ms?.add({ detail: 'Usuario o contraseña incorrecta.', summary: 'Credenciales invalida.', severity: 'warn' });
    this._waiting = false;

    return false;
  }

  public async logout(): Promise<boolean> {
    if (this._waiting) {
      this._ms?.add({ detail: 'Estamos trabajando. Favor intenar mas tarde.', summary: 'Ocupado', severity: 'warn' });
      return false;
    }

    this._waiting = true;

    if (this.status !== SessionStatus.Login) {
      this._waiting = false;

      return true;
    }

    this.Status = SessionStatus.Logouting;

    this.logouted(true);

    this._waiting = false;

    return true;
  }
}
