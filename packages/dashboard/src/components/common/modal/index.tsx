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
import classNames from 'classnames';
import style from './style.less';
import { IconClose } from '../../icons';

interface IProps {
    title: string;
    onClose: () => void;
    children: JSX.Element;
}

export function Modal(props: IProps) {
    return (
        <div className={style.modalContainer}>
            <div className={style.header}>
                <div className={style.title}>{props.title}</div>
                <button className={classNames([style.closeIcon, 'btnNoBg'])} onClick={props.onClose}>
                    <IconClose className={style.icon}/>
                </button>
            </div>
            <div className={style.modal}>{props.children}</div>
        </div>
    );
}
