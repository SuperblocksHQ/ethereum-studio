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

import { of } from 'rxjs';
import { switchMap, withLatestFrom, map, catchError } from 'rxjs/operators';
import { ofType, Epic } from 'redux-observable';
import { projectsActions } from '../../actions';

export const loadProject: Epic = (action$: any, state$: any) => action$.pipe(
    ofType(projectsActions.LOAD_PROJECT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        const projectId = action.projectId;
        return of({
            id: '5c54546c71e58a55cc4af24a',
            name: 'hello-world',
            description: 'This is a simple hello world project',
            files: {
                '/': {
                   children: {
                      'app': {
                         type: 'd',
                         children: {
                            'app.html': {
                               type: 'f',
                                // tslint:disable-next-line: max-line-length
                               contents: '<!DOCTYPE html>\n<html lang="en">\n    <head>\n        <script type="text/javascript" src="https://unpkg.com/jquery@3.3.1/dist/jquery.js"></script>\n        <script type="text/javascript" src="https://unpkg.com/web3@0.20.5/dist/web3.min.js"></script>\n        <!-- The generated javascript and app.js will be substituted in below -->\n        <!-- JAVASCRIPT -->\n\n        <!-- The app.css contents will be substituted in below -->\n        <!-- STYLE -->\n    </head>\n    <body>\n        <h1 class="text message">Message:&nbsp;<span id="message"></span></h1>\n        <h2 class="text blocknumber">Block number:&nbsp;<span id="blocknumber"></span></h2>\n        <h2 class="text error">There was an error communicating with the contract.</h2>\n    </body>\n</html>'
                            },
                            'app.css': {
                               type: 'f',
                               // tslint:disable-next-line: max-line-length
                               contents: "body {\n    background-color: #725BA4;\n    color: #FCE8DF;\n    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;\n    text-align: center;\n}\n\n.text {\n    display: none;\n}\n\n.error {\n    color: red;\n}"
                            },
                            'app.js': {
                               type: 'f',
                               // tslint:disable-next-line: max-line-length
                               contents: "// The object 'Contracts' will be injected here, which contains all data for all contracts, keyed on contract name:\n// Contracts['HelloWorld'] = {\n//  abi: [],\n//  address: \"0x..\",\n//  endpoint: \"http://....\"\n// }\nfunction HelloWorld(Contract) {\n    this.web3 = null;\n    this.instance = null;\n    this.Contract = Contract;\n}\n\nHelloWorld.prototype.init = function() {\n    // We create a new Web3 instance using either the Metamask provider\n    // or an independent provider created towards the endpoint configured for the contract.\n    this.web3 = new Web3(\n        (window.web3 && window.web3.currentProvider) ||\n        new Web3.providers.HttpProvider(this.Contract.endpoint));\n\n    // Create the contract interface using the ABI provided in the configuration.\n    var contract_interface = this.web3.eth.contract(this.Contract.abi);\n\n    // Create the contract instance for the specific address provided in the configuration.\n    this.instance = contract_interface.at(this.Contract.address);\n};\n\n// Get the hello message from the contract.\nHelloWorld.prototype.getMessage = function(cb) {\n    this.instance.message(function (error, result) {\n        cb(error, result);\n    });\n};\n\n// Get the current block number and show it.\nHelloWorld.prototype.getBlockNumber = function(cb) {\n    this.web3.eth.getBlockNumber(function(error, result) {\n        cb(error, result);\n    });\n};\n\nHelloWorld.prototype.update = function() {\n    var that = this;\n    this.getMessage(function(error, result) {\n        if(error) {\n            $(\".error\").show();\n            return;\n        }\n        $(\"#message\").text(result);\n\n        that.getBlockNumber(function(error, result) {\n            if(error) {\n                $(\".error\").show();\n                return;\n            }\n            $(\"#blocknumber\").text(result);\n            setTimeout(function() {that.update()}, 1000);\n        });\n    });\n}\n\nHelloWorld.prototype.main = function() {\n    $(\".blocknumber\").show();\n    $(\".message\").show();\n    this.update();\n}\n\nHelloWorld.prototype.onReady = function() {\n    this.init();\n    this.main();\n};\n\nvar helloWorld = new HelloWorld(Contracts['HelloWorld']);\n\n$(document).ready(function() {\n    helloWorld.onReady();\n});"
                            }
                         }
                      },
                      'contracts': {
                         type: 'd',
                         children: {
                            'HelloWorld.sol': {
                               type: 'f',
                               // tslint:disable-next-line: max-line-length
                               contents: 'pragma solidity ^0.4.25;\n\ncontract HelloWorld {\n    string public message;\n    \n    constructor(string initMessage) public {\n        message = initMessage;\n    }\n\n    function update(string newMessage) public {\n        message = newMessage;\n    }\n}'
                            }
                         }
                      },
                      'README.md': {
                         type: 'f',
                         contents: '# Hello World start DApp\n\nWelcome to a simple Hello World starter!'
                      },
                      'dappfile.json': {
                         type: 'f',
                         // tslint:disable-next-line: max-line-length
                         contents: '{\n    "project": {\n        "info": {\n            "name": "Hello",\n            "title": "Hello"\n        }\n    },\n    "environments": [\n        {\n            "name": "browser"\n        },\n        {\n            "name": "custom"\n        },\n        {\n            "name": "rinkeby"\n        },\n        {\n            "name": "ropsten"\n        },\n        {\n            "name": "kovan"\n        },\n        {\n            "name": "infuranet"\n        },\n        {\n            "name": "mainnet"\n        }\n    ],\n    "contracts": [\n        {\n            "source": "/contracts/HelloWorld.sol",\n            "name": "HelloWorld",\n            "args": [\n                {\n                    "value": "Hello World!"\n                }\n            ]\n        }\n    ],\n    "wallets": [\n        {\n            "desc": "This is a wallet for local development",\n            "name": "development"\n        },\n        {\n            "desc": "A private wallet",\n            "name": "private"\n        },\n        {\n            "desc": "External wallet integrating with Metamask and other compatible wallets",\n            "name": "external",\n            "type": "external"\n        }\n    ],\n    "accounts": [\n        {\n            "name": "Default",\n            "_environments": [\n                {\n                    "name": "browser",\n                    "data": {\n                        "wallet": "development",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "custom",\n                    "data": {\n                        "wallet": "private",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "rinkeby",\n                    "data": {\n                        "wallet": "external",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "ropsten",\n                    "data": {\n                        "wallet": "external",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "kovan",\n                    "data": {\n                        "wallet": "external",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "infuranet",\n                    "data": {\n                        "wallet": "external",\n                        "index": 0\n                    }\n                },\n                {\n                    "name": "mainnet",\n                    "data": {\n                        "wallet": "external",\n                        "index": 0\n                    }\n                }\n            ]\n        }\n    ]\n}'
                      }
                   }
                }
             }
        }).pipe(
            map(projectsActions.loadProjectSuccess),
            catchError((error) => {
                console.log('There was an issue loading the project: ' + error);
                return of(projectsActions.loadProjectFail(error));
            })
        );
    }));
