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
import { IconDropdown, IconLock, IconLockOpen, IconMetamask, IconMetamaskLocked, IconPublicAddress } from '../icons';
import { AccountsList } from './accountsList';
import { IAccount } from '../../models/state';

interface IProps {
    selectedAccount: IAccount;
    accounts: IAccount[];
    onAccountSelected(name: string): void;
    onAccountEdit(name: string): void;
    onAccountDelete(name: string): void;
    onAccountCreate(): void;
}

function getAccountIcon(accountType: string, isLocked: boolean) {
    let accountIcon;
    if (accountType === 'metamask') {
        if (isLocked) {
            accountIcon = (
                <IconMetamaskLocked alt='locked metamask account' />
            );
        } else {
            accountIcon = <IconMetamask alt='available metamask account' />;
        }
    } else if (accountType === 'wallet') {
        if (isLocked) {
            accountIcon = (
                <IconLock alt='locked wallet account' size='xs' />
            );
        } else {
            accountIcon = (
                <IconLockOpen alt='open wallet account' size='xs' />
            );
        }
    } else if (accountType === 'pseudo') {
        accountIcon = (
            <IconPublicAddress alt='pseudo account with only a public address' />
        );
    }
    return accountIcon;
}

export class AccountSelector extends React.Component<IProps> {

    onDeleteAccountClick = (name: string) => {
        if (!confirm('Are you sure to delete account?')) { return; }
        this.props.onAccountDelete(name);
    }

    render() {
        const { selectedAccount, accounts } = this.props;

        return (
            <DropdownContainer
                dropdownContent={
                    <AccountsList
                        accounts={accounts}
                        selectedAccountName={selectedAccount.name}
                        onSelect={this.props.onAccountSelected}
                        onEdit={this.props.onAccountEdit}
                        onDelete={this.onDeleteAccountClick}
                        onCreate={this.props.onAccountCreate}
                    />
                }
            >
                <div className={classnames([style.selector, style.account])}>
                    {getAccountIcon(selectedAccount.type, selectedAccount.isLocked)}
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
