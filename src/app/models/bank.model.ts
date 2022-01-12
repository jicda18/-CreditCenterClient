import { Currency } from './currency.model';
import { Transaction } from './transaction.model';

export interface Bank {
  key: string;
  currency_key: string;
  bank: string;
  account: string;
  nickname: string;
  summary: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  currency?: Currency;
  transactions?: Transaction[];
}
