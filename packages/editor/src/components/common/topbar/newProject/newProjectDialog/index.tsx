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
import Templates from '../../../../modals/projectTemplateModal/templates';
import { ITemplate } from '../../../../../models';


interface IProps {
    createProjectFromTemplate: (template: ITemplate) => void;
    showModal: (modalType: string, modalProps: any) => void;
}

class NewProjectDialog extends Component<IProps> {

    startWithTemplate = () => {
        const { showModal } = this.props;
        showModal('PROJECT_TEMPLATE_MODAL', { hideWelcome: true });
    }

    render() {
        const { createProjectFromTemplate } = this.props;

        return (
            <div className={classNames([style.menu, 'contextMenu'])}>
                <ul>
                    <li>
                        <div onClick={() => createProjectFromTemplate(Templates.templates[3])}>
                            Create empty project
                        </div>
                    </li>
                    <li>
                        <div onClick={this.startWithTemplate}>
                            Start with a template
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
    return {
        createProjectFromTemplate: (template: ITemplate) => {
            dispatch(projectsActions.createProjectFromTemplate(template));
        },
        showModal: (modalType: string, modalProps: any) => {
            dispatch(modalActions.showModal(modalType, modalProps));
        }
    };
};

export default connect(null, mapDispatchToProps)(NewProjectDialog);
