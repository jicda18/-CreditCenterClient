import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorResponse } from '../models/error-response.model';
import { DateTime } from 'luxon';
import { ApiService } from '../services/api.service';
import { Message } from 'primeng/api';

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
  if (response === undefined || response === null) {
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
  return dateFormat(dte, 'hh:mm:ss a');
}

export function dateTimeStandardFormat(dte: string | Date | DateTime): string {
  return dateFormat(dte, 'LL/dd/yyyy hh:mm:ss a');
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

// ----- api ----
// export async function apiDelete<T>(api: ApiService, ap: AlertProvider, url: string, question = 'Are you sure yo want to delete it?', comment = ''): Promise<T | false> {
//   const alert = ap.yesNoQuestion('danger', 'Deletion', question, comment, 'fa-trash');
//   const answer = await alert.promise.catch<false>(() => false);
//   let item: undefined | T | false;

//   if (answer) {
//     item = (await api.delete<T>(url)).data;
//   }

//   alert.close();
//   return item ?? false;
// }

export async function downloadApi(url: string, api: ApiService): Promise<void> {
  const response = await api.download(url);

  downloadBlob(response);
}
