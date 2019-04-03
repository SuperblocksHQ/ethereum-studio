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
import classnames from 'classnames';
import { IProjectItem } from '../../../../models';
import { getContractAbis, getFunctionsFromAbi } from '../../../../utils/abi';

interface IProps {
    project: IProjectItem;
    closeModal(): void;
}

export class Interact extends React.Component<IProps> {

    onModalClose = () => {
        this.props.closeModal();
    }

    render() {
        const abis = getContractAbis(this.props.project);

        if (abis) {
            console.log(getFunctionsFromAbi(abis[0]));
        }

        return (
            <React.Fragment>
                <div className={style.contractInstance}>
                    <div className={style.transactionInfo}>
                        <div className={classnames(style.transactionField, style.superInputDark)}>
                            <div className={style.name}>Gas limit</div>
                            <input className={style.value} type='number' id='gasLimit'></input>
                        </div>
                        <div className={classnames(style.transactionField, style.superInputDark)}>
                            <div className={style.name}>Value</div>
                            <input className={style.value} type='text' id='value' title='Enter the value and choose the unit'></input>
                            <select name='unit' id='unit'>
                                <option data-unit='wei'>wei</option>
                                <option data-unit='gwei'>gwei</option>
                                <option data-unit='finney'>finney</option>
                                <option data-unit='ether'>ether</option>
                            </select>
                        </div>
                    </div>
                    <div className={style.contractInfo}>
                        Contract address: 0xa9e73bb65b54c445081dae9d67f08ccbcce8bcb7
                    </div>
                    <div className={style.actionContainer}>
                        <div className={classnames(style.singleAction, style.superInputDark)}>
                            <button
                                className={style.actionButton}
                                title='delegate - transact (not payable)' >
                                delegate
                            </button>
                            <input
                                placeholder='address to'
                                title='address to'
                            />
                        </div>
                    </div>

                    <div className={style.actionContainer}>
                        <div className={classnames(style.singleAction, style.superInputDark)}>
                            <button
                                className={style.actionButton}
                                title='delegate - transact (not payable)' >
                                delegate
                            </button>
                            <input
                                placeholder='address to'
                                title='address to'
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
