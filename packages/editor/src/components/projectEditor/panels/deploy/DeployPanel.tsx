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
import { IProjectItem } from '../../../../models';

interface IProps {
    dappFileData: any;
    tree: IProjectItem;
    onConfigureContract: (contractSource: string) => void;
    onDeployContract(file: IProjectItem): void;
}

export class DeployPanel extends React.Component<IProps> {

    render() {
        const { dappFileData, onConfigureContract, onDeployContract, tree } = this.props;
        let itemData: any = null;
        if (tree) {
            const contractsTree = tree.children.filter(item => item.name === 'contracts');
            for (const key in contractsTree[0].children) {
                if (key) {
                    itemData = contractsTree[0].children[key];
                }
            }
        }
        if (!dappFileData || !dappFileData.contracts.length) {
            return (
                <div className={style.noContracts}>
                    <p>No contracts found in this project</p>
                </div>
            );
        }

        return (
            <div className={style.container}>
                <p className={style.note}>Depending on your contract, some extra configuration might be required to be deployed successfully.</p>
                {
                    dappFileData.contracts.map((contract: any, index: number) => (
                        <div className={style.contractContainer} key={index}>
                            <span className={style.title}>
                                {contract.name}.sol
                            </span>
                            <div>
                            <StyledButton
                                className={style.contractBtn}
                                type={StyledButtonType.Primary}
                                text={'Deploy'}
                                onClick={() => onDeployContract(itemData)}
                            />
                            {contract.args.length !== 0 &&
                                <StyledButton
                                className={style.contractBtn}
                                type={StyledButtonType.Secondary}
                                text={'Configure'}
                                onClick={() => onConfigureContract(contract.source)}
                            />
                            }
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}
