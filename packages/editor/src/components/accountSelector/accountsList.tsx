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

import React, { Component } from 'react';
import classnames from 'classnames';
import { Tooltip, TextInput } from '../common';
import style from './style.less';
import copy from 'copy-to-clipboard';
import * as accountUtils from '../../utils/accounts';
import { IconTrash, IconEdit, IconCopy } from '../icons';
import { IAccount } from '../../models/state';
import { validateAccountName } from '../../validations';

interface IProps {
    accountInfo: IAccount;
    accounts: IAccount[];
    selectedAccount: IAccount;
    selectedAccountName: string;
    onSelect(account: IAccount): void;
    onEdit(account: IAccount): void;
    onDelete(account: IAccount): void;
    onCreate(): void;
    updateAccountName(account: IAccount, newName: string): void;
}

interface IState {
    newAccountName: string;
    isButtonClicked: boolean;
    errorName: Nullable<string>;
    stateIndex: any;
}

export class AccountsList extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = { stateIndex: null, newAccountName: this.props.selectedAccountName, isButtonClicked: false, errorName: null };
    }

    onCopyAddressClick = (e: React.MouseEvent, str: Nullable<string>) => {
        e.preventDefault();
        e.stopPropagation();
        if (str) {
            copy(str);
        }
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.selectedAccount.name !== this.props.selectedAccount.name) {
            this.setState({
                newAccountName: this.props.selectedAccountName
            });
        }
    }

    onEditClick = (e: React.MouseEvent, index: number, account: IAccount) => {
        e.stopPropagation();
        this.setState({ isButtonClicked: true, stateIndex: index });
        // this.props.onSelect(account);
    }

    onDeleteClick = (e: React.MouseEvent, account: IAccount) => {
        e.stopPropagation();
        this.props.onDelete(account);
    }

    onCreateAccountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.onCreate();
    }

    onNameChange = (e: any, account: IAccount) => {
        const value = e.target.value;
        const { accounts } = this.props;
        const isDuplicate = accounts.find((acc) => acc.name === value);

        let errorName = null;
        if (!!isDuplicate && account.name !== value) {
            errorName = 'Account with such name already exists, please choose a different one.';
        } else {
            errorName = validateAccountName(value);
        }

        this.setState({
            newAccountName: value,
            errorName
        });

    }

    onSelectAccount = (e: React.MouseEvent, account: IAccount) => {
        e.stopPropagation();
        this.setState({ isButtonClicked: false });
        this.props.onSelect(account);
    }

    handleKeyDown = (e: any, account: IAccount) => {
        if (e.key === 'Enter') {
            this.saveName(e, account);
        }
    }

    saveName = (e: any, account: IAccount) => {
        const { updateAccountName } = this.props;
        const { newAccountName, errorName } = this.state;
        e.preventDefault();
        if (!errorName) {
            updateAccountName(account, newAccountName);
            this.setState({ isButtonClicked: false, newAccountName: '' });
        }

    }


    render() {
        const { stateIndex, isButtonClicked, newAccountName, errorName } = this.state;
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
                        onClick={(e) => this.onSelectAccount(e, account)}>

                        <div className={style.nameContainer}>
                            <div className={style.accountName}>
                                {stateIndex === index && isButtonClicked ?
                                    <TextInput
                                        type='text'
                                        id='name'
                                        onBlur={(e: any) => this.saveName(e, account)}
                                        onKeyDown={(e: any) => this.handleKeyDown(e, account)}
                                        onChange={(e: any) => this.onNameChange(e, account)}
                                        onClick={(e: any) => e.stopPropagation()}
                                        error={errorName}
                                        defaultValue={account.name}
                                    />
                                    : <div>{account.name}</div>
                                }
                            </div>
                            <div className={style.address}>{accountUtils.shortenAddres(account.address || '')}</div>
                        </div>
                        <div className={isButtonClicked && stateIndex === index ? style.actionsContainerClicked : style.actionsContainer}>
                            <button className='btnNoBg' onClick={(e) => this.onEditClick(e, index, account)}>
                                <Tooltip title='Edit account name'>
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
