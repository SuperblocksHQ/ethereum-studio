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
import { IconCheck, IconClose, IconClock } from '../../common/icons';

interface IProps {
    status: number;
}

export function BuildStatus(props: IProps) {
    switch (props.status) {
        case 1:
            return (
                <div className={classNames([style.buildStatus, style.passed])}>
                    <IconCheck width='14px' height='14px' />
                    <span>passed</span>
                </div>
            );
        case 0:
            return (
                <div className={classNames([style.buildStatus, style.pending])}>
                    <IconClock width='14px' height='14px' />
                    <span>pending</span>
                </div>
            );
        default:
            return (
                <div className={classNames([style.buildStatus, style.failed])}>
                    <IconClose width='14px' height='14px' />
                    <span>failed</span>
                </div>
            );
    }
}
