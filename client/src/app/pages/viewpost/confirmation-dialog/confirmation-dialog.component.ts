import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TaquitoService } from '../../../taquito.service';


@Component({
  selector: 'ngx-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() puid: string;
  @Input() amount: number;
  @Input() comment: string;

  constructor(private ref: NbDialogRef<ConfirmationDialogComponent>,private taquito : TaquitoService) { }

  ngOnInit(): void {
  }

  close()
  {
    this.ref.close();
  }

  async Okay()
  {
    // await this.taquito.send_fund();
    this.ref.close();
    console.log(this.puid);
    console.log(this.amount);
    console.log(this.comment);
    console.log("confirmed");
  }

}