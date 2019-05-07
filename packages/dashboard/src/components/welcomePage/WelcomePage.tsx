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
import style from './style.less';
import Topbar from '../topbar';
import GithubRepoList, { Section } from '../githubRepositoryList';

export const WelcomePage = () => (
    <div className={style.welcomePage}>
        <Topbar />
        <div className={style.content}>
            <div className={style.header}>
                <h1>Welcome to Superblocks!<br/>What would you like to build?</h1>
                <p>Select a repository you would like to start building</p>
            </div>
            <GithubRepoList section={Section.Welcome} className={style.repoList} />
        </div>
    </div>
);
