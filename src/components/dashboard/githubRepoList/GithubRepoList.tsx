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

import React, { Component } from 'react';
import style from './style.less';
import classNames from 'classnames';

interface IProps {
    customClassName?: string;
    reposList: any; // TOOD: Add Model of repository
    getUserRepos: () => void;
}

// interface IState {
//     selectedRepoId: number | null;
// }

export default class GithubRepoList extends Component<IProps> {

    // state = {
    //     selectedRepoId: null
    // };

    // selectRepository = (id: number) => {
    //     this.setState({
    //         selectedRepoId: id
    //     });
    // }

    componentDidMount() {
        this.props.getUserRepos();
    }

    render() {
        const { customClassName, reposList } = this.props;

        return (
            <div className={classNames([style.container, customClassName])}>
                <div className={style.left}>
                    <div>
                        <input className={style.searchInput} type='text' placeholder='Filter projects...' />
                    </div>

                    <p>If you don't see your project listed here, make sure to <a href='#'>grant us access</a></p>

                    <div className={style.repoList}>
                        { reposList.map((repo: any, index: number) =>
                            <div onClick={() => console.log(repo.id)} key={index} className={style.singleRepo}>
                                <img src={repo.owner.avatarUrl} alt={repo.owner.login} />
                                <div className={style.repoTitle}>{repo.fullName}</div>
                                <a className={style.btnBuild} href='#'>Build</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className={style.right}>
                </div>
            </div>
        );
    }
}
