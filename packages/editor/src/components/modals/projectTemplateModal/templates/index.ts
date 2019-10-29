// Copyright 2019 Superblocks AB
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

import Coin from '../../../../assets/static/json/templates/Coin.json';
import HelloWorld from '../../../../assets/static/json/templates/HelloWorld.json';
import CryptoPizzas from '../../../../assets/static/json/templates/CryptoPizzas.json';
import EmptyProject from '../../../../assets/static/json/templates/EmptyProject.json';

export default class Templates {
    static templates = [
        {
            id: 0,
            name: 'Hello World',
            description: '<div><h2>Hello World</h2><p>A Hello World style starter project. Deploys a smart contract with a message, and renders it in the front-end. You can change the message using the interact panel!</p></div>',
            content: HelloWorld,
        },
        {
            id: 1,
            name: 'Coin',
            description: '<div><h2>Coin Contract</h2><p>A starter dapp that defines a basic token you can create and send to others.</p></div>',
            content: Coin
        },
        {
            id: 2,
            name: 'CryptoPizza NFT',
            description: '<div><h2>CryptoPizza NFT</h2><p>A Crypto-collectible game built on top of the ERC-721 standard for creating unique tokens.</p></div>',
            content: CryptoPizzas,
        },
        {
            id: 3,
            name: 'Empty Project',
            description: '<div><h2>Empty Project</h2><p>An empty boilerplate which can help you to get started quickly.</p></div>',
            content: EmptyProject,
        }
    ];
}
