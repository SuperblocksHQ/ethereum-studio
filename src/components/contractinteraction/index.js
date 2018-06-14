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

    var classes="";
    if(item.constant) classes+="constant ";
    if(item.payable) classes+="payable ";
    var html=`<div class="`+classes+`">
<form id="`+prefix+item.name+`" action="/static/error/404.html" onsubmit="`+handler+`(`+item_index+`, event);return false;">
`;
    var js="";
    var input_value=`<div class="inputs">
`;
    if(item.payable) {
        var id=prefix+item.name+"_payable";
        input_value+=`<label for="`+id+`">Value to send:</label>
<input type="text" name="`+id+`" id="`+id+`" />&nbsp; Wei<br />
`;
    }
    if(!item.constant) {
        var id=prefix+item.name+"_gas";
        input_value+=`<label for="`+id+`">Gas limit:</label>
<input type="text" name="`+id+`" id="`+id+`" placeholder="300000" /><br />
`;
        var id=prefix+item.name+"_gasPrice";
        input_value+=`<label for="`+id+`">Gas price:</label>
<input type="text" name="`+id+`" id="`+id+`" placeholder="1000000000" />&nbsp; Wei<br />
`;
    }

    if(item.inputs.length>0 || item.payable) {
        for(var index=0;index<item.inputs.length;index++) {
            var input=item.inputs[index];
            var id=prefix+item.name+"__"+input.name;
            html+=`    <label for="`+id+`">`+input.name+` (`+input.type+`)</label>
    <input type="text" name="`+id+`" id="`+id+`" /><br />
`;
        }
    }

    input_value+=`</div>
`;
    html+=input_value;

    if(!item.constant) {
        html+=` Tx hash:&nbsp;<span id="`+prefix+item.name+`_res"></span><br />
`;
    }

    html+=`<input type="submit" value="`+item.name+`" /><br />
`;

    if(item.outputs.length>0) {
        html+=`<div class="outputs">
`;
        for(var index=0;index<item.outputs.length;index++) {
            var output=item.outputs[index];
            var id=prefix+item.name+"_output_"+index;
            html+=`    <label for="`+id+`">`+output.name+` (`+output.type+`)</label>
    <input placeholder="(output)" disabled type="text" name="`+id+`" id="`+id+`" /><br />
`;
        }
        html+=`</div>
`;
    }

    html=html+`</form>
</div>
`;

    return {html:html,js:js};
};

var render=function(abi, contract) {
    var prefix=contract+"_";
    var renderings=[];
    var html_snippets=[];
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
            document.getElementById(id2).value="";
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
            if(err) {
                console.error("Could not get data from contract: ", err);
                iserr=true;
                res=[];
            }
            if(item.outputs.length==0) {
                var id2=id+"_res";
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
                    document.getElementById(id2).value=value;
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
    }
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
