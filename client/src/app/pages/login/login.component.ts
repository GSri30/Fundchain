import { Component, OnInit } from '@angular/core';
import Sawo from "sawo";
import {secret} from "../../../environments/secret";
import { encode, decode } from 'js-base64';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'angular-sawo-chander';
  Sawo: any;
  isLoggedIn:boolean = false;
  userPayload:any = {};
  greeting='';
  container_id=secret.CONTAINER_ID;

  email:string = '';
  uuid:string = '';
  name:string = '';
  profile_pic_number:number = 0;

  returnUrl:string='';

  constructor(
    private router: Router,
  ) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
  //   if(this.isLoggedIn){
  //     this.router.navigate([this.returnUrl], { queryParams: { isLoggedIn: this.isLoggedIn,email:this.email,uuid:this.uuid,name:this.name,profile_pic_number:this.profile_pic_number} });
  //     return true;
  //   }
  //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url} });
  //   return false;
  // }

  ngOnInit(): void {

    const sawoConfig = {
      containerID: this.container_id,
      identifierType: "email",
      // Secret
      apiKey: secret.API_KEY,
      onSuccess: (payload: any) => {
        // var sawoContainer = document.getElementById("");
        // sawoContainer..remove();
        this.userPayload = payload;
        this.isLoggedIn = true;
        this.email=this.userPayload['identifier'];
        this.uuid=encode(this.email,true);
        // const uuid_decode=decode(uuid);
        this.name=(this.userPayload['customFieldInputValues']['Name']!='' ?this.userPayload['customFieldInputValues']['Name']:"Anonymous");
        this.profile_pic_number=this.name.length%7;
      }
    };
    this.Sawo = new Sawo(sawoConfig);
  }

  ngAfterViewInit() {
    this.Sawo.showForm();
  }

}
