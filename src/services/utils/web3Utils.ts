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
// MERCHANTABILITY or FITNESS FOR A PARTICULA PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import Networks from '../../networks';
import { evmService } from '..';

export function getWeb3(endpoint: string) {
    let provider;
    if (endpoint.toLowerCase() === Networks.browser.endpoint) {
        provider = evmService.getProvider();
    } else {
        provider = new window.Web3.providers.HttpProvider(endpoint);
    }

    return new window.Web3(provider);
}

export function convertGas(value: string) {
    return '0x'.concat(Number(value).toString(16));
}
