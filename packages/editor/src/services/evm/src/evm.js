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

// Ethereum
const abi = require('ethereumjs-abi');
const Account = require('ethereumjs-account');
const Block = require('ethereumjs-block');
const BlockHeader = require('ethereumjs-block/header.js');
const Blockchain = require('ethereumjs-blockchain');
const Transaction = require('ethereumjs-tx');
const utils = require('ethereumjs-util');
const VM = require('ethereumjs-vm');
const Trie = require('merkle-patricia-tree');
const BigNumber = require('bignumber.js');
const Web3Utils = require('web3-utils');
const BN = require('bn.js');
// Other
const Buffer = require('safe-buffer').Buffer;

//
// Data
var _vm;
var _debug;
var _debugEVM = false;
var _blocks = [];
var _transactions = {};
var _transactionReceipts = {};
var _accounts = {};
var _coinbase = null;
var _gasPrice = '0x3B9ACA00'; // 1 GWei
var _currentFilterId = 1;
var _latestBlockHash;
var _latestPendingTransactionHash;
var _installedFilters = {};

//
// Internal operations
//
function _callback(callback) {
    if (typeof callback === 'undefined') {
        return function(err, result) {
            if (err) {
                return err;
            } else {
                return result;
            }
        };
    }
    return callback;
}

function _debugLog() {
    if (_debug) {
        console.log.apply(console, arguments);
    }
}

function _pad(data) {
    return data.length % 2 === 0 ? data : '0' + data;
}

//
// Web3.js provider
//
var DevkitProvider = function(devkitVm) {
    this.devkitVm = devkitVm;
};

DevkitProvider.prototype.request = function(data, callback) {
    // unpack
    if (Object.prototype.toString.call(data) === '[object Array]') {
        var results = [];
        for (var i = 0; i < data.length; i += 1) {
            results.push(this.request(data[i]));
        }
        return callback(null, results);
    }

    var fn = this[data.method];
    var args = data.params || [];

    if (callback) {
        var thisProvider = this;
        args.push(function(err, res) {
            return callback(err, thisProvider.response(data, res));
        });
    }

    var result = fn.apply(this, args);
    return this.response(data, result);
};

DevkitProvider.prototype.response = function(data, result) {
    return {
        id: data.id,
        jsonrpc: '2.0',
        result: result,
    };
};

DevkitProvider.prototype.send = function(payload) {
    return this.request(payload);
};

DevkitProvider.prototype.sendAsync = function(payload, callback) {
    return this.request(payload, callback);
};

//
// web3
DevkitProvider.prototype.web3_clientVersion = function(callback) {
    callback = _callback(callback);
    var agent = navigator.userAgent;
    return callback(null, 'DevkitVM/v0.3.0/' + agent);
};

DevkitProvider.prototype.web3_isConnected = function() {
    return true;
};

//
// web3.bzz
function _bzz_unsupported() {
    console.error('Swarm operations are not supported in devkit');
    return null;
}

DevkitProvider.prototype.bzz_blockNetworkRead = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_download = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_get = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_hive = function(callback) {
    var errorMessage = 'Swarm operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.bzz_info = function(callback) {
    var errorMessage = 'Swarm operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.bzz_modify = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_put = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_retrieve = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_store = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_swapEnabled = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_syncEnabled = function() {
    return _bzz_unsupported();
};

DevkitProvider.prototype.bzz_upload = function() {
    return _bzz_unsupported();
};

//
// web3.db
function _db_unsupported(status) {
    console.error('DB operations are not supported in devkit');
    return status;
}

DevkitProvider.prototype.db_getHex = function(db, key) {
    return _db_unsupported(null);
};

DevkitProvider.prototype.db_getString = function(db, key) {
    return _db_unsupported(null);
};

DevkitProvider.prototype.db_putHex = function(db, key, value) {
    return _db_unsupported(false);
};

DevkitProvider.prototype.db_putString = function(db, key, value) {
    return _db_unsupported(false);
};

//
// web3.eth
function _unlockedSend_unsupported(callback) {
    var errorMessage =
        'Send operations with unlocked accounts are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
}

DevkitProvider.prototype.eth_accounts = function(callback) {
    callback = _callback(callback);
    return callback(null, this.devkitVm.getAccounts());
};

DevkitProvider.prototype.eth_blockNumber = function(callback) {
    callback = _callback(callback);
    return callback(null, this.devkitVm.blockNumber());
};

DevkitProvider.prototype.eth_coinbase = function(callback) {
    callback = _callback(callback);
    return callback(null, this.devkitVm.getCoinbase());
};

DevkitProvider.prototype.eth_compileLLL = function(sourceString, callback) {
    var errorMessage = 'Compiling operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.eth_compileSerpent = function(sourceString, callback) {
    var errorMessage = 'Compiling operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.eth_compileSolidity = function(
    sourceString,
    callback
) {
    var errorMessage = 'Compiling operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.eth_estimateGas = function(callObject, callback) {
    return this.devkitVm.estimateGas(callObject, callback);
};

DevkitProvider.prototype.eth_gasPrice = function(callback) {
    callback = _callback(callback);
    return callback(null, _gasPrice);
};

DevkitProvider.prototype.eth_hashrate = function(callback) {
    callback = _callback(callback);
    return callback(null, '0x0');
};

DevkitProvider.prototype.eth_mining = function(callback) {
    callback = _callback(callback);
    return callback(null, false);
};

DevkitProvider.prototype.eth_syncing = function(callback) {
    callback = _callback(callback);
    return callback(null, false);
};

DevkitProvider.prototype.eth_getBalance = function(
    address,
    defaultBlock,
    callback
) {
    // TODO: implement defaultBlock (block number)
    return this.devkitVm.getBalance(address, callback);
};

DevkitProvider.prototype.eth_getBlockByNumber = function(
    blockNumber,
    returnTransactionObjects,
    callback
) {
    return this.devkitVm.getBlock(
        blockNumber,
        returnTransactionObjects,
        callback
    );
};

DevkitProvider.prototype.eth_getBlockByHash = function(
    blockHash,
    returnTransactionObjects,
    callback
) {
    return this.devkitVm.getBlockByHash(
        blockHash,
        returnTransactionObjects,
        callback
    );
};

