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
import { IAccount, IEnvironment } from '../models/state';
import { IProject } from '../models';

export const projectSelectors = {
    // TODO enable external environments
    getEnvironments: (state: any) => state.projects.environments.slice(0, 1).map((env: any) => env),
    getAccounts: (state: any) => state.projects.accounts,
    getSelectedEnvironment: (state: any): IEnvironment => state.projects.selectedEnvironment,
    getSelectedAccount: (state: any): IAccount => state.projects.selectedAccount,
    getProject: (state: any): IProject => state.projects.project,
    getProjectId: (state: any): string => state.projects.project.id,
    getProjectName: (state: any): string => state.projects.project.name,
    getLoadingProject: (state: any): boolean => state.projects.isProjectLoading,
    getIsOwnProject: (state: any): boolean => state.projects.isOwnProject,
    getDappFileData: (state: any): any => state.projects.dappFileData
};
