import { Injectable } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageProvider {
  public messages: Message[] = [];

  public addMessage(messages: Message | Message[]): void {
    if (Array.isArray(messages)) {
      this.messages.push(...messages);
    } else {
      this.messages.push(messages);
    }
  }

  public removeMessage(id: number): void {
    this.messages.splice(id, 1);
  }

  public clear(): void {
    this.messages = [];
  }
}
