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
import { Link } from 'react-router-dom';

interface IProps {
    icon?: JSX.Element;
    title: string;
    onClick?: any;
    active?: boolean;
    linkTo: string;
    children?: any;
}

export function SideMenuItem(props: IProps) {
    return (
        <div className={classNames([style.posRelative, !props.active ? style.flyOut : style.itemWrapper])}>
            <Link to={props.linkTo}>
                <div onClick={props.onClick} className={classNames([style.item, props.active ? style.active : null])}>
                    <div className={style.iconContainer}>
                        {props.icon}
                    </div>
                    <span>
                        {props.title}
                    </span>
                </div>
            </Link>
            {props.children}
        </div>
    );
}
