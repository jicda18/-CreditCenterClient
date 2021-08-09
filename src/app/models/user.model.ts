export interface User {
  key: string;
  user: string;
  mail: string;
  name: string;
  administrator: boolean;
  inserted_at: string;
  edited_at: string;
  removed_at: string;
  companies?: any[]; // Todo: create interfaces
  permissions: any[]; // Todo: create interfaces
}
