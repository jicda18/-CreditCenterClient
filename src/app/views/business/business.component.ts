import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Business } from 'src/app/models/business.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { ApiService } from 'src/app/services/api.service';
import { apiDelete, dateTimeStandardFormat, selectOption } from 'src/app/utils/helpers.utils';
import { BusinessModalComponent } from './business-modal.component';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styles: [
  ]
})
export class BusinessComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'business', label: 'Nombre', type: 'text', filter: true },
    { key: 'province_key', label: 'Provincia', type: 'text', filter: true, enableOptions: true },
    { key: 'relation', label: 'Relacción', type: 'text', filter: true },
    { key: 'noe', label: '# Empleados', type: 'numeric', filter: true },
    { key: 'phone_number', label: 'Telefono', type: 'text', filter: true },
    { key: 'street', label: 'Dirrección', type: 'text', filter: true },
    { key: 'comments', label: 'Comentario', type: 'text', filter: true },
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'businesses';
  public includes = ['province'];

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.cols[1].options = options);
  }

  public mapper(business: Business): { [key: string]: any } {
    const province = business.province;
    return {
      key: business.key,
      province_key: province?.province,
      business: business.business,
      relation: business.relation, // Todo: En español
      noe: business.noe,
      phone_number: business.phone_number,
      street: business.street,
      comments: business.comments,
      inserted_at: dateTimeStandardFormat(business.inserted_at),
      edited_at: dateTimeStandardFormat(business.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `business=**${query}**`; // Todo update query
  }

  public show(business: Business): void {
    this.router.navigate(['/businesses/', business.key], { state: { data: business } });
  }

  public add(): void {
    this._modal?.show(BusinessModalComponent, 'Crear Negocio', { grid: this._grid });
  }

  public edit(business: Business): void {
    this._modal?.show(BusinessModalComponent, `Editar ${business.business}`, { item: business, grid: this._grid });
  }

  public delete(business: Business): void {
    apiDelete<Business>(this.api, this.ms, `businesses/${business.key}`, this._grid, (item) => `${item.business} fue eliminado`);
  }
}
