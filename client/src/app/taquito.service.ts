import { Injectable } from '@angular/core';
import { TezosToolkit} from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from "@airgap/beacon-sdk";


@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
    private taquito: TezosToolkit = new TezosToolkit('https://florencenet.smartpy.io/');
    private wallet = new BeaconWallet({ name: 'test' });
    private contract_address = "KT1TGetGC755zfqZ2y2BVFb2YNGvPodN1BxZ";
    

    constructor() {}
    
    public async connect_wallet() {
        await this.wallet.requestPermissions({
            network: {  
                type: NetworkType.FLORENCENET
            }
        });
        this.taquito.setProvider({ wallet: this.wallet });
    }

    public async get_specific_from_transactions(uuid) {
        const userAddress = await this.wallet.getPKH();
        const contract = await this.taquito.wallet.at(this.contract_address);
        const storage = await contract.storage();
        // return storage.transactions.  
    }

    // public async get_specific_to_transactions(email) {
    //     const userAddress = await this.wallet.getPKH();
    //     const contract = await this.taquito.wallet.at(this.contract_address);
    //     const storage = await contract.storage();
    // }

    // public async send_fund(from_uuid, to_puid,send_amount,comment) {
    //     const userAddress = await this.wallet.getPKH();
    //     const contract = await this.taquito.wallet.at(this.contract_address);
    //     const op = await contract.methods
    //     .add_transaction(from_uuid,userAddress,to_puid, send_amount, comment)
    //     .send({
    //     amount: send_amount,
    //     mutez: true
    //     });
    //     await op.confirmation();
    // }

    public async add_new_user(email) {
        const userAddress = await this.wallet.getPKH();
        const contract = await this.taquito.wallet.at(this.contract_address);
        const op = await contract.methods
        .add_user(email,"hash2(email)")
        .send();
        await op.confirmation();
    }

    // public async add_new_post(user_uuid,puid,goal) {
    //     const userAddress = await this.wallet.getPKH();
    //     const contract = await this.taquito.wallet.at(this.contract_address);
    //     const op = await contract.methods
    //     .add_post(userAddress,goal,puid,user_uuid)
    //     .send();
    //     await op.confirmation();
    // }
}