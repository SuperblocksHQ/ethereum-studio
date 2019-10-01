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

import { accountActions, projectsActions } from '../actions';
import { AnyAction } from 'redux';
import { IAccountConfigState, IProjectState, IExplorerState, UpdateAccountResults } from '../models/state';
import { getAccountInfo, updateAccountAddress } from './dappfileLib';
import { IProjectItem, ProjectItemTypes, IAccountConfig } from '../models';
import { findItemByPath } from './explorerLib';

export const initialState: IAccountConfigState =  {
    showAccountConfig: false,
    knownWalletSeed: 'butter toward celery cupboard blind morning item night fatal theme display toy',
    accountInfo: undefined,
    environment: '',

    dappFileCodeToSave: undefined,
    dappFileId: '',
    updateAccountResult: UpdateAccountResults.OK,
};

export default function accountsConfigReducer(state = initialState, action: AnyAction,
                                              { projects, explorer }: { projects: IProjectState, explorer: IExplorerState }): IAccountConfigState {
    switch (action.type) {

        case accountActions.OPEN_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                accountInfo: action.data.account,
                showAccountConfig: true,
                environment: projects.selectedEnvironment.name
            };
        }

        case accountActions.CLOSE_ACCOUNT_CONFIGURATION: {
            return {
                ...state,
                showAccountConfig: false,
                accountInfo: undefined
            };
        }

        case accountActions.CHANGE_ENVIRONMENT: {
            if (!state.accountInfo) {
                return state;
            }
            const currentAccountName = state.accountInfo.name;

            return {
                ...state,
                environment: action.data.environmentName,
                accountInfo: getAccountInfo(
                    projects.dappFileData.accounts.find((da: any) => da.name === currentAccountName),
                    projects.dappFileData.wallets,
                    action.data.environmentName,
                    projects.openWallets,
                    projects.metamaskAccounts)
            };
        }

        case accountActions.UPDATE_ACCOUNT_NAME: {
            if (!state.accountInfo) {
                return state;
            }

            return {
                ...state,
                accountInfo: { ...state.accountInfo, name: action.data.newName }
            };
        }

        case accountActions.UPDATE_ACCOUNT_BALANCE: {
            if (!state.accountInfo || state.accountInfo.name !== action.data.accountName) {
                return state;
            }

            return {
                ...state,
                accountInfo: {
                    ...state.accountInfo,
                    balance: action.data.balance
                }
            };
        }

        case accountActions.UPDATE_ADDRESS: {
            const nothingtoSaveState = { ...state, dappFileCodeToSave: undefined, updateAccountResult: UpdateAccountResults.OK };
            if (!state.accountInfo || !explorer.tree) {
                return nothingtoSaveState;
            }

            const dappFileItem: Nullable<IProjectItem> = findItemByPath(explorer.tree, [ 'dappfile.json' ], ProjectItemTypes.File);

            if (!dappFileItem) {
                return nothingtoSaveState;
            }

            const address = (action.data.address || '').trim();
            if (!(address.match(/^0x([a-fA-F0-9]){40}$/) || address === '0x0')) {
                return {
                    ...nothingtoSaveState,
                    updateAccountResult: UpdateAccountResults.IllegalAddress
                };
            }

            const dappFileDataToSave = updateAccountAddress(projects.dappFileData, state.accountInfo.name, state.environment, action.data.address);

            return {
                ...state,
                accountInfo: { ...state.accountInfo, address: action.data.address },
                dappFileCodeToSave: JSON.stringify(dappFileDataToSave, null, 4),
                dappFileId: dappFileItem.id,
                updateAccountResult: UpdateAccountResults.OK
            };
        }

        case projectsActions.OPEN_WALLET_SUCCESS: {
            if (!state.accountInfo || !state.accountInfo.walletName) {
                return state;
            }
            // wallet was opened - thus we might figure out custom account's address
            if (action.data.name === state.accountInfo.walletName) {
                return {
                    ...state,
                    accountInfo: {
                        ...state.accountInfo,
                        isLocked: false,
                        address: action.data.addresses[0]
                    }
                };
            } else {
                return state;
            }
        }

        default:
            return state;
    }
}
