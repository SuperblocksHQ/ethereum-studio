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
import { StyledButton, TextInput } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';

interface IProps {
    rawAbiDefinition: IRawAbiDefinition;
    call: (rawAbiDefinitionName: string, value: string) => void;
}

interface IState {
    value: string;
}

export class Payable extends React.Component<IProps, IState> {

    state: IState = {
        value: '',
    };

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: e.target.value || ' ' });
    }

    call = () => {
        const { call, rawAbiDefinition } = this.props;
        call(rawAbiDefinition.name, this.state.value);
    }

    render() {
        const { rawAbiDefinition: data } = this.props;
        return (
            <div className={style.container}>
                <StyledButton type={StyledButtonType.Payable} text={data.name} onClick={this.call} />
                <TextInput
                    id='name'
                    onChangeText={this.onInputChange}
                    defaultValue={this.state.value}
                    placeholder={0}
                    className={style.input}
                    type='number'
                />
            </div>
        );
    }
}
