import { ViewpostComponent } from './viewpost/viewpost.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserinfoComponent } from './userinfo/userinfo.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AddorgComponent } from './addorg/addorg.component';
//import { LoginComponent } from './login/login.component';
import { IpfsComponent } from './ipfs/ipfs.component';
import { LoginComponent } from '../login/login.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,canActivate:[LoginComponent],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path:'userinfo',
      component: UserinfoComponent,
    },
    {
      path:'viewpost',
      component: ViewpostComponent,
    },
    {
      path:'addorg',
      component: AddorgComponent,
    },
    {
      path: 'ipfs',
      component: IpfsComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
