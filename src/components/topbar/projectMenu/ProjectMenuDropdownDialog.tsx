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
import { MenuItem } from '../../common/menu';
import style from './style.less';
import {
    IconConfigure,
    IconDownload,
    IconTrash,
    IconEdit
} from '../../icons';
import classNames from 'classnames';

interface IProps {
    projectId: string;
    deleteProject: (projectId: string) => void;
    renameProject: () => void;
    customClass?: string;
}

export default class ProjectMenuDropdownDialog extends Component<IProps> {

    handleMenuItemClick = (action: string) => {
        const { projectId } = this.props;

        switch (action) {
            case 'export-project':
                console.log('Export');
                break;
            case 'rename-project':
                this.props.renameProject();
                break;
            case 'delete-project':
                this.props.deleteProject(projectId);
                break;
            default:
                return;
        }
    }

    render() {
        return (
            <div className = {classNames([style.menuDialog, this.props.customClass])} >
                <MenuItem
                    icon={<IconDownload />}
                    action='download-project'
                    onClick={this.handleMenuItemClick}
                    title='Download'
                />
                <MenuItem
                    icon={<IconConfigure />}
                    action='configure-project'
                    onClick={this.handleMenuItemClick}
                    title='Configure'
                />
                <MenuItem
                    icon={<IconEdit />}
                    action='rename-project'
                    onClick={this.handleMenuItemClick}
                    title='Rename'
                />
                <MenuItem
                    icon={<IconTrash />}
                    action='delete-project'
                    onClick={this.handleMenuItemClick}
                    title='Delete'
                />
            </div>
        );
    }
}
