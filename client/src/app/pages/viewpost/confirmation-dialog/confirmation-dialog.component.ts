import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';


@Component({
  selector: 'ngx-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(private ref: NbDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  close()
  {
    this.ref.close();
  }

  Okay()
  {
    this.ref.close();
    console.log("confirmed");
  }

}
