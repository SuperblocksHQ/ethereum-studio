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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import ErrorMessage from '../errorMessage';

export class TextInput extends PureComponent {

    render() {
        const {
            onChangeText,
            type,
            label,
            tip,
            defaultValue,
            disabled,
            error,
            readOnly,
            onBlur,
            ...props
        } = this.props;

        return(
            <div>
                <div className={classNames("superInputDark", style.container)}>
                    { label != null && <label htmlFor="name">{label}</label> }
                    <div className={style.inputContainer}>
                        <input
                            type={type}
                            onChange={onChangeText}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            readOnly={readOnly}
                            className={classNames({[style.error]: error != null})}
                            onBlur={onBlur}
                            {...props}
                        />
                        {tip != null && <div className={style.tip}>{tip}</div>}
                    </div>

                </div>
                { error != null && <ErrorMessage error={error} className={style.errorMessage}/>}
            </div>
        );
    }
}

TextInput.propTypes = {
    id: PropTypes.string,
    onChangeText: PropTypes.func,
    type: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    readOnly: PropTypes.bool
}
