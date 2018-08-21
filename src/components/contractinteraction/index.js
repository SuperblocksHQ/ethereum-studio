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

if (typeof (module) === "undefined") module = {};

var render_item=function(item, item_index, handler, prefix) {
    if(!item.name || item.type!="function") {
        return {html:"",js:""};
    }

    var functionName = item.name;
    var classes="item";
    if(item.constant) {
        classes+=" constant";
    }
    if(item.payable) {
        classes+= " payable";
    }
    if(!item.payable && !item.constant) {
        classes+= " regular";
    }
    var intro=`
<div>
    <h2>`+functionName+`</h2>
</div>
`;
    var html=`<div class="`+classes+`">
`+intro+`
<form id="`+prefix+item.name+`" action="/static/error/404.html" onsubmit="`+handler+`(`+item_index+`, event);return false;">
`;
    var js="";
    var input_value="";

    if(!item.constant || item.payable) {
        input_value+=`
<div class="inputs">
    `;
        if(!item.constant) {
            var id=prefix+item.name+"_gas";
            input_value+=`
    <div class="arguments">
        <div class="btn2">Gas</div>
        <div class="argument">
            <span>Limit</span>
            <input type="text" placeholder="300000" name="`+id+`" id="`+id+`" />
        </div>
`;
            var id=prefix+item.name+"_gasPrice";
            input_value+=`
        <div class="argument">
            <span>Price</span>
            <input type="text" name="`+id+`" id="`+id+`" placeholder="1000000000" />&nbsp;Wei
        </div>
`;
            input_value+=`
    </div>
`;
        }

        if(item.payable) {
            var id=prefix+item.name+"_payable";
            input_value+=`
    <div class="arguments">
        <div class="btn2">Value</div>
        <div class="argument">
            <span>Value</span>
            <input type="text" name="`+id+`" id="`+id+`" placeholder="0" />&nbsp;Wei
        </div>
    </div>
    `;
        }

        input_value+=
`</div>
`;
    }

    var fnArguments="";
    if(item.inputs.length>0) {
        fnArguments += `
<div class="arguments">
    <div class="btn2">Arguments</div>
`;
        for(var index=0;index<item.inputs.length;index++) {
            var input=item.inputs[index];
            var id=prefix+item.name+"__"+input.name;
            fnArguments+=`
    <div class="argument">
        <span>`+input.name+`</span>
        <input type="text" placeholder="(`+input.type+`)" name="`+id+`" id="`+id+`" />
    </div>
`;
        }
        fnArguments += `
</div>
`;
    }

    var returns=`
<div class="returns">
    <div class="btn2">Returns:</div>
`;
    if(!item.constant) {
        // Show tx hash
        returns+=`
<div class="argument">
    <span>Transaction hash</span>
    <span style="width: unset;" id="`+prefix+item.name+`_res"></span>
</div>
`;
    }
    else if(item.outputs.length>0) {
        // Show return values
        for(var index=0;index<item.outputs.length;index++) {
            var output=item.outputs[index];
            var id=prefix+item.name+"_output_"+index;
            returns+=`
    <div class="argument">
        <span>`+output.type+`</span>
        <span style="width: unset;" id="`+id+`"></span>
    </div>
`;
        }
    }

    returns+=`
</div>
`;

    html+=`
<div>
    `+fnArguments+`
    `+input_value+`
    <div class="function">
        <button class="functionName" type="submit">`+functionName+`</button>
    </div>
    `+returns+`
</div>
</div>
</form>
`;
    return {html:html,js:js};
};