DevkitProvider.prototype.eth_getBlockTransactionCountByNumber = function(
    blockNumber,
    callback
) {
    return this.devkitVm.getBlockTransactionCount(blockNumber, callback);
};

DevkitProvider.prototype.eth_getBlockTransactionCountByHash = function(
    blockHash,
    callback
) {
    return this.devkitVm.getBlockTransactionCountByHash(blockHash, callback);
};

DevkitProvider.prototype.eth_getCompilers = function(callback) {
    var errorMessage = 'Compiling operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.eth_getStorageAt = function(
    addressHexString,
    position,
    defaultBlock,
    callback
) {
    // TODO: implement defaultBlock (block number)
    return this.devkitVm.getStorageAt(addressHexString, position, callback);
};

DevkitProvider.prototype.eth_getWork = function(callback) {
    console.error('Proof-of-work operations are not supported in devkit');
    return null;
};

DevkitProvider.prototype.eth_submitWork = function(
    powHash,
    seedHash,
    target,
    callback
) {
    console.error('Proof-of-work operations are not supported in devkit');
    return null;
};

DevkitProvider.prototype.eth_getUncleCountByBlockNumber = function(
    blockNumber,
    callback
) {
    return this.devkitVm.getBlockUncleCount(blockNumber, callback);
};

DevkitProvider.prototype.eth_getUncleCountByBlockHash = function(
    blockHash,
    callback
) {
    return this.devkitVm.getBlockUncleCountByBlockHash(blockHash, callback);
};

DevkitProvider.prototype.eth_getTransactionByHash = function(
    transactionHash,
    callback
) {
    return this.devkitVm.getTransaction(transactionHash, callback);
};

DevkitProvider.prototype.eth_getTransactionByBlockNumberAndIndex = function(
    blockNumber,
    transactionIndex,
    callback
) {
    return this.devkitVm.getTransactionByBlock(
        blockNumber,
        transactionIndex,
        callback
    );
};

DevkitProvider.prototype.eth_getTransactionByBlockHashAndIndex = function(
    blockNumber,
    transactionIndex,
    callback
) {
    return this.devkitVm.getTransactionByBlockHash(
        blockNumber,
        transactionIndex,
        callback
    );
};

DevkitProvider.prototype.eth_sendTransaction = function(
    transactionObject,
    callback
) {
    return _unlockedSend_unsupported(callback);
};

DevkitProvider.prototype.eth_sign = function(address, dataToSign, callback) {
    return _unlockedSend_unsupported(callback);
};

DevkitProvider.prototype.eth_signTransaction = function(
    transactionObject,
    callback
) {
    return _unlockedSend_unsupported(callback);
};

DevkitProvider.prototype.eth_sendRawTransaction = function(
    signedTransactionData,
    callback
) {
    callback = _callback(callback);
    return this.devkitVm.sendRawTransaction(signedTransactionData, callback);
};

DevkitProvider.prototype.eth_getTransactionCount = function(
    addressHexString,
    defaultBlock,
    callback
) {
    // TODO: implement defaultBlock (block number)
    return this.devkitVm.getTransactionCount(addressHexString, callback);
};

DevkitProvider.prototype.eth_getTransactionReceipt = function(
    hashString,
    callback
) {
    callback = _callback(callback);
    return callback(null, this.devkitVm.getTransactionReceipt(hashString));
};

DevkitProvider.prototype.eth_getUncleByBlockNumberAndIndex = function(
    blockNumber,
    uncleNumber,
    callback
) {
    return this.devkitVm.getUncle(blockNumber, uncleNumber, callback);
};

DevkitProvider.prototype.eth_getUncleByBlockHashAndIndex = function(
    blockHash,
    uncleNumber,
    callback
) {
    return this.devkitVm.getUncleByHash(blockHash, uncleNumber, callback);
};

DevkitProvider.prototype.eth_getCode = function(
    address,
    defaultBlock,
    callback
) {
    // TODO: implement defaultBlock (block number)
    return this.devkitVm.getCode(address, callback);
};

DevkitProvider.prototype.eth_call = function(
    callObject,
    defaultBlock,
    callback
) {
    // TODO: implement defaultBlock (block number)
    return this.devkitVm.call(callObject, callback);
};

DevkitProvider.prototype.eth_protocolVersion = function(callback) {
    callback = _callback(callback);
    return callback('Ethereum protocol version is unknown', null);
};

DevkitProvider.prototype.eth_newBlockFilter = function(callback) {
    _currentFilterId += 1;

    var filterId = utils.addHexPrefix(utils.intToHex(_currentFilterId));
    var filterData = {};
    filterData.type = 'latestBlock';
    filterData.data = null;
    filterData.confirmed = 1;
    _installedFilters[_currentFilterId] = filterData;

    callback = _callback(callback);
    return callback(null, _currentFilterId);
};

DevkitProvider.prototype.eth_getFilterChanges = function(filterId, callback) {
    var result = [];

    // TODO: FIXME: web3 polling system may try to still enter after uninstall
    //              start/stopPolling is apparently only controlled by web3
    //              when using event filters
    if (_installedFilters[filterId]) {
        if (
            _installedFilters[filterId].type == 'latestBlock' ||
            _installedFilters[filterId].type == 'pendingTransaction'
        ) {
            var hash = _installedFilters[filterId].data;
            if (hash !== null) {
                //                console.log("[Filter] updating block filter with id: " + filterId);
                if (_installedFilters[filterId].confirmed == 1) {
                    result.push(hash);
                    _installedFilters[filterId].data = null;
                    _installedFilters[filterId].confirmed = 0;
                }
            }
        } else if (_installedFilters[filterId].type == 'filterOptions') {
            var options = _installedFilters[filterId].data;
            if (options !== null) {
                //                console.log("[Filter] updating filter with id: " + filterId);
                if (_installedFilters[filterId].confirmed == 1) {
                    _installedFilters[filterId].confirmed = 0;
                    result = this.devkitVm.getLogs(options);
                }
            }
        } else {
            console.warn('Unknown filter. Skipping...');
        }
    }

    callback = _callback(callback);
    return callback(null, result);
};

DevkitProvider.prototype.eth_uninstallFilter = function(filterId, callback) {
    console.log('[Filter] uninstalling filterId: ' + filterId);
    callback = _callback(callback);
    if (_installedFilters[filterId]) {
        delete _installedFilters[filterId];
        return callback(null, true);
    } else {
        return callback(null, false);
    }
};

