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
    currentAccount: IAccount;
    stateIndex: any;
}

export class AccountsList extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        console.log('PROPS', props);
        this.state = { stateIndex: null, newAccountName: this.props.selectedAccount.name, isButtonClicked: false, errorName: null, currentAccount: this.props.selectedAccount };
    }

    onCopyAddressClick = (e: React.MouseEvent, str: Nullable<string>) => {
        e.preventDefault();
        e.stopPropagation();
        if (str) {
            copy(str);
        }
    }

    handleChange = ({ target }: any) => {
        this.setState({ [target.name]: target.value } as Pick<IState, keyof IState>);
    }

    onEditClick = (e: React.MouseEvent, index: number) => {
        console.log('ON EDIT CLICK ACCOUNT?', index);
        this.setState({ isButtonClicked: true, stateIndex: index});
    }

    onDeleteClick = (e: React.MouseEvent, account: IAccount) => {
        e.stopPropagation();
        this.props.onDelete(account);
    }

    onCreateAccountClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.onCreate();
    }

    onNameChange = (e: any) => {
        const value = e.target.value;
        console.log('value', value);
        const { selectedAccount, accounts, accountInfo } = this.props;
        const { currentAccount } = this.state;
        console.log('ACCOUNT INFO', accountInfo);
        console.log('CURRENT ACCOUNT', currentAccount);
        console.log('new account name', this.state.newAccountName);
        console.log('selected acc', selectedAccount);
        const isDuplicate = accounts.find((acc) => acc.name === value);

        let errorName = null;
        if (!!isDuplicate && selectedAccount.name !== value) {
            errorName = 'Account with such name already exists, please choose a different one.';
        } else {
            errorName = validateAccountName(value);
        }

        this.setState({
            newAccountName: value,
            errorName
        });

    }

    saveName = (e: any) => {
        const { selectedAccount: account, updateAccountName } = this.props;
        const { newAccountName, errorName } = this.state;
        console.log('In save name', newAccountName);
        console.log('selected acc in save name', account);
        e.preventDefault();
        if (!errorName) {
            updateAccountName(account, newAccountName);
        }
    }


    render() {
        const { stateIndex, isButtonClicked, newAccountName, errorName } = this.state;
        const { selectedAccount } = this.props;
        const renderedAccounts = this.props.accounts.map((account, index) => {
            console.log('ACCOUNT??', account);
            // console.log('INDEX', index);
            // console.log('SELECTED ACCOUNT', selectedAccount);
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
                            <div className={style.accountName}>
                                { stateIndex === index ?
                                    <TextInput
                                        type='text'
                                        id='name'
                                        value={newAccountName}
                                        onKeyUp={this.onNameChange}
                                        onChange={this.onNameChange}
                                        error={errorName}
                                    />
                                    : <div>{account.name}</div>
                                }
                            </div>
                            <div className={style.address}>{accountUtils.shortenAddres(account.address || '')}</div>
                        </div>
                        <div className={style.actionsContainer}>
                            {isButtonClicked ?
                                <button className='btnNoBg' onClick={this.saveName}>
                                    <Tooltip title='Save account name'>
                                        <IconEdit />
                                    </Tooltip>
                                </button>
                                :
                                <button className='btnNoBg' onClick={(e) => this.onEditClick(e, index)}>
                                    <Tooltip title='Edit account name'>
                                        <IconEdit />
                                    </Tooltip>
                                </button>
                            }
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
