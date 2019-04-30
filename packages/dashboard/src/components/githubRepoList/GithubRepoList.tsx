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
import { GenericLoading } from '../common';
import { IGithubRepository, IGithubRepositoryOwner, StyledButtonType } from '../../models';
import { IconFilter, IconChevronDown } from '../common/icons';
import { StyledButton } from '../common/buttons/StyledButton';
import OnlyIf from '../common/onlyIf';

interface IProps {
    customClassName?: string;
    reposList: IGithubRepository[];
    isRepositoriesLoading: boolean;
    getUserRepos: () => void;
}

interface IState {
    filteredRepos: IGithubRepository[];
    searchFilter: string;
    ownerFilterId: number;
    ownerFilterName: string;
    ownerFilterAvatar: string;
    isExpandedOwners: boolean;
    timer: number;
}

export default class GithubRepoList extends Component<IProps, IState> {

    state = {
        filteredRepos: this.props.reposList,
        searchFilter: '',
        ownerFilterId: -1,
        ownerFilterName: '',
        ownerFilterAvatar: '',
        isExpandedOwners: false,
        timer: 0
    };

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    componentDidMount() {
        this.props.getUserRepos();
        this.state.timer = window.setInterval(() => this.props.getUserRepos(), 5000);
    }

    onSearchInputChange(e: any) {
        this.setState({
            searchFilter: e.target.value
        });
    }

    onFilterOwnerChange = (id: number, name: string, avatar: string) => {
        this.setState({
            ownerFilterId: id !== this.state.ownerFilterId ? id : -1,
            ownerFilterName: name !== this.state.ownerFilterName ? name : '',
            ownerFilterAvatar: avatar !== this.state.ownerFilterAvatar ? avatar : '',
            isExpandedOwners: false
        });
    }

    resetFilter = () => {
        this.setState({
            searchFilter: '',
            ownerFilterId: -1,
            ownerFilterName: '',
            ownerFilterAvatar: ''
        });
    }

    toggleOwnersDropdown = () => {
        this.setState({
            isExpandedOwners: !this.state.isExpandedOwners
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

    handleOnBuildClick = (repo: IGithubRepository) => {
        {/* TODO: Create project and add it to organization -> redirect to this project */}
        console.log('TODO');
    }

    render() {
        const { customClassName, reposList, isRepositoriesLoading } = this.props;
        const { searchFilter, ownerFilterId, ownerFilterName, ownerFilterAvatar, isExpandedOwners } = this.state;
        const owners = this.getOwners();

        const filteredRepos = reposList
            .filter((repo: IGithubRepository) =>
                (searchFilter === '' || repo.fullName.toLowerCase().includes(searchFilter.toLowerCase())) &&
                (ownerFilterId === -1 || repo.owner.id === ownerFilterId ));

        return (
            <div className={classNames([style.container, customClassName])}>
                <div className={style.left}>
                    <div className={style.searchInput}>
                        <IconFilter className={style.icon} />
                        <input type='text' placeholder='Filter projects...' value={searchFilter} onChange={this.onSearchInputChange.bind(this)} />
                    </div>

                    <p>If you don't see your project listed here, make sure to <a href='https://github.com/apps/superblocks-devops' target='_blank' rel='noreferrer noopener'>grant us access</a></p>

                    <div className={style.repoList}>
                        { filteredRepos.map((repo: IGithubRepository, index: number) =>
                            <div key={index} className={style.singleRepo}>
                                <img src={`${repo.owner.avatarUrl}&s=48`} alt={repo.owner.login} />
                                <div className={style.repoTitle}>{repo.fullName}</div>
                                <OnlyIf test={repo.private}>
                                    <div className={style.repoPrivate}>Private</div>
                                </OnlyIf>
                                <StyledButton type={StyledButtonType.Primary} onClick={() => this.handleOnBuildClick(repo)} text='Build' customClassName={style.btnBuild}/>
                            </div>
                        )}

                        {/* Show 'Reset filter' button when filtering results into 0 repositories */}
                        <OnlyIf test={searchFilter && filteredRepos.length <= 0}>
                            <div className={style.resetFilter}>
                                <p>No repositories found</p>
                                <StyledButton type={StyledButtonType.Primary} onClick={() => this.resetFilter()} text='Reset filter' />
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
                        <p className={style.ownersDropdownContainer} onClick={() => this.toggleOwnersDropdown()}>
                            {ownerFilterAvatar ? <img src={`${ownerFilterAvatar}&s=48`} alt={ownerFilterName} /> : ''}
                            {ownerFilterName ? ownerFilterName : 'All repositories'}
                            <IconChevronDown className={style.ownersDropdown} />
                        </p>
                        <div className={classNames([style.organizationsList, isExpandedOwners ? style.expanded : null])}>
                            { owners.map((owner: IGithubRepositoryOwner, index: number) =>
                                <div onClick={() => this.onFilterOwnerChange(owner.id, owner.login, owner.avatarUrl)}
                                    className={classNames([style.singleOrganization, owner.id === ownerFilterId ? style.active : null])}
                                    key={index}
                                >
                                    <img src={`${owner.avatarUrl}&s=48`}/>
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
