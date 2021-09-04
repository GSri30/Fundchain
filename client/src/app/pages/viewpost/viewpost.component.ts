import { ConditionalFundDialogComponent } from './conditional-fund-dialog/conditional-fund-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FluidMeterComponent } from './fluid-meter/fluid-meter.component';
import { Component, OnInit, Output, OnChanges, SimpleChange, Input, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import FluidMeter from '../../../js/js-fluid-meter.js';
import {NbDialogService} from '@nebular/theme';
import {TaquitoService} from '../../taquito.service';
import {QrcodeComponent} from '../qrcode/qrcode.component'
import { Base64 } from 'js-base64';
import {secret} from '../../../environments/secret';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

interface OrganizationInfo{
  title: string,
  data: string,
};

@Component({
  selector: 'ngx-viewpost',
  templateUrl: './viewpost.component.html',
  styleUrls: ['./viewpost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewpostComponent implements OnInit, OnChanges{
  constructor(
    private cds: ChangeDetectorRef,
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
  @Output() puid:String;

  xtz: any;
  curr: string = "rupee";
  con: any = 0;
  disp: any = 0;

  ngOnChanges(changes: SimpleChanges)
  {
      if(changes.curr.currentValue === 'dollar')
      {
          // this.disp = this.dollorTOtez(changes.con.currentValue);
          this.disp += 1;
          this.cds.detectChanges();

      }
      else if(changes.curr.currentValue === 'rupee')
      {
          // this.disp = this.inrTOtez(changes.con.currentValue);
          this.disp += 2;
          this.cds.detectChanges();
      }
  }

  async ngOnInit(): Promise<void> {
    // fetch(`http://api.coinlayer.com/api/live?access_key=${secret.COIN_LAYER}`).then(response=>response.json())
    // .then(data=>{
    //   this.xtz=(data["rates"].XTZ);
    //   this.disp = this.inrTOtez(this.con);
    // });
    const routeparams = this.route.snapshot.paramMap;
    this.puid = <String>routeparams.get('id');
    this.remaining = this.Goal - this.reached;
    await this.getOrganizationDetails(this.puid);
    this.fluidMeter();
  }

  dollorTOtez(dollors){
    return (dollors/this.xtz)*1000;
  }

  inrTOtez(inr){
    return (inr/(this.xtz*73))*1000;
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
    Data[3] = post.goal+" tez";
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

  fund(amount: number, comment: string)
  {
    this.dialogService.open(ConfirmationDialogComponent, {
        context:{
          puid: this.puid as string,
          amount: amount,
          comment: comment,
        },
        closeOnBackdropClick: false,
      })
  }

  conditional(amount: number, comment: string)
  {
      this.dialogService.open(ConditionalFundDialogComponent, {
        context:{
          puid: this.puid as string,
          amount: amount,
          comment: comment,
        }
      })
  }
}
