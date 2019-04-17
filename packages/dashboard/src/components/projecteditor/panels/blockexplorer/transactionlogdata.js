// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import Web3 from 'web3';

export default class TransactionLogData {
    constructor(props) {
        this.props = props;

        this._web3s = {};
        this._transactions = [];
        this._addressMappingAccounts = {};
        this._addressMappingContracts = {};
    }

    transactions = network => {
        return this._transactions.filter(item => {
            return item.network == network;
        });
    };

    _getNames = network => {
        // Get a fresh list of account and contract names and addresses for the given network.
        // TODO:
        //const dappfile = this.props.project.props.state.data.dappfile;
        //if (dappfile) {
        //const accounts = dappfile.accounts();
        //console.log("got accounts", accounts);
        //accounts.map((account) => {
        //dappfile.getItem("accounts", {name:account.name}, network);
        //});
        //}
    };

    accounts = network => {
        return this._addressMappingAccounts[network] || {};
    };

    contracts = network => {
        return this._addressMappingContracts[network] || {};
    };

    addTx = data => {
        const tx = {
            ts: Date.now(),
            hash: data.hash,
            contract: data.contract, // the name of the contract when deploying
            network: data.network,
            origin: data.origin || 'Superblocks Lab',
            context: data.context,
            deployArgs: data.deployArgs, // When Superblocks Lab deploys a contract we can simply save the constructor arguments.
            obj: null,
            objTS: null, // Timestamp when transaction object become available.
            receipt: null, // This will be filled when tx has been mined.
            receiptTS: null, // Timestamp when receipt become available.
            state: {}, // Local state data for displaying the tx.
        };
        this._transactions.unshift(tx);
        this._fillData(tx);
        this._getNames(tx.network);
    };

    // Fill the tx with tx obj and then final receipt
    _fillData = tx => {
        this._getTxObj(tx, obj => {
            tx.obj = obj;
            tx.objTS = Date.now();
            this._getTxReceipt(tx, receipt => {
                tx.receipt = receipt;
                tx.receiptTS = Date.now();
            });
        });
    };

    // Get the (pending) tx obj.
    _getTxObj = (tx, cb) => {
        const web3 = this._getWeb3(tx.network);
        web3.eth.getTransaction(tx.hash, (err, res) => {
            if (err || !res) {
                setTimeout(() => {
                    this._getTxObj(tx, cb);
                }, 1000);
            } else {
                cb(res);
            }
        });
    };

    // Get the receipt.
    _getTxReceipt = (tx, cb) => {
        const web3 = this._getWeb3(tx.network);
        web3.eth.getTransactionReceipt(tx.hash, (err, res) => {
            if (err || !res || !res.blockHash) {
                setTimeout(() => {
                    this._getTxReceipt(tx, cb);
                }, 5000);
            } else {
                cb(res);
            }
        });
    };

    _getWeb3 = network => {
        if (this._web3s[network]) return this._web3s[network];
        const endpoint = this.props.functions.networks.endpoints[network]
            .endpoint;
        var provider;
        if (endpoint.toLowerCase() == 'http://superblocks-browser') {
            provider = this.props.functions.EVM.getProvider();
        } else {
            var provider = new Web3.providers.HttpProvider(endpoint);
        }
        var web3 = new Web3(provider);
        this._web3s[network] = web3;
        return web3;
    };
}
