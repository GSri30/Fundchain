import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FluidMeterComponent } from './fluid-meter/fluid-meter.component';
import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import FluidMeter from '../../../js/js-fluid-meter.js';
import {NbDialogService} from '@nebular/theme';


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
    private dialogService: NbDialogService
  ) { }

  content: string = "abcdefghijklmnopqrstuvwxyz";
  elementType = 'canvas';
  data = 'aAgdk35gknek35NGkl';

  Goal: number = 4000;
  reached: number = 1000;
  remaining: number = 0;

  OrgInfo: OrganizationInfo[] = [];


  ngOnInit(): void {
    this.remaining = this.Goal - this.reached;
    this.fluidMeter();
    this.getOrganizationDetails();
  }

  CopyText(content: string)
  {
    this.clipboardApi.copyFromContent(this.content);
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

  getOrganizationDetails()
  {
    var titles = ['Name Of the Organization', 'Organization Type', 'Cause', 'Target Amount', 'Description'];
    var Data = ['Dhamodhara Siddhalayam', 'Education', 'Public college bathroom repairs', '4000 XTz', 'ksdhfsh fksbdk kjdfksb kjkfsjbd kbfiuhei fgjdk kdbfv ksdifg urhfi weugf lbkdbk vkjbsk dbvks ksdj bigiuke fiuw iegf kdjbkbkj vdsbi lefohiu fbiwuf kjbib jfbkd sjbkjbkjd sbvkb jvbjsdb'];
    for(let i=0; i<titles.length; i++)
    {
      this.OrgInfo.push({
        title: titles[i],
        data: Data[i],
      })
    }
  }

  open()
  {
    this.dialogService.open(
      ConfirmationDialogComponent,
      {
        closeOnBackdropClick: false,
      });
  }
}
