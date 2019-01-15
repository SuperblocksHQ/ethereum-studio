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
    IconEdit,
    IconAddFile,
    IconAddFolder,
    IconImportFile
} from '../../../../icons';
import style from '../../style.less';
import { DropdownContainer } from '../../../../common';
import { FadeInComponent } from './fadeInComponent';
import { ShowActions } from './showActions';
import Tooltip from '../../../../tooltip';
import classnames from 'classnames';

export class DirectoryEntry extends Component {
    render() {
        const {
            title,
            angleClicked,
            clickNewFile,
            clickImportFile,
            clickNewFolder,
            clickRenameFile,
            clickDeleteFile,
            fullPath,
            icons,
        } = this.props;

        const alwaysVisible = fullPath === "/";

        const contextMenuDirectory=(
            <div className={style.contextMenu}>
                <div onClick={clickNewFile}>
                    <div className={style.icon} >
                        <IconAddFile />
                    </div>
                    Create File
                </div>
                <div onClick={clickImportFile}>
                    <div className={style.icon} >
                        <IconImportFile />
                    </div>
                    Import File
                </div>
                <div onClick={clickNewFolder}>
                    <div className={style.icon} >
                        <IconAddFolder />
                    </div>
                    Create Folder
                </div>
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
            <DropdownContainer dropdownContent={contextMenuDirectory} useRightClick={true}>
                <div className={classnames(style.projectContractsTitleContainer, style.directoryEntry)} onClick={angleClicked} onContextMenu={(e) => e.preventDefault()}>
                    <ShowActions
                        alwaysVisible={alwaysVisible}
                        actionContainer={
                            <div className={style.buttonsWrapper}>
                                <FadeInComponent>
                                    <div className={style.buttons} onClick={(e) => e.stopPropagation()}>
                                        <a href="#" title="New File" onClick={clickNewFile}>
                                            <Tooltip title="New File">
                                                <IconAddFile />
                                            </Tooltip>
                                        </a>
                                        <a href="#" title="New Folder" onClick={clickNewFolder}>
                                            <Tooltip title="New Folder">
                                                <IconAddFolder />
                                            </Tooltip>
                                        </a>
                                        {
                                            fullPath != "/" &&
                                                <div style={{display: "inline"}}>
                                                    <a href="#" title="Rename" onClick={clickRenameFile}>
                                                        <Tooltip title="Rename">
                                                            <IconEdit />
                                                        </Tooltip>
                                                    </a>
                                                    <a href="#" title="Delete" onClick={clickDeleteFile}>
                                                        <Tooltip title="Delete">
                                                            <IconTrash />
                                                        </Tooltip>
                                                    </a>
                                                </div>
                                        }
                                    </div>
                                </FadeInComponent>
                            </div>
                        }
                    >
                            {icons}
                            <div className={style.title} title={title}>
                                <a href="#">{title}</a>
                            </div>
                    </ShowActions>
                </div>
            </DropdownContainer>
        );
    }
}
