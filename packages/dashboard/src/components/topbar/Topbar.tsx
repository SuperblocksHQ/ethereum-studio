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
import style from './style.less';
import { HelpAction } from '../common';
import LoggedInButton from './../login/LoggedInButton';
import { IUser } from './../../models/user.model';
import { Link } from 'react-router-dom';

interface IProps {
    logout: () => void;
    userProfile: IUser;
}

export default class Topbar extends Component<IProps> {

    render() {
        const { userProfile, logout } = this.props;

        return(
            <div className={style.topbar}>
                <Link to='/' className={style.logo}>
                    <img
                        src='/static/img/img-logo-dashboard.svg'
                        alt='Superblocks logo'
                    />
                </Link>

                <div className={style.actionsRight}>
                    <HelpAction />
                    <LoggedInButton
                        logout={logout}
                        userProfile={userProfile}
                    />
                </div>
            </div>
        );
    }
}
