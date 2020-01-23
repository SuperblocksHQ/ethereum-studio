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

import { settingsEpics } from './settings';
import { projectsEpics } from './projects';
import { appEpics } from './app';
import { explorerEpics } from './explorer';
import { urlParametersEpics } from './urlParameters';
import { panesEpics } from './panes';
import { compilerEpics } from './compiler';
import { deployerEpics } from './deployer';
import { contractConfigurationEpics } from './contractConfiguration';
import { accountEpics } from './account';
import { transactionEpics } from './transactions';
import { interactEpics } from './interact';

export const epics = [
    ...settingsEpics,
    ...projectsEpics,
    ...appEpics,
    ...explorerEpics,
    ...urlParametersEpics,
    ...panesEpics,
    ...compilerEpics,
    ...deployerEpics,
    ...contractConfigurationEpics,
    ...accountEpics,
    ...transactionEpics,
    ...interactEpics
    // Disable this 2 categories for now
    // ...userEpics,
    // ...loginEpics,
];