DevkitProvider.prototype.eth_newPendingTransactionFilter = function(callback) {
    _currentFilterId += 1;

    var filterId = utils.addHexPrefix(utils.intToHex(_currentFilterId));
    var filterData = {};
    filterData.type = 'pendingTransaction';
    filterData.data = null;
    filterData.confirmed = 0;
    _installedFilters[_currentFilterId] = filterData;

    callback = _callback(callback);
    return callback(null, _currentFilterId);
};

DevkitProvider.prototype.eth_newFilter = function(filterOptions, callback) {
    _currentFilterId += 1;

    if (!filterOptions.fromBlock) {
        filterOptions.fromBlock = 'latest';
    }
    if (!filterOptions.toBlock) {
        filterOptions.toBlock = 'latest';
    }

    var filterId = utils.addHexPrefix(utils.intToHex(_currentFilterId));
    var filterData = {};
    filterData.type = 'filterOptions';
    filterData.data = filterOptions;
    filterData.confirmed = 0;
    _installedFilters[_currentFilterId] = filterData;

    callback = _callback(callback);
    return callback(null, _currentFilterId);
};

DevkitProvider.prototype.eth_getLogs = function(filterOptions, callback) {
    callback = _callback(callback);
    return callback(null, this.devkitVm.getLogs(filterOptions));
};

DevkitProvider.prototype.eth_getFilterLogs = function(filterId, callback) {
    if (_installedFilters[filterId].type == 'filterOptions') {
        var filterOptions = _installedFilters[filterId].data;
        callback = _callback(callback);
        return callback(null, this.devkitVm.getLogs(filterOptions));
    } else {
        return callback('Unknown filter type. Skipping...');
    }
};

//
// web3.net
DevkitProvider.prototype.net_listening = function(callback) {
    callback = _callback(callback);
    return callback(null, true);
};

DevkitProvider.prototype.net_peerCount = function(callback) {
    callback = _callback(callback);
    return callback(null, 0);
};

DevkitProvider.prototype.net_version = function(callback) {
    callback = _callback(callback);
    return callback(null, 333);
};

//
// web3.personal
function _personal_unsupported() {
    console.error('Personal operations are not supported in devkit');
    return null;
}

