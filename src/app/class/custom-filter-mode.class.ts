import { FilterMatchMode } from 'primeng/api';

export class CustomFilterMode extends FilterMatchMode {
  static readonly NOT_STARTS_WITH = 'notStartsWith';
  static readonly NOT_ENDS_WITH = 'notEndsWith';
}
