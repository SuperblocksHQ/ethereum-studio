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
import { Link } from 'react-router-dom';
import PeopleListItem from './PeopleListItem';
import { BreadCrumbs, StyledButton } from '../../../common';
import { IUser } from '../../../../models';
import { StyledButtonType } from '../../../../models/button.model';
import InvitePeopleModal from '../../../modals/invitePeopleModal/InvitePeopleModal';
import OnlyIf from '../../../common/onlyIf';

interface IProps {
    location: any;
    match: any;
    userProfile: IUser;
    showInvitePeopleModal: boolean;
    toggleInvitePeopleModal: () => void;

}

export default class PeopleList extends Component<IProps> {
    render() {
        const { showInvitePeopleModal, toggleInvitePeopleModal } = this.props;

        // TODO: Get users from redux
        const organization = {
            name: 'Organization name placeholder',
            users: [
                {
                    id: '5cb47caf21a7140017e120c5',
                    imageUrl: 'https://avatars0.githubusercontent.com/u/17637244?v=4&s=24',
                    name: 'Krystof Viktora',
                    email: 'krystof@superblocks.com',
                    lastLogin: '2019-04-15T12:47:45.090Z',
                    role: 'Admin'
                },
                {
                    id: '2151dsfds5f2sdf',
                    imageUrl: 'https://avatars0.githubusercontent.com/u/17637244?v=4&s=24',
                    name: 'John Doe',
                    email: 'john@superblocks.com',
                    lastLogin: null,
                    role: 'Basic'
                },
                {
                    id: '2151dsfds5f2sdf',
                    imageUrl: 'https://avatars0.githubusercontent.com/u/17637244?v=4&s=24',
                    name: 'Frodo Baggins',
                    email: 'frodo@superblocks.com',
                    lastLogin: '2019-04-15T12:47:45.090Z',
                    role: 'Basic'
                },
            ]
        };

        return (
            <React.Fragment>
                <BreadCrumbs>
                    <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                    <Link to={`/${this.props.match.params.organizationId}/settings/details`}>Organization Settings</Link>
                    <Link to={window.location.pathname}>People</Link>
                </BreadCrumbs>

                <div className={style.flexVerticalCenter}>
                    <h1>People</h1>
                    <StyledButton type={StyledButtonType.Primary} text={'Invite People'} onClick={() => toggleInvitePeopleModal()} customClassName={style.inviteBtn} />
                </div>

                <OnlyIf test={showInvitePeopleModal}>
                    <InvitePeopleModal hideModal={toggleInvitePeopleModal} />
                </OnlyIf>

                <div className={style.hr}></div>

                <table className={style.peopleList}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Last seen</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { organization.users.map(user =>
                            <tr className={style.userItem} key={user.email}>
                                <PeopleListItem user={user} currentUser={this.props.userProfile} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}
