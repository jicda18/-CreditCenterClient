import { Bank } from './bank.model';
import { Debtor } from './debtor.model';
import { Guarantor } from './guarantor.model';
import { User } from './user.model';

export interface Company {
  key: string;
  company: string;
  image: string;
  ico: string;
  front_end: string;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  users?: User[];
  banks?: Bank[];
  guarantors?: Guarantor[];
  debtors?: Debtor[];
}
