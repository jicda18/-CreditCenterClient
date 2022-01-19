import { Bank } from './bank.model';
import { Fee } from './fee.model';
import { Loan } from './loan.model';
import { User } from './user.model';

export interface Transaction {
  key: string;
  loan_key: string;
  bank_key: string;
  cash: boolean;
  register_key: string;
  was_at: string;
  amount: number;
  loan_amount: number;
  bank_amount: number;
  loan_balance: number;
  bank_balance: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  loan?: Loan;
  bank?: Bank;
  register?: User;
  fees?: Fee;
}
