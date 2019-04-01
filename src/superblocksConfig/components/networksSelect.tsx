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
import { Select } from '../../components/common';
import { INetwork } from '../models';

interface IProps {
    currentNetwork: INetwork;
    networks: INetwork[];
    onChange(network: INetwork): void;
}

export function NetworksSelect(props: IProps) {
    const value = props.currentNetwork.host + ':' + props.currentNetwork.port;
    const options = props.networks.map(n => n.host + ':' + n.port);

    const getNetwork = (v: string) => {
        return props.networks.find(n => v.indexOf(n.host) >= 0 && v.indexOf(n.port.toString()) >= 0) as INetwork;
    };

    return (
        <Select value={value} options={options} onChange={v =>  props.onChange(getNetwork(v))} />
    );
}
