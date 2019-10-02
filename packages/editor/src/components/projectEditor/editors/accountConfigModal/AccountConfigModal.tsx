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
import classNames from 'classnames';
import style from './style.less';
import { IAccount, IEnvironment } from '../../../../models/state';
import { Modal, ModalHeader } from '../../../common';
import AccountEnvironmentList from './AccountEnvironmentList';

interface IProps {
    accountInfo: IAccount;
    environments: IEnvironment[];
    environment: string;
    updateAccountName(account: IAccount, newName: string): void;
    hideModal(): void;

    changeEnvironment(environmentName: string): void;
    updateAddress(address: string): void;
    openWallet(walletName: string): void;
}

interface IState {
    newAccountName: string;
    accountNameDirty: boolean;
}

export default class AccountConfigModal extends Component<IProps, IState> {

    state = {
        newAccountName: this.props.accountInfo.name,
        accountNameDirty: false
    };

    onNameChange = (e: any) => {
        const value = e.target.value;
        this.setState({
            newAccountName: value,
            accountNameDirty: true
        });
    }

    saveName = (e: any) => {
        const { accountInfo: account, updateAccountName } = this.props;
        const { newAccountName } = this.state;
        e.preventDefault();

        updateAccountName(account, newAccountName);
        this.setState({
            accountNameDirty: false
        });
    }

    render() {
        const { accountInfo, environments, environment, hideModal, changeEnvironment, updateAddress, openWallet } = this.props;
        const { accountNameDirty, newAccountName } = this.state;

        return (
            <Modal hideModal={hideModal}>
                <div className={classNames([style.accountConfigModal, 'modal'])}>
                    <ModalHeader title='Configure Account' onCloseClick={hideModal} />

                    <div className={classNames([style.content, 'scrollable-y'])}>
                        <div className={style.inner}>
                            <h1 className={style.title}>Edit Account</h1>
                            <div className={style.form}>
                                <div className={style.field}>

                                    <div className='superInputDarkInline'>
                                        <label htmlFor='name'>Name</label>
                                        <input
                                            type='text'
                                            id='name'
                                            value={newAccountName}
                                            onKeyUp={this.onNameChange}
                                            onChange={this.onNameChange}
                                        />
                                        <button className='btn2' disabled={!accountNameDirty} onClick={this.saveName}>
                                            Save name
                                        </button>
                                    </div>

                                    <div className={style.infoText}>
                                        <div className={style.titleContainer}>
                                            <h3 className={style.title}>Configure the account foreach network</h3>
                                        </div>
                                        <div className={style.subtitle}>Each account must be configured for each of the networks available.
                                            <a href='https://help.superblocks.com/' target='_blank' rel='noopener noreferrer'>
                                                {' '}
                                                Click here
                                            </a>{' '}
                                            to access our Help Center and find more information about this.
                                        </div>
                                    </div>

                                    <AccountEnvironmentList
                                        accountInfo={accountInfo}
                                        environments={environments}
                                        environment={environment}
                                        changeEnvironment={changeEnvironment}
                                        updateAddress={updateAddress}
                                        openWallet={openWallet}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
        );
    }
}
