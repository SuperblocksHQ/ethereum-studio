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

interface IProps {
    panes: IPane[];
    onCloseAllTabs: () => void;
    onCloseAllOtherTabs: (fileId: string) => void;
    onTabClick: (file: IProjectItem) => void;
    onTabClose: (fileId: string) => void;
}

export function PaneTabs(props: IProps) {
    const getContextMenuElement = (fileId: string) => {
        return (
            <div className={style.contextMenu}>
                <div className={style.item} onClick={props.onCloseAllTabs}>
                    Close all
                </div>
                <div className={style.item} onClick={() => props.onCloseAllOtherTabs(fileId)}>
                    Close all other
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            {props.panes.map((paneData) =>
                <div key={paneData.file.id}
                    className={ classnames(style.tab, { [style.selected]: paneData.active }) }
                    onMouseDown={() => props.onTabClick(paneData.file)}
                    onContextMenu={ e => e.preventDefault()}>

                    <DropdownContainer
                        dropdownContent={getContextMenuElement(paneData.file.id)}
                        useRightClick={true}>
                        <div className={style.tabContainer}>
                            <div className={style.title}>
                                <div className={style.icon}>{<FileIcon filename={paneData.file.name} />}</div>
                                <div className={style.title2}>{paneData.file.name}</div>
                            </div>
                            <div className={style.close}>
                                <button className='btnNoBg'
                                    onMouseDown={e => e.stopPropagation()}
                                    onClick={e => props.onTabClose(paneData.file.id)}>
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
