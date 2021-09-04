import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FluidMeterComponent } from './fluid-meter/fluid-meter.component';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import FluidMeter from '../../../js/js-fluid-meter.js';
import {NbDialogService} from '@nebular/theme';
import {TaquitoService} from '../../taquito.service';
import {QrcodeComponent} from '../qrcode/qrcode.component'
import { Base64 } from 'js-base64';

interface OrganizationInfo{
  title: string, 
  data: string,
};

@Component({
  selector: 'ngx-viewpost',
  templateUrl: './viewpost.component.html',
  styleUrls: ['./viewpost.component.scss']
})
export class ViewpostComponent implements OnInit {
  constructor(
    private clipboardApi: ClipboardService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute,
    private taqutio : TaquitoService,
    private qr:QrcodeComponent
  ) { }

  // content: string = "abcdefghijklmnopqrstuvwxyz";
  elementType = 'canvas';
  data = 'pleasewait_pleasewait';

  Name: String;
  Goal: number = 0;
  reached: number = 0;
  remaining: number = 0;

  OrgInfo: OrganizationInfo[] = [];
  puid:string;
  async ngOnInit(): Promise<void> {
    const routeparams = this.route.snapshot.paramMap;
    const puid = <String>routeparams.get('id');
    // console.log(orgid);
    this.remaining = this.Goal - this.reached;
    this.fluidMeter();
    this.getOrganizationDetails(puid);
  }

  CopyText(content: string)
  {
    this.clipboardApi.copyFromContent(this.data);
  }

  fluidMeter()
  {
    var fill = (this.reached/this.Goal)*100;
    var fm = new FluidMeter();
    fm.init({
      targetContainer: document.getElementById("fluid-meter"),
      fillPercentage: fill, // 15%
      options:{
        size: 210,
        borderWidth: 18,
        fontSize: "45px",
        backgroundColor: "#e2e2e2",
        foregroundColor: "#fafafa",
        backgroundFluidLayer: {
          fillStyle: "",
          angularSpeed: 100,
          maxAmplitude: 9,
          frequency: 30,
          horizontalSpeed: 150
        },
        foregroundFluidLayer: {
          fillStyle: "green",
          angularSpeed: 100,
          maxAmplitude: 12,
          frequency: 30,
          horizontalSpeed: -150
        },
      }
    });
  }

  async getOrganizationDetails(puid)
  {
    await this.taqutio.set_contract();
    var titles = ['Name', 'Organization Type', 'Name of the Institution','Target Amount','Description'];
    var Data = ['-', '-', '-', '-', '-'];
    
    const post:any = await this.taqutio.get_post(puid);
    Data[0] = post.name;
    Data[1] = post.post_type;
    Data[2] = post.institution;
    Data[3] = post.goal+" XTZ";
    Data[4] = post.description;
    this.Name = Data[0];
    this.puid = puid;
    this.data = post.address;
    this.Goal = post.goal;
    this.reached = post.received_mutez;
    this.remaining = post.goal - post.received_mutez;
    
    for(let i=0; i<titles.length; i++)
    {
      this.OrgInfo.push({
        title: titles[i],
        data: Data[i],
      })
    }
  }

  async donate()
  {
    await this.taqutio.set_contract();
    // this.taqutio.send_fund(Base64.encode(sessionStorage.getItem('email'),true),this.puid,); 
  }

  open(amount: number, comment: string)
  {
    console.log('c');
    this.dialogService.open(ConfirmationDialogComponent, {
        context:{
          puid: this.puid,
          amount: amount,
          comment: comment,
        },
        closeOnBackdropClick: false,
      });
    console.log('dadsd');
  }
}
