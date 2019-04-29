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
import moment from 'moment';
import { IUser } from '../../../../models';

interface IProps {
    user: any; // TODO: Add model of user
    currentUser: IUser;
}

export default class PeopleListItem extends Component<IProps> {

    sendInvitation = () => {
        // TODO: Handle invitation (send email to user)
    }

    removeUser = (userId: string) => {
        // TODO: Handle removing of user
    }

    renderAction = () => {
        const { user, currentUser } = this.props;

        if (user.id === currentUser.id) {
            return (
                <div>
                    -
                </div>
            );
        } else if (user.lastLogin === null) {
            return (
                <div onClick={this.sendInvitation} className={style.linkPrimary}>
                    Resend invite
                </div>
            );
        } else {
            return (
                <div onClick={() => this.removeUser(user.id)} className={style.linkPrimary}>
                    Remove
                </div>
            );
        }
    }

    render() {
        const { user } = this.props;

        return (
            <React.Fragment>
                <td>
                    <div className={style.flexVerticalCenter}>
                        <img src={user.imageUrl} className={style['mr-2']} alt={user.name} />
                        <div>
                            <span className={style['mb-1']}>
                                {user.name}
                            </span>
                            <span className={style.colorGrey}>
                                {user.email}
                            </span>
                        </div>
                    </div>
                </td>
                <td>
                    { user.lastLogin !== null ?
                        moment.utc(user.lastLogin).fromNow()
                    :
                        'never'
                    }
                </td>
                <td>
                    {user.role}
                </td>
                <td>
                    {this.renderAction()}
                </td>
            </React.Fragment>
        );
    }
}
