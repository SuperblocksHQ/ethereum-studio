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

import { IRawAbiDefinition } from '../abi.model';

export interface IAbiDefinitionState extends IRawAbiDefinition {
    lastResult?: any[];
}

export interface IDeployedContract {
    id: string;
    abi: IAbiDefinitionState[];
    address: string;
    tx: string;
    deploy: string;
    js: string;
    contractName: string;
    opened: boolean;
    deployed: boolean; // show if the contract is deployed to current network
}

export interface IInteractState {
    items: IDeployedContract[];
}
