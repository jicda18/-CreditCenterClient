import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { GridCol } from 'src/app/models/grid-col.model';
import { ApiService } from 'src/app/services/api.service';
import { dateFormat, getViewAreaSize } from 'src/app/utils/helpers.utils';
import { ConfirmationService } from 'primeng/api';
import { CustomFilterMode } from 'src/app/class/custom-filter-mode.class';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [ConfirmationService],
})
export class GridComponent implements OnInit, OnDestroy {
  @Input() rows = 16;
  @Input() cols: GridCol[] = [];
  @Input() endpoint = '';
  @Input() autoLoad = true;
  @Input() mapper: (item: any) => { [key: string]: any };
  @Input() idKey = 'key';
  @Input() rowsPerPageOptions = [8, 16, 32, 64, 128];
  @Input() header = '';
  @Input() globalFilter: undefined | ((query: string) => string);
  @Input() includes: string[] = [];

  @Input() filter = true;
  @Input() add = true;
  @Input() show = true;
  @Input() edit = true;
  @Input() delete = true;

  @Input() disableDeleteConfirm = false;

  @Output() addClick = new EventEmitter<void>();
  @Output() showClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();

  private _interval: any;

  public data: any[] = [];
  public totalRecords = 0;
  public loading = false;

  public width = 'auto';

  @Input() deleteQuestion: ((item: { [key: string]: any }) => string) = () => '¿Esta Seguro de eliminar este item?';

  private getRoute(page: number, sortBy: string, sortDirection: string): string {
    let route = `${this.endpoint}?per_page${this.rows}&page=${page}&sort_by=${sortBy}&sort_direction=${sortDirection}`;

    if (this.includes.length > 0) {
      route += '&include=' + this.includes.join(',');
    }

    return route;
  }

  constructor(private api: ApiService, private cs: ConfirmationService) {
    this.mapper = (item) => item;
  }

  ngOnInit(): void {
    if (this.autoLoad) {
      this.getFromApi(this.getRoute(1, this.idKey, 'asc'));
    }

    this._interval = setInterval(() => {
      if (this.loading) {
        this.width = 'auto';
      }

      const width = getViewAreaSize().width;

      this.width = `${width - 32}px`;
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }

  public remove(item: { [key: string]: any }): void {
    if (Object.prototype.hasOwnProperty.call(item, this.idKey)) {
      for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        const original = element.original;

        if (Object.prototype.hasOwnProperty.call(element, this.idKey)) {
          if (item[this.idKey] === original[this.idKey]) {
            this.data.splice(i, 1);
            return;
          }
        }
      }
    }
  }

  public insert(item: { [key: string]: any }): void {
    this.data.unshift(this.map(item));
  }

  public update(item: { [key: string]: any }): void {
    if (Object.prototype.hasOwnProperty.call(item, this.idKey)) {
      for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        const original = element.original;

        if (Object.prototype.hasOwnProperty.call(element, this.idKey)) {
          if (item[this.idKey] === original[this.idKey]) {
            this.data.splice(i, 1, this.map(item));
            return;
          }
        }
      }
    }
  }

  public async load(event: LazyLoadEvent): Promise<void> {
    const page = ((event.first ?? 0) / this.rows) + 1;
    const sortField = event.sortField ?? this.idKey;
    const sortOrder = (event.sortOrder ?? 1) === 1 ? 'asc' : 'desc';
    const query = event.globalFilter ?? '';
    const filters = event.filters;

    let route = this.getRoute(page, sortField, sortOrder);

    if (this.globalFilter !== undefined && query !== '') {
      route += '&' + this.globalFilter(query);
    }

    if (filters !== undefined) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const filter = filters[key];

          if (filter === undefined || filter === null || !Array.isArray(filter) || filter.length === 0) {
            continue;
          }

          const f: FilterMetadata = filter[0];

          if (f.value !== null) {
            const q = this.matchModeToApiMode(f.value, f.matchMode);

            route += `&${key}=${q}`;
          }

        }
      }
    }

    this.getFromApi(route);
  }

  public deleteClickFunction(item: { [key: string]: any }, event: Event): void {
    if (this.disableDeleteConfirm === false) {
      this.cs.confirm({
        target: event.target ?? undefined,
        message: this.deleteQuestion(item),
        icon: 'pi pi-info-circle',
        accept: () => {
          this.deleteClick.emit(item);
        },
        acceptIcon: 'pi pi-trash',
        rejectIcon: 'pi pi-times',
        header: 'Confirmación de borrado',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-warning'
      });
    } else {
      this.deleteClick.emit(item);
    }
  }

  private matchModeToApiMode(value: number | boolean | string | Date, matchMode = ''): string {
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }

    const val = (typeof value === 'object' ? dateFormat(value, 'yyyy-LL-dd[T]HH:mm:ss.sss') : value);

    switch (matchMode) {
      case CustomFilterMode.STARTS_WITH:
        return `**${val}`;
      case CustomFilterMode.NOT_STARTS_WITH:
        return `!**${val}`;
      case CustomFilterMode.ENDS_WITH:
        return `${val}**`;
      case CustomFilterMode.NOT_ENDS_WITH:
        return `${val}**!`;
      case CustomFilterMode.CONTAINS:
        return `**${val}**`;
      case CustomFilterMode.NOT_CONTAINS:
        return `!**${val}**!`;
      case CustomFilterMode.NOT_EQUALS:
        return `<>${val}`;
      case CustomFilterMode.LESS_THAN:
        return `<${val}`;
      case CustomFilterMode.LESS_THAN_OR_EQUAL_TO:
        return `~<${val}`;
      case CustomFilterMode.GREATER_THAN:
        return `>${val}`;
      case CustomFilterMode.GREATER_THAN_OR_EQUAL_TO:
        return `~>${val}`;
      case CustomFilterMode.DATE_AFTER:
        return `~>${val}`;
      case CustomFilterMode.DATE_BEFORE:
        return `~<${val}`;
      default:
        return val.toString();
    }
  }

  private map(item: any): { [key: string]: any } {
    const mapped = this.mapper(item);

    mapped.original = item;

    return mapped;
  }

  private async getFromApi(endpoint: string): Promise<void> {
    this.loading = true;

    const response = await this.api.get<any[]>(endpoint);

    const { data, meta, error } = response;

    if (data !== undefined) {
      this.data = data.map((item) => this.map(item));
    }

    if (meta !== undefined) {
      this.totalRecords = meta.total;
    }

    this.loading = false;
  }
}
