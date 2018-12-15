// Copyright 2018 Superblocks AB
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.less';
import * as validations from '../../../../validations';
import TextInput from '../../../textInput';
import Web3 from 'web3';

export default class NetworkPreferences extends Component {

    state = {
        errorGasLimit: null,
        errorGasPrice: null,
        tempGasLimit: this.props.networkPreferences.gasLimit,
        tempGasPrice: this.props.networkPreferences.gasPrice
    }

    constructor(props) {
        super(props);

        this.web3 = new Web3();
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getPreferences() {
        return {
            gasLimit: this.state.errorGasLimit ? this.props.networkPreferences.gasLimit : this.state.tempGasLimit,
            gasPrice: this.state.errorGasPrice ? this.props.networkPreferences.gasPrice : this.state.tempGasPrice
        }
    }

    onChange = (e, key) => {
        const value = e.target.value;
        if (key === "gasLimit") {
            const gasLimitValue = value;
            const errorGasLimit = gasLimitValue ? validations.validateGasLimit(Number(gasLimitValue)) : null;

            // To make sure we update the input the UI correctly
            this.setState({
                errorGasLimit,
                tempGasLimit: gasLimitValue
            });

        } else if (key === "gasPrice") {
            const gasPriceValue = value;
            const errorGasPrice = gasPriceValue ? validations.validateGasPrice(Number(gasPriceValue)) : null;

            // To make sure we update the input the UI correctly
            this.setState({
                errorGasPrice,
                tempGasPrice: gasPriceValue
            });
        }
    }

    render() {
        const {
            errorGasLimit,
            errorGasPrice,
            tempGasLimit,
            tempGasPrice,
        } = this.state;

        const gasPriceGwei = this.web3.fromWei(tempGasPrice, 'Gwei');

        return (
            <div className={style.container}>
                <h2>Chain Network Preferences</h2>
                <div className={style.form}>
                    <form action="">
                        <div className={style.field}>
                            <TextInput
                                id="gasLimit"
                                type="number"
                                label="Gas Limit"
                                error={errorGasLimit}
                                onChangeText={(e)=>{this.onChange(e, 'gasLimit')}}
                                defaultValue={tempGasLimit}
                            />
                            <div className={style.note}>Maximum amount of gas available to each block and transaction. <b>Leave blank for default.</b></div>
                            <TextInput
                                id="gasPrice"
                                type="number"
                                label="Gas Price"
                                error={errorGasPrice}
                                onChangeText={(e)=>{this.onChange(e, 'gasPrice')}}
                                defaultValue={tempGasPrice}
                                tip={gasPriceGwei + ' Gwei'}
                            />
                            <div className={style.note}>The price of each unit of gas, in WEI. <b>Leave blank for default.</b></div>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}

NetworkPreferences.propTypes = {
    onRef: PropTypes.func.isRequired
}


