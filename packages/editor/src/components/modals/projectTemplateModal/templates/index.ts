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

// TODO: Create projects in cloud and replace id's with proper ones
export default class Templates {
    static templates = [
        {
            id: 0,
            name: 'Hello World',
            description: '<div><h2>Hello World</h2><p>A simple Hello World starter project. Deploy a smart contract with a message nad render it in the front-end. Don\'t forget to update the message using the interact panel!</p></div>',
            projectId: '5d837679875da96cb4432b76'
        },
        {
            id: 1,
            name: 'Coin',
            description: '<div><h2>Coin Contract</h2><p>Example DApp which uses ERC-20 standard</p></div>',
            projectId: '5d837679875da96cb4432b76'
        },
        {
            id: 2,
            name: 'CryptoPizza NFT',
            description: '<div><h2>CryptoPizza NFT</h2><p>Crypto-collectible game built on top of ERC-721 standard</p></div>',
            projectId: '5d837679875da96cb4432b76'
        },
        {
            id: 3,
            name: 'Empty Project',
            description: '<div><h2>Empty Project</h2><p>The simples form of project in order to get started from a clean slate</p></div>',
            projectId: '5d837679875da96cb4432b76'
        },
    ];
}
