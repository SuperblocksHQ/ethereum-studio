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
import style from './account-env-list.less';
import { IAccount } from '../../../../models/state';
import { getWeb3 } from '../../../../services/utils';
import Networks from '../../../../networks';

interface IProps {
    accountInfo: IAccount;
    environment: string;
    updateAddress(address: string): void;
    openWallet(walletName: string): void;
}

interface IState {
    accountAddressDirty: string;
}

export default class NetworkInfo extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            accountAddressDirty: toDisplayAddress(props.accountInfo.address)
        };
    }

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.accountInfo !== this.props.accountInfo) {
            this.setState({ accountAddressDirty: toDisplayAddress(this.props.accountInfo.address) });
        }
    }

    onAddressChange = (e: any) => {
        this.setState({ accountAddressDirty: e.target.value });
    }

    render() {
        const { accountInfo, environment, updateAddress, openWallet } = this.props;

        if (accountInfo.type === 'pseudo') { // Static address
            const { accountAddressDirty } = this.state;
            const saveDisabled = accountAddressDirty === accountInfo.address;

            return (
                <div>
                    <div className='superInputDarkInline'>
                        <label htmlFor='address'>Address</label>
                        <input
                            type='text'
                            id='address'
                            onKeyUp={this.onAddressChange}
                            onChange={this.onAddressChange}
                            value={this.state.accountAddressDirty}
                        />

                        <button
                            className='btn2'
                            disabled={saveDisabled}
                            onClick={() => updateAddress(accountAddressDirty)}>
                            Save
                        </button>
                    </div>
                    <p>
                        <b>NOTE:</b> This account only has a public address which you need to set yourself. This means that the
                        account cannot be used for any transactions. The reason for this feature is that this account can be passed as
                        argument to contract constructors.
                    </p>
                </div>
            );
        } else {
            // Check for external web3 provider
            if (accountInfo.type === 'metamask') {
                if (accountInfo.isLocked) {
                    return <p>Metamask is locked. Unlock Metamask to see address and balance of this account.</p>;
                } else {
                    const web3 = getWeb3(Networks[environment].endpoint);
                    return (
                        <div className={style.accountInfo}>
                            <h3>Metamask account</h3>
                            <p>
                                <b>Address:</b> {accountInfo.address}
                            </p>
                            <p>{
                                accountInfo.balance
                                ? <React.Fragment>
                                        <b>Balance:</b> {web3.toWei(accountInfo.balance)} wei ({accountInfo.balance} Ether){' '}
                                </React.Fragment>
                                : <span><b>Balance:</b> {'<could not get balance>'}</span>
                                }
                            </p>
                        </div>
                    );
                }
            } else { // Regular wallet
                if (accountInfo.isLocked) {
                    return (
                        <div>
                            <p>This wallet is locked. Unlock the wallet to show the address and the balance.</p>
                            <button className='btn2' onClick={() => openWallet(accountInfo.walletName || '')}>Unlock</button>
                        </div>
                    );
                } else {
                    let unlockDifferentAccountButton;
                    if (accountInfo.walletName === 'private' || (accountInfo.walletName === 'external' && !window.web3)) {
                        unlockDifferentAccountButton = (
                            <button className='btn2' onClick={() => openWallet(accountInfo.walletName || '')}>
                                Unlock a different account
                            </button>
                        );
                    }

                    const web3 = getWeb3(Networks[environment].endpoint);

                    return (
                        <div className={style.accountInfo}>
                            <p><b>Address:</b> {accountInfo.address}</p>
                            <p>{
                                accountInfo.balance
                                ? <React.Fragment>
                                        <b>Balance:</b> {web3.toWei(accountInfo.balance)} wei ({accountInfo.balance} Ether){' '}
                                </React.Fragment>
                                : <span><b>Balance:</b> {'<could not get balance>'}</span>
                                }
                            </p>
                            {unlockDifferentAccountButton}
                        </div>
                    );
                }
            }
        }
    }
}

function toDisplayAddress(address: Nullable<string>) {
    return (!address || address === '0x0') ? '' : address;
}
