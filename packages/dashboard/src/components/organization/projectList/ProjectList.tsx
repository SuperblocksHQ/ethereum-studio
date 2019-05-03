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
import { IProject } from '../../../models';
import Header from './header';
import Filter from './filter';
import ProjectRow from './projectRow/ProjectRow';
import OnlyIf from '../../common/onlyIf';
import { StyledButton } from '../../common';
import { StyledButtonType } from '../../../models/button.model';

interface IProps {
    list: IProject[];

    organizationName: string;
    organizationId: string;
}

interface IState {
    orderBy: string;
    order: string;
    projectFilter: string;
}

export default class ProjectList extends Component<IProps, IState> {

    state: IState = {
        orderBy: 'lastModifiedAt',
        order: 'desc',
        projectFilter: ''
    };

    handleOrderByChange = (orderValue: string) => {
        this.setState({
            orderBy: orderValue
        });
    }

    handleOrderChange = () => {
        this.setState({
            order: this.state.order === 'asc' ? 'desc' : 'asc'
        });
    }

    handleFilterChange = (filter: string) => {
        this.setState({
            projectFilter: filter
        });
    }

    resetFilter = () => {
        this.setState({
            projectFilter: ''
        });
    }

    dynamicSort = (property: string, order: string) => {
        let sortOrder = 1;

        if (order === 'desc') {
            sortOrder = -1;
        }

        return (a: any, b: any)  => {
            if (sortOrder === -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        };
    }

    render() {
        const { list, organizationName, organizationId } = this.props;
        const { orderBy, order, projectFilter } = this.state;
        const suggestedProjects = [...list].sort(this.dynamicSort('lastModifiedAt', 'desc')).slice(0, 3);

        // Filter projects from input and order them corresponding to selected sort
        let orderedList = list.filter((project: IProject) =>
                (projectFilter === '' ||
                (
                    project.name.toLowerCase().includes(projectFilter.toLowerCase()) ||
                    project.description.toLowerCase().includes(projectFilter.toLowerCase())
                )
        )).sort(this.dynamicSort(orderBy, order));

        if (orderBy === 'name') {
            orderedList = orderedList.reverse();
        }

        return (
            <div className={style.container}>
                <Header
                    title={organizationName}
                    suggestedProjects={suggestedProjects}
                    organizationId={organizationId}
                />
                <Filter
                    orderBy={orderBy}
                    order={order}
                    onOrderChange={this.handleOrderChange}
                    onOrderByChange={this.handleOrderByChange}
                    onFilterChange={this.handleFilterChange}
                    projectFilter={projectFilter}
                />
                <p>Name</p>
                <div className={style.hr}></div>
                <div className={style.projectTable}>
                {
                    orderedList.map((project: IProject) => {
                        return (
                            <ProjectRow
                                orderBy={orderBy}
                                key={project.id}
                                project={project}
                                organizationId={organizationId}
                            />
                        );
                    })
                }
                {/* Show 'Reset filter' button when filtering results into 0 projects */}
                <OnlyIf test={projectFilter && orderedList.length <= 0}>
                    <div className={style.resetFilter}>
                        <p>No projects found</p>
                        <StyledButton type={StyledButtonType.Primary} onClick={() => this.resetFilter()} text='Reset filter' />
                    </div>
                </OnlyIf>
                </div>
            </div>
        );
    }
}
