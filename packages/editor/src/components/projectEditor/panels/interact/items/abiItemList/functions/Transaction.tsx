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
import { IRawAbiDefinition, IRawAbiParameter } from '../../../../../../../models';
import { StyledButton, TextInput, OnlyIf } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';

interface IProps {
    rawAbiDefinition: IRawAbiDefinition;
    call: (rawAbiDefinitionName: string, args?: any[]) => void;
}

interface IState {
    args: string;
}

export class Transaction extends React.Component<IProps> {

    state: IState = {
        args: '',
    };

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ args: e.target.value || ' ' });
    }

    call = () => {
        const { call, rawAbiDefinition } = this.props;
        call(rawAbiDefinition.name, this.state.args.split(','));
    }

    render() {
        const { rawAbiDefinition } = this.props;
        const { args } = this.state;
        const placeholder = getPlaceholderText(rawAbiDefinition.inputs);

        return (
            <div className={style.container}>
                <StyledButton type={StyledButtonType.Transaction} text={rawAbiDefinition.name} onClick={this.call}/>
                <OnlyIf test={rawAbiDefinition.inputs.length > 0}>
                    <TextInput
                        id='name'
                        onChangeText={this.onInputChange}
                        placeholder={placeholder}
                        title={placeholder}
                        className={style.input}
                        defaultValue={args}
                    />
                </OnlyIf>
            </div>
        );
    }
}

function getPlaceholderText(inputs: IRawAbiParameter[]) {
    const placeholder: string[] = [];
    inputs.map((input) => placeholder.push(`${input.type} ${input.name}`));
    return placeholder.join(', ');
}
