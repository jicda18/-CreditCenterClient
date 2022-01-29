import { Fee } from './fee.model';
import { Frequency } from './frequency.model';
import { Currency } from './currency.model';
import { Debtor } from './debtor.model';
import { Transaction } from './transaction.model';

export interface Loan {
  key: string;
  label: string;
  debtor_key: string;
  currency_key: string;
  frequency_key: string;
  fee_amount: number;
  start_at: string;
  thanks_days: number;
  next_at: string;
  status: 'active' | 'paid' | 'paused' | 'canceled';
  summary: number;
  interest_summary: number;
  amount: number;
  type: 'fixed_interest' | 'interest_capital';
  interest: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  debtor?: Debtor;
  currency?: Currency;
  frequency?: Frequency;
  transactions?: Transaction[];
  fees?: Fee[];
}
