import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GridComponent } from 'src/app/components/grid/grid.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { GridCol } from 'src/app/models/grid-col.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { apiDelete, dateTimeStandardFormat } from 'src/app/utils/helpers.utils';
import { UsersModalComponent } from './users-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit {
  @ViewChild('grid', { static: false }) private _grid?: GridComponent;
  @ViewChild('modal', { static: false }) private _modal?: ModalComponent;

  public cols: GridCol[] = [
    { key: 'avatar', label: 'Avatar', type: 'text', filter: false }, // Todo: add image field
    { key: 'name', label: 'Nombre', type: 'text', filter: true },
    { key: 'user', label: 'Usuario', type: 'text', filter: true },
    { key: 'mail', label: 'Email', type: 'text', filter: true },
    { key: 'administrator', label: 'Administrador', type: 'boolean', filter: true }, // Todo: render boolean
    { key: 'inserted_at', label: 'Creación', type: 'date', filter: false },
    { key: 'edited_at', label: 'Actualización', type: 'date', filter: false },
  ];
  public endpoint = 'users';
  public includes = []; // Todo: Set Include

  constructor(private api: ApiService, private router: Router, private ms: MessageService) { }

  ngOnInit(): void {

  }

  public mapper(user: User): { [key: string]: any } {
    return {
      key: user.key,
      user: user.user,
      mail: user.mail,
      name: user.name,
      administrator: user.administrator,
      avatar: user.avatar,
      inserted_at: dateTimeStandardFormat(user.inserted_at),
      edited_at: dateTimeStandardFormat(user.edited_at),
    };
  }

  public globalFilter(query: string): string {
    return `name=**${query}**`; // Todo update query
  }

  public show(user: User): void {
    this.router.navigate(['/users/', user.key], { state: { data: user } });
  }

  public add(): void {
    this._modal?.show(UsersModalComponent, 'Crear Usuario', { grid: this._grid });
  }

  public edit(user: User): void {
    this._modal?.show(UsersModalComponent, `Editar ${user.name}`, { item: user, grid: this._grid });
  }

  public delete(user: User): void {
    apiDelete<User>(this.api, this.ms, `users/${user.key}`, this._grid, (item) => `${item.name} fue eliminado`);
  }
}
