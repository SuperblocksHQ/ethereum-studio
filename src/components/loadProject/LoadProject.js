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
import ProjectEditor from '../projecteditor';
import OnlyIf from '../onlyIf';
import { GenericLoading } from "../common";

// interface IProps {
//     loadProject: (projectId: string) => void;
//     match: any;
//     project: IProject;
//     router: any;
//     functions: any;
//     knownWalletSeed: string;
//     isImportedProject: boolean;
// }

// TODO: rename this component.
export default class LoadProject extends Component {

    componentDidMount() {
        const { loadProject, projectId, openDevWallet, knownWalletSeed, initEvm } = this.props;
        loadProject(projectId);
        openDevWallet(knownWalletSeed);
        initEvm();
    }

    render() {
        const { project, router, functions, isImportedProject, isEvmReady } = this.props;

        return (
            <React.Fragment>
                <OnlyIf test={project}>
                    <ProjectEditor
                        project={project}
                        router={router}
                        functions={functions}
                        isImportedProject={isImportedProject}
                    />
                </OnlyIf>
                <OnlyIf test={!isEvmReady || !project}>
                    <GenericLoading />
                </OnlyIf>
            </React.Fragment>
        );
    }
}
