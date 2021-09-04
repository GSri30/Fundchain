import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserinfoModule } from './userinfo/userinfo.module';
import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule, NbIconModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AddorgModule } from './addorg/addorg.module';
import { ViewpostComponent } from './viewpost/viewpost.component';
import { OrgpicsComponent } from './viewpost/orgpics/orgpics.component';




@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    UserinfoModule,
    DashboardModule,
    MiscellaneousModule,
    AddorgModule
  ],
  declarations: [
    PagesComponent,
    ViewpostComponent,
    OrgpicsComponent,
  ],
})
export class PagesModule {
}
