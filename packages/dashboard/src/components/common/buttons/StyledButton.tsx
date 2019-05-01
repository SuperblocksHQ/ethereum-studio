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
import { StyledButtonType } from '../../../models/button.model';
import OnlyIf from '../onlyIf';

interface IProps {
    type: StyledButtonType;
    text: string;
    icon?: JSX.Element;
    customClassName?: string;
    isDisabled?: boolean;
    onClick: () => void;
}

export const StyledButton = (props: IProps) => {
    let clsBtn = {};

    switch (props.type) {
        case StyledButtonType.Primary:
            clsBtn = style.primaryButton;
            break;
        case StyledButtonType.Danger:
            clsBtn = style.dangerButton;
            break;
        default:
            break;
    }

    return (
        <button onClick={props.onClick} className={classNames([style.btn, clsBtn, props.customClassName])} disabled={props.isDisabled}>
            <OnlyIf test={!!props.icon}>
                <div className={style.icon}>
                    {props.icon}
                </div>
            </OnlyIf>
            <span>
                {props.text}
            </span>
        </button>
    );
};
