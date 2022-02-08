import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Debtor } from 'src/app/models/debtor.model';
import { GridCol } from 'src/app/models/grid-col.model';
import { ApiService } from 'src/app/services/api.service';
import { genderOptions, maritalStatusOptions } from 'src/app/utils/const.utils';
import { selectOption, dateTimeStandardFormat, translate, apiDelete } from 'src/app/utils/helpers.utils';
import { DebtorsModalComponent } from './debtors-modal.component';

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styles: [
  ]
})
export class DebtorsComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'personal_id', label: 'Documento', type: 'text', filter: true },
    { key: 'name', label: 'Nombre', type: 'text', filter: true },
    { key: 'nick_name', label: 'Apodo', type: 'text', filter: true },
    { key: 'business', label: 'Negocio', type: 'text', filter: false },
    { key: 'province_key', label: 'Provincia', type: 'text', filter: true, enableOptions: true },
    { key: 'gender', label: 'Genero', type: 'text', filter: true, enableOptions: true, options: genderOptions },
    { key: 'street', label: 'Dirrección', type: 'text', filter: true },
    { key: 'dob', label: 'Fecha Nacimiento', type: 'date', filter: true },
    { key: 'phone_number', label: 'Telefono', type: 'text', filter: true },
    { key: 'marital_status', label: 'Estado Civil', type: 'text', filter: true, enableOptions: true, options: maritalStatusOptions },
    { key: 'occupation', label: 'Trabajo', type: 'text', filter: true },
    { key: 'income', label: 'Ingresos', type: 'numeric', filter: true },
    { key: 'other_income', label: 'Otros Ingresos', type: 'numeric', filter: true },
    { key: 'guarantor', label: 'Garante', type: 'text', filter: false },
    { key: 'guarantor_email', label: 'Email Garante', type: 'text', filter: false },
    { key: 'guarantor_phone', label: 'Telefono Garante', type: 'text', filter: false },
    { key: 'guarantor_personal_id', label: 'Cedula Garante', type: 'text', filter: false },
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'debtors';
  public includes = ['province'];

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.cols[5].options = options);
  }

  public mapper(debtor: Debtor): { [key: string]: any } {
    const province = debtor.province;
    return {
      key: debtor.key,
      guarantor: debtor.guarantor,
      guarantor_email: debtor.guarantor_email,
      guarantor_phone: debtor.guarantor_phone,
      guarantor_personal_id: debtor.guarantor_personal_id,
      business: debtor.business,
      province_key: province?.province,
      name: debtor.name,
      nick_name: debtor.nick_name,
      personal_id: debtor.personal_id,
      gender: translate(debtor.gender),
      street: debtor.street,
      dob: dateTimeStandardFormat(debtor.dob),
      phone_number: debtor.phone_number,
      marital_status: debtor.marital_status,
      occupation: debtor.occupation,
      income: debtor.income,
      inserted_at: dateTimeStandardFormat(debtor.inserted_at),
      edited_at: dateTimeStandardFormat(debtor.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `name=**${query}**`; // Todo update query
  }

  public show(debtor: Debtor): void {
    this.router.navigate(['/debtors/', debtor.key], { state: { data: debtor } });
  }

  public add(): void {
    this._modal?.show(DebtorsModalComponent, 'Crear Cliente', { grid: this._grid });
  }

  public edit(debtor: Debtor): void {
    this._modal?.show(DebtorsModalComponent, `Editar ${debtor.name}`, { item: debtor, grid: this._grid });
  }

  public delete(debtor: Debtor): void {
    apiDelete<Debtor>(this.api, this.ms, `debtors/${debtor.key}`, this._grid, (item) => `${item.name} fue eliminado`);
  }
}
