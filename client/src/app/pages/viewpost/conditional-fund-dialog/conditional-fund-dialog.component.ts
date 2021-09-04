import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-conditional-fund-dialog',
  templateUrl: './conditional-fund-dialog.component.html',
  styleUrls: ['./conditional-fund-dialog.component.scss']
})
export class ConditionalFundDialogComponent implements OnInit {

  @Input() puid: string;
  @Input() amount: number;
  @Input() comment: string;


  constructor(private ref: NbDialogRef<ConditionalFundDialogComponent>) { }

  ngOnInit(): void {
  }


  close()
  {
    this.ref.close();
  }

  async Okay()
  {

  }

}
