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

export default class AccountsItem extends Item {
    constructor(props, router) {
        props.type = props.type || 'accounts';
        super(props, router);
    }

    /**
     * Return the chosen account.
     * @return: The account name.
     */
    getChosen = () => {
        return this.props.state.chosen;
    };

    /**
     * Save which account is chosen.
     * @param account: The account name
     */
    setChosen = account => {
        this.props.state.chosen = account;
    };

    /**
     * Return account item by it's name.
     */
    getByName = name => {
        return this.getChildren().filter(account => {
            return account.getName() == name;
        })[0];
    };
}