var render=function(abi, contract) {
    var intro=`
<div class="item">
    <h1>Interact directly with the deployed contract</h1>
    <h3>All public contract functions are represented as colored buttons below, click them to call the function.</h3>
    <h3>Legend of colors:</h3>
    <div class="constant function" style="margin-bottom:10px;">
        <span class="functionName nohover" style="text-align: center;font-weight:unset;padding: 3px 16px;width: unset; display: inline;" type="submit">Constant</span>
        <span>This is a constant function which runs outside of a transaction and can return one or many values. Running it does not consume any gas nor can it mutate the state of the contract.</span>
    </div>
    <div class="regular function" style="margin-bottom:10px;">
        <span class="functionName nohover" style="text-align: center;font-weight:unset;padding: 3px 16px;width: unset; display: inline;" type="submit">Transaction</span>
        <span>This is a function which always runs inside a transaction. It consumes gas and you cannot send any ether to the function.</span>
        <span>A transaction always only returns a transaction hash, to learn the status of the transaction we must look at the mined transaction.</span>
    </div>
    <div class="payable function" style="margin-bottom:10px;">
        <span class="functionName nohover" style=";text-align: center;font-weight:unset;padding: 3px 16px;width: unset; display: inline;" type="submit">Payable</span>
        <span>This is a payable function which always runs inside a transaction. It consumes gas and you can send ether to the function.</span>
        <span>A transaction always only returns a transaction hash, to learn the status of the transaction we must look at the mined transaction.</span>
    </div>
</div>
`;
    if(abi.length==0) {
        intro += `
<div class="item">
    <h1>This contract has no public functions to interact with</h1>
</div>
`;
    }
    var prefix=contract+"_";
    var renderings=[];
    var html_snippets=[intro];
    var js_snippets=[];
    for(var index=0;index<abi.length;index++) {
        var item=abi[index];
        var o = render_item(item, index, prefix+"Handler", prefix);
        html_snippets.push(o.html);
        js_snippets.push(o.js);
    }

    var js=`var module={};
(function(module, abi, address, provider) {
    const _web3 = new Web3(provider);
    const contract=_web3.eth.contract(abi);
    var instance=contract.at(address);
    var handler = function(index, event) {
        var id=event.target.id;
        const item=abi[index];
        for(var index=0;index<item.outputs.length;index++) {
            var id2=id+"_output_"+index;;
            document.getElementById(id2).textContent="";
        }
        const args=[];
        for(var index=0;index<item.inputs.length;index++) {
            var input=item.inputs[index];
            var id2=id+"__"+input.name;
            args.push(document.getElementById(id2).value);
        }
        if(item.constant) {
        }
        else {
            const accounts=(typeof(web3)!="undefined"?web3.eth.accounts:[]);
            if(accounts.length==0) {
                const msg="There is no account available to do the transaction.";
                alert(msg);
                console.warn(msg);
                return;
            }
            var value=0;
            if(item.payable) {
                value=parseInt(document.getElementById(id+"_payable").value)||0;
            }
            var gas=parseInt(document.getElementById(id+"_gas").value)||"300000";
            var gasPrice=parseInt(document.getElementById(id+"_gasPrice").value)||"1000000000";
            args.push({from: accounts[0], value: value, gas: gas, gasPrice: gasPrice});
        }
        const fn=item.name;
        const cb=(err,res)=>{
            var iserr=false;
            if(res && res.error) {
                // Sometimes we get an error in the result, so we copy it over.
                err=res.error;
            }
            if(err) {
                console.error("Could not interact with contract: ", err);
                iserr=true;
                res=[];
            }
            if(item.outputs.length==0) {
                var id2=id+"_res";
                if(iserr) {
                    res=err;
                }
                document.getElementById(id2).textContent=res.toString();
            }
            else {
                if(! (res instanceof Array)) res=[res];
                for(var index=0;index<item.outputs.length;index++) {
                    var output=item.outputs[index];
                    var id2=id+"_output_"+index;
                    var val=res.shift()
                    var isBool = typeof val =='boolean'
                    var isString = typeof val =='string'
                    var value=val || isBool?val:isString?"(Empty)":iserr?"(ERROR)":"(NO DATA)";
                    if(item.type=="uint256") {
                        value=res.toNumber();
                    }
                    document.getElementById(id2).textContent=value;
                }
            }
        };
        args.push(cb);
        try {
            const res=instance[fn].apply(instance, args);
        }
        catch(e) {
            console.error("Error interacting with contract:", e);
        }
    };
    module.handler=handler;
})(module, Contracts['`+contract+`'].abi, Contracts['`+contract+`'].address,
    (function(endpoint) {
        if(typeof(web3)!="undefined" && web3.currentProvider) return web3.currentProvider;
        return new Web3.providers.HttpProvider(endpoint);
})(Contracts['`+contract+`'].endpoint));
var `+prefix+`Handler=module.handler;
`;
    js_snippets.unshift(js);
    return {html:html_snippets.join("\n"),js:js_snippets.join("\n")};
};

module.exports={
    render: render
};
