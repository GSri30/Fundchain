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
//import { LoginComponent } from './login/login.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import {ClipboardModule} from 'ngx-clipboard';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';



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
    ClipboardModule,
    AddorgModule,
    NgxQRCodeModule,
  ],
  declarations: [
    PagesComponent,
    ViewpostComponent,
    OrgpicsComponent,
    //LoginComponent,
    QrcodeComponent,
  ],
})
export class PagesModule {
}
