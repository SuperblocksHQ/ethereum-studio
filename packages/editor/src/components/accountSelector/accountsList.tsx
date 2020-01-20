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
import { Tooltip } from '../common';
import style from './style.less';
import copy from 'copy-to-clipboard';
import * as accountUtils from '../../utils/accounts';
import { IconTrash, IconEdit, IconCopy } from '../icons';
import { IAccount } from '../../models/state';

interface IProps {
    accounts: IAccount[];
    selectedAccountName: string;
    onSelect(account: IAccount): void;
    onEdit(account: IAccount): void;
    onDelete(account: IAccount): void;
    onCreate(): void;
}

export class AccountsList extends React.Component<IProps> {
    onCopyAddressClick = (e: React.MouseEvent, str: Nullable<string>) => {
        e.preventDefault();
        e.stopPropagation();
        if (str) {
            copy(str);
        }
    }

    onEditClick = (e: React.MouseEvent, account: IAccount) => {
        e.stopPropagation();
        this.props.onEdit(account);
    }

    onDeleteClick = (e: React.MouseEvent, account: IAccount) => {
        e.stopPropagation();
        this.props.onDelete(account);
    }

    onCreateAccountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.onCreate();
    }

    render() {
        const renderedAccounts = this.props.accounts.map((account, index) => {
            let deleteButton;
            if (index !== 0) {
                deleteButton = (
                    <button
                        className='btnNoBg'
                        onClick={e => this.onDeleteClick(e, account)}
                    >
                        <Tooltip title='Delete'>
                            <IconTrash />
                        </Tooltip>
                    </button>
                );
            } else {
                deleteButton = (
                    <button className='btnNoBg'>
                        <i>&nbsp;&nbsp;&nbsp;&nbsp;</i>
                    </button>
                );
            }

            return (
                <div key={index}>
                    <div className={classnames(style.accountLink, { [style.accountLinkChosen]: account.name === this.props.selectedAccountName })}
                        onClick={() => this.props.onSelect(account)}>

                        <div className={style.nameContainer}>
                            <div className={style.accountName}>{account.name}</div>
                            <div className={style.address}>{accountUtils.shortenAddres(account.address || '')}</div>
                        </div>
                        <div className={style.actionsContainer}>
                            <button className='btnNoBg' onClick={(e) => this.onEditClick(e, account)}>
                                <Tooltip title='Edit Account'>
                                    <IconEdit />
                                </Tooltip>
                            </button>
                            <button
                                className='btnNoBg'
                                onClick={e => this.onCopyAddressClick(e, account.address)}>
                                <Tooltip title='Copy address'>
                                    <IconCopy />
                                </Tooltip>
                            </button>
                            {deleteButton}
                        </div>

                    </div>
                </div>
            );
        });

        return (
            <div className={classnames([style.accounts])}>
                <div className={style.title}>Select an Account</div>
                {renderedAccounts}
                <div className={style.newAccount} onClick={this.onCreateAccountClick}>
                    <button className='btnNoBg'>
                        + New Account
                    </button>
                </div>
            </div>
        );
    }
}
