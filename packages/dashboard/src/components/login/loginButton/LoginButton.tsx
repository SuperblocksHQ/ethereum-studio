// Copyright 2019 Superblocks AB
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
import LoggedInButton from '../LoggedInButton';
import {IUser} from '../../../models';

interface IProps {
    logout: () => void;

    userProfile: IUser;
}

export default class LoginButton extends Component<IProps> {

    logout = () => {
        if (!confirm('Are you sure you want to logout?')) { return; }

        this.props.logout();
    }

    render() {
        const { userProfile } = this.props;

        return(
            <React.Fragment>
                <LoggedInButton
                    logout={this.logout}
                    userProfile={userProfile}
                />
            </React.Fragment>
        );
    }
}
