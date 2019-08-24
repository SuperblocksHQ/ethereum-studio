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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { projectsActions, modalActions } from '../../../../../actions';
import classNames from 'classnames';
import style from '../style.less';

// TODO - Finalise all this

interface IProps {
    createEmptyProject: (redirect: boolean) => void;
    showModal: (modalType: string, modalProps: any) => void;
    redirect: boolean;
}

class NewProjectDialog extends Component<IProps> {

    startWithTemplate = () => {
        const { showModal } = this.props;
        showModal('PROJECT_TEMPLATE_MODAL', null);
    }

    render() {
        const { createEmptyProject, redirect } = this.props;

        return (
            <div className={classNames([style.menu, 'contextMenu'])}>
                <ul>
                    <li>
                        <div onClick={() => createEmptyProject(redirect)}>
                            Create empty project
                        </div>
                    </li>
                    <li>
                        <div onClick={this.startWithTemplate}>
                            Start with a template
                        </div>
                    </li>
                    <li>
                        <a
                            href='https://help.superblocks.com'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            Import a project
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        createEmptyProject: (redirect: boolean) => {
            dispatch(projectsActions.createEmptyProject(redirect));
        },
        showModal: (modalType: string, modalProps: any) => {
            dispatch(modalActions.showModal(modalType, modalProps));
        }
    };
};

export default connect(null, mapDispatchToProps)(NewProjectDialog);
