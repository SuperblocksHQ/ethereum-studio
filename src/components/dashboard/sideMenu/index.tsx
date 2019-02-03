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
import style from './style.less';
import {
    IconTrash,
    IconRecent
} from '../../icons';

export enum ItemType {
    Recent,
    All,
    Deleted
}

interface IProps {
    onItemSelected: (itemType: ItemType) => void;
}

export default class SideMenu extends Component<IProps> {

    onItemSelected = (item: ItemType) => {
        this.props.onItemSelected(item);
    }

    render() {
        return (
            <div className={style.sideMenuContainer}>
                <div className={style.item} onClick={() => this.onItemSelected(ItemType.Recent)}>
                    <IconRecent/>
                    <span>Recent</span>
                </div>
                <div className={style.item} onClick={() => this.onItemSelected(ItemType.All)}>
                    <span>Your Projects</span>
                </div>
                <div className={style.item} onClick={() => this.onItemSelected(ItemType.Deleted)}>
                    <IconTrash/>
                    <span>Deleted Projects</span>
                </div>
            </div>
        );
    }
}
