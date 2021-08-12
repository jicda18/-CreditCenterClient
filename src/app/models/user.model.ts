import { Company } from './company.model';
import { Permission } from './permission.model';

export interface User {
  avatar: string;
  key: string;
  user: string;
  mail: string;
  name: string;
  administrator: boolean;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  companies?: Company[];
  permissions: Permission[];
}