DevkitProvider.prototype.personal_ecRecover = function(message, signature) {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_importRawKey = function(keydata, passphrase) {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_listAccounts = function(callback) {
    var errorMessage = 'Personal operations are not supported in devkit';
    if (typeof callback === 'undefined') {
        console.error(errorMessage);
        return null;
    } else {
        return callback(errorMessage, null);
    }
};

DevkitProvider.prototype.personal_lockAccount = function(address) {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_newAccount = function() {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_sendTransaction = function(tx, passphrase) {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_sign = function(message, account, password) {
    return _personal_unsupported();
};

DevkitProvider.prototype.personal_unlockAccount = function(
    address,
    passphrase,
    duration
) {
    return _personal_unsupported();
};

//
// web3.shh
function _shh_unsupported() {
    console.error('Shh operations are not supported in devkit');
    return null;
}

DevkitProvider.prototype.shh_addPrivateKey = function(privateKey) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_addSymKey = function(symKey) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_deleteKeyPair = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_deleteSymKey = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_generateSymKeyFromPassword = function(password) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_getPrivateKey = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_getPublicKey = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_getSymKey = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_hasKeyPair = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_hasSymKey = function(id) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_info = function() {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_markTrustedPeer = function(enode) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_newKeyPair = function() {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_newSymKey = function() {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_post = function(object) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_setMaxMessageSize = function(size) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_setMinPoW = function(pow) {
    return _shh_unsupported();
};

DevkitProvider.prototype.shh_version = function() {
    return _shh_unsupported();
};

//
// Public API
//
function init(callback, debug = true) {
    if (debug === undefined || !debug) {
        _debug = false;
    } else if (debug) {
        _debug = true;
        _debugLog('[Debug] mode is enabled (' + debug + ')');
    }

    //
    // Blockchain
    // In-memory database
    var blockchain;
    blockchain = new Blockchain({ validate: false });
    _debugLog('[Blockchain] initialized');

    //
    // VM
    // In-memory VM
    // TODO: load from existing geth/chaindata
    // i.e.: new Trie(levelup(leveldown('geth/chaindata')));
    var vmState = new Trie();
    _vm = new VM({ state: vmState, blockchain: blockchain });
    _vm.on('beforeTx', function(tx) {
        _debugLog(
            '[Transaction] preparing to run nonce: ' +
                decode('uint', tx.nonce).toString('hex')
        );
        tx._homestead = true;
    });
    _vm.on('beforeBlock', function(block) {
        _debugLog('[Block] preparing to run...');
        //        _debugLog(block);
        block.header.isHomestead = function() {
            return true;
        };
        block.uncleHeaders.forEach(function(uncle) {
            uncle.isHomestead = function() {
                return true;
            };
        });
    });
    if (_debugEVM) {
        _vm.on('step', function(data) {
            _debugLog(
                data.opcode.name + ' (' + data.gasLeft.toString('hex') + ')'
            );
        });
    }

    _debugLog('[VM] initialized');
    if (_debug) {
        if (typeof window !== 'undefined') {
            window.devkitVm_debug = _vm;
        }
        _debugLog('[Debug] VM symbol available: devkitVm_debug');
    }

    //
    // Genesis
    // TODO: load from genesis.json
    // consider: _vm.stateManager.generateGenesis(genesisData, cb)
    //           _vm.stateManager.generateCanonicalGenesis(cb)
    var genesisBlock = new Block();
    genesisBlock.setGenesisParams();
    _vm.blockchain.putGenesis(genesisBlock, callback);
    _blocks.push(genesisBlock);
    _latestBlockHash = utils.addHexPrefix(genesisBlock.hash().toString('hex'));
    _debugLog(
        '[Block] genesis hash: ' +
            utils.addHexPrefix(genesisBlock.hash().toString('hex'))
    );

    // Preallocate account used for call()
    // TODO: move to general purpose addAccount
    var key =
        '79e8817a0b150357a5c30964e2d8b551da038a84d855687222b3bc581730df6e';
    var address = '0x620cbab1f950e38a964d02ddcf85ecfcbb9f468f';
    var accountData = {
        secretKey: key,
        publicKey: utils.privateToPublic(new Buffer(key, 'hex')),
        address: address,
        //account: account
    };
    _accounts[address] = accountData;
    _coinbase = address;
}

function sign(data, privateKey) {
    data = utils.addHexPrefix(data);
    var tx = new Transaction({
        from: data.from,
        to: data.to,
        nonce: data.nonce,
        gasPrice: data.gasPrice ? data.gasPrice : _gasPrice,
        gasLimit: data.gasLimit,
        data: data.data,
        value: data.value,
    });
    tx.sign(Buffer.from(privateKey, 'hex'));
    _debugLog(
        '[Account] Signed transaction base fee: ' +
            tx.getBaseFee().toString() +
            ' wei. Up front gas requirement: ' +
            tx.getUpfrontCost().toString() +
            ' wei.'
    );
    return utils.addHexPrefix(tx.serialize().toString('hex'));
}

function sendRawTransaction(data, callback) {
    var tx = new Transaction(data);
    _debugLog(
        '[Transaction] sending raw data from [' +
            utils.addHexPrefix(tx.from.toString('hex')) +
            '] to [' +
            utils.addHexPrefix(tx.to.toString('hex')) +
            ']'
    );

    _vm.blockchain.getHead(function(err, block) {
        var timeNowInSeconds = Math.floor(Date.now() / 1000);
        var nextBlock = new Block();
        nextBlock.header.number = blockNumber() + 1;
        nextBlock.header.difficulty = block.header.difficulty;
        nextBlock.header.parentHash = block.hash();
        nextBlock.header.timestamp = new Buffer(
            _pad(timeNowInSeconds.toString(16)),
            'hex'
        );
        nextBlock.transactions.push(tx);

        var transactionHash = utils.bufferToHex(tx.hash());
        _transactions[transactionHash] = tx;

        _debugLog(
            '[Block] next hash: ' +
                utils.addHexPrefix(nextBlock.hash().toString('hex'))
        );
        _latestBlockHash = utils.addHexPrefix(nextBlock.hash().toString('hex'));
        _latestPendingTransactionHash = utils.addHexPrefix(transactionHash);
        var filterKey;
        for (filterKey in _installedFilters) {
            if (_installedFilters[filterKey].type == 'latestBlock') {
                _installedFilters[filterKey].data = _latestBlockHash;
                _installedFilters[filterKey].confirmed = 1;
            } else if (
                _installedFilters[filterKey].type == 'pendingTransaction'
            ) {
                _installedFilters[
                    filterKey
                ].data = _latestPendingTransactionHash;
            }
        }
        _vm.blockchain.putBlock(nextBlock, function(err, block) {
            if (err) {
                console.error(err);
            } else {
                _debugLog(
                    '[Block] new block has been created: ' +
                        utils.bufferToInt(nextBlock.header.number)
                );
                _vm.runBlock({ block: nextBlock, generate: true }, function(
                    err,
                    results
                ) {
                    if (err) {
                        console.error(err);
                        callback(err.toString(), null);
                    } else {
                        var errorMessage = null;

                        //
                        // EIP 838
                        // REVERT with reason
                        //
                        var returnData = results.results[0].vm.return;
                        if(returnData) {
                            var errorSelector = '08c379a0';                                     // Generic error selector. See also: Error(string)
                            var returnDataSelector = returnData.slice(0,4).toString('hex');     // Check selector ...
                            if(returnDataSelector === errorSelector ) {                         // ... looking for generic error.
                                var returnDataString = returnData.slice(4).toString('hex');     // Read ABI-encoded string. Then,
                                errorMessage = decode('string', returnDataString)[0];           // decode the output.
                            }
                        }

                        callback(errorMessage, transactionHash);
                        _debugLog('[Block] finished running');
                        _debugLog(results);
                        //console.info("[Transaction] returned: " + results.results[0].vm.return.toString("hex"));

                        var contractAddress = results.results[0].createdAddress;
                        if (contractAddress) {
                            _transactionReceipts[
                                transactionHash
                            ].contractAddress = utils.addHexPrefix(
                                contractAddress.toString('hex')
                            );
                        } else {
                            _transactionReceipts[
                                transactionHash
                            ].contractAddress = null;
                        }

                        //_transactionReceipts[transactionHash].gasUsed = results.results[0].vm.gasUsed.toString();
                        _transactionReceipts[
                            transactionHash
                        ].gasUsed = utils.bufferToInt(
                            results.receipts[0].gasUsed
                        );
                        _transactionReceipts[
                            transactionHash
                        ].blockNumber = utils.bufferToInt(
                            nextBlock.header.number
                        );
                        _transactionReceipts[
                            transactionHash
                        ].blockHash = utils.addHexPrefix(
                            nextBlock.hash().toString('hex')
                        );
                        _transactionReceipts[
                            transactionHash
                        ].from = utils.addHexPrefix(tx.from.toString('hex'));
                        var to = tx.to.toString('hex');
                        if (to == '') {
                            _transactionReceipts[transactionHash].to = null;
                        } else {
                            _transactionReceipts[
                                transactionHash
                            ].to = utils.addHexPrefix(to);
                        }
                        _transactionReceipts[
                            transactionHash
                        ].transactionHash = transactionHash.toString('hex');
                        _transactionReceipts[
                            transactionHash
                        ].cumulativeGasUsed = utils.bufferToInt(
                            results.results[0].gasUsed
                        );
                        _transactionReceipts[
                            transactionHash
                        ].transactionIndex = 0;

                        var logs = [];
                        for (
                            var logIndex = 0;
                            logIndex < results.receipts[0].logs.length;
                            logIndex++
                        ) {
                            var currentLog = results.receipts[0].logs[logIndex];
                            var logAddress = utils.addHexPrefix(
                                utils.bufferToHex(currentLog[0])
                            );
                            var logData = utils.bufferToHex(currentLog[2]);
                            var logArguments = [];
                            for (
                                var arg = 0;
                                arg < currentLog[1].length;
                                arg++
                            ) {
                                logArguments.push(
                                    utils.bufferToHex(currentLog[1][arg])
                                );
                            }

                            var log = {
                                logIndex: utils.intToHex(logIndex),
                                transactionIndex: '0x0',
                                transactionHash: transactionHash.toString(
                                    'hex'
                                ),
                                blockHash: utils.addHexPrefix(
                                    nextBlock.hash().toString('hex')
                                ),
                                blockNumber: utils.bufferToInt(
                                    nextBlock.header.number
                                ),
                                address: logAddress,
                                data: logData,
                                topics: logArguments,
                                type: 'mined',
                            };
                            logs.push(log);
                        }
                        _transactionReceipts[transactionHash].logs = logs;

                        _transactionReceipts[transactionHash].status =
                            results.receipts[0].status;
                        for (filterKey in _installedFilters) {
                            if (
                                _installedFilters[filterKey].type ==
                                    'pendingTransaction' ||
                                _installedFilters[filterKey].type ==
                                    'filterOptions'
                            ) {
                                _installedFilters[filterKey].confirmed = 1;
                            }
                        }

                        _blocks.push(nextBlock);
                    }
                });
            }
        });

        // TODO: consider filling with data that is already available
        _transactionReceipts[transactionHash] = {
            blockHash: null,
            blockNumber: null,
            transactionHash: null,
            transactionIndex: 0,
            from: null,
            to: null,
            cumulativeGasUsed: null,
            gasUsed: null,
            contractAddress: null,
            logs: [],
            status: null,
        };
    });
}

function call(data, callback) {
    var errorMessage = 'call must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        // TODO: add block as (optional) second parameter
        //       consider it in runTx options
        // TODO: find a way to remove the need of a transaction
        data = utils.addHexPrefix(data);
        // TODO: use custom account for calling
        var fromAddress = '0x620cbab1f950e38a964d02ddcf85ecfcbb9f468f'; //data.from;
        var tx = new Transaction({
            from: fromAddress,
            to: data.to,
            //"nonce": data.nonce,
            gasPrice: data.gasPrice ? data.gasPrice : _gasPrice,
            gasLimit: data.gasLimit ? data.gasLimit : '0x2DC6C0', // TODO: set to global default gasLimit instead
            data: data.data,
            value: data.value,
        });
        tx.sign(Buffer.from(_accounts[fromAddress].secretKey, 'hex'));

        _vm.stateManager.checkpoint();
        _vm.runTx(
            {
                tx: tx,
                skipBalance: true,
                skipNonce: true,
            },
            function(err, results) {
                _vm.stateManager.revert(function() {
                    var result = results.vm.return;
                    if (result) {
                        result = utils.addHexPrefix(result.toString('hex'));
                    } else {
                        result = '0x0';
                    }
                    callback(err, result);
                });
            }
        );
    }
}

function estimateGas(data, callback) {
    var errorMessage =
        'estimateGas must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        // TODO: find a way to remove the need of a transaction
        data = utils.addHexPrefix(data);
        // TODO: use custom account for calling
        var fromAddress = '0x620cbab1f950e38a964d02ddcf85ecfcbb9f468f'; //data.from;
        var tx = new Transaction({
            from: fromAddress,
            to: data.to,
            //"nonce": data.nonce,
            gasPrice: data.gasPrice ? data.gasPrice : _gasPrice,
            gasLimit: data.gasLimit ? data.gasLimit : '0x2DC6C0', // TODO: set to global default gasLimit instead
            data: data.data,
            value: data.value,
        });
        tx.sign(Buffer.from(_accounts[fromAddress].secretKey, 'hex'));

        _vm.stateManager.checkpoint();
        _vm.runTx(
            {
                tx: tx,
                skipBalance: true,
                skipNonce: true,
            },
            function(err, results) {
                _vm.stateManager.revert(function(e) {
                    callback(err || e, utils.bufferToInt(results.gasUsed));
                });
            }
        );
    }
}

function decode(type, data) {
    data = utils.stripHexPrefix(data);
    var decodedData = abi.rawDecode([type], new Buffer(data, 'hex'));
    return decodedData;
}

function methodID(method, data) {
    var id = abi.methodID(method, data);
    return id;
}

function blockNumber() {
    return _vm.blockchain.meta.height;
    /*_vm.blockchain.getHead(function(err, block){
        var number = utils.bufferToInt(block.header.number);
        _debugLog(number);
    });*/
}

function getBlock(blockNumber, returnTransactionObjects, callback) {
    var errorMessage =
        'getBlock must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        if (blockNumber == 'latest') {
            blockNumber = this.blockNumber();
        } else if (blockNumber == 'pending') {
            callback('TODO: getBlock missing defaultBlock implementation');
            return null;
            // number is expected to be null for pending block
            // hash is expected to be null for pending block
            // nonce is expected to be null for pending block
            // logsBloom is expected to be null for pending block
        } else if (blockNumber == 'earliest') {
            // TODO: implement defaultBlock (block number)
            callback('TODO: getBlock missing defaultBlock implementation');
            return null;
        }
        _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
            err,
            block
        ) {
            if (err) {
                callback(err); // TODO: error here might be an object instead of plain string message. Double check
            } else {
                _debugLog('[Block] retrieving block by number: ' + blockNumber);
                var data = {
                    number: utils.bufferToInt(block.header.number),
                    hash: utils.addHexPrefix(block.hash().toString('hex')),
                    parentHash: utils.addHexPrefix(
                        block.header.parentHash.toString('hex')
                    ),
                    nonce: block.header.nonce.toString('hex')
                        ? utils.addHexPrefix(block.header.nonce.toString('hex'))
                        : '0x0',
                    sha3Uncles: utils.addHexPrefix(
                        block.header.uncleHash.toString('hex')
                    ),
                    logsBloom: utils.addHexPrefix(
                        block.header.bloom.toString('hex')
                    ),
                    transactionsRoot: utils.addHexPrefix(
                        block.header.transactionsTrie.toString('hex')
                    ),
                    stateRoot: utils.addHexPrefix(
                        block.header.stateRoot.toString('hex')
                    ),
                    miner: utils.addHexPrefix(
                        block.header.coinbase.toString('hex')
                    ),
                    difficulty: utils.addHexPrefix(
                        block.header.difficulty.toString('hex')
                    ),
                    totalDifficulty: utils.addHexPrefix(
                        block.header.difficulty.toString('hex')
                    ), // TODO: calculate total difficulty
                    extraData: utils.addHexPrefix(
                        block.header.extraData.toString('hex')
                    ),
                    size: 0, // TODO: integer size of this block in bytes (?)
                    gasLimit: new BN(block.header.gasLimit),
                    gasUsed: new BN(block.header.gasUsed),
                    timestamp: new BN(block.header.timestamp),
                    transactions: block.transactions.map(function(transaction) {
                        console.log('TRANSACTION IN MAP', transaction);
                        // TODO: implement returnTransactionObjects
                        if (returnTransactionObjects) {
                            var transactionIndex = 0;
                            for (
                                var i = 0;
                                i < block.transactions.length;
                                i++
                            ) {
                                var tx = block.transactions[i];
                                // Read current index
                                if (tx.hash().equals(transaction.hash())) {
                                    transactionIndex = i;
                                    break;
                                }
                            }
                            var transactionData = {
                                blockHash: utils.addHexPrefix(
                                    block.hash().toString('hex')
                                ),
                                blockNumber: utils.fromSigned(
                                    block.header.number
                                ),
                                from: utils.addHexPrefix(
                                    transaction.from.toString('hex')
                                ),
                                gas: utils.addHexPrefix(
                                    transaction.gasLimit.toString('hex')
                                ),
                                gasPrice: utils.addHexPrefix(
                                    transaction.gasPrice.toString('hex')
                                ),
                                hash: utils.addHexPrefix(
                                    transaction.hash().toString('hex')
                                ),
                                input: utils.addHexPrefix(
                                    transaction.data.toString('hex')
                                ),
                                nonce: transaction.nonce.toString('hex')
                                    ? utils.addHexPrefix(
                                          transaction.nonce.toString('hex')
                                      )
                                    : '0x0',
                                transactionIndex: transactionIndex,
                                to: utils.addHexPrefix(
                                    transaction.to.toString('hex')
                                ), // TODO: check if empty must be null or not
                                value: utils.fromSigned(transaction.value),
                                r: utils.addHexPrefix(
                                    transaction.r.toString('hex')
                                ),
                                s: utils.addHexPrefix(
                                    transaction.s.toString('hex')
                                ),
                                v: utils.addHexPrefix(
                                    transaction.v.toString('hex')
                                ),
                            };
                            return transactionData;
                        } else {
                            return utils.addHexPrefix(
                                transaction.hash().toString('hex')
                            );
                        }
                    }),
                    uncles: block.uncleHeaders.map(function(uncle) {
                        // TODO: implement returnTransactionObjects
                        //    if(returnTransactionObjects)
                        //return uncle.toString("hex");
                        return {};
                    }),
                };
                console.log('BLOCK', block);
                console.log('TRANSACTION DATA', data);
                console.log('TYPE OF TRANSACTION DATA', typeof data);
                console.log('GASLIMIT', data.gasLimit);
                console.log('TYPE OF GASLIMIT', typeof data.gasLimit);
                callback(null, data);
            }
        });
    }
}

function getBlockByHash(blockHash, returnTransactionObjects, callback) {
    var hash = utils.toBuffer(blockHash);
    _vm.blockchain.getDetails(hash, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var blockNumber = result.number;
            return getBlock(blockNumber, returnTransactionObjects, callback);
        }
    });
}

