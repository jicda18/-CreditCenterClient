import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorResponse } from '../models/error-response.model';
import { DateTime } from 'luxon';
import { ApiService } from '../services/api.service';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { NavItem } from '../models/nav-item.model';
import { Router } from '@angular/router';
import { GridComponent } from '../components/grid/grid.component';
import { EventEmitter } from '@angular/core';

// ----- Validations -----
/**
 * Validate the values if it's present
 * @param value - value to validate.
 * @param validateFn - function to validate if the value is present
 */
export function unRequiredValue<T>(value: T, validateFn: (value: T) => boolean): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string' && value === '') {
    return true;
  }

  return validateFn(value);
}

/**
 * Validate the values is present and valid.
 * @param value - value to validate.
 * @param validateFn - function to validate.
 */
export function requiredValue<T>(value: T, validateFn: (value: T) => boolean): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'string' && value === '') {
    return false;
  }

  return validateFn(value);
}

/**
 * Validate if the two items are equal.
 * @param value - first item to compare.
 * @param compare - second item to compare.
 */
export function equal<T>(value: T, compare: T): boolean {
  return value === compare;
}

/**
 * validate if file is an image.
 * @param file - the ile to validate
 */
export function image(file: File): boolean {
  return file.type?.split('/')[0] === 'image';
}

/**
 * validate the length of string is between min and max inclusive.
 * @param str - the string to validate.
 * @param min - the min value range.
 * @param max - the mas value range.
 */
export function length(str: string, min: number, max: number): boolean {
  return str.length >= min && str.length <= max;
}

// ----- Http Handler
async function blobError(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      if (typeof reader.result === 'string') {
        const result: ErrorResponse = JSON.parse(reader.result);

        if (typeof result.error === 'string') {
          return resolve(result.error);
        }

        return resolve(result.error.message);
      }

      return 'Unexpected error.';
    });

    reader.addEventListener('error', () => reject(null));

    reader.readAsText(blob);
  });
}

function downloadBlob(response?: HttpResponse<Blob>, defaultName = 'temp'): void {
  if (response === undefined || response === null || response.body === undefined || response.body === null) {
    return;
  }

  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = response.headers.get('X-Content-Name') ?? defaultName;
  a.href = window.URL.createObjectURL(response.body);
  document.body.appendChild(a);

  a.click();
  new Audio('assets/sounds/success.ogg').play(); // Tod: add audio

  a.remove();
}

export function httpErrorResponseFalse(response: HttpErrorResponse): false {
  if (!environment.production) {
    console.error(response);
  }

  return false;
}

export function httpErrorResponseHandler(response: HttpErrorResponse): ErrorResponse {
  if (!environment.production) {
    console.error(response);
  }

  return response.error;
}

export async function errorResponseToMessage(response: Blob | ErrorResponse): Promise<Message | Message[]> {
  if (response instanceof Blob) {
    const msg = await blobError(response);

    return { summary: 'Error', severity: 'error', detail: msg };
  }

  if (typeof response.error === 'string') {
    return { summary: 'Error', severity: 'error', detail: response.error };
  }

  let errors = response.error;
  if (errors !== undefined && errors !== null && Object.prototype.hasOwnProperty.call(errors, 'message')) {
    if (typeof errors.message === 'string') {
      return { summary: 'Error', severity: 'error', detail: errors.message };
    } else {
      errors = errors.message;
    }
  }

  const messages: Message[] = [];
  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      const error = errors[key];

      messages.push({ summary: 'Error', severity: 'error', detail: error });
    }
  }

  return messages;
}

// ----- date -----
export function convertToDateTime(dte: string | Date | DateTime): DateTime {
  if (typeof dte === 'string') {
    return DateTime.fromISO(dte);
  }

  if (dte instanceof Date) {
    return DateTime.fromJSDate(dte);
  }

  return dte;
}

export function convertToDate(dte: string | Date | DateTime): Date {
  if (typeof dte === 'string') {
    return DateTime.fromISO(dte).toJSDate();
  }

  if (dte instanceof DateTime) {
    return dte.toJSDate();
  }

  return dte;
}

