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
    static categories = [
        {
            id: 0,
            name: 'All',
        },
    ];

    static templates = [
        {
            id: 1,
            name: 'Hello World',
            description: 'Simple Hello World starter project',
            image: '/static/img/templates/img-hello-world.png',
            categories: [0, 3],
        },
        {
            id: 2,
            name: 'ERC-20 Token',
            description: 'Example DApp which uses ERC-20 standard',
            image: '/static/img/templates/img-erc20-token.png',
            categories: [0, 1],
        },
        {
            id: 3,
            name: 'ERC-721 CryptoPizza',
            description: 'Crypto-collectible game built on top of ERC-721 standard',
            image: '/static/img/templates/img-cryptopizza.png',
            categories: [0, 2],
        },
        {
            id: 0,
            name: 'Vanilla Project',
            description: 'The simples form of project in order to get started from a clean slate',
            image: '/static/img/templates/img-empty.png',
            categories: [0, 2],
        },
    ];
}
