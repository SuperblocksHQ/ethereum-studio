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
import { logEvent, LogOnMount } from '../../../utils/analytics';
import { ModalHeader } from '../../common';
import classNames from 'classnames';
import style from './style.less';

interface ITemplate {
    id: number;
    description: string;
    name: string;
}

interface IProps {
    hideModal: () => void;
}

interface IState {
    selectedTemplate: ITemplate;
}

export default class ProjectTemplateModal extends Component<IProps, IState> {
    state: IState = {
        selectedTemplate: Templates.templates[0] as ITemplate
    };

    onCloseClickHandle = () => {
        this.props.hideModal();
    }

    onTemplateSelected = (selectedTemplate: ITemplate) => {
        this.setState({
            selectedTemplate,
        });
    }

    onCreateProjectHandle = () => {
        logEvent('PROJECT_CREATED', { template: this.state.selectedTemplate.name});
        window.location.href = `${window.location.origin}/${this.state.selectedTemplate.id}`;
    }

    render() {
        const { templates } = Templates;
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
                                                className={selectedTemplate.id === template.id ? style.selected : null}>
                                                <div onClick={() => this.onTemplateSelected(template)}>{template.name}</div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        <div className={style.templateListContainer}>
                            <div className={style.templateListArea}>
                                <div dangerouslySetInnerHTML={{__html: selectedTemplate.description}} />
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <button onClick={this.onCloseClickHandle} className='btn2 noBg mr-2'>Cancel</button>
                        <button onClick={this.onCreateProjectHandle} disabled={Object.entries(selectedTemplate).length === 0} className='btn2'>Create Project</button>
                    </div>
                </div>
            </div>
        );
    }
}
