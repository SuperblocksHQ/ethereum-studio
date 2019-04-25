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

import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { ModalHeader } from '../../common/modal';
import { TextInput, DangerButton } from '../../common';

interface IProps {
    organization: any; // TODO: Add organization Model
    deleteOrganization: (projectId: string) => void;
    hideModal: () => void;
}

interface IState {
    isValid: boolean;
}

export default class DeleteProjectModal extends React.Component<IProps, IState> {

    state: IState = {
        isValid: false
    };

    handleTitleChange = (e: any) => {
        this.setState({
            isValid: this.props.organization.name === e.target.value
        });
    }

    onConfirmClick = () => {
        const { id } = this.props.organization;
        if (this.state.isValid) {
            this.props.deleteOrganization(id);
        }
    }

    render() {
        const { hideModal, organization } = this.props;
        const { isValid } = this.state;

        return (
            <div className={classNames([style.deleteOrganizationModal, 'modal'])}>
                <ModalHeader
                    title='Delete this organization'
                    onCloseClick={hideModal}
                />
                <div className={style.content}>
                    <p>
                        This action <b>cannot</b> be undone. This will permanently delete your organization and its data, making it inaccessible for any of the members in it.
                    </p>
                    <p>
                        To confirm this action, please type "<b>{organization.name}</b>":
                    </p>
                    <TextInput
                        id='organizationName'
                        type='text'
                        placeholder='Type the name of the organization to confirm...'
                        onChangeText={this.handleTitleChange}
                    />
                    <div className={style.footer}>
                        <div className={style.cancelBtn} onClick={hideModal}>Cancel</div>
                        <DangerButton text={'Delete Organization'} onClick={this.onConfirmClick} isDisabled={!isValid} />
                    </div>
                </div>

            </div>
        );
    }
}
