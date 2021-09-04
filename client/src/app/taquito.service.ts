import { Injectable } from '@angular/core';
import { MichelsonMap, TezosToolkit} from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from "@airgap/beacon-sdk";
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';


@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
    private taquito: TezosToolkit = new TezosToolkit('https://florencenet.smartpy.io/');
    private wallet;
    private contract_address = "KT1VZoraKP7md8fLVBojL9RbrHNw4HLNRJGU";
    private storage = undefined;
    private contract = undefined;
    constructor() {}
    
    public async set_contract() {
        this.contract = await this.taquito.wallet.at(this.contract_address);
        this.storage = await this.contract.storage();
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

    public async get_specific_from_transactions(uuid):Promise<Array<object>> {        
        if(this.storage == undefined) this.storage = await this.contract.storage();
        console.log(this.storage.transactions.get(uuid)[0]);
        return this.storage.transactions.get(uuid)[0];
    }

    public async get_specific_to_transactions(puid):Promise<Array<object>> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        console.log(this.storage.transactions.get(puid)[0]);
        return this.storage.transactions.get(puid)[0];
    }
    
    public async get_all_transactions():Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        const transactions_list: { uuid: string; transaction: number }[] = [];
        this.storage.transactions.forEach((val: number, key: string) => {
            transactions_list.push({ uuid: key, transaction: val });
        });
        console.log(transactions_list[0]);
        return this.storage.transactions;
    }

    //get user
    public async get_user(uuid):Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        console.log(this.storage.users.get(uuid));
        return this.storage.users.get(uuid);
    }
    // get post
    public async get_post(puid):Promise<object>{
        if(this.storage == undefined) this.storage = await this.contract.storage();
        console.log(this.storage.posts[puid]);
        return this.storage.posts[puid];
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

    //get QR

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

    public async get_all_posts():Promise<object> {
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.posts);
        return this.storage.posts;
    }

    public async get_total_users():Promise<number>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        // console.log(this.storage.users.size);
        return this.storage.users.size;
    }
    
    async check_new_user(email):Promise<Boolean>{
        if(this.storage == undefined)this.storage = await this.contract.storage();
        if(this.storage.users.get(btoa(email))) return true;
        else return false;
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
        .add_user(email,"hash2(email)")
        .send();
        await op.confirmation();
    }

    public async add_new_post(name,description,institution,post_type,user_uuid,puid,goal) {
        const userAddress = await this.wallet.getPKH();
        console.log(userAddress,description,goal,institution,name,post_type,puid,user_uuid);
        const op = await this.contract.methods
        .add_post(userAddress,description,goal,institution,name,post_type,puid,user_uuid)
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