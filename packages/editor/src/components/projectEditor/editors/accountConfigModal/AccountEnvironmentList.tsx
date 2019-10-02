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
import style from './account-env-list.less';
import { IEnvironment, IAccount } from '../../../../models/state';
import NetworkInfo from './NetworkInfo';

interface IProps {
    environments: IEnvironment[];
    environment: string;
    accountInfo: IAccount;
    changeEnvironment(environmentName: string): void;
    updateAddress(address: string): void;
    openWallet(walletName: string): void;
}

export default function AccountEnvironmentList(props: IProps) {
    const { changeEnvironment, ...otherProps } = props;
    const { environments, environment } = props;

    return (
        <div className={style.networkSelector}>
            <div className={style.networks}>
                <ul>
                    {environments.map(env =>
                        (<li key={env.name} className={classnames({[style.active]: env.name === environment})}>
                            <div className={style.networkName} onClick={() => changeEnvironment(env.name)}>
                                {env.name}
                            </div>
                        </li>)
                    )}
                </ul>
            </div>
            <div className={style.networkInfo}>
                <NetworkInfo {...otherProps}  />
            </div>
        </div>
    );
}
