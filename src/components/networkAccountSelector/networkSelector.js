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

import React from 'react';
import classnames from 'classnames';
import { DropdownContainer } from '../common/dropdown';
import style from './style.less';
import { IconDropdown } from '../icons';
import { NetworksList } from './networksList';

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
export function NetworkSelector(props) {
    return (
        <DropdownContainer
            dropdownContent={
                <NetworksList
                    selectedNetwork={props.selectedNetwork.name}
                    networks={props.networks}
                    onNetworkSelected={props.onNetworkSelected}
                />
            }
        >
            <div className={classnames([style.selector])}>
                <div className={style.capitalize} title={props.selectedNetwork.endpoint}>
                    {props.selectedNetwork.name}
                </div>
                <div className={style.dropdownIcon}>
                    <IconDropdown />
                </div>
            </div>
        </DropdownContainer>
    );
}
