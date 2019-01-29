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
import { SubMenu, MenuItem, Divider } from '../../common/menu';
import style from './style.less';

export default class MenuDropdownDialog extends Component {
    render() {
        return (
            <div className={style.menuDialog}>
                <SubMenu title="File">
                    <MenuItem>New Project</MenuItem>
                    <MenuItem>New File</MenuItem>
                    <MenuItem>New Folder</MenuItem>
                    <Divider/>
                    <MenuItem>Open Project</MenuItem>
                    <Divider/>
                    <MenuItem>Save</MenuItem>
                    <MenuItem>Save All</MenuItem>
                </SubMenu>
                <SubMenu title="View">
                    <MenuItem>Explorer</MenuItem>
                    <MenuItem>Transaction</MenuItem>
                    <MenuItem>Preview</MenuItem>
                </SubMenu>
                <Divider/>
            </div>
        )
    }
}
