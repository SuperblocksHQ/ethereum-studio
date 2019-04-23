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
    IconHelp,
    IconDiscord
} from '../../icons';
import { DropdownContainer } from '../../';
import { Tooltip } from '../../';
import style from './style.less';


const HelpDropdownDialog = () => (
    <div className={style.helpMenu}>
        <div className={style.title}>General</div>
        <ul>
            <li>
                <a
                    href='https://help.superblocks.com/hc/en-us/categories/360000486714-Using-Superblocks-Lab'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Guide to Superblocks
                </a>
            </li>
            <li>
                <a
                    href='https://www.youtube.com/playlist?list=PLjnjthhtIABuzW2MTsPGkihZtvvepy-n4'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Video tutorials
                </a>
            </li>
            <li>
                <a
                    href='https://help.superblocks.com'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Help Center
                </a>
            </li>
            <li>
                <a
                    href='https://help.superblocks.com/hc/en-us/requests/new'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Ask a question
                </a>
            </li>
            <li>
                <a className={style.container} href='https://discord.gg/6Cgg2Dw' target='_blank' rel='noopener noreferrer' title="Superblocks' community">
                    Join our Community!
                    <span className={style.communityIcon}>
                        <IconDiscord color='#7289DA'/>
                    </span>
                </a>
            </li>
        </ul>
    </div>
);

export const HelpAction = () => (
    <DropdownContainer
            className={classNames([style.actionMenu, style.actionRight])}
            dropdownContent={<HelpDropdownDialog />}
    >
        <div className={style.action}>
            <Tooltip title='Help'>
                <button className={classNames([style.container, 'btnNoBg'])}>
                    <IconHelp />
                </button>
            </Tooltip>
        </div>
    </DropdownContainer>
);



