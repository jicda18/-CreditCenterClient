import { Loan } from './loan.model';
import { Transaction } from './transaction.model';

export interface Fee {
  key: string;
  loan_key: string;
  transaction_key: string;
  payment_at: string;
  amount: number;
  limit_at: string;
  paid_at: null | string;
  status: 'paid' | 'in-time' | 'in-thanks' | 'overdue';
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  loan?: Loan;
  transactions?: Transaction[];
}
