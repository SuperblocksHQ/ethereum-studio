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

import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import { PaneTabs } from './paneTabs';
import { PaneType, Pane, IFilePane, Panels, IPanelsState } from '../../../models/state';
import { FileEditor } from './editor';
import { IProjectItem } from '../../../models';
import PaneDraggable from './paneDraggable';
import { IconTogglePreview } from '../../icons';
import { PaneAction } from '../paneAction';
import { OnlyIf } from '../../common';

interface IProps {
    panes: Pane[];
    panels: IPanelsState;
    dragging: boolean;
    tree: IProjectItem;
    onSaveFile: (fileId: string, code: string) => void;
    onOpenFile: (fileItem: IProjectItem) => void;
    onClosePane: (fileId: string) => void;
    onCloseAllOtherPanes: (fileId: string) => void;
    onCloseAllPanes: () => void;
    onMovePane: (fromIndex: number, toIndex: number) => void;
    togglePanel: (panel: Panels) => void;
    onUnsavedChange: (fileId: string, hasUnsavedChanges: boolean, code: any) => void;
}

export function Panes(props: IProps) {

    const isPanelOpen = (panel: Panels) => props.panels[panel] && props.panels[panel].open;

    return (
        <div className={classnames(style.panescontainer, { dragging: props.dragging })}>
            <PaneDraggable index={props.panes.length} onMovePane={props.onMovePane} isRoot={true}>
                <div className={style.header}>
                    <PaneTabs
                        panes={props.panes}
                        onTabClick={props.onOpenFile}
                        onTabClose={props.onClosePane}
                        onCloseAllOtherTabs={props.onCloseAllOtherPanes}
                        onCloseAllTabs={props.onCloseAllPanes}
                        onMovePane={props.onMovePane} />

                    <OnlyIf test={!isPanelOpen(Panels.Preview) && !isPanelOpen(Panels.Transactions)}>
                        <PaneAction
                            tooltipText='Toggle Preview'
                            icon={<IconTogglePreview />}
                            onClick={() => props.togglePanel(Panels.Preview)}
                        />
                    </OnlyIf>
                </div>
            </PaneDraggable>
            <div className={style.panes}>
            {
                props.panes.map((p) => {
                    if (p.type === PaneType.FILE) {
                        const pane = p as IFilePane;
                        return <FileEditor
                                    key={pane.file.id}
                                    file={pane.file}
                                    tree={props.tree}
                                    visible={pane.active}
                                    hasUnsavedChanges={pane.hasUnsavedChanges}
                                    onSave={props.onSaveFile}
                                    onUnsavedChange={props.onUnsavedChange}
                                />;
                    }
                })
            }
            </div>
        </div>
    );
}
