import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorResponse } from '../models/error-response.model';
import { Response } from '../models/response.model';
import { TokenProvider } from '../providers/token.provider';
import { errorResponseToMessage } from '../utils/helpers.utils';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public onUnauthorized = new EventEmitter<string>();
  public onCall = new EventEmitter<void>();

  private _ms: undefined | MessageService;

  private get oauthHeaders(): HttpHeaders {
    const token = this.tp.token;

    return new HttpHeaders({
      Authorization: `${token.token_type} ${token.access_token}`
    });
  }

  public set ms(value: MessageService) {
    this._ms = value;
  }

  constructor(private http: HttpClient, private tp: TokenProvider) { }

  private async httpErrorResponseHandler(response: HttpErrorResponse, notification: boolean, onError: (response: ErrorResponse) => null): Promise<void> {
    if (environment.production) {
      console.error(response);
    }

    const status = response.status;

    if (status === 401) {
      this.onUnauthorized.emit('Token invalido. Se require que se vuelva a iniciar sección.');
    }

    if (status === 429) {
      this.onUnauthorized.emit('Demasiadas solicitudes. Inicie sección mas tarde.');
    }

    if (notification) {
      const m = await errorResponseToMessage(response.error as ErrorResponse);
      if (Array.isArray(m)) {
        this._ms?.addAll(m);
      } else {
        this._ms?.add(m);
      }
    }

    if (onError !== undefined && onError !== null) {
      onError(response.error as ErrorResponse);
    }

    if (!environment.production) {
      console.error(response);
    }
  }

  private async validateToken(): Promise<boolean> {
    const isValid = await this.tp.isValid();

    if (!isValid) {
      const msg = 'Su token expiro y no se pudo removar.';
      this.onUnauthorized.emit(msg);
      this._ms?.add({ severity: 'error', summary: 'Error', detail: msg });
    }

    return isValid;
  }

  private async sendGet<T>(route: string, withAuth: boolean, withNotification: boolean, onError: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    const response = await this.http.get<Response<T>>(environment.api + route, {
      headers: withAuth ? this.oauthHeaders : undefined
    }).toPromise().catch<Response<undefined>>((error: HttpErrorResponse) => { this.httpErrorResponseHandler(error, withNotification, onError); return { data: undefined }; });

    this.onCall.emit();

    return response;
  }

  private async sendPost<T>(route: string, withAuth: boolean, payload: FormData, withNotification: boolean, onError: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    const response = await this.http.post<Response<T>>(environment.api + route, payload, {
      headers: withAuth ? this.oauthHeaders : undefined
    }).toPromise().catch<Response<undefined>>((error: HttpErrorResponse) => { this.httpErrorResponseHandler(error, withNotification, onError); return { data: undefined }; });

    this.onCall.emit();

    return response;
  }

  private async sendPut<T>(route: string, withAuth: boolean, payload: HttpParams, withNotification: boolean, onError: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    const response = await this.http.put<Response<T>>(environment.api + route, payload, {
      headers: withAuth ? this.oauthHeaders : undefined
    }).toPromise().catch<Response<undefined>>((error: HttpErrorResponse) => { this.httpErrorResponseHandler(error, withNotification, onError); return { data: undefined }; });

    this.onCall.emit();

    return response;
  }

  private async sendDelete<T>(route: string, withAuth: boolean, withNotification: boolean, onError: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    const response = await this.http.delete<Response<T>>(environment.api + route, {
      headers: withAuth ? this.oauthHeaders : undefined
    }).toPromise().catch<Response<undefined>>((error: HttpErrorResponse) => { this.httpErrorResponseHandler(error, withNotification, onError); return { data: undefined }; });

    this.onCall.emit();

    return response;
  }

  public async download(route: string, auth: boolean = true, withNotification: boolean = true, onError?: (response: ErrorResponse) => null): Promise<HttpResponse<Blob> | undefined> {
    if (auth && !await this.validateToken()) {
      return undefined;
    }

    const response = await this.http.get(environment.api + route, {
      headers: auth ? this.oauthHeaders : undefined,
      responseType: 'blob',
      observe: 'response',
    }).toPromise().catch<undefined>((error: HttpErrorResponse) => { this.httpErrorResponseHandler(error, withNotification, onError ?? (() => null)); return undefined; });

    this.onCall.emit();

    return response;
  }

  public async get<T>(route: string, auth: boolean = true, withNotification: boolean = true, onError?: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    if (auth && !await this.validateToken()) {
      return { data: undefined };
    }

    return this.sendGet<T>(route, auth, withNotification, onError ?? (() => null));
  }

  public async post<T>(route: string, body?: FormData, auth: boolean = true, withNotification: boolean = true, onError?: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    if (auth && !await this.validateToken()) {
      return { data: undefined };
    }

    return this.sendPost<T>(route, auth, body ?? new FormData(), withNotification, onError ?? (() => null));
  }

  public async put<T>(route: string, body?: HttpParams, auth: boolean = true, withNotification: boolean = true, onError?: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    if (auth && !await this.validateToken()) {
      return { data: undefined };
    }

    return this.sendPut<T>(route, auth, body ?? new HttpParams(), withNotification, onError ?? (() => null));
  }

  public async delete<T>(route: string, auth: boolean = true, withNotification: boolean = true, onError?: (response: ErrorResponse) => null): Promise<Response<T | undefined>> {
    if (auth && !await this.validateToken()) {
      return { data: undefined };
    }

    return this.sendDelete<T>(route, auth, withNotification, onError ?? (() => null));
  }
}
