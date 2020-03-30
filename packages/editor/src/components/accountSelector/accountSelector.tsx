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

import React from 'react';
import classnames from 'classnames';
import { DropdownContainer } from '../common/dropdown';
import style from './style.less';
import { IconDropdown } from '../icons';
import { AccountsList } from './accountsList';
import { IAccount } from '../../models/state';
import Identicon from '../identicon';

interface IProps {
    accountInfo: IAccount;
    selectedAccount: IAccount;
    accounts: IAccount[];
    onAccountSelected(account: IAccount): void;
    onAccountEdit(account: IAccount): void;
    onAccountDelete(account: IAccount): void;
    onAccountCreate(): void;
    updateAccountName(account: IAccount, newName: string): void;
}

export class AccountSelector extends React.Component<IProps> {

    onDeleteAccountClick = (account: IAccount) => {
        if (!confirm('Are you sure to delete account?')) { return; }
        this.props.onAccountDelete(account);
    }

    render() {
        const { selectedAccount, accounts, accountInfo } = this.props;
        return (
            <DropdownContainer
                enableClickInside={true}
                dropdownContent={
                    <AccountsList
                        accountInfo={accountInfo}
                        updateAccountName={this.props.updateAccountName}
                        accounts={accounts}
                        selectedAccount={selectedAccount}
                        selectedAccountName={selectedAccount.name}
                        onSelect={this.props.onAccountSelected}
                        onEdit={this.props.onAccountEdit}
                        onDelete={this.onDeleteAccountClick}
                        onCreate={this.props.onAccountCreate}
                    />
                }
            >
                <div className={classnames([style.selector, style.account])}>
                    <Identicon seed={selectedAccount.address} size={7} />
                    <div className={style.accountContainer}>
                        <div title={selectedAccount.address || ''} className={style.nameContainer}>
                            {selectedAccount.name}
                        </div>
                        <div className={style.dropdownIcon}>
                            <IconDropdown height='8' width='10' />
                        </div>
                    </div>
                </div>
            </DropdownContainer>
        );
    }
}
