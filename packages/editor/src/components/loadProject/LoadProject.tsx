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
import ProjectEditor from '../projectEditor';
import { GenericLoading, OnlyIf } from '../common';
import { IProject } from '../../models';

interface IProps {
    loadProject: (projectId: string) => void;
    openDevWallet: (knownWalletSeed: string) => void;
    initEvm: () => void;
    project: IProject;
    knownWalletSeed: string;
    projectIdToLoad: string;
    isEvmReady: boolean;
}

export default class LoadProject extends Component<IProps> {

    componentDidMount() {
        const { loadProject, projectIdToLoad, openDevWallet, knownWalletSeed, initEvm } = this.props;
        loadProject(projectIdToLoad);
        openDevWallet(knownWalletSeed);
        initEvm();
    }

    render() {
        const { project, isEvmReady } = this.props;

        return (
            <React.Fragment>
                <OnlyIf test={project}>
                    <ProjectEditor/>
                </OnlyIf>
                <OnlyIf test={!isEvmReady || !project}>
                    <GenericLoading />
                </OnlyIf>
            </React.Fragment>
        );
    }
}
