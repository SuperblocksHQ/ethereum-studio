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
import { StyledButton } from '../../../../../../common';
import { StyledButtonType } from '../../../../../../common/buttons/StyledButtonType';

interface IProps {
    data: IRawAbiDefinition;
}

export class Constant extends React.Component<IProps> {

    render() {
        const { data } = this.props;
        return (
            <div className={style.container}>
                <StyledButton type={StyledButtonType.Constant} text={data.name} />
            </div>
        );
    }
}
