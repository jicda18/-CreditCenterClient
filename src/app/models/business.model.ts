import { Province } from './province.model';

export interface Business {
  key: string;
  province_key: string;
  business: string;
  relation: string;
  noe: number;
  phone_number: string;
  street: string;
  comments: string;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  province?: Province;
}
