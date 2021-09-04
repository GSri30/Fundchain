import { UserinfoService } from './../userinfo/userinfo.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TaquitoService } from './../../taquito.service'
import {IpfsComponent} from '../ipfs/ipfs.component'

import { Base64 } from 'js-base64';

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
  constructor(private userinfo : UserinfoService,
              private cds : ChangeDetectorRef,
              private taquito: TaquitoService,
              private ipfs: IpfsComponent,
    ) {}

   ngOnInit():void{
    this.userinfo.Wallet.subscribe((status) => {
      this.Wallet = status;
      this.cds.detectChanges();
    });
  }

  async processFile(imageInput : any){
    const files: File[] = imageInput.files;
    const reader = new FileReader();
    await this.ipfs.updateFiles(files);
    await this.ipfs.upload();
    // for(let i=0;i<files.length;i++){
    //   reader.addEventListener('load', (event: any) => {
    //     this.selectedFile = new ImageSnippet(event.target.result, files[i]);
    //   });
    // }
  }

  async addOrg(name,description,goal,post_type,institution):Promise<number>
  {    
    await this.taquito.set_contract();
    var images = this.ipfs.get_hashes(); 
    const op = await this.taquito.add_new_post(name,description,institution,post_type,Base64.encode(sessionStorage.getItem('email'),true),goal,images);
    return 1;
  }
}
