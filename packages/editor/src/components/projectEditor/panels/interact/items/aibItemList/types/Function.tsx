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
import { StyledButton, TextInput } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';

interface IProps {
    data: IRawAbiDefinition;
}

export class Function extends React.Component<IProps> {

    renderPlaceHolder(inputs: IRawAbiParameter[]) {
        const placeholder: string[] = [];
        inputs.map((input) => placeholder.push(`${input.type} ${input.name}`));
        return placeholder.join(', ');
    }
    render() {
        const { data } = this.props;
        return (
            <div className={style.container}>
                <StyledButton type={StyledButtonType.Primary} text={data.name} />
                <TextInput
                    id='name'
                    // onChangeText={this.onNameChange}
                    // defaultValue={project.name}
                    placeholder={this.renderPlaceHolder(data.inputs)}
                    className={style.input}
                />
            </div>
        );
    }
}
