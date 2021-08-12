import { Company } from './company.model';

export interface Notification {
  key: string;
  company_key: string;
  lvl: number;
  msg: string;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  company?: Company;
}
