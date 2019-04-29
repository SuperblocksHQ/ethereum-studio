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
import { IconDropdown } from '../icons';

interface IProps {
    children: any;
    title: string;
}
interface IState { menuVisible: boolean; }

export class SubMenu extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            menuVisible: false
        };
    }

    openMenu: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ menuVisible: true }));
    }

    closeMenu: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ menuVisible: false }));
    }

    render() {
        const { children, title } = this.props;
        const { menuVisible } = this.state;
        const active = style.active;

        return (
            <div className={classNames([style.parentMenu, menuVisible ? active : null])} onMouseEnter={this.openMenu} onMouseLeave={this.closeMenu}>
                <div className={style.title}>
                    <div>{ title }</div>
                    <div className={style.description}>
                        <IconDropdown style={{transform: 'rotate(-45deg)'}}/>
                    </div>
                </div>
                { menuVisible &&
                <div className={style.childrenMenu}>
                    { children }
                </div> }
            </div>
        );
    }
}
