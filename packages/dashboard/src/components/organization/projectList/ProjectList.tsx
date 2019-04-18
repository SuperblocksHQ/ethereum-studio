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
import Project from './project';
import Header from './header';

interface IProps {
    getProjectList: () => void;

    list: IProject[];

    isListLoading: boolean;
    organizationName: string;
    organizationId: string;
}

interface IState {
    orderBy: string;
    order: string;
}

export default class ProjectList extends Component<IProps, IState> {

    state: IState = {
        orderBy: 'lastModifiedAt',
        order: 'desc'
    };

    componentDidMount() {
        this.props.getProjectList();
    }

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

    dynamicSort = (property: string) => {
        let sortOrder = 1;

        if (this.state.order === 'desc') {
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
        const { list, organizationName, organizationId, isListLoading } = this.props;
        const { orderBy, order } = this.state;

        let orderedList = list.sort(this.dynamicSort(orderBy));

        if (orderBy === 'name') {
            orderedList = orderedList.reverse();
        }

        // TODO - show the loading indicator

        return (
            <div className={style.container}>
                <Header
                    title={organizationName}
                    orderBy={orderBy}
                    order={order}
                    onOrderChange={this.handleOrderChange}
                    onOrderByChange={this.handleOrderByChange}
                />
                <div className={style.content}>
                {
                    orderedList.map((project: IProject) => {
                        return (
                            <Project
                                orderBy={orderBy}
                                key={project.id}
                                project={project}
                                organizationId={organizationId}
                            />
                        );
                    })
                }
                </div>
            </div>
        );
    }
}
