import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TaquitoService } from '../../../taquito.service';


@Component({
  selector: 'ngx-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

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
    console.log("confirmed");
  }

}
