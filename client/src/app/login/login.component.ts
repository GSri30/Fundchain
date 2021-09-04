import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import Sawo from "sawo";
import {secret} from "../../environments/secret";
import { encode, decode } from 'js-base64';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,CanActivate {

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
    private appservice: AppService
  ) { }

   canActivate(route, state: RouterStateSnapshot) {
    const check = sessionStorage.getItem("isLoggedin");
    if(check == "true"){
      return true;
    }
    this.router.navigate([''], { queryParams: { returnUrl: state.url} });
    return false;
  }

  ngOnInit(): void {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem('isUpdate', 'true');
    console.log("hello");
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
        // this.appservice.name.next(this.name);
        // this.appservice.email.next(this.email);
        // this.appservice.uuid.next(this.uuid);
        // this.appservice.profile_pic_number.next(this.profile_pic_number);
        sessionStorage.setItem('name', this.name);
        sessionStorage.setItem("isLoggedin", "true");
        sessionStorage.setItem("email", this.email);
        sessionStorage.setItem("uuid", this.uuid);
        sessionStorage.setItem("profilepicid",this.profile_pic_number.toString());
        if(this.isLoggedIn){
          this.router.navigate(['/pages']);
        }
        
      }
    };
    this.Sawo = new Sawo(sawoConfig);
  }

  ngAfterViewInit() {
    this.Sawo.showForm();

  }

}
