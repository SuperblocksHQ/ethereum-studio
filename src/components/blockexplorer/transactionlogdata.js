// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import Web3 from 'web3';

export default class TransactionLogData {
    constructor(props) {
        this.props=props;

        this._web3s={};
        this._transactions=[];
        console.log(this.addTx);
    }

    transactions=()=>{
        return this._transactions;
    };

    addTx=(data)=>{
        const tx={
            hash: data.hash,
            network: data.network,
            origin: data.origin||"Studio",
            context: data.context,
            obj: null,
            receipt: null,  // This will be filled when tx has been mined.
        };
        this._transactions.unshift(tx);
        this._fillData(tx);
    };

    // Fill the tx with data and final receipt
    // Issue a rerender when new data has arrived.
    _fillData=tx=>{
        this._getTxObj(tx, (obj)=>{
            console.log("tx obj", obj);
            tx.obj=obj;
            //this.setState();
            this._getTxReceipt(tx, (receipt)=>{
                console.log("tx receipt", receipt);
                tx.receipt=receipt;
                //this.setState();
            });
        });
    };

    // Get the (pending) tx obj.
    _getTxObj=(tx, cb)=>{
        const web3=this._getWeb3(tx.network);
        web3.eth.getTransaction(tx.hash,(err,res)=>{
            if(err || !res) {
                setTimeout(()=>{this._getTxObj(tx, cb)},1000);
            }
            else  {
                cb(res);
            }

        });
    };

    // Get the receipt.
    _getTxReceipt=(tx, cb)=>{
        const web3=this._getWeb3(tx.network);
        web3.eth.getTransactionReceipt(tx.hash,(err,res)=>{
            if(err || !res || !res.blockHash) {
                setTimeout(()=>{this._getTxReceipt(tx, cb)},5000);
            }
            else  {
                cb(res);
            }
        });
    };

    _getWeb3=(network)=>{
        if(this._web3s[network]) return this._web3s[network];
        const endpoint=this.props.functions.networks.endpoints[network].endpoint;
        var provider;
        if(endpoint.toLowerCase()=="http://superblocks-browser") {
            provider=this.props.functions.EVM.getProvider();
        }
        else {
            var provider=new Web3.providers.HttpProvider(endpoint);
        }
        var web3=new Web3(provider);
        this._web3s[network]=web3;
        return web3;
    };
}