function getBlockTransactionCount(blockNumber, callback) {
    var errorMessage =
        'getBlockTransactionCount must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        if (blockNumber == 'latest' || blockNumber == 'pending') {
            // TODO: implement defaultBlock (block number)
            // number is expected to be null for pending block
            // hash is expected to be null for pending block
            // nonce is expected to be null for pending block
            // logsBloom is expected to be null for pending block
            callback('TODO: getBlock missing defaultBlock implementation');
        } else if (blockNumber == 'earliest') {
            // TODO: implement defaultBlock (block number)
            callback('TODO: getBlock missing defaultBlock implementation');
        } else {
            _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
                err,
                block
            ) {
                if (err) {
                    callback(err); // TODO: error here might be an object instead of plain string message. Double check
                } else {
                    callback(null, block.transactions.length);
                }
            });
        }
    }
}

function getBlockTransactionCountByHash(blockHash, callback) {
    var hash = utils.toBuffer(blockHash);
    _vm.blockchain.getDetails(hash, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var blockNumber = result.number;
            return getBlockTransactionCount(blockNumber, callback);
        }
    });
}

function getUncle(blockNumber, uncleNumber, callback) {
    var errorMessage =
        'getUncle must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        if (blockNumber == 'latest' || blockNumber == 'pending') {
            // TODO: implement defaultBlock (block number)
            // number is expected to be null for pending block
            // hash is expected to be null for pending block
            // nonce is expected to be null for pending block
            // logsBloom is expected to be null for pending block
            callback('TODO: getUncle missing defaultBlock implementation');
        } else if (blockNumber == 'earliest') {
            // TODO: implement defaultBlock (block number)
            callback('TODO: getUncle missing defaultBlock implementation');
        } else {
            _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
                err,
                block
            ) {
                if (err) {
                    callback(err); // TODO: error here might be an object instead of plain string message. Double check
                } else {
                    var data = {};
                    callback(null, data);
                }
            });
        }
    }
}

