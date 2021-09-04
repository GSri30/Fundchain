import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import {FluidMeter} from '../../../js/js-fluid-meter.js';


@Component({
  selector: 'ngx-viewpost',
  templateUrl: './viewpost.component.html',
  styleUrls: ['./viewpost.component.scss']
})
export class ViewpostComponent implements OnInit {

  constructor(
    private clipboardApi: ClipboardService
  ) { }

  content: string = "abcdefghijklmnopqrstuvwxyz";
  elementType = 'canvas';
  data = 'aAgdk35gknek35NGkl';




  ngOnInit(): void {
    // var fm = new FluidMeter();
    // fm.init({
    //   targetContainer: document.getElementById("fluid-meter"),
    //   fillPercentage: 15 // 15%
    // });
  }

  CopyText(content: string)
  {
    this.clipboardApi.copyFromContent(this.content);
  }
}
