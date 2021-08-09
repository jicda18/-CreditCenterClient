import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageProvider {
  constructor() {
  }

  public exists(storageKey: string): boolean {
    return localStorage.getItem(storageKey) !== null;
  }

  public setInStore<T>(storageKey: string, payload: T): void {
    const storageValue = JSON.stringify(payload);

    localStorage.setItem(storageKey, storageValue);
  }

  public getFromStore<T>(storageKey: string): T {
    const value = localStorage.getItem(storageKey);

    return value !== null ? JSON.parse(value) : undefined;
  }

  public remove(storageKey: string): void {
    localStorage.removeItem(storageKey);
  }
}