function getUncleByHash(blockHash, uncleNumber, callback) {
    var hash = utils.toBuffer(blockHash);
    _vm.blockchain.getDetails(hash, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var blockNumber = result.number;
            return getUncle(blockNumber, uncleNumber, callback);
        }
    });
}

function getBlockUncleCount(blockNumber, callback) {
    var errorMessage =
        'getBlockUncleCount must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        if (blockNumber == 'latest' || blockNumber == 'pending') {
            // TODO: implement defaultBlock (block number)
            // number is expected to be null for pending block
            // hash is expected to be null for pending block
            // nonce is expected to be null for pending block
            // logsBloom is expected to be null for pending block
            callback(
                'TODO: getBlockUncleCount missing defaultBlock implementation'
            );
        } else if (blockNumber == 'earliest') {
            // TODO: implement defaultBlock (block number)
            callback(
                'TODO: getBlockUncleCount missing defaultBlock implementation'
            );
        } else {
            _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
                err,
                block
            ) {
                if (err) {
                    callback(err); // TODO: error here might be an object instead of plain string message. Double check
                } else {
                    callback(null, block.uncleHeaders.length);
                }
            });
        }
    }
}

function getBlockUncleCountByBlockHash(blockHash, callback) {
    var hash = utils.toBuffer(blockHash);
    _vm.blockchain.getDetails(hash, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var blockNumber = result.number;
            return getBlockUncleCount(blockNumber, callback);
        }
    });
}

