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

import React from 'react';
import classNames from 'classnames';
import {
    IconAngleDown,
    IconNew
} from '../../../icons';
import { DropdownContainer } from '../../';
import style from './style.less';

// TODO - Finalise all this
const NewDropdownDialog = () => (
    <div className={'contextMenu'}>
        <ul>
            <li>
                <a
                    href='https://help.superblocks.com'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Start from scratch
                </a>
            </li>
            <li>
                <a
                    href='https://help.superblocks.com'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Start with a template
                </a>
            </li>
            <li>
                <a
                    href='https://help.superblocks.com'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Import a project
                </a>
            </li>
        </ul>
    </div>
);

export const NewProjectAction = () => (
    <DropdownContainer
            className={classNames([style.actionMenu, style.actionRight])}
            dropdownContent={<NewDropdownDialog />}
    >
        <div className={classNames([style.action, style.actionRight])}>
            <button className={classNames([style.container, 'btnNoBg'])}>
                <IconNew />
            </button>
            <div className={style.caret} >
                <IconAngleDown className={style.angleDown}/>
            </div>
        </div>
    </DropdownContainer>
);



