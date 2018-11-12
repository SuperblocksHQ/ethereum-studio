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

import Item from './item';

export default class AccountItem extends Item {
    constructor(props, router) {
        props.type = props.type || 'account';
        super(props, router);
    }

    /**
     * Get the wallet name for the account under a given environment.
     */
    getWallet = env => {
        return this._getData(env, 'wallet');
    };

    /**
     * Get the account index for the account under a given environment.
     */
    getAccountIndex = env => {
        return this._getData(env, 'index');
    };

    /**
     * For pseudo accounts, get the static address under a given environment.
     */
    getAddress = env => {
        return this._getData(env, 'address');
    };

    /**
     * Set this items key values to a new key.
     *
     */
    reKey = newkey => {
        this.props.state.key = newkey;
        this.props.state.name = newkey;
        this.props.state.title = newkey;
    };

    _getData = (env, key) => {
        var value = this.props.state[key];
        if (value === undefined) {
            const envObj = this.props.state._environments.filter(envObj => {
                return envObj.name == env;
            })[0];
            if (envObj) {
                value = (envObj.data || {})[key];
            }
        }
        return value;
    };
}
