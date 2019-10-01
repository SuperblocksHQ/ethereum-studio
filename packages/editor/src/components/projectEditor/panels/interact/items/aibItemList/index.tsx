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
// import style from './style.less';
import { IRawAbiDefinition, Type } from '../../../../../../models';
import { Constant } from './types/Constant';
import { Transaction } from './types/Transaction';

interface IProps {
    abi: IRawAbiDefinition[];
}

export class AbiItemList extends React.Component<IProps> {

    renderAbiDefinition(rawAbiDefinition: IRawAbiDefinition) {
        if (rawAbiDefinition.constant) {
            return <Constant
                        data={rawAbiDefinition}
                    />;
        } else if (rawAbiDefinition.type === Type.Function) {
            return <Transaction
                        data={rawAbiDefinition}
                    />;
        } else {
            return null;
        }
    }

    render() {
        const { abi } = this.props;
        return (
            <div>
                { abi.map((rawAbiDefinition) => {
                    return (
                            <div key={rawAbiDefinition.name}>
                                { this.renderAbiDefinition(rawAbiDefinition) }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
