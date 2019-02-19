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
import OnlyIf from '../../onlyIf';

interface IProps {
    projectId: string;
    downloadProject?: () => void;
    configureProject?: () => void;
    renameProject?: () => void;
    deleteProject?: (projectId: string) => void;
    shareProject?: () => void;
    customClass?: string;
}

export default class ProjectMenuDropdownDialog extends Component<IProps> {
    render() {
        const { projectId, downloadProject, configureProject, renameProject, deleteProject, shareProject } = this.props;

        return (
            <div className = {classNames([style.menuDialog, this.props.customClass])} >
                { downloadProject &&
                    <MenuItem
                        onClick={() => downloadProject()}
                        title='Download'
                    />
                }
                { configureProject &&
                    <MenuItem
                        onClick={() => configureProject()}
                        title='Configure'
                    />
                }
                { renameProject &&
                    <MenuItem
                        onClick={() => renameProject()}
                        title='Rename'
                    />
                }
                { shareProject &&
                    <MenuItem
                        onClick={() => shareProject()}
                        title='Share'
                    />
                }
                { deleteProject &&
                    <MenuItem
                        onClick={() => deleteProject(projectId)}
                        title='Delete'
                    />
                }
            </div>
        );
    }
}
