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
import { ModalHeader } from '../../modal';

interface IProps {
    // project: IProject;
    deleteProject: (projectId: string) => void;
    hideModal: () => void;
}

interface IState {
    errorName: string | null;
    errorDescription: string | null;
    canSave: boolean;
}

export default class DeleteProjectModal extends React.Component<IProps, IState> {

    state: IState = {
        errorName: null,
        errorDescription: null,
        canSave: true
    };



    render() {
        const { hideModal } = this.props;
        const { errorName, errorDescription, canSave } = this.state;

        return (
            <div className={classNames([style.editModal, 'modal'])}>
                <ModalHeader
                    title='Project info'
                    onCloseClick={hideModal}
                />

            </div>
        );
    }
}
