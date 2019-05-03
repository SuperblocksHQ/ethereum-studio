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
import { ModalHeader, TextInput, StyledButton } from '../../common';
import { StyledButtonType } from '../../../models/button.model';
import { Modal } from '../../common/modal';
import { validateOrganizationName } from '../../../validations';

interface IProps {
    hideModal: () => void;
    createOrganization: (name: string, description: string, redirect: boolean) => void;
}

interface IState {
    errorName: string | null;
    organizationName: string;
    canCreate: boolean;
}

export default class CreateOrganizationModal extends React.Component<IProps, IState> {

    state: IState = {
        errorName: null,
        organizationName: '',
        canCreate: false
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value || ' ';
        const errorName = name ? validateOrganizationName(name) : null;

        this.setState({
            errorName,
            organizationName: name,
            canCreate: !errorName
        });
    }

    onCreate = () => {
        const { createOrganization } = this.props;
        const { organizationName } = this.state;

        createOrganization(organizationName, '', true);
    }

    render() {
        const { hideModal } = this.props;
        const { errorName, canCreate } = this.state;

        return (
            <Modal>
                <div className={classNames([style.createOrganizationModal, 'modal'])}>
                    <ModalHeader
                        title='Create an organization'
                        onCloseClick={hideModal}
                    />
                    <div className={style.content}>
                        <div className={style['mb-4']}>
                            <TextInput
                                onChangeText={this.onNameChange}
                                error={errorName}
                                label={'Organization name:'}
                                id={'organizationName'}
                                required={true}
                                placeholder={'Enter organization name'}
                            />
                            <p className={style.secondLabel}>This will be your organization name on https://superblocks.com/</p>
                        </div>
                        <div className={style.footer}>
                            <div className={style.cancelBtn} onClick={hideModal}>Cancel</div>
                            <StyledButton
                                type={StyledButtonType.Primary}
                                text={'Create Organization'}
                                onClick={this.onCreate}
                                isDisabled={!canCreate}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
