import { Province } from './province.model';

export interface Country {
  key: string;
  country: string;
  abbr: string;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  provinces?: Province;
}
