import { Component, OnInit } from '@angular/core';

import { urlSource } from 'ipfs-http-client';
const {create}=require('ipfs-http-client');
// https://www.npmjs.com/package/ipfs-http-client#usage

class Files{
  list:Array<File>;
  names:Array<string>;
  constructor(){
    this.list=new Array<File>();
    this.names=new Array<string>();
  }
}

@Component({
  selector: 'ngx-ipfs',
  templateUrl: './ipfs.component.html',
  styleUrls: ['./ipfs.component.scss']
})
export class IpfsComponent implements OnInit {

  client:any;
  files:Files;

  constructor() { }

  ngOnInit(): void {
    this.files=new Files();
    this.client = create("https://ipfs.infura.io:5001/api/v0");
  }

  updateFiles(e){
    this.files=new Files();
    let len=e.target.files.length;
    for(var i=0;i<len;i++){
      if(e.target.files[i].type.substring(0,5)!="image"){
        continue;
      }
      this.files.list.push(e.target.files[i]);
      this.files.names.push(e.target.files[i].name);
    }
  }

  async upload(){
    let len=this.files.list.length;
    let hashes=[];
    for(var i=0;i<len;i++){
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.files.list[i]);
      reader.onloadend = async ()=>{
        let buffer=new Uint8Array(reader.result as ArrayBuffer);
        const result = await this.client.add(buffer);
        hashes.push(result?.path);
        // const url=`https://ipfs.io/ipfs/${result.path}`
        // (document.getElementById("output") as HTMLImageElement).src=url;
        console.log(`https://ipfs.io/ipfs/${result.path}`);
        console.log(hashes);
      };
    }
    this.files=new Files();
  }
}
