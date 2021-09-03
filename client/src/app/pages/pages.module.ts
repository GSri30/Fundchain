import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserinfoModule } from './userinfo/userinfo.module';
import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { UserinfoComponent } from './userinfo/userinfo.component';




@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    UserinfoModule,
    DashboardModule,
    MiscellaneousModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
