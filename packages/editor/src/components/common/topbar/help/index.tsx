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
} from '../../../icons';
import { DropdownContainer } from '../../';
import { Tooltip } from '../../';
import style from './style.less';

const HelpDropdownDialog = ({openAboutModal}: IProps) => (
    <div className={style.helpMenu}>
        <div className={style.title}>General</div>
        <ul>
            <li>
                <a
                    href='https://help.superblocks.com/en/collections/1865071-ethereum-studio'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Guide to Ethereum Studio
                </a>
            </li>
            <li>
                <a
                    href='https://discuss.superblocks.com/c/ethereum-studio'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Ask a question
                </a>
            </li>
            <li>
                <a href='' onClick={(e) => { e.preventDefault(); openAboutModal(); }}>
                    About
                </a>
            </li>
        </ul>
    </div>
);

interface IProps {
    openAboutModal: () => void;
}

export const HelpAction = ({ openAboutModal }: IProps) => (
    <DropdownContainer
            className={classNames([style.actionMenu, style.actionRight])}
            dropdownContent={<HelpDropdownDialog openAboutModal={openAboutModal} />}
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
