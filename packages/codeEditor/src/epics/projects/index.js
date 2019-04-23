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

import { environmentUpdateEpic } from './environmentUpdate.epic';
import { updateProjectSettings } from './updateProjectSettings.epic';
import { initExplorerEpic } from './initExplorer.epic';
import { deleteProject } from './deleteProject.epic';
import { forkProject } from './forkProject.epic';
import { updateProject } from './updateProject.epic';

// TODO - Add missing epics

// import { downloadProject } from './downloadProject.epic';
// import { importProject } from './importProject.epic';

import { loadProject } from './loadProject.epic';
import { renameProjectEpic } from './renameProject.epic';
import { createEmptyProject } from './createEmptyProject.epic';
import { openWalletEpic } from './openWallet.epic';
import { updateAccountBalanceEpic } from './updateAccountBalance.epic';
import { createForkedProject } from './createForkedProject.epic';

export const projectsEpics = [
    environmentUpdateEpic,
    updateProjectSettings,
    initExplorerEpic,
    loadProject,
    deleteProject,
    renameProjectEpic,
    forkProject,
    createEmptyProject,
    openWalletEpic,
    updateAccountBalanceEpic,
    updateProject,
    createForkedProject
];
