import { Component, OnInit } from '@angular/core';
import Sawo from "sawo";

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  title = 'angular-sawo-chander';
  Sawo: any;
  isLoggedIn:any= false;
  userPayload:any = {};
  greeting='';

  constructor() { }

  ngOnInit(): void {
    const sawoConfig = {
      containerID: "",
      identifierType: "email",
      // Secret
      apiKey: "",
      onSuccess: (payload: any) => {
        this.userPayload = payload;
        this.isLoggedIn = true;
        // var sawoContainer = document.getElementById("");
        // sawoContainer..remove();
        console.log(this.userPayload);
        console.log(this.userPayload['identifier']);
        console.log(this.userPayload['customFieldInputValues']['Name']);
        console.log(this.userPayload['customFieldInputValues']['Name']=='');
        const name=(this.userPayload['customFieldInputValues']['Name']!='' ?this.userPayload['customFieldInputValues']['Name']:"Anonymous");
        alert(`Hi ${name}!`);
      }
    };
    this.Sawo = new Sawo(sawoConfig);
  }

  ngAfterViewInit() {
    console.log(this.Sawo);
    this.Sawo.showForm();
  }

}
