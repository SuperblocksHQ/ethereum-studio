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

const EmptyZip = require('./empty.zip');
const HelloZip = require('./hello.zip');
const ERC20TokenZip = require('./erc-20-token.zip');
const CryptoPizzaZip = require('./cryptopizza.zip');

// TODO: Remove all these when we have projects in cloud
export default class Templates {
    static templates = [
        {
            "id": 0,
            "name": "Hello World",
            "description": "Simple Hello World starter project",
            "image": "/static/img/templates/img-hello-world.png",
            "categories": [0, 3],
            "zip": HelloZip,
        },
        {
            "id": 1,
            "name": "Coin",
            "description": "Example DApp which uses ERC-20 standard",
            "image": "/static/img/templates/img-erc20-token.png",
            "categories": [0, 1],
            "zip": ERC20TokenZip,
        },
        {
            "id": 2,
            "name": "CryptoPizza",
            "description": "Crypto-collectible game built on top of ERC-721 standard",
            "image": "/static/img/templates/img-cryptopizza.png",
            "categories": [0, 2],
            "zip": CryptoPizzaZip,
        },
        {
            "id": 3,
            "name": "Empty Project",
            "description": "Empty project",
            "image": "/static/img/templates/img-empty.png",
            "categories": [0, 2],
            "zip": EmptyZip,
        },
    ];
}
