import { Permission } from './permission.model';
import { Role } from './role.model';

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
  permissions: Permission[];
  roles: Role[];
}