function getStorageAt(addressHexString, position, callback) {
    var errorMessage =
        'getStorageAt must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        _vm.blockchain.getHead(function(err, head) {
            if (err) {
                callback(err); // TODO: error here might be an object instead of plain string message. Double check
            } else {
                _vm.stateManager.trie.get(addressHexString, function(
                    err,
                    data
                ) {
                    if (err) {
                        callback(err);
                    } else {
                        if (position > 0) {
                            var offsetValue =
                                addressHexString +
                                utils.setLengthLeft(position, 32); // TODO: pad addressHexString as well and convert with sha3 ?
                            console.error(
                                'missing getStorageAt offset value implementation'
                            );
                        } else {
                            callback(null, data);
                        }
                    }
                });
            }
        });
    }
}

function getTransaction(transactionHash, callback) {
    var errorMessage =
        'getTransaction must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        var transaction = _transactions[transactionHash];
        if (transaction) {
            var blockNumber = _transactionReceipts[transactionHash].blockNumber;
            var transactionIndex =
                _transactionReceipts[transactionHash].transactionIndex;
            _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
                err,
                block
            ) {
                if (err) {
                    callback(err); // TODO: error here might be an object instead of plain string message. Double check
                } else {
                    var transactionData = {
                        blockHash: utils.addHexPrefix(
                            block.hash().toString('hex')
                        ),
                        blockNumber: utils.bufferToInt(block.header.number),
                        from: utils.addHexPrefix(
                            transaction.from.toString('hex')
                        ),
                        gas: utils.addHexPrefix(
                            transaction.gasLimit.toString('hex')
                        ),
                        gasPrice: utils.addHexPrefix(
                            transaction.gasPrice.toString('hex')
                        ),
                        hash: utils.addHexPrefix(
                            transaction.hash().toString('hex')
                        ),
                        input: utils.addHexPrefix(
                            transaction.data.toString('hex')
                        ),
                        nonce: transaction.nonce.toString('hex')
                            ? utils.addHexPrefix(
                                  transaction.nonce.toString('hex')
                              )
                            : '0x0',
                        transactionIndex: transactionIndex,
                        to: utils.addHexPrefix(transaction.to.toString('hex')), // TODO: check if empty must be null or not
                        value: utils.fromSigned(transaction.value),
                        r: utils.addHexPrefix(transaction.r.toString('hex')),
                        s: utils.addHexPrefix(transaction.s.toString('hex')),
                        v: utils.addHexPrefix(transaction.v.toString('hex')),
                    };
                    callback(null, transactionData);
                }
            });
        } else {
            callback(
                'Failed to read transaction data from hash: ' + transactionHash
            );
        }
    }
}

function getTransactionByBlock(blockNumber, transactionIndex, callback) {
    var errorMessage =
        'getTransactionByBlock must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        _vm.blockchain.getBlock(utils.bufferToInt(blockNumber), function(
            err,
            block
        ) {
            if (err) {
                callback(err); // TODO: error here might be an object instead of plain string message. Double check
            } else {
                transactionIndex = utils.bufferToInt(transactionIndex);
                var txData = block.transactions[transactionIndex];
                var tx = new Transaction(txData);
                var transactionHash = utils.bufferToHex(tx.hash());
                var transaction = _transactions[transactionHash];
                if (transaction) {
                    var transactionData = {
                        blockHash: utils.addHexPrefix(
                            block.hash().toString('hex')
                        ),
                        blockNumber: utils.bufferToInt(block.header.number),
                        from: utils.addHexPrefix(
                            transaction.from.toString('hex')
                        ),
                        gas: utils.addHexPrefix(
                            transaction.gasLimit.toString('hex')
                        ),
                        gasPrice: utils.addHexPrefix(
                            transaction.gasPrice.toString('hex')
                        ),
                        hash: utils.addHexPrefix(
                            transaction.hash().toString('hex')
                        ),
                        input: utils.addHexPrefix(
                            transaction.data.toString('hex')
                        ),
                        nonce: transaction.nonce.toString('hex')
                            ? utils.addHexPrefix(
                                  transaction.nonce.toString('hex')
                              )
                            : '0x0',
                        transactionIndex: transactionIndex,
                        to: utils.addHexPrefix(transaction.to.toString('hex')), // TODO: check if empty must be null or not
                        value: utils.fromSigned(transaction.value),
                        r: utils.addHexPrefix(transaction.r.toString('hex')),
                        s: utils.addHexPrefix(transaction.s.toString('hex')),
                        v: utils.addHexPrefix(transaction.v.toString('hex')),
                    };
                    callback(null, transactionData);
                } else {
                    callback(
                        'Failed to read transaction data from hash: ' +
                            transactionHash
                    );
                }
            }
        });
    }
}

function getTransactionByBlockHash(blockHash, transactionIndex, callback) {
    var hash = utils.toBuffer(blockHash);
    _vm.blockchain.getDetails(hash, function(error, result) {
        if (error) {
            callback(error);
        } else {
            var blockNumber = result.number;
            return getTransactionByBlock(
                blockNumber,
                transactionIndex,
                callback
            );
        }
    });
}

function getAccounts() {
    return Object.keys(_accounts);
}

function getBalance(address, callback) {
    var errorMessage =
        'getBalance must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        _vm.stateManager.getAccountBalance(address, function(err, balance) {
            if (err) {
                callback(err);
            } else {
                var balanceString = balance.toString('hex');
                if (!balanceString) {
                    balanceString = '0';
                }
                balanceString = utils.addHexPrefix(balanceString);
                callback(null, balanceString);
            }
        });
    }
}

function getCoinbase() {
    return _coinbase;
}

function getTransactionCount(address, callback) {
    var errorMessage =
        'getTransactionCount must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        _vm.stateManager.trie.get(address, function(err, raw) {
            if (err) {
                callback(err);
            } else {
                var account = new Account(raw);
                var nonce = decode('uint', account.nonce);
                nonce = nonce.toString();
                callback(null, nonce);
            }
        });
    }
}

function getTransactionReceipt(hash) {
    var receipt = _transactionReceipts[hash];
    if (receipt) {
        return {
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            cumulativeGasUsed: receipt.cumulativeGasUsed,
            gasUsed: receipt.gasUsed,
            logs: receipt.logs,
            status: receipt.status,
        };
    } else {
        return null;
    }
}

