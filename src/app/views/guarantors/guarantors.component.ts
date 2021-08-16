import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { GridCol } from 'src/app/models/grid-col.model';
import { Guarantor } from 'src/app/models/guarantor.model';
import { ApiService } from 'src/app/services/api.service';
import { genderOptions } from 'src/app/utils/const.utils';
import { apiDelete, dateTimeStandardFormat, selectOption, translate } from 'src/app/utils/helpers.utils';
import { GuarantorsModalComponent } from './guarantors-modal.component';

@Component({
  selector: 'app-guarantors',
  templateUrl: './guarantors.component.html',
  styles: [
  ]
})
export class GuarantorsComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'personal_id', label: 'Documento', type: 'text', filter: true },
    { key: 'name', label: 'Nombre', type: 'text', filter: true },
    { key: 'province_key', label: 'Provincia', type: 'text', filter: true, enableOptions: true },
    { key: 'gender', label: 'Genero', type: 'text', filter: true, enableOptions: true, options: genderOptions },
    { key: 'street', label: 'Dirrección', type: 'text', filter: true },
    { key: 'phone_number', label: 'Telefono', type: 'text', filter: true },
    { key: 'occupation', label: 'Ocupación', type: 'text', filter: true },
    { key: 'workplace', label: 'Trabajo', type: 'text', filter: true },
    { key: 'income', label: 'Ingresos', type: 'numeric', filter: true },
    { key: 'other_income', label: 'Otros Ingresos', type: 'numeric', filter: true },
    { key: 'debtors', label: '# Garante', type: 'numeric', filter: false },
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'guarantors';
  public includes = ['province', 'debtors'];

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {
    selectOption('provinces/select', this.api).then((options) => this.cols[2].options = options);
  }

  public mapper(guarantor: Guarantor): { [key: string]: any } {
    const province = guarantor.province;
    const debtors = guarantor.debtors;
    return {
      key: guarantor.key,
      province_key: province?.province,
      name: guarantor.name,
      gender: translate(guarantor.gender),
      street: guarantor.street,
      phone_number: guarantor.phone_number,
      occupation: guarantor.occupation,
      workplace: guarantor.workplace,
      income: guarantor.income,
      personal_id: guarantor.personal_id,
      other_income: guarantor.other_income,
      debtors: debtors?.length ?? 0,
      inserted_at: dateTimeStandardFormat(guarantor.inserted_at),
      edited_at: dateTimeStandardFormat(guarantor.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `name=**${query}**`; // Todo update query
  }

  public show(guarantor: Guarantor): void {
    this.router.navigate(['/guarantors/', guarantor.key], { state: { data: guarantor } });
  }

  public add(): void {
    this._modal?.show(GuarantorsModalComponent, 'Crear Garante', { grid: this._grid });
  }

  public edit(guarantor: Guarantor): void {
    this._modal?.show(GuarantorsModalComponent, `Editar ${guarantor.name}`, { item: guarantor, grid: this._grid });
  }

  public delete(guarantor: Guarantor): void {
    apiDelete<Guarantor>(this.api, this.ms, `guarantors/${guarantor.key}`, this._grid, (item) => `${item.name} fue eliminado`);
  }
}
