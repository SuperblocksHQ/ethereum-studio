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
import Templates from './templates';
import { LogOnMount } from '../../../utils/analytics';
import { ModalHeader, StyledButton } from '../../common';
import classNames from 'classnames';
import style from './style.less';
import { StyledButtonType } from '../../common/buttons/StyledButtonType';
import { ITemplate } from '../../../models';

interface IProps {
    isProjectLoading: boolean;
    createProjectFromTemplate: (template: ITemplate) => void;
    hideModal: () => void;
    hideWelcome: boolean;
}

interface IState {
    selectedTemplate: ITemplate | null;
}

export default class ProjectTemplateModal extends Component<IProps, IState> {
    state: IState = {
        selectedTemplate: this.props.hideWelcome ? Templates.templates[0] as ITemplate : null
    };

    onCloseClickHandle = () => {
        this.props.hideModal();
    }

    onTemplateSelected = (selectedTemplate: ITemplate | null) => {
        this.setState({
            selectedTemplate,
        });
    }

    onCreateProjectHandle = () => {
        const { createProjectFromTemplate } = this.props;
        const { selectedTemplate } = this.state;

        if (selectedTemplate) {
            createProjectFromTemplate(selectedTemplate);
        }
    }

    render() {
        const { templates } = Templates;
        const { isProjectLoading, hideWelcome } = this.props;
        const { selectedTemplate } = this.state;

        return (
            <div className={classNames([style.projectTemplateModal, 'modal'])}>
                <LogOnMount eventType='NEW_PROJECT_SELECT_TEMPLATE'/>
                <div className={style.innerContent}>
                    <ModalHeader
                        title='Select Template'
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={classNames([style.area, style.container])}>
                        <div className={style.templateListPanel}>
                            <div className={style.templateListTitle}>Templates</div>
                                <ul>
                                    {  templates.map((template: ITemplate) => (
                                            <li key={template.id}
                                                className={selectedTemplate && selectedTemplate.id === template.id ? style.selected : null}>
                                                <div onClick={() => this.onTemplateSelected((!hideWelcome && selectedTemplate && selectedTemplate.id === template.id) ? null : template)}>{template.name}</div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        <div className={style.templateListContainer}>
                            <div className={style.templateListArea}>
                                { selectedTemplate
                                ?   <div dangerouslySetInnerHTML={{__html: selectedTemplate.description}} />
                                :   <div>
                                        <h2>Welcome</h2>
                                        <p>
                                            Ethereum Studio is a tool for developers who want to learn about building on Ethereum.
                                            The templates on the left side will teach you how to write a smart contract, deploy it to Ethereum,
                                            and interact with the contracts through a web-based application.
                                        </p>
                                        <p>For quick start, check out this <a href='https://www.youtube.com/watch?v=-tjk0yIIaIM' target='_blank' rel='noopener noreferrer'>video</a>.</p>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <StyledButton
                            type={StyledButtonType.Secondary}
                            text='Cancel'
                            onClick={this.onCloseClickHandle}
                            className='mr-2'
                        />
                        <StyledButton
                            type={StyledButtonType.Primary}
                            isDisabled={selectedTemplate ? Object.entries(selectedTemplate).length === 0 : true}
                            text='Create Project'
                            onClick={this.onCreateProjectHandle}
                            loadingText='Creating...'
                            loading={isProjectLoading}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
