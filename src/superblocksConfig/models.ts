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

export enum AccountType {
    Seed = 'seed',
    Key = 'key',
    External = 'external'
}

export interface INetwork {
    host: string;
    port: number;
    id: string;
}

export interface IAccount {
    name: string;
    type: AccountType;

    seed?: string;
    addressIndex?: number;
    hdpath?: string;

    key?: string;
    default?: boolean;
}

export interface IAccountInfo {
    address: string;
    balance: string;
}

export interface IEnvironment {
    name: string;
    network: INetwork;
    accounts: IAccount[];
}

export interface ISuperblocksRunConfiguration {
    id: string;
    data: { environmentName: string; };
}

export interface IDappfile {
    environments: IEnvironment[];
    compilerOptions: any;
}

export interface ISuperblocksConfigUI {
    selectedConfig: ISuperblocksRunConfiguration;
    environment?: IEnvironment;
    networks: INetwork[];
}

export interface ISuperblocksPluginState {
    configUI: ISuperblocksConfigUI;
    activeConfig: ISuperblocksRunConfiguration;
    dappfile: IDappfile;

    accountInfo: IAccountInfo;
    openWallets: {
        [key: string]: string[]
    };
    metamaskAccounts: string[];
}

