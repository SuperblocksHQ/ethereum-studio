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
    categories: number[];
    description: string;
    image: string;
    name: string;
}

interface IProps {
    hideModal: () => void;
}

interface IState {
    categorySelectedId: number | null;
    selectedTemplate: ITemplate;
}

const TemplateLayout = (props: any) => (
    <div onClick={props.onTemplateSelected} className={classNames([style.templateLayout], { [style.selected]: props.selected }, style.alignContentCenter)}>
        <img src={props.image} width='300'/>
        <div style={{height: '90px'}}>
            <div className={style.title}>{props.name}</div>
            <div className={style.description}>{props.description}</div>
        </div>
    </div>
);

const GridLayout = (props: any) => (
    <div className={style.gridLayout}>
        <div id='mainContent' className='container' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 0fr)', gridGap: '10px', gridAutoRows: 'minMax(100px, auto)' }}>
            { props.templates
                .filter((template: ITemplate) => template.categories.indexOf(props.categorySelectedId) > -1)
                .map((template: ITemplate) => (
                    <TemplateLayout
                        key={template.id}
                        image={template.image}
                        name={template.name}
                        description={template.description}
                        selected={template.id === props.templateSelectedId}
                        onTemplateSelected={() => props.onTemplateSelected(template)} />
                    )
                )
            }
        </div>
    </div>
);

export default class ProjectTemplateModal extends Component<IProps, IState> {
    state: IState = {
        categorySelectedId: 0,
        selectedTemplate: {} as ITemplate
    };

    onCloseClickHandle = () => {
        this.props.hideModal();
    }

    onTemplateSelected = (selectedTemplate: ITemplate) => {
        this.setState({
            selectedTemplate,
        });
    }

    onCategorySelected(id: number) {
        this.setState({
            categorySelectedId: id
        });
    }

    onCreateProjectHandle = () => {
        logEvent('PROJECT_CREATED', { template: this.state.selectedTemplate.name});
        window.location.href = `${window.location.origin}/${this.state.selectedTemplate.id}`;
    }

    render() {
        const { categories, templates } = Templates;
        const { categorySelectedId, selectedTemplate } = this.state;

        return (
            <div className={classNames([style.projectTemplateModal, 'modal'])}>
                <LogOnMount eventType='NEW_PROJECT_SELECT_TEMPLATE'/>
                <div className={style.innerContent}>
                    <ModalHeader
                        title='Select Template'
                        onCloseClick={this.onCloseClickHandle}
                    />
                    <div className={classNames([style.area, style.container])}>
                        <div className={style.categoriesArea}>
                            <div className={style.categoriesTitle}>Categories</div>
                                <ul>
                                <ul>
                                    { categories.map((category: any) => (
                                            <li key={category.id}
                                                className={categorySelectedId === category.id ? style.selected : null}>
                                                <div onClick={() => this.onCategorySelected(category.id)}>{category.name}</div>
                                            </li>
                                        )
                                     )
                                    }
                                </ul>
                                </ul>
                            </div>
                        <div className={style.templateListContainer}>
                            <div className={style.templateListArea}>
                                <GridLayout
                                    templates={templates}
                                    onTemplateSelected={this.onTemplateSelected}
                                    templateSelectedId={selectedTemplate ? selectedTemplate.id : null}
                                    categorySelectedId={categorySelectedId}/>
                            </div>
                        </div>
                    </div>
                    <div className={style.footer}>
                        <button onClick={this.onCloseClickHandle} className='btn2 noBg mr-2'>Cancel</button>
                        <button onClick={this.onCreateProjectHandle} disabled={Object.entries(selectedTemplate).length === 0} className='btn2'>Select Template</button>
                    </div>
                </div>
            </div>
        );
    }
}
