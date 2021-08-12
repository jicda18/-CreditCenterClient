import { Company } from './company.model';
import { Debtor } from './debtor.model';
import { Province } from './province.model';

export interface Guarantor {
  key: string;
  province_key: string;
  company_key: string;
  name: string;
  gender: 'female' | 'male';
  street: string;
  phone_number: string;
  occupation: string;
  workplace: string;
  income: number;
  other_income: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  province?: Province;
  company?: Company;
  debtors?: Debtor[];
}
