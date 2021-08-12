import { Country } from './country.model';

export interface Province {
  key: string;
  country_key: string;
  province: string;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  country?: Country;
}
