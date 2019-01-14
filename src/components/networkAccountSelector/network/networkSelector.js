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
import classnames from 'classnames';
import { DropdownContainer } from '../../common';
import style from '../style.less';
import NetworkDropdown from './networkDropdown';
import {
    IconDropdown,
} from '../../icons';

// Note: We display networks, which really are environments, which map to networks.
// This is due to a simplification where we do not show environments, only networks, but technically it's environments which we work with.
export default class NetworkSelector extends Component {
    constructor(props) {
        super(props);
    }

    onNetworkSelectedHandle = network => {
        const project = this.props.router.control.getActiveProject();
        if (project) {
            project.getHiddenItem('environments').setChosen(network);
            this.props.router.main.redraw(true);
        }
    };

    getNetwork = () => {
        var network = 'browser';
        var endpoint = '';
        const project = this.props.router.control.getActiveProject();
        if (project) {
            network = project.getHiddenItem('environments').getChosen() || network;
            endpoint = project.getEndpoint(network);
        }
        return {network, endpoint};
    };

    render() {
        var {network, endpoint} = this.getNetwork();
        return (
            <DropdownContainer
                dropdownContent={
                    <NetworkDropdown
                        router={this.props.router}
                        networkSelected={network}
                        onNetworkSelected={this.onNetworkSelectedHandle}
                    />
                }
            >
                <div className={classnames([style.selector])}>
                    <div className={style.capitalize} title={endpoint}>
                        {network}
                    </div>
                    <div className={style.dropdownIcon}>
                        <IconDropdown />
                    </div>
                </div>
            </DropdownContainer>
        );
    }
}

NetworkSelector.propTypes = {
    router: PropTypes.object.isRequired
}
