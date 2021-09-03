import { UserinfoService } from './../userinfo/userinfo.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'ngx-addorg',
  templateUrl: './addorg.component.html',
  styleUrls: ['./addorg.component.scss'],
  changeDetection : ChangeDetectionStrategy.OnPush,

})
export class AddorgComponent implements OnInit {
  Wallet : boolean;
  selectedFile : ImageSnippet;
  constructor(private userinfo : UserinfoService,    private cds : ChangeDetectorRef,
    ) {
      
     }

   ngOnInit():void{
    this.userinfo.Wallet.subscribe((status) => {
      this.Wallet = status;
      this.cds.detectChanges();
    });
  }

  processFile(imageInput : any){
    const files: File[] = imageInput.files;
    const reader = new FileReader();

    for(let i=0;i<files.length;i++){
      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, files[i]);
        //Add way to store these files in backend
      });
    }
  }

}
