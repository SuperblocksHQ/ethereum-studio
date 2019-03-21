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

import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import { IconClose } from '../../icons';
import { DropdownContainer, FileIcon } from '../../common';
import { IPane } from '../../../models/state';
import { IProjectItem } from '../../../models';

interface IState {
    mousePositionX: number;
}

interface IProps {
    panes: IPane[];
    onCloseAllTabs: () => void;
    onCloseAllOtherTabs: (fileId: string) => void;
    onTabClick: (file: IProjectItem) => void;
    onTabClose: (fileId: string) => void;
}

export class PaneTabs extends React.Component<IProps, IState> {
    state: IState = {
        mousePositionX: 0
    };

    getContextMenuElement = (fileId: string) => {
        const { mousePositionX } = this.state;

        return (
            <div className={style.contextMenu} style={{left: mousePositionX}}>
                <div className={style.item} onClick={this.props.onCloseAllTabs}>
                    Close all
                </div>
                <div className={style.item} onClick={() => this.props.onCloseAllOtherTabs(fileId)}>
                    Close all other
                </div>
            </div>
        );
    }

    handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();

        this.setState({
            mousePositionX: e.pageX
        });
    }

    handleTabClose = (paneId: string, hasUnsavedChanges: boolean) => {
        const { onTabClose } = this.props;

        if (hasUnsavedChanges && !confirm('File is not saved, close anyway?')) {
            return;
        }

        onTabClose(paneId);
    }

    render() {
        const { panes, onTabClick } = this.props;

        return (
            <React.Fragment>
                {panes.map((paneData) =>
                    <div key={paneData.file.id}
                        className={ classnames(style.tab, { [style.selected]: paneData.active }) }
                        onMouseDown={ e => e.button === 1 ? this.handleTabClose(paneData.file.id, paneData.hasUnsavedChanges) : onTabClick(paneData.file) }
                        onContextMenu={ e => this.handleRightClick(e)}>

                        <DropdownContainer
                            dropdownContent={this.getContextMenuElement(paneData.file.id)}
                            useRightClick={true}>
                            <div className={style.tabContainer}>
                                <div className={style.title}>
                                    <div className={style.icon}>{<FileIcon filename={paneData.file.name} />}</div>
                                    <div className={style.title2}>{paneData.file.name}</div>
                                </div>
                                <div className={style.close}>
                                    <button className='btnNoBg'
                                        onMouseDown={e => e.stopPropagation()}
                                        onClick={() => this.handleTabClose(paneData.file.id, paneData.hasUnsavedChanges)}>
                                        <IconClose />
                                    </button>
                                </div>
                            </div>
                        </DropdownContainer>

                    </div>
                )}
            </React.Fragment>
        );
    }
}
