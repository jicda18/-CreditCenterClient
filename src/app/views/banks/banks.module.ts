import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BanksRoutingModule } from './banks.routing';
import { BanksComponent } from './banks.component';
import { ViewComponent } from './view.component';
import { GridModule } from 'src/app/components/grid/grid.module';
import { BanksModalComponent } from './banks-modal.component';
import { ModalModule } from 'src/app/components/modal/modal.module';
import { BanksFormModule } from 'src/app/forms/banks-form/banks-form.module';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
    declarations: [
        BanksComponent,
        ViewComponent,
        BanksModalComponent
    ],
    imports: [
        CommonModule,
        BanksRoutingModule,
        GridModule,
        ModalModule,
        BanksFormModule,
        TabViewModule,
    ]
})
export class BanksModule { }
