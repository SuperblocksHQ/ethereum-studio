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

import { h, render } from 'preact';

export default class EVM {
    constructor(props) {
        this.props=props;
        this.id=props.id+"_evm";
        this._queue=[];
        this.ref=null;
        this._counter=0;
        this._cbMap={};

        var setRef = (ref)=>{
            this.ref=ref;
            var cb;
            cb = () => {
                if(this.isLoaded()) {
                    this.ref.contentWindow.queueMessageReply=this._response;
                }
                else {
                    setTimeout(cb, 100);
                }
            };
            cb();
        };

        render((
            <div style="display:none;" id={this.id}>
                <iframe ref={setRef} src="/evm/index-v5.html" frameborder="0"></iframe>
            </div>
        ), document.body);

        // This is temmporarily that we share an object with the iframe.
        // We should pass messages to it so that the interface can be "webworked" in the future.
        this.queue({},(result)=>{
            this.devkitVm=result.devkitVm;
            this.provider= new this.devkitVm.Provider(this.devkitVm);
            this.devkitVm.setBalance("0xa48f2e0be8ab5a04a5eb1f86ead1923f03a207fd", "0x10000000000000000");
            this.devkitVm.setBalance("0x95c2332b26bb22153a689ae619d81a6c59e0a804", "0x10000000000000000");
            this.devkitVm.setBalance("0x96a893548257af28a362015e70a95cf6f4ddf56f", "0x10000000000000000");
            this.devkitVm.setBalance("0xa48f2e0be8ab5a04a5eb1f86ead1923f03a207fd", "0x10000000000000000");
            this.devkitVm.setBalance("0x105e8df6456765bf8f0f360b66ed86d9ace92363", "0x10000000000000000");
            console.log("[VM] ready");
        });

        setInterval(this._processQueue, 100);
    }

    // Return a web3 provider which asynchronously works together with the iframe.
    // However, right now it directly uses the devkitVms provider.
    getProvider=()=>{
        return this.provider;
    };

    _response = (msg) => {
        if(this._cbMap[msg.id]) {
            const cb=this._cbMap[msg.id];
            delete this._cbMap[msg.id];
            cb(msg.data);
        }
    };

    queue = (cmd, cb) => {
        const id=++this._counter;
        this._cbMap[id]=cb;
        this._queue.push({data:cmd, id:id});
    };

    isLoaded = () => {
        return this.ref && this.ref.contentWindow && this.ref.contentWindow.queueMessage;
    };

    isReady = () => {
        return this.isLoaded() && this.ref.contentWindow.queueMessageReply;
    };

    _processQueue = () => {
        if(this._processBusy) return;
        this._processBusy=true;
        if(this.isReady() && this._queue.length>0) {
            this.ref.contentWindow.queueMessage(this._queue.pop());
        }
        this._processBusy=false;
    };
}
