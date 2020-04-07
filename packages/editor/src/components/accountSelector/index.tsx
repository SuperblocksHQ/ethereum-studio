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

import React, { Component, Dispatch } from 'react';
import { connect } from 'react-redux';
import style from './style.less';
import OnlyIf from '../common/onlyIf';
import { AccountSelector } from './accountSelector';
import { projectsActions } from '../../actions';
import { projectSelectors, accountsConfigSelectors } from '../../selectors';
import { IProject } from '../../models';
import { IAccount } from '../../models/state';
import { AnyAction } from 'redux';
import { accountActions } from '../../actions/account.actions';

interface IProps {
    project: IProject;
    accounts: [IAccount];
    accountInfo: IAccount;
    selectedAccount: IAccount;
    onAccountSelected: (account: IAccount) => void;
    onAccountCreate: () => void;
    onAccountDelete: (account: IAccount) => void;
    onAccountEdit: (account: IAccount) => void;
    updateAccountName(account: IAccount, newName: string): void;
}

class AccountSelectorWrapper extends Component<IProps> {
    render() {
        const {
            project,
            onAccountSelected,
            onAccountCreate,
            onAccountDelete,
            onAccountEdit,
            accounts,
            selectedAccount,
            updateAccountName,
            accountInfo,
        } = this.props;

        return (
            <OnlyIf test={Boolean(project.id)}>
                <div className={style.container}>
                    <AccountSelector
                            accountInfo={accountInfo}
                            updateAccountName={updateAccountName}
                            accounts={accounts}
                            selectedAccount={selectedAccount}
                            onAccountSelected={onAccountSelected}
                            onAccountCreate={onAccountCreate}
                            onAccountDelete={onAccountDelete}
                            onAccountEdit={onAccountEdit} />
                </div>
            </OnlyIf>
        );
    }
}

const mapStateToProps = (state: any) => ({
    project: projectSelectors.getProject(state),
    selectedAccount: projectSelectors.getSelectedAccount(state),
    accounts: state.projects.accounts,
    accountInfo: accountsConfigSelectors.getAccountInfo(state),
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        updateAccountName(account: IAccount, newName: string) {
            dispatch(accountActions.updateAccountName(account, newName));
        },
        onAccountSelected(account: IAccount) {
            dispatch(projectsActions.selectAccount(account.name));
        },
        onAccountEdit(account: IAccount) {
            dispatch(accountActions.openAccountConfig(account));
        },
        onAccountDelete(account: IAccount) {
            dispatch(accountActions.deleteAccount(account.name));
        },
        onAccountCreate() {
            dispatch(accountActions.createNewAccount());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelectorWrapper);
