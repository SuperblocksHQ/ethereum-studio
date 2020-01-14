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
import { StyledButton } from '../../../common';
import { StyledButtonType } from '../../../common/buttons/StyledButtonType';

interface IProps {
    dappFileData: any;
    onConfigureContract: (contractSource: string) => void;
}

export class ConfigurePanel extends React.Component<IProps> {

    render() {
        const { dappFileData, onConfigureContract } = this.props;

        if (!dappFileData || !dappFileData.contracts.length) {
            return (
                <div className={style.noContracts}>
                    <p>No contracts found in this project</p>
                </div>
            );
        }

        return (
            <div className={style.container}>
                <p className={style.note}>Each of your contracts requires a configuration in order to be deployed successfully.</p>
                {
                    dappFileData.contracts.map((contract: any, index: number) => (
                        <div className={style.contractContainer} key={index}>
                            <span className={style.title}>
                                {contract.name}.sol
                            </span>
                            <StyledButton
                                className={style.contractBtn}
                                type={StyledButtonType.Primary}
                                text={'Configure'}
                                onClick={() => onConfigureContract(contract.source)}
                            />
                        </div>
                    ))
                }
            </div>
        );
    }
}
