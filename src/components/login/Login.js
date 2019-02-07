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
import Proptypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import LoginModal from "./LoginModal";

export default class Login extends Component {

    logout = () => {
        if (!confirm('Are you sure you want to logout?')) { return; }

        this.props.logout();
    };

    showLoginModal = () => {
        const modal = (
            <LoginModal
                onCloseClick={this.props.onSettingsModalClose}
                githubLogin={this.props.githubLogin}
                loginSuccess={this.props.loginSuccess}
            />
        );
        this.props.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            }
        });
    };

    render() {
        const isAuthenticated = this.props.loginActions.getIsAuthenticated;

        return(
            <div className={style.action}>
                {isAuthenticated
                    ?
                    <button
                        className={classNames([style.container, "btnNoBg"])}
                        onClick={this.logout}
                    >
                        <span>Logout</span>
                    </button>
                    :
                    <button
                        className={classNames([style.container, "btnNoBg"])}
                        onClick={this.showLoginModal}
                    >
                        <span>Login</span>
                    </button>
                }
            </div>
        );
    }
}

Login.proptypes = {
    functions: Proptypes.func.isRequired,
    onSettingsModalClose: Proptypes.func.isRequired,
}
