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

(function (Module) {
    var compiler;
    var _replyMessage = (msg, data) => {
        // Send msg to parent.
        if(window.queueMessageReply) {
            setTimeout(()=>{window.queueMessageReply({data:data,id:msg.id})},1);
        }
    };
    var _queueMessage = (msg) => {
        // Got msg from parent.
        var cmd=msg.data;
        const resolveCb=(filepath)=>{
            console.log('[compiler] import file ' + filepath);
            if(cmd.files[filepath]) {
                return {contents:cmd.files[filepath]};
            }
            return {error: 'I searched the bottoms of the Oceans... The slopes of the Mountains... The dark side of the Moon... Under the Oak where you were born... But no where could you be found.'};
        };
        console.log("[compiler] start compiling.");
        var result;
        for(var tries=2;tries>=0;tries--) {
            try {
                result = compiler.compileStandardWrapper(cmd.input, resolveCb);
            }
            catch(e) {
                if(tries==0) {
                    console.error("[compiler]", e);
                    replyMessage(msg, false);
                    return;
                }
                else {
                    // Try again.
                    console.log("[compiler] slipped, trying again.");
                    continue;
                }
            }
            replyMessage(msg, result);
        }
    };
    var solc = require('solc/wrapper');
    compiler = solc(Module);
    // Let's warm up the compiler
    try {
        compiler.compile("pragma solidity ^0.4.20;contract dummy{}");
    } catch(e) {
        console.log("[compiler] needed warming up.");
    }
    window._solcCompiler=compiler;
    window.replyMessage=_replyMessage;
    window.queueMessage=_queueMessage;
})(window.Module);
