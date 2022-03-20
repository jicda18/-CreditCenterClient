import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { defaultPassword } from 'src/app/utils/const.utils';
import { getModel, objectToHttpParams } from 'src/app/utils/helpers.utils';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styles: [
  ],
  providers: [ConfirmationService],
})
export class UsersViewComponent implements OnInit {
  public user?: User;
  public isDisable = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router, private cs: ConfirmationService, private ms: MessageService) { }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key') ?? '';

    getModel<User>(key, 'users', this.api, this.router, '/users').then((user) => this.user = user);
  }

  public async resetPassword(event: Event): Promise<void> {
    this.cs.confirm({
      target: event.target ?? undefined,
      message: `¿Esta Seguro de resetear la contraseña de ${this.user?.name}?`,
      icon: 'pi pi-info-circle',
      accept: async () => {
        this.isDisable = true;

        const user = (await this.api.put<User>(`users/${this.user?.key}`, objectToHttpParams({ password: defaultPassword }))).data;

        if (user !== undefined) {
          this.user = user;

          this.ms.add({
            severity: 'success',
            summary: 'Reseteo Exitoso',
            detail: `La contraseña ha sido reseteda existosamente. La contraseña es: ${defaultPassword}`,
            icon: 'pi-check-circle'
          });
        }

        this.isDisable = false;
      },
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      header: 'Confirmación de Reseteo Contraseña',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-warning'
    });
  }
}
