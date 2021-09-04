import { Injectable } from '@angular/core';
import { MichelsonMap, TezosToolkit} from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from "@airgap/beacon-sdk";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
    private taquito: TezosToolkit = new TezosToolkit('https://florencenet.smartpy.io/');
    private wallet;
    private contract_address = "KT1NeHakUJ3uYAfwGMQ5pJf3tNzd8Czy75Ys";
    private storage = undefined;
    private contract = undefined;
    constructor() {}
    
    public async set_contract() {
        // if(this.storage == undefined) 
        // {
            this.contract = await this.taquito.wallet.at(this.contract_address);
            this.storage = await this.contract.storage();
        // }
    }

    public async connect_wallet() {
        this.wallet = new BeaconWallet({ name: 'test' });
        await this.wallet.requestPermissions({
            network: {  
                type: NetworkType.FLORENCENET
            }
        });
        this.taquito.setProvider({ wallet: this.wallet });    
        return true;
    }
    public async get_pics(puid):Promise<Array<string>>
    {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var pics =  this.storage.posts.get(puid).pictures;
        for(let i = 0;i<pics.length;i++)
        {
            pics[i] = "https://ipfs.io/ipfs/" + pics[i];
            console.log(pics[i]);
        }
        return pics;
    }

    public async get_specific_from_transactions(uuid):Promise<Array<object>> {        
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 1;
        this.storage.transactions.get(uuid).forEach((val: any, key: string) => {
            tlist.push({data : {
                Type : this.storage.posts.get(val.to_puid).name,
                Amount : val.amount.c[0].toString(),
                kind : 'doc'
                }});
            i+=1;
        });
        return tlist;
    }

    public async get_specific_to_transactions(uuid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 0;
        var post_list = this.storage.users.get(uuid).posts;
        while(i<post_list.length)
        {
            this.storage.transactions.get(post_list[i]).forEach((val: any, key: string) => {
                tlist.push({data : {
                    Type : this.storage.posts.get(val.to_puid).name,
                    Amount : val.amount.c[0].toString(),
                    kind : 'doc'
                    }});
            });
            i+=1;
        }
        return tlist;
    }
    public async get_specific_post_transactions(puid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var tlist:{}[] = [];
        var i = 1;
        this.storage.transactions.get(puid).forEach((val: any, key: string) => {
            tlist.push({data : {
                Type : this.storage.posts.get(val.to_puid).name,
                Amount : val.amount.c[0].toString(),
                kind : 'doc'
                }});
            i+=1;
        });
        return tlist;
    }
    
    public async get_all_transactions():Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const transactions_list: { uuid: string; transaction: number }[] = [];
        this.storage.transactions.forEach((val: number, key: string) => {
            transactions_list.push({ uuid: key, transaction: val });
        });
        console.log(transactions_list[0]);
        return transactions_list;
    }

    public async graph()
    {
        var month_list:any = {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
            6 : 0,
            7 : 0,
            8 : 0,
            9 : 0,
            10 : 0,
            11 : 0,
            12 : 0
        };
        // var curr_date = new Date();
        // const curr_month = curr_date.getMonth() + 1;      
        
        // if(this.storage == undefined)this.storage = await this.contract.storage();
        // this.storage.transactions.forEach((val: any, key: string) => {
        //     val.forEach(element => {
                
        //         const trans_month = parseInt(element.timestamp.substring(5,7));
        //         console.log(trans_month);
        //         if(curr_month >= trans_month && curr_month == trans_month)
        //         else
        //     });
        // });
        // month_list.forEach((val : Number , key : Number) => {
            
        // });
    }

    //get user
    public async get_user(uuid):Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        console.log(this.storage.users.get(uuid));
        return this.storage.users.get(uuid);
    }
    // get post
    public async get_post(puid):Promise<object>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.posts.get(puid));
        return this.storage.posts.get(puid);
    }

    public async get_specific_post_type(type):Promise<Array<object>>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        var plist = [];
        this.storage.posts.forEach((val: any, key: string) => {
            if(val.post_type == type)
            {
                plist.push({
                    name : val.name,
                    id : key,
                    description : val.description,
                    progress : Math.floor((val.received_mutez.c/val.goal.c)*100),
                    pic :"https://ipfs.io/ipfs/" + val.pictures[0],
                    goal : val.goal
                });
            }
        });
        return plist;
    }

    // get total fund
    public async get_total_fund():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return this.storage.total_fund;
    }
    // get total donors
    public async get_total_donors():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions);
        return this.storage.total_donors;
    }
    // get total fundings
    public async get_total_fundings():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.transactions.size);
        return this.storage.transactions.size;
    }
    // get total goals reached
    public async get_goals_reached():Promise<number>{
        if(this.storage == undefined) this.storage = await this.contract.storage();
        // console.log(this.storage.total_goals_reached.c);
        return this.storage.total_goals_reached.c;
    }
    
    //get number of posts
    public async get_number_posts():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.posts.size);
        return this.storage.posts.size;
    }
    //get fundings each month
    
    //get weekly fundings

    //set vote

    //Send anyway (transaction)

    //XP for each user.
    
    //deadline

    //set verifaction.

    //Set images for posts.

    public async get_posts_of_user(uuid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        let i = 0;
        let posts = [];
        let post_ids = this.storage.users.get(uuid).posts;
        while(i < this.storage.users.get(uuid).posts.length)
        {
            posts.push(this.storage.posts.get(post_ids[i])[0]);
            i++;
        }
        // console.log(posts);
        return posts;
    }
    
    public async get_all_posts():Promise<Array<Object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const post_list: { name: string; id: string, puid : string,type: string, description : string }[] = [];
        var i = 1;
        this.storage.posts.forEach((val: any, key: string) => {
            post_list.push({
                name : val.name,
                id : i.toString(),
                puid : key,
                type : val.post_type,
                description : val.description,
                });
            i+=1;
        });
        return post_list;
    }

    public async get_total_users():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.users.size);
        return this.storage.users.size;
    }
    
    async check_new_user(email):Promise<Boolean>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        if(this.storage.users.get(Base64.encode(email,true))) return false;
        else return true;
    }

    public async send_fund(from_uuid, to_puid,send_amount,comment) {
        const userAddress = await this.wallet.getPKH();
        let flag = true
        if(this.storage == undefined)this.storage = await this.contract.storage();
        try{
            console.log(this.storage.posts.get(to_puid).address)
            await this.taquito.wallet.transfer({to : this.storage.posts.get(to_puid).address , amount : send_amount})
        }
        catch(err){
            flag = false;
            console.error(err);
        }
        if(flag)
        {
            const op = await this.contract.methods
            .add_transaction(send_amount,comment,userAddress,from_uuid,to_puid)
            .send();
            await op.confirmation();
        }
    }

    public async add_new_user(email) {
        const op = await this.contract.methods
        .add_user(email,Base64.encode(email,true))
        .send();
        await op.confirmation();
    }

    public async add_new_post(name,description,institution,post_type,uuid,goal,images) {
        const userAddress = await this.wallet.getPKH();
        if(this.storage == undefined) this.storage = this.contract.storage();
        
        const len = await this.storage.users.get(uuid).posts.length;
        const posts = await this.storage.users.get(uuid);
        var email = atob(uuid);
        const puid = Base64.encode(email+ len.toString(),true);
        // console.log(typeof(images));
        // console.log(images[0]);
        const op = await this.contract.methods
        .add_post(userAddress,description,goal,institution,name,images,post_type,puid,uuid)
        .send();
        await op.confirmation();
    }

    public async is_connected():Promise<boolean>
    {
        let activeAccount;
        if(this.wallet) activeAccount = await this.wallet.client.getActiveAccount();
        else return false;
        if(activeAccount) 
        {
            console.log(activeAccount.address);
            return true;
        }
        else return false;
    }

    public async disconnect_wallet(){
        if(this.wallet)
        {   
            this.wallet.client.destroy();
            this.wallet = undefined;
        }
    };
}