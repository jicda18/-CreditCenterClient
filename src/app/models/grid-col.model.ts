export interface GridCol {
  key: string;
  label: string;
  type: 'text' | 'numeric' | 'boolean' | 'date';
  filter: boolean;
  minFractionDigits?: number;
  prefix?: string;
  suffix?: string;
  options?: { value: number | string; label: string }[];
  enableOptions?: boolean;
}
