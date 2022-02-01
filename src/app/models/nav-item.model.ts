export interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  admin?: boolean;
  permission?: number[];
  children?: NavItem[];
}
