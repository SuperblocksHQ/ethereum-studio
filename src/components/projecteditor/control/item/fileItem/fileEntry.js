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
import {
    IconTrash,
    IconEdit
} from '../../../../icons';
import style from '../../style.less';
import { DropdownContainer } from '../../../../common';
import { Tooltip } from '../../../../common';
import { FadeInComponent } from './fadeInComponent';
import { ShowActions } from './showActions';
import classnames from 'classnames';

export class FileEntry extends Component {
    render() {
        const {
            openItem,
            title,
            isReadOnly,
            clickRenameFile,
            clickDeleteFile,
            icons,
            isAppFile
        } = this.props;

        const contextMenuFile = (
            <div className={style.contextMenu}>
                <div onClick={clickRenameFile}>
                    <div className={style.icon}>
                        <IconEdit />
                    </div>
                    Rename
                </div>
                <div onClick={clickDeleteFile}>
                    <div className={style.icon}>
                        <IconTrash />
                    </div>
                    Delete
                </div>
            </div>
        );

        return (
            <DropdownContainer dropdownContent={contextMenuFile} useRightClick={!isReadOnly && !isAppFile} onContextMenu={e => e.preventDefault()}>
                <div className={classnames(style.projectContractsTitleContainer, style.fileEntry)} onClick={openItem}>
                    <ShowActions
                        isReadOnly={isReadOnly || isAppFile}
                        actionContainer={
                            <div className={style.buttonsWrapper}>
                                <FadeInComponent>
                                    <div className={style.buttons} onClick={e => e.stopPropagation()}>
                                        <a href="#" title="Rename file" onClick={clickRenameFile}>
                                            <Tooltip title="Rename">
                                                <IconEdit />
                                            </Tooltip>
                                        </a>
                                        <a href="#" title="Delete file" onClick={clickDeleteFile} >
                                            <Tooltip title="Delete">
                                                <IconTrash />
                                            </Tooltip>
                                        </a>
                                    </div>
                                </FadeInComponent>
                            </div>
                        }
                    >
                            {icons}
                            <div className={style.title}>
                                <a title={title} href="#">
                                    {title}
                                </a>
                            </div>
                    </ShowActions>
                </div>
            </DropdownContainer>
        );
    }
}
