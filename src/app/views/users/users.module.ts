import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users.routing';
import { UsersComponent } from './users.component';
import { UsersViewComponent } from './users-view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { UsersModalComponent } from './users-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { UsersFormModule } from 'src/app/forms/users-form/users-form.module';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    UsersComponent,
    UsersViewComponent,
    UsersModalComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    GridModule,
    ModalModule,
    UsersFormModule,
    TabViewModule,
  ],
  entryComponents: [
    UsersModalComponent
  ]
})
export class UsersModule { }
