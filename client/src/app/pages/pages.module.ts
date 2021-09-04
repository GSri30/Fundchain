import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserinfoModule } from './userinfo/userinfo.module';
import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AddorgModule } from './addorg/addorg.module';
import { LoginComponent } from './login/login.component';
import { QrcodeComponent } from './qrcode/qrcode.component';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { IpfsComponent } from './ipfs/ipfs.component';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    UserinfoModule,
    DashboardModule,
    MiscellaneousModule,
    AddorgModule,
    NgxQRCodeModule,
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
    QrcodeComponent,
    IpfsComponent,
  ],
})
export class PagesModule {
}
