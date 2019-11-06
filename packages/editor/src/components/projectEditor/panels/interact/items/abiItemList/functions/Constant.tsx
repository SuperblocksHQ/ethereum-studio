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
import { StyledButton, TextInput, OnlyIf } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';
import { IAbiDefinitionState } from '../../../../../../../models/state';
import { getPlaceholderText } from './utils';
import { IconClose } from '../../../../../../icons';

interface IProps {
    abiDefinition: IAbiDefinitionState;
    call(args: any[]): void;
    clearLastResult(): void;
}

interface IState {
    args: string;
}

export class Constant extends React.Component<IProps> {
    state: IState = {
        args: '',
    };

    onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ args: e.target.value || ' ' });
    }

    call = () => {
        const { abiDefinition, call } = this.props;
        call(abiDefinition.inputs.length ? this.state.args.split(',') : []);
    }

    render() {
        const { abiDefinition, clearLastResult } = this.props;
        const placeholder = getPlaceholderText(abiDefinition.inputs);

        return (
            <div>
                <div className={style.container}>
                    <StyledButton type={StyledButtonType.Constant} text={abiDefinition.name} onClick={this.call}/>
                    <TextInput
                        onChangeText={this.onInputChange}
                        placeholder={placeholder}
                        title={placeholder}
                        className={style.input}
                        defaultValue={this.state.args}
                        disabled={abiDefinition.inputs.length === 0}
                    />
                </div>
                <OnlyIf test={abiDefinition.lastResult}>
                    <div className={style.resultContainer}>
                    {
                        abiDefinition.outputs.map((o, index) => (
                            <div key={index} className={style.resultItem}>
                                <div className={style.type}>{o.type}:</div>
                                <div className={style.result}>{getResult(index, abiDefinition.lastResult)}</div>
                            </div>
                        ))
                    }
                        <IconClose className={style.closeIcon} onClick={clearLastResult} />
                    </div>
                </OnlyIf>
            </div>
        );
    }
}

function getResult(index: number, result?: any[]) {
    const res = (result || [])[index] || '(NO DATA)';
    if (res instanceof Array) {
        return '[' + res.join(', ') + ']';
    } else {
        return res;
    }
}
