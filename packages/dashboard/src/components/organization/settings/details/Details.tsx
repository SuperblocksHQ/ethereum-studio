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
import { BreadCrumbs, TextInput, TextAreaInput, StyledButton } from '../../../common';
import { StyledButtonType } from '../../../../models/button.model';
import { Link } from 'react-router-dom';
import { validateOrganizationName } from '../../../../validations';
import OnlyIf from '../../../common/onlyIf';
import DeleteOrganizationModal from '../../../modals/deleteOrganizationModal';

interface IProps {
    location: any;
    match: any;
    organization: any; // TODO: Any organization model
    updateOrganization: (name: string, description: string) => void; // TODO: Add organization model
    showDeleteOrganizationModal: boolean;
    toggleDeleteOrganizationModal: () => void;
}

interface IState {
    errorName: string | null;
    newName: string;
    newDescription: string;
    canSave: boolean;
}

export default class Details extends Component<IProps, IState> {

    state: IState = {
        errorName: null,
        newName: 'Organization name placeholder', // TODO: Fetch from props
        newDescription: 'Organization description placeholder', // TODO: Fetch from props
        canSave: true
    };

    onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value || ' ';
        const errorName = newName ? validateOrganizationName(newName) : null;

        this.setState({
            errorName,
            newName,
            canSave: !errorName
        });
    }

    onDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDescription = e.target.value;

        this.setState({
            newDescription
        });
    }

    onSave = () => {
        const { updateOrganization } = this.props;
        const { newName, newDescription} = this.state;

        updateOrganization(newName, newDescription);
    }

    render() {
        const { showDeleteOrganizationModal, toggleDeleteOrganizationModal } = this.props;
        const { errorName, canSave } = this.state;

        {/* TODO: Fetch organization from redux */}
        const organization = {
            name: 'Organization name placeholder',
            description: 'Organization description placeholder'
        };

        return (
            <React.Fragment>
                <div className={style.details}>
                    <BreadCrumbs>
                        <Link to={`/${this.props.match.params.organizationId}`}>{organization.name}</Link>
                        <Link to={`/${this.props.match.params.organizationId}/settings/details`}>Organization Settings</Link>
                        <Link to={window.location.pathname}>Details</Link>
                    </BreadCrumbs>

                    <h1>Details</h1>
                    <div className={style['mb-5']}>
                        <TextInput
                            onChangeText={this.onNameChange}
                            error={errorName}
                            label={'Organization name'}
                            id={'organizationName'}
                            placeholder={'organization-name'}
                            defaultValue={organization.name}
                            required={true}
                        />
                    </div>
                    <div className={style['mb-4']}>
                        <TextAreaInput
                            onChangeText={this.onDescChange}
                            label={'Description'}
                            id={'description'}
                            placeholder={'Enter a short description (optional)'}
                            defaultValue={organization.description}
                        />
                    </div>
                    <StyledButton type={StyledButtonType.Primary} text={'Save Details'} onClick={this.onSave} isDisabled={!canSave}/>

                    <div className={style.sectionDivider}></div>

                    <h1>Delete this organization</h1>
                    <p className={style['mb-4']}>Once deleted, it will be gone forever. Please be certain.</p>
                    <StyledButton type={StyledButtonType.Danger} text={'Delete Organization'} onClick={() => toggleDeleteOrganizationModal()} />
                </div>

                <OnlyIf test={showDeleteOrganizationModal}>
                    <DeleteOrganizationModal hideModal={toggleDeleteOrganizationModal} organization={organization} />
                </OnlyIf>
            </React.Fragment>
        );
    }
}
