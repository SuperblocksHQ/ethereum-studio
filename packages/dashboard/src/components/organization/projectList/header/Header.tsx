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

import React, { Component, Fragment } from 'react';
import style from './style.less';
import { DropdownContainer, MenuItem, StyledButton } from '../../../common';
import classNames from 'classnames';
import { IconArrowUpThin, IconPlusTransparent } from '../../../common/icons';
import OnlyIf from '../../../common/onlyIf';
import CreateProjectModal from '../../../modals/createProjectModal';
import { StyledButtonType } from '../../../../models/button.model';

interface IProps {
    title: string;
    onOrderByChange: (orderValue: string) => any;
    orderBy: string;
    onOrderChange: () => any;
    order: string;
    showCreateProjectModal: boolean;
    toggleCreateProjectModal: () => void;
}

export default class Header extends Component<IProps> {

    getOrderBy = () => {
        switch (this.props.orderBy) {
            case 'lastModifiedAt':
                return 'Last Modified';
            case 'createdAt':
                return 'Last Created';
            default:
                return 'Name';
        }
    }

    render() {
        const { title, onOrderByChange, onOrderChange, order, showCreateProjectModal, toggleCreateProjectModal } = this.props;

        return (
            <Fragment>
                <div className={style.container}>
                    <div className={style.titleContainer}>
                        <span>{title}</span>
                    </div>
                    <div className={style.sortContainer}>
                        <span className={style.desc}>Sorted by </span>
                        <DropdownContainer
                            dropdownContent={
                                <div className={style.menuDialog} >
                                    <MenuItem onClick={() => onOrderByChange('lastModifiedAt')} title='Last Modified' />
                                    <MenuItem onClick={() => onOrderByChange('createdAt')} title='Last Created' />
                                    <MenuItem onClick={() => onOrderByChange('name')} title='Name' />
                                </div>
                            }>
                                <span className={style.orderBy}> {this.getOrderBy()}</span>
                        </DropdownContainer>
                        <div onClick={() => onOrderChange()} className={classNames([style.orderButton, order === 'asc' ? style.orderAsc : style.orderDesc])}>
                            <IconArrowUpThin />
                        </div>
                    </div>
                    <div className={style.createProject}>
                        <StyledButton icon={<IconPlusTransparent width={'12px'} height={'12px'} />} type={StyledButtonType.Primary} text={'Create Project'} onClick={() => toggleCreateProjectModal()} />
                    </div>
                    <OnlyIf test={showCreateProjectModal}>
                        <CreateProjectModal hideModal={toggleCreateProjectModal} />
                    </OnlyIf>
                </div>
            </Fragment>
        );
    }
}
