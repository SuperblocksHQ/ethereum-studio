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
import { IconCheckThin } from '../../icons';

interface IProps {
    title: string;
    description: string;
    onClick: () => void;
}

interface IState {
    active: boolean;
    disabled: boolean;
}

export class MenuItem extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            active: false,
            disabled: false
        };
    }

    render() {
        const { title, description } = this.props;
        const { active, disabled } = this.state;


        return (
            <div className={classNames([style.title, disabled ? style.disabled : null])}>
                <div className={style.activeContainer}>
                    {active &&
                        <IconCheckThin />
                    }
                </div>
                <div>{title}</div>
                <div className={style.description}>{description}</div>
            </div>
        );
    }
}
