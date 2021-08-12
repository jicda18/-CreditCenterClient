import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageProvider } from './storage.provider';
import { Token } from '../models/token.model';
import { environment } from '../../environments/environment';
import { ErrorResponse } from '../models/error-response.model';
import { httpErrorResponseFalse, httpErrorResponseHandler } from '../utils/helpers.utils';
import { Response } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class TokenProvider {
  private readonly _key = 'token';
  private _token?: Token;

  public get token(): Token {
    if (this._token === undefined) {
      this._token = this.sp.getFromStore<Token>(this._key);
    }

    if (this._token !== undefined && this._token.expired === undefined) {
      this._token.expired = () => {
        return this._token === undefined ? true : this._token.expires_in <= (new Date().getTime() - (5 * 60 * 1000)); // 5 min of margin
      };
    }

    return this._token;
  }

  public set token(value: Token) {
    this._token = {
      access_token: value.access_token,
      expires_in: new Date().getTime() + (value.expires_in * 1000),
      refresh_token: value.refresh_token,
      token_type: value.token_type,
    };

    this.sp.setInStore<Token>(this._key, this._token);
  }

  constructor(private sp: StorageProvider, private http: HttpClient) { }

  private async refreshToken(): Promise<false | Token> {
    const params = new FormData();
    params.append('grant_type', environment.grant);
    params.append('client_id', environment.client.toString());
    params.append('client_secret', environment.secret);
    params.append('refresh_token', this.token.refresh_token);

    return await this.http.post<Token>(environment.api + 'token', params).toPromise().catch<false>(httpErrorResponseFalse);
  }

  public async generateToken(username: string, password: string): Promise<ErrorResponse | Token> {
    const params = new FormData();
    params.append('grant_type', environment.grant);
    params.append('client_id', environment.client.toString());
    params.append('client_secret', environment.secret);
    params.append('username', username);
    params.append('password', password);

    const response = await this.http.post<Response<Token>>(environment.api + 'tokens', params).toPromise().catch<ErrorResponse>(httpErrorResponseHandler);

    if ('data' in response) {
      return response.data;
    }

    return response;
  }

  public get exists(): boolean {
    return this.token !== undefined && this.token !== null;
  }

  public async isValid(): Promise<boolean> {
    if (this.token === undefined || this.token === null || this.token.refresh_token === undefined || this.token.refresh_token === null || this.token.refresh_token === '') {
      return false;
    }

    if (this.token.expired === undefined || this.token.expired()) {
      const newToken = await this.refreshToken();
      if (newToken === false) {
        return false;
      }

      this.token = newToken;
    }

    return true;
  }

  public clear(): void {
    this._token = undefined;
    this.sp.remove(this._key);
  }
}
