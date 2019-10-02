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

import Networks from '../../networks';
import { IAccountEnvironment, IContractConfiguration } from '../../models';
import { IAccount, IEnvironment } from '../../models/state';
import { replaceInArray } from '../utils';

export function getAccountInfo(dappfileAccount: any, dappfileWallets: any[], environmentName: string, openWallets: any, metamaskAccounts: string[]): IAccount {
    const accountEnvironment = dappfileAccount._environments.find((e: IAccountEnvironment) => e.name === environmentName);
    const walletName = accountEnvironment ? accountEnvironment.data.wallet : null;

    const accountInfo: IAccount = {
        name: dappfileAccount.name,
        address: accountEnvironment ? accountEnvironment.data.address : '0x0',
        balance: null,
        type: 'pseudo',
        isLocked: false,
        walletName: null
    };

    if (!walletName) {
        return accountInfo;
    }
    const wallet = dappfileWallets.find(w => w.name === walletName);

    if (wallet) {
        if (wallet.type === 'external') {
            accountInfo.type = 'metamask';
            accountInfo.isLocked = metamaskAccounts.length < 1;
            accountInfo.address = metamaskAccounts[0];
        } else {
            accountInfo.type = 'wallet';
            if (openWallets[walletName]) {
                try {
                    accountInfo.address = openWallets[walletName][accountEnvironment.data.index];
                } catch (ex) {
                    accountInfo.address = '0x0';
                }
            } else {
                accountInfo.isLocked = true;
            }
        }
    }

    accountInfo.walletName = walletName;
    return accountInfo;
}

export function resolveAccounts(dappFileData: any, environment: string, openWallets: any, metamaskAccounts: string[]) {
    return dappFileData.accounts.map((a: any) => getAccountInfo(a, dappFileData.wallets, environment, openWallets, metamaskAccounts));
}

export function findContractConfiguration(dappFileData: any, contractSource: string): IContractConfiguration {
    return dappFileData.contracts.find((contract: any) => contract.source === contractSource);
}

export function getDappSettings(dappfileCode: string, openWallets: any, metamaskAccounts: string[]) {
    const dappFileData: any = JSON.parse(dappfileCode);

    // environments
    const environments = dappFileData.environments.map((e: any) => {
        if (Networks[e.name]) {
            return {
                name: e.name,
                endpoint: Networks[e.name].endpoint
            };
        }
    });
    const selectedEnvironment: IEnvironment = environments[0];

    // accounts
    const accounts = resolveAccounts(dappFileData, selectedEnvironment.name, openWallets, metamaskAccounts);

    return { environments, selectedEnvironment, accounts, selectedAccount: accounts[0], dappFileData };
}

export function updateAccountAddress(dappfileData: any, accountName: string, environment: string, address: string) {
    return {
        ...dappfileData,
        accounts: replaceInArray(
            dappfileData.accounts,
            (a: any) => a.name === accountName,
            (a: any) => {
                const _environments = replaceInArray(
                    a._environments,
                    (e: any) => e.name === environment,
                    (item) => ({
                        ...item,
                        data: { address }
                    })
                );

                // if no change - then item was not found and should be created
                if (_environments === a._environments) {
                    _environments.push({
                        name: environment,
                        data: { address }
                    });
                }

                return {
                    ...a,
                    _environments
                };
            })
    };
}
