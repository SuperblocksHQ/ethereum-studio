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
import { IRawAbiDefinition } from '../../../../../../../models';
import { OnlyIf, StyledButton, TextInput } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';
import { getPlaceholderText } from './utils';
import classnames from 'classnames';

interface IProps {
    rawAbiDefinition: IRawAbiDefinition;
    call: (rawAbiDefinitionName: string, args: any[], value: number) => void;
}

interface IState {
    args: string;
    value: number;
}

export class Payable extends React.Component<IProps, IState> {

    state: IState = {
        args: '',
        value: 0,
    };

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ args: e.target.value || ' ' });
    }

    onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: Number(e.target.value) || 0 });
    }

    call = () => {
        const { call, rawAbiDefinition } = this.props;
        const { args, value } = this.state;
        call(rawAbiDefinition.name, args ? args.split(',') : [], value);
    }

    render() {
        const { rawAbiDefinition: data } = this.props;
        const placeholder = getPlaceholderText(data.inputs);

        return (
            <div className={classnames([style.container, style.containerBackground])}>
                <StyledButton type={StyledButtonType.Payable} text={data.name} onClick={this.call} />
                <OnlyIf test={data.inputs.length > 0}>
                    <TextInput
                        id='input'
                        onChangeText={this.onInputChange}
                        defaultValue={this.state.args}
                        placeholder={placeholder}
                        title={placeholder}
                        className={style.input}
                    />
                </OnlyIf>
                <div className={style.break}/>
                <div className={style.transactionValue}>
                    <span>Value:</span>
                    <div className={style.valueInput}>
                        <TextInput
                            id='input'
                            onChangeText={this.onValueChange}
                            defaultValue={this.state.value}
                            placeholder='value'
                            className={style.input}
                            type='number'
                        />
                        <div className={style.wei}>
                            <span>Wei</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