// ----- format -----
export function secondToTime(seconds: number): string {
  if (seconds <= 0) {
    return '0:00:00';
  }

  const hourSec = 3600;
  const minSec = 60;

  let rest = seconds;

  const H = Math.floor(rest / hourSec);
  rest = rest % hourSec;

  const m = Math.floor(rest / minSec);
  rest = rest % minSec;

  const s = rest;

  return `${H}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
}

export function lengthFormat(srt: string, maxLength: number, ignore = true): string {
  if (ignore) {
    return srt;
  }

  if (maxLength > 0 && srt.length > maxLength) {
    return srt.trim().substr(0, maxLength).trim() + '...';
  }

  return srt.trim();
}

export function dateFormat(dte: string | Date | DateTime, format: string): string {
  return convertToDateTime(dte).toFormat(format);
}

export function dateStandardFormat(dte: string | Date | DateTime): string {
  return dateFormat(dte, 'LL/dd/yyyy');
}

export function timeStandardFormat(dte: string | Date | DateTime): string {
  return dateFormat(dte, 'hh:mm a');
}

export function dateTimeStandardFormat(dte?: string | Date | DateTime): string {
  if (dte === undefined || dte === null) {
    return '';
  }

  return dateFormat(dte, 'LL/dd/yyyy hh:mm a');
}

export function ucfirst(str: string): string {
  if (str.length <= 1) {
    return str.toUpperCase();
  }

  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function ucword(sentence: string, separator = ' '): string {
  const words = sentence.split(separator);

  return words.map((word) => ucfirst(word)).join(separator);
}

// ----- thread -----
export function sleep(ms: number = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function run<T>(f: () => T): Promise<T> {
  return new Promise<T>(resolve => setTimeout(() => resolve(f())));
}

export async function downloadApi(url: string, api: ApiService): Promise<void> {
  const response = await api.download(url);

  downloadBlob(response);
}

export function hasAll<T>(self: T[], required: T[]): boolean {
  if (required.length > 0) {
    for (const item of required) {
      if (!self.includes(item)) {
        return false;
      }
    }
  }

  return true;
}

export function hasAny<T>(self: T[], required: T[]): boolean {
  if (required.length > 0) {
    for (const item of required) {
      if (self.includes(item)) {
        return true;
      }
    }

    return false;
  }

  return true;
}

export function mapNavItemsToMenuItems(nav: NavItem): MenuItem {
  const item: MenuItem = {
    label: nav.label,
    icon: nav.icon,
  };

  if ((nav.children === undefined || nav.children.length === 0) && (nav.href !== undefined && nav.href !== '')) {
    item.routerLink = [nav.href];
  }

  if (nav.children !== undefined && nav.children.length !== 0) {
    item.items = nav.children.map(mapNavItemsToMenuItems);
  }

  return item;
}

export function userNavs(navs: NavItem[], admin: boolean, permissions: number[]): MenuItem[] {
  if (navs.length === 0) {
    return [];
  }

  if (admin) {
    return navs.map(mapNavItemsToMenuItems);
  }

  const answer: MenuItem[] = [];
  for (const nav of navs) {
    if (nav.admin === true) {
      continue;
    }

    if (nav.permission !== undefined && !hasAll(permissions, nav.permission)) {
      continue;
    }

    const item: MenuItem = {
      label: nav.label,
      icon: nav.icon,
    };

    if ((nav.children === undefined || nav.children.length === 0) && (nav.href !== undefined && nav.href !== '')) {
      item.routerLink = [nav.href];
    }

    if (nav.children !== undefined && nav.children.length !== 0) {
      item.items = userNavs(nav.children, admin, permissions);

      if (item.items.length === 0) {
        continue;
      }
    }

    answer.push(item);
  }

  return answer;
}

export async function selectOption<E, T>(route: string, api: ApiService): Promise<{ value: E; label: string; custom?: T; }[]> {
  const response = await api.get<{ value: E; label: string; custom?: T; }[]>(route);

  if (response === undefined || response.data === undefined) {
    return [];
  }

  return response.data;
}

export async function getModel<T>(key: string, route: string, api: ApiService, router: Router, back = '/home', includes = ''): Promise<undefined | T> {
  if (key === '') {
    await router.navigate([back]);
    return;
  }

  let model: any = history.state.data;

  if (model !== undefined && model !== null) {
    return model;
  }

  const include = includes === '' ? '' : `?include=${includes}`;

  model = (await api.get<T>(`${route}/${key}${include}`)).data;

  if (model !== undefined && model !== null) {
    return model;
  }

  await router.navigate([back]);

  return;
}

export function translate(word: string): string {
  const dictionary: { [key: string]: string } = {
    female: 'Mujer',
    male: 'Hombre',
    single: 'Soltero',
    married: 'Casado',
    divorced: 'Divorciado',
    widowed: 'Vuido',
  };


  if (Object.prototype.hasOwnProperty.call(dictionary, word)) {
    return dictionary[word];
  }

  return word;
}

export async function apiDelete<T>(api: ApiService, ms: MessageService, route: string, grid?: GridComponent, success?: (item: T) => string, fail?: () => string, withFail = true): Promise<T | false> {
  if (grid !== undefined) {
    grid.loading = true;
  }

  const item = (await api.delete<T>(route)).data ?? false;

  if (item !== false) {
    const msg = success === undefined ? 'Elemento eliminado.' : success(item);
    ms.add({ summary: 'Eliminado', detail: msg, icon: 'pi-check-circle', severity: 'success' });

    if (grid !== undefined) {
      grid.remove(item);
    }
  } else if (withFail) {
    const msg = fail === undefined ? 'Elemento no eliminado.' : fail();
    ms.add({ summary: 'Error', detail: msg, icon: 'pi-times-circle', severity: 'error' });
  }

  if (grid !== undefined) {
    grid.loading = false;
  }

  return item;
}

export function basicTypeToString(value: string | number | boolean | Date, format = 'yyyy-LL-dd'): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }

  return dateFormat(value, format);
}

export function objectToFormData(data: { [key: string]: Blob | string | number | boolean | Date | Array<string | number | boolean | Date> | null }): FormData {
  const form = new FormData();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key];

      if (item === undefined || item === null) {
        form.append(key, '');
      } else if (Array.isArray(item)) {
        for (const i of item) {
          form.append(`${key}[]`, basicTypeToString(i));
        }
      } else if (item instanceof Blob) {
        form.append(key, item);
      } else {
        form.append(key, basicTypeToString(item));
      }
    }
  }

  return form;
}

export function objectToHttpParams(data: { [key: string]: string | number | boolean | Date | Array<string | number | boolean | Date> }): HttpParams {
  let form = new HttpParams();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const item = data[key];

      if (item === undefined || item === null) {
        form.append(key, '');
      } else if (Array.isArray(item)) {
        for (const i of item) {
          form = form.set(`${key}[]`, basicTypeToString(i));
        }
      } else {
        form = form.set(key, basicTypeToString(item));
      }
    }
  }

  return form;
}

export async function createResource<T>(api: ApiService, route: string, form: FormData, ms: MessageService, event?: EventEmitter<T>, success?: (item: T) => string, fail?: () => string, withFail = true): Promise<T | false> {
  const item = (await api.post<T>(route, form)).data ?? false;

  if (item !== false) {
    const msg = success === undefined ? 'Elemento creado.' : success(item);
    ms.add({ summary: 'Creado', detail: msg, icon: 'pi-check-circle', severity: 'success' });

    event?.emit(item);
  } else if (withFail) {
    const msg = fail === undefined ? 'Elemento no creado.' : fail();
    ms.add({ summary: 'Error', detail: msg, icon: 'pi-times-circle', severity: 'error' });
  }

  return item;
}

export async function updateResource<T>(api: ApiService, route: string, form: HttpParams, ms: MessageService, event: EventEmitter<T>, success?: (item: T) => string, fail?: () => string, withFail = true): Promise<T | false> {
  const item = (await api.put<T>(route, form)).data ?? false;

  if (item !== false) {
    const msg = success === undefined ? 'Elemento actualizado.' : success(item);
    ms.add({ summary: 'Actualizado', detail: msg, icon: 'pi-check-circle', severity: 'success' });

    event.emit(item);
  } else if (withFail) {
    const msg = fail === undefined ? 'Elemento no actualizado.' : fail();
    ms.add({ summary: 'Error', detail: msg, icon: 'pi-times-circle', severity: 'error' });
  }

  return item;
}

export function getViewAreaSize(): { width: number, height: number } {
  const elements = document.getElementsByClassName('view-area');
  const answer = { width: -1, height: -1 };

  for (let i = 0; i < elements.length; i++) {
    const element = elements.item(i);

    if (element !== null) {
      const width = element.clientWidth;
      const height = element.clientHeight;

      if (width > answer.width) {
        answer.width = width;
      }

      if (height > answer.height) {
        answer.height = height;
      }
    }
  }

  return answer;
}

export function toCurrency(value: number): string {
  return value.toLocaleString('es-US', { style: 'currency', currency: 'USD' });
}

export function groupBy<T extends { [key: string]: any }>(array: T[], prop: string): { [key: string]: T[] } {
  const group: { [key: string]: T[] } = {};

  for (const item of array) {
    const key = item[prop];

    if (Object.prototype.hasOwnProperty.call(group, key)) {
      group[key].push(item);
    } else {
      group[key] = [item];
    }
  }

  return group;
}
