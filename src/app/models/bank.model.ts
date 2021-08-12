import { Company } from './company.model';
import { Currency } from './currency.model';
import { Transaction } from './transaction.model';

export interface Bank {
  key: string;
  company_key: string;
  currency_key: string;
  bank: string;
  account: string;
  nickname: string;
  summary: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  company?: Company;
  currency?: Currency;
  transactions?: Transaction[];
}
