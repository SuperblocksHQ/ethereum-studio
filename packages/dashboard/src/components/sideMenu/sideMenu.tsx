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
import classNames from 'classnames';
import { IconDoubleArrowLeft } from '../common/icons';

interface IState {
    collapsed: boolean;
}

export class SideMenu extends Component<{}, IState> {
    state = {
        collapsed: false
    };

    toggleExpanded = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const { collapsed } = this.state;

        return (
            <div className={classNames([style.sideMenuContainer, collapsed ? style.collapsed : null])}>
                <div className={style.sideMenuInner}>
                    {this.props.children}
                </div>
                <div className={classNames([style.collapseSidebar, style.item])} onClick={this.toggleExpanded}>
                    <IconDoubleArrowLeft />
                </div>
            </div>
        );
    }
}
