// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks.
//
// Superblocks is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { StyledButtonType } from './StyledButtonType';
import OnlyIf from '../onlyIf';
import { IconSpinner } from '../../icons';

interface IProps {
    type: StyledButtonType;
    text: string;
    icon?: JSX.Element;
    className?: string;
    isDisabled?: boolean;
    onClick?: () => void;
    onMouseDown?: () => void;
    htmlType?: string;
    loading?: boolean;
    loadingText?: string;
    shouldSubmit?: boolean;
}

export const StyledButton = (props: IProps) => {
    let clsBtn = {};

    switch (props.type) {
        case StyledButtonType.Primary:
            clsBtn = style.primaryButton;
            break;
        case StyledButtonType.Secondary:
            clsBtn = style.secondaryButton;
            break;
        case StyledButtonType.Danger:
            clsBtn = style.dangerButton;
            break;
        case StyledButtonType.Constant:
            clsBtn = style.constantButton;
            break;
        case StyledButtonType.Transaction:
            clsBtn = style.transactionButton;
            break;
        case StyledButtonType.Payable:
            clsBtn = style.payableButton;
            break;
        default:
            break;
    }

    return (
        <button onClick={props.onClick} onMouseDown={props.onMouseDown} className={classNames([style.btn, clsBtn, props.className])} disabled={props.isDisabled || props.loading} type={props.shouldSubmit ? 'submit' : 'button'}>
            <div className={style.content}>
                <OnlyIf test={!props.loading}>
                    <OnlyIf test={!!props.icon}>
                        <div className={style.icon}>
                            {props.icon}
                        </div>
                    </OnlyIf>
                    <span>
                        {props.text}
                    </span>
                </OnlyIf>
                <OnlyIf test={props.loading}>
                    <div className={style.icon}>
                        <IconSpinner />
                    </div>
                    <span>
                        {props.loadingText ? props.loadingText : 'Loading'}
                    </span>
                </OnlyIf>
            </div>
        </button>
    );
};
