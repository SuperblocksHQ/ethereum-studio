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
import style from '../style.less';

export default class NetworkDropdown extends Component {
    render() {
        var networks;
        const project = this.props.router.control.getActiveProject();
        if (!project) {
            // Setup default stub network just for show. This is due to the fact that atm networks are
            // actually dependent on the project.
            networks = [
                {
                    getName: () => 'browser',
                },
            ];
        } else {
            const environmentsItem = project.getHiddenItem('environments');
            networks = environmentsItem.getChildren();
        }

        const renderedNetworks = networks.map(network => {
            const cls = {};
            cls[style.networkLink] = true;
            cls[style.capitalize] = true;
            if (network.getName() == this.props.networkSelected)
                cls[style.networkLinkChosen] = true;
            return (
                <div
                    key={network.getName()}
                    onClick={e => {
                        e.preventDefault();
                        this.props.onNetworkSelected(network.getName());
                    }}
                    className={classnames(cls)}
                >
                    {network.getName()}
                </div>
            );
        });
        return (
            <div className={style.networks}>
                <div className={style.title}>Select a Network</div>
                {renderedNetworks}
            </div>
        );
    }
}

NetworkDropdown.propTypes = {
    router: PropTypes.object.isRequired,
    networkSelected: PropTypes.string.isRequired,
    onNetworkSelected: PropTypes.func.isRequired,
}