function dumpTrie() {
    // Alternatively: _vm.stateManager.dumpStorage
    _debugLog('[Accounts] listing...');
    var stream = _vm.stateManager.trie.createReadStream();
    stream.on('data', function(data) {
        var account = new Account(data.value);
        var value = account.balance;
        _debugLog(
            'address: ' +
                utils.addHexPrefix(data.key.toString('hex')) +
                ' | ' +
                'value: ' +
                utils.addHexPrefix(value.toString('hex'))
        );
    });
}

// Note: Address balance is (re)set once a new block is created
function setBalance(address, balance) {
    // TODO: consider pre-allocating in the genesis block
    _debugLog(
        '[Account] set balance (' +
            utils.addHexPrefix(address.toString('hex')) +
            '): ' +
            utils.addHexPrefix(balance.toString('hex'))
    );
    var account = new Account();
    account.balance = balance;
    _vm.stateManager.trie.put(address, account.serialize(), function(error) {
        if (error) {
            console.error(error);
        }
    });

    // TODO: move to general purpose addAccount
    var key =
        '79e8817a0b150357a5c30964e2d8b551da038a84d855687222b3bc581730df6e';
    var accountData = {
        secretKey: key,
        publicKey: utils.privateToPublic(new Buffer(key, 'hex')),
        address: address,
        account: account,
    };
    _accounts[address] = accountData;
}

function getCode(address, callback) {
    var errorMessage =
        'getCode must be called asynchronously: undefined callback';
    if (callback === undefined) {
        console.error(errorMessage);
        return null;
    } else {
        _vm.stateManager.getContractCode(address, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, utils.addHexPrefix(result.toString('hex')));
            }
        });
    }
}

function getLogs(filterOptions) {
    var fromBlock = 'latest';
    var toBlock = 'latest';
    var address = null;
    var topics = null;

    if (filterOptions) {
        if (filterOptions.fromBlock) {
            fromBlock = filterOptions.fromBlock;
        }
        if (filterOptions.toBlock) {
            toBlock = filterOptions.toBlock;
        }
        if (filterOptions.address) {
            address = filterOptions.address;
        }
        if (filterOptions.topics) {
            topics = filterOptions.topics;
        }
    }

    if (fromBlock == 'latest') {
        fromBlock = blockNumber();
    } else if (fromBlock == 'pending' || fromBlock == 'earliest') {
        //TODO: FIXME:
        console.warn(
            'Missing support for pending and earliest filtering options. Setting to latest.'
        );
        fromBlock = blockNumber();
    }

    if (toBlock == 'latest') {
        toBlock = blockNumber();
    } else if (toBlock == 'pending' || toBlock == 'earliest') {
        //TODO: FIXME:
        console.warn(
            'Missing support for pending and earliest filtering options. Setting to latest.'
        );
        toBlock = blockNumber();
    }

    var logObjects = [];
    var blockCallback = function(err, block) {
        if (err) {
            console.error(err); // TODO: error here might be an object instead of plain string message. Double check
        } else {
            if (block.transactions) {
                for (var i = 0; i < block.transactions.length; i += 1) {
                    var transactionHash = utils.addHexPrefix(
                        block.transactions[i].hash().toString('hex')
                    );
                    var receipt = getTransactionReceipt(transactionHash);
                    if (receipt.logs) {
                        for (
                            var logsIndex = 0;
                            logsIndex < receipt.logs.length;
                            logsIndex++
                        ) {
                            var object = {
                                removed: false,
                                logIndex: receipt.logs[logsIndex].logIndex,
                                transactionIndex:
                                    receipt.logs[logsIndex].transactionIndex,
                                transactionHash:
                                    receipt.logs[logsIndex].transactionHash,
                                blockHash: receipt.logs[logsIndex].blockHash,
                                blockNumber:
                                    receipt.logs[logsIndex].blockNumber,
                                address: receipt.logs[logsIndex].address,
                                data: receipt.logs[logsIndex].data,
                                topics: receipt.logs[logsIndex].topics,
                            };

                            // Filter address
                            if (
                                address === null ||
                                object.address == address.replace(/['"]+/g, '')
                            ) {
                                if (topics === null || topics.length === 0) {
                                    logObjects.push(object);
                                } else {
                                    // Filter topics
                                    // TODO: FIXME: review topic ordering rules according to https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
                                    // TODO: FIXME: add conditionals (arrays of DATA with OR construct)
                                    for (
                                        var j = 0;
                                        j < object.topics.length;
                                        j += 1
                                    ) {
                                        for (
                                            var k = 0;
                                            k < topics.length;
                                            k += 1
                                        ) {
                                            if (object.topics[j] == topics[k]) {
                                                logObjects.push(object);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    for (var blockIndex = fromBlock; blockIndex <= toBlock; blockIndex++) {
        blockCallback(null, _blocks[utils.bufferToInt(blockIndex)]);
    }

    return logObjects;
}

var devkitVm = (module.exports = {
    // base
    init: init,

    // accounts
    getAccounts: getAccounts,
    getBalance: getBalance,
    setBalance: setBalance,
    getCoinbase: getCoinbase,
    getCode: getCode,

    // blocks
    blockNumber: blockNumber,
    getBlock: getBlock,
    getBlockByHash: getBlockByHash,
    getBlockTransactionCount: getBlockTransactionCount,
    getBlockTransactionCountByHash: getBlockTransactionCountByHash,
    getBlockUncleCount: getBlockUncleCount,
    getBlockUncleCountByBlockHash: getBlockUncleCountByBlockHash,
    getUncle: getUncle,
    getUncleByHash: getUncleByHash,

    // transactions
    sendRawTransaction: sendRawTransaction,
    getTransaction: getTransaction,
    getTransactionByBlock: getTransactionByBlock,
    getTransactionByBlockHash: getTransactionByBlockHash,
    getTransactionCount: getTransactionCount,
    getTransactionReceipt: getTransactionReceipt,

    // utils
    call: call,
    estimateGas: estimateGas,
    decode: decode,
    getLogs: getLogs,
    getStorageAt: getStorageAt,
    methodID: methodID,
    sign: sign,

    // debugging
    dumpTrie: dumpTrie,

    // provider
    Provider: DevkitProvider,
});

if (typeof window !== 'undefined') {
    window.devkitVm = devkitVm;
}
