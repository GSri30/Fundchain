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
  formerr : boolean;
  imgerr : boolean;
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

  async processFile(name,description,goal,post_type,institution,imageInput:any){
    const files: File[] = imageInput.files;
    if(files.length<4){
      this.imgerr=true;
    }
    else{
      this.imgerr=false;
    }
    if((name==="" || description==="" || goal==="" || post_type==="" || imageInput.files.length===0)){
      this.formerr=true;
    }
    else{
      this.formerr=false;
    }
    const reader = new FileReader();
    await this.ipfs.updateFiles(files);
    await this.ipfs.upload();
    // for(let i=0;i<files.length;i++){
    //   reader.addEventListener('load', (event: any) => {
    //     this.selectedFile = new ImageSnippet(event.target.result, files[i]);
    //   });
    // }
  }

  checkerr(name,description,goal,post_type,institution,imageInput){
    if((name==="" || description==="" || goal==="" || post_type==="" || imageInput.files.length===0)){
      this.formerr=true;
    }
    else{
      this.formerr=false;
    }
    if(this.imgerr){
      return 0;
    }
  }
  async addOrg(name,description,goal,post_type,institution,imageInput,deadline):Promise<number>
  {    
    if((name==="" || description==="" || goal==="" || post_type==="" || imageInput.files.length===0)){
      this.formerr=true;
      return 0;
    }
    else{
      this.formerr=false;
    }
    if(this.imgerr){
      return 0;
    }

    await this.taquito.set_contract();
    
    const dl = new Date(deadline);
    // deadline = dl.getTime()/1000;
    
    var images = this.ipfs.get_hashes(); 
    
    const op = await this.taquito.add_new_post(name,description,institution,post_type,Base64.encode(sessionStorage.getItem('email'),true),goal,images,dl);
    return 1;
  }
}
