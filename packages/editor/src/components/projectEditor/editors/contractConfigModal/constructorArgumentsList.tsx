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
import { ConstructorArgument } from './constructorArgument';
import { IconAdd } from '../../../icons';
import classNames from 'classnames';
import style from './style.less';
import { IContractArgData } from '../../../../models';

interface IProps {
    args: IContractArgData[];
    accounts: string[];
    onArgChange: (arg: IContractArgData, index: number) => void;
}

export function ConstructorArgumentsList(props: IProps) {

    const argumentsNodes = props.args.map((arg: IContractArgData, index: number) =>
        <div key={index} className={style.argumentContainer}>
            <ConstructorArgument
                data={arg}
                accounts={props.accounts}
                onChange={c => props.onArgChange(c, index)}
            />
        </div>
    );

    return (
        <React.Fragment>
            <p><b>No. args: </b>{props.args.length}</p>
            <div className={style.arguments}>
                {argumentsNodes}
            </div>
        </React.Fragment>
    );
}
