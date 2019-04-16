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
import OnlyIf from '../../onlyIf';
import { GenericLoading } from '../../common';
import { IGithubRepository, IGithubRepositoryOwner } from '../../../models';
import { IconFilter } from '../../icons';
import PrimaryButton from '../../common/buttons/primaryButton';

interface IProps {
    customClassName?: string;
    reposList: IGithubRepository[];
    isRepositoriesLoading: boolean;
    getUserRepos: () => void;
}

interface IState {
    filteredRepos: IGithubRepository[];
    searchFilter: string;
    ownerFilter: number;
}

export default class GithubRepoList extends Component<IProps, IState> {

    state = {
        filteredRepos: this.props.reposList,
        searchFilter: '',
        ownerFilter: -1
    };

    componentDidMount() {
        this.props.getUserRepos();
    }

    onSearchInputChange(e: any) {
        this.setState({
            searchFilter: e.target.value
        });
    }

    onFilterOwnerChange = (id: number) => {
        this.setState({
            ownerFilter: id !== this.state.ownerFilter ? id : -1
        });
    }

    resetFilter = () => {
        this.setState({
            searchFilter: '',
            ownerFilter: -1
        });
    }

    removeDuplicatesByProperty(myArr: any[], prop: string) {
        return myArr.filter((obj: any, pos: number, arr: any[]) => {
            return arr.map((mapObj: any) => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    getOwners = () => {
        const owners = this.props.reposList.map((repo: IGithubRepository) => repo.owner);
        return this.removeDuplicatesByProperty(owners, 'id');
    }

    render() {
        const { customClassName, reposList, isRepositoriesLoading } = this.props;
        const { searchFilter, ownerFilter } = this.state;
        const owners = this.getOwners();

        const filteredRepos = reposList
            .filter((repo: IGithubRepository) =>
                (searchFilter === '' || repo.fullName.includes(searchFilter)) &&
                (ownerFilter === -1 || repo.owner.id === ownerFilter ));

        return (
            <div className={classNames([style.container, customClassName])}>
                <div className={style.left}>
                    <div className={style.searchInput}>
                        <IconFilter className={style.icon} />
                        <input type='text' placeholder='Filter projects...' disabled={isRepositoriesLoading} value={searchFilter} onChange={this.onSearchInputChange.bind(this)} />
                    </div>

                    <p>If you don't see your project listed here, make sure to <a href='#'>grant us access</a></p>

                    <div className={style.repoList}>
                        { filteredRepos.map((repo: IGithubRepository, index: number) =>
                            <div onClick={() => console.log(repo.id)} key={index} className={style.singleRepo}>
                                <img src={`${repo.owner.avatarUrl}&s=48`} alt={repo.owner.login} />
                                <div className={style.repoTitle}>{repo.fullName}</div>
                                <PrimaryButton onClick={() => console.log('TODO')} text='Build' customClassName={style.btnBuild}/>
                            </div>
                        )}

                        {/* Show 'Reset filter' button when filtering results into 0 repositories */}
                        <OnlyIf test={searchFilter && filteredRepos.length <= 0}>
                            <div className={style.resetFilter}>
                                <p>No repositories found</p>
                                <PrimaryButton onClick={() => this.resetFilter()} text='Reset filter' />
                            </div>
                        </OnlyIf>

                        {/* Show loader until we have repositories available */}
                        <OnlyIf test={isRepositoriesLoading && reposList.length <= 0}>
                            <GenericLoading />
                        </OnlyIf>
                    </div>
                </div>
                <div className={style.right}>
                    <OnlyIf test={owners.length}>
                        <p>All Github organizations</p>
                        <div className={style.organizationsList}>
                            { owners.map((owner: IGithubRepositoryOwner, index: number) =>
                                <div onClick={() => this.onFilterOwnerChange(owner.id)}
                                    className={classNames([style.singleOrganization, owner.id === ownerFilter ? style.active : null])}
                                    key={index}
                                >
                                    <img src={`${owner.avatarUrl}&s=48`} alt={owner.login} />
                                    <div className={style.orgTitle}>{owner.login}</div>
                                </div>
                            )}
                        </div>
                    </OnlyIf>
                </div>
            </div>
        );
    }
}
