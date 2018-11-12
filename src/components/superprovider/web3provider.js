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

'use strict';
window.DevKitProvider = {};
(function(module) {
    const _queue = [];
    const _pending = {};
    var _msgCounter = 0;
    var parentWindow;
    const onMsg = event => {
        if (event.origin !== ORIGIN) {
            return;
        }

        if (typeof event.data != 'object') {
            console.warn('Data not object.');
            return;
        }

        if (event.data.type == 'init') {
            parentWindow = {
                window: event.source,
                origin: event.origin,
                channel: event.data.channel,
            };
            postMessage({ type: 'ack', channel: parentWindow.channel });
        } else if (parentWindow && event.data.channel == parentWindow.channel) {
            const data = event.data;
            if (data.type == 'reply') {
                if (_pending[data.id]) {
                    const cb = _pending[data.id];
                    delete _pending[data.id];
                    cb(data.payload.err, data.payload.res);
                }
            } else {
                console.warn('Data type unknown.');
                return;
            }
        } else {
            console.warn('Parent window sending on wrong channel.', event);
            return;
        }
    };
    var queueMsg = (payload, endpoint, callback) => {
        _queue.push({
            payload: payload,
            endpoint: endpoint,
            callback: callback,
        });
        _runQueue();
    };
    const _runQueue = () => {
        if (parentWindow == null) {
            setTimeout(_runQueue, 500);
            return;
        }
        while (_queue.length > 0) {
            const msg = _queue.pop();
            msg.id = _msgCounter++;
            msg.channel = parentWindow.channel;
            _pending[msg.id] = msg.callback;
            delete msg.callback;
            postMessage(msg);
        }
    };
    const postMessage = msg => {
        parentWindow.window.postMessage(msg, parentWindow.origin);
    };
    var provider = function(endpoint, timeout, user, password, headers) {
        this.endpoint = endpoint;
        this.timeout = timeout || 0;
        this.user = user;
        this.password = password;
        this.headers = headers;
        this.vendor = 'Superblocks';

        return this;
    };
    provider.prototype.prepareRequest = function(async) {
        throw 'Not implemented.';
    };
    provider.prototype.send = function(a, b, c) {
        if (a && a.method == 'eth_uninstallFilter') {
            this.sendAsync(
                { method: 'eth_uninstallFilter', id: a.id, params: a.params },
                (a, b) => {}
            );
            return { id: a.id, jsonrpc: a.jsonrpc, result: true };
        } else {
            throw 'Synchronous tx posting is not supported by Superblocks Lab EVM: ' +
                a.method;
        }
    };
    provider.prototype.isConnected = function() {
        return true;
    };
    provider.prototype.sendAsync = function(payload, callback) {
        queueMsg(payload, this.endpoint, callback);
    };
    module.onMsg = onMsg;
    module.provider = provider;
})(DevKitProvider);
window.addEventListener('message', DevKitProvider.onMsg);
