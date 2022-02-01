import { Loan } from './loan.model';
import { Transaction } from './transaction.model';

export interface Fee {
  key: string;
  loan_key: string;
  payment_at: string;
  amount: number;
  interest: number;
  capital: number;
  late_payment: number;
  paid_interest: number;
  paid_capital: number;
  paid_late_payment: number;
  pending_interest: number;
  pending_capital: number;
  pending_late_payment: number;
  balance: number;
  paid: number;
  pending: number;
  extra: boolean;
  limit_at: string;
  paid_at: null | string;
  status: 'paid' | 'in-time' | 'in-thanks' | 'overdue';
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  loan?: Loan;
  transactions?: Transaction[];
}
