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
// import AccountEnvironmentList from './AccountEnvironmentList';

interface IProps {
    account: IAccount;
    environments: IEnvironment[];
    updateAccountName: (account: IAccount, neName: string) => void;
    hideModal: () => void;
}

interface IState {
    newAccountName: string;
    accountNameDirty: boolean;
}

export default class AccountConfigModal extends Component<IProps, IState> {

    state = {
        newAccountName: this.props.account.name,
        accountNameDirty: false
    };

    // TODO
    // canClose = (cb, silent) => {
    //     if (
    //         (this.state.accountBalanceDirty ||
    //             this.state.accountAddressDirty ||
    //             this.state.accountNameDirty) &&
    //         !silent
    //     ) {
    //         const flag = confirm(
    //             'There is unsaved data. Do you want to close tab and loose the changes?'
    //         );
    //         cb(flag ? 0 : 1);
    //         return;
    //     }
    //     cb(0);
    // }

    onNameChange = (e: any) => {
        const value = e.target.value;
        this.setState({
            newAccountName: value,
            accountNameDirty: true
        });
    }

    saveName = (e: any) => {
        const { account, updateAccountName } = this.props;
        const { newAccountName } = this.state;
        e.preventDefault();

        updateAccountName(account, newAccountName);
    }

    render() {
        const { account, environments, hideModal } = this.props;

        return (
            <Modal hideModal={hideModal}>
                <div className={classNames([style.accountConfigModal, 'modal'])}>
                    <ModalHeader
                        title='Configure Account'
                        onCloseClick={hideModal}
                    />
                    <div className={classNames([style.content, 'scrollable-y'])}>
                        <div className={style.inner}>
                            <h1 className={style.title}>Edit Account</h1>
                            <div className={style.form}>
                                <form action=''>
                                    <div className={style.field}>
                                        <div className='superInputDarkInline'>
                                            <label htmlFor='name'>Name</label>
                                            <input
                                                type='text'
                                                id='name'
                                                value={account.name}
                                                onKeyUp={this.onNameChange}
                                                onChange={this.onNameChange}
                                            />

                                            <button
                                                className='btn2'
                                                disabled={
                                                    !this.state.accountNameDirty
                                                }
                                                onClick={this.saveName}
                                            >
                                                Save name
                                            </button>
                                        </div>
                                        {/* <AccountEnvironmentList
                                            environments={environments}
                                        /> */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
