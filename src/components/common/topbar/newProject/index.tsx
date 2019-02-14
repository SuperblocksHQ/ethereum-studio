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
import { DropdownContainer, Tooltip } from '../../';
import NewProjectDialog from './newProjectDialog';
import style from './style.less';

export const NewProjectAction = () => (
    <DropdownContainer
            className={classNames([style.actionMenu, style.actionRight])}
            dropdownContent={<NewProjectDialog />}
    >
        <div className={classNames([style.action, style.actionRight])}>
            <Tooltip title='New Project'>
                <div className={style.alignCenter}>
                    <button className={classNames([style.container, 'btnNoBg'])}>
                        <IconNew />
                    </button>
                    <div className={style.caret} >
                        <IconAngleDown className={style.angleDown}/>
                    </div>
                </div>
            </Tooltip>
        </div>
    </DropdownContainer>
);



