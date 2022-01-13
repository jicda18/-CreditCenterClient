import { Permission } from './permission.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  inserted_at: string;
  edited_at: string;
  permissions: Permission[];
}
