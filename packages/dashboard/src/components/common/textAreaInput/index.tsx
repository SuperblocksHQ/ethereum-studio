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

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import style from './style.less';
import ErrorMessage from '../errorMessage';

interface IProps {
    id: string;
    onChangeText?: () => void;
    tip?: string;
    label?: string;
    defaultValue?: string;
    value?: string;
    disabled?: boolean;
    error?: string;
    readOnly?: boolean;
    rows?: number;
    cols?: number;
    maxLength?: number;
}

export class TextAreaInput extends PureComponent<IProps> {

    handleFocus = (e: any) => {
        e.target.select();
    }

    render() {
        const {
            id,
            onChangeText,
            label,
            tip,
            defaultValue,
            value,
            disabled,
            error,
            readOnly,
            rows,
            cols,
            maxLength,
            ...props
        } = this.props;

        return(
            <div>
                <div className={classNames('superInputDark', style.container)}>
                    { label != null && <label htmlFor='name'>{label}</label> }
                    <div className={style.inputContainer}>
                        <textarea
                            id={id}
                            onKeyUp={onChangeText}
                            disabled={disabled}
                            readOnly={readOnly}
                            className={classNames({[style.error]: error != null})}
                            rows={rows}
                            cols={cols}
                            maxLength={maxLength}
                            defaultValue={defaultValue}
                            value={value}
                            onFocus={this.handleFocus}
                            {...props}
                        >
                        </textarea>
                        {tip != null && <div className={style.tip}>{tip}</div>}
                    </div>

                </div>
                { error != null && <ErrorMessage error={error} className={style.errorMessage}/>}
            </div>
        );
    }
}
