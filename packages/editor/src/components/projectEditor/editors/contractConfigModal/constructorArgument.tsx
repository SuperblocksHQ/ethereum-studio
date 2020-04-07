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
import classNames from 'classnames';
import style from './style.less';
import { IconTrash, IconHelp } from '../../../icons';
import { Select, Tooltip } from '../../../common';
import { ContractArgTypes, IContractArgData } from '../../../../models';

interface IProps {
    data: IContractArgData;
    accounts: string[];
    onChange: (data: IContractArgData) => void;
}

export class ConstructorArgument extends React.Component<IProps> {

    onTypeChange = (type: string) => {
        let value = '';
        if (type === ContractArgTypes.account) {
            value = this.props.accounts[0];
        }

        this.props.onChange({ type: type as ContractArgTypes, value });
    }

    onValueChange = (value: string) => {
        this.props.onChange({ type: this.props.data.type, value });
    }

    render() {
        const { data, accounts } = this.props;
        let argumentValue: React.ReactNode;

        if (data.type === ContractArgTypes.account) {
            argumentValue = <Select value={data.value} options={accounts} onChange={this.onValueChange} />;
        } else {
            argumentValue = (
                <div className={classNames(['superInputDark', style.valueContainer])}>
                    <input value={data.value} onChange={e => this.onValueChange(e.target.value)} />
                    { data.type === ContractArgTypes.array &&
                    <button className='btnNoBg'>
                        <Tooltip html={
                            <div className='arrayInfoTooltip'>
                                <div>Comma separated list</div>
                                <div className='example'>for data type uint256[]: 1,2,3,1337</div>
                                <div className='example'>for data type bytes8[]: Hello,World</div>
                                <div className='example'>bytes32[] allows 32 bytes per string: LongStringHere,String With Spaces, Initial space counts</div>
                            </div>
                        }><IconHelp /></Tooltip>
                    </button>
                    }
                </div>
            );
        }

        return (
            <div>
                <Select value={data.type} options={Object.keys(ContractArgTypes)} onChange={this.onTypeChange} />
                { argumentValue }
            </div>
        );
    }
}
