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
import { Constant, Transaction, Payable } from './functions';
import { IDeployedContract } from '../../../../../../models/state';

interface IProps {
    deployedContract: IDeployedContract;
    getConstant(abiIndex: number, deployedContract: IDeployedContract, args?: any[]): void;
    sendTransaction(deployedContract: IDeployedContract, abiDefinitionName: string, abiIndex: number, args?: any[], value?: number): void;
    clearLastResult(deployedContractId: string, abiIndex: number): void;
}

export class AbiList extends React.Component<IProps> {

    getConstant = (abiIndex: number, args: any[]) => {
        const { getConstant, deployedContract } = this.props;
        getConstant(abiIndex, deployedContract, args);
    }

    sendTransaction = (abiDefinitionName: string, abiIndex: number, args?: any[], value?: number) => {
        const { sendTransaction, deployedContract } = this.props;
        sendTransaction(deployedContract, abiDefinitionName, abiIndex, args, value);
    }

    clearLastResult = (abiIndex: number) => {
        const { clearLastResult, deployedContract } = this.props;
        clearLastResult(deployedContract.id, abiIndex);
    }

    renderAbiDefinition(rawAbiDefinition: IRawAbiDefinition, index: number) {
        if (rawAbiDefinition.constant) {
            return <Constant
                        call={args => this.getConstant(index, args)}
                        abiDefinition={rawAbiDefinition}
                        clearLastResult={() => this.clearLastResult(index)}
                    />;
        } else if (rawAbiDefinition.type === Type.Function && !rawAbiDefinition.payable) {
            return <Transaction
                        call={(abiName, args) => this.sendTransaction(abiName, index, args)}
                        rawAbiDefinition={rawAbiDefinition}
                    />;
        } else if (rawAbiDefinition.type === Type.Function && rawAbiDefinition.payable) {
            return <Payable
                        rawAbiDefinition={rawAbiDefinition}
                        call={(abiName, args, value) => this.sendTransaction(abiName, index, args, value)}
                    />;
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.deployedContract.abi.map((rawAbiDefinition, index) =>
                        (
                            <div key={index}>
                                { this.renderAbiDefinition(rawAbiDefinition, index) }
                            </div>
                        )
                    )
                }
            </div>
        );
    }
}
