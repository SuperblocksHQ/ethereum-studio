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
import style from './style.less';
import { IEnvironment } from '../../models/state';

interface IProps {
    selectedEnvName: string;
    environments: [IEnvironment];
    onNetworkSelected: (name: string) => void;
}

export function NetworksList(props: IProps) {
    const renderedNetworks = props.environments.map(env => {
        const cls = {
            [style.networkLinkChosen]: env.name === props.selectedEnvName
        };

        return (
            <div
                key={env.name}
                onClick={e => {
                    e.preventDefault();
                    props.onNetworkSelected(env.name);
                }}
                className={classnames(style.networkLink, style.capitalize, cls)}
            >
                {env.name}
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
