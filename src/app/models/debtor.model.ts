
import { Company } from './company.model';
import { Loan } from './loan.model';
import { Province } from './province.model';

export interface Debtor {
  key: string;
  company_key: string;
  guarantor?: string;
  business?: string;
  province_key: string;
  name: string;
  nick_name?: string;
  personal_id: string;
  gender: 'female' | 'male';
  street: string;
  dob?: string;
  phone_number?: string;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  occupation: string;
  income: number;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  company?: Company;
  province?: Province;
  loans?: Loan[];
}
