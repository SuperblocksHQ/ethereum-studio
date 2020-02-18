import React from 'react';
import classnames from 'classnames';
import { IconFolder, IconFolderOpen, IconAddFile, IconImportFile, IconAddFolder, IconEdit, IconTrash } from '../../../../icons';
import { Tooltip } from '../../../../common';
import BaseItem from './baseItem';
import style from './style.less';
import { ProjectItemTypes, IProjectItem } from '../../../../../models';
import {DropTarget, DropTargetSpec } from 'react-dnd';

interface IProps {
    data: IProjectItem;
    children: JSX.Element | Nullable<JSX.Element>[];
    connectDropTarget?: any;
    depth: number;
    onToggle(id: string): void;
    onClick(data: IProjectItem): void;
    onRenameClick(id: string): void;
    onCreateItemClick(parentId: string, type: ProjectItemTypes): void;
    onImportFileClick(parentId: string): void;
    onDeleteClick(id: string): void;
    onMoveItem(sourceId: string, targetId: string): void;
}

function getToolbar(props: IProps) {
    return (
        <div className={classnames(style.buttonsWrapper, { [style.alwaysOn]: props.data.isRoot })}>
            <div className={style.buttons} onClick={e => e.stopPropagation()}>
                <a href='#' onClick={() => props.onCreateItemClick(props.data.id, ProjectItemTypes.File) }>
                    <Tooltip delay='500' title='New File'>
                        <IconAddFile />
                    </Tooltip>
                </a>
                <a href='#' onClick={() => props.onCreateItemClick(props.data.id, ProjectItemTypes.Folder)}>
                    <Tooltip delay='500' title='New Folder'>
                        <IconAddFolder />
                    </Tooltip>
                </a>
                { props.data.mutable &&
                <React.Fragment>
                    <a href='#' onClick={() => props.onRenameClick(props.data.id)}>
                        <Tooltip delay='500' title='Rename'>
                            <IconEdit />
                        </Tooltip>
                    </a>
                    <a href='#' onClick={() => props.onDeleteClick(props.data.id)} >
                        <Tooltip delay='500' title='Delete'>
                            <IconTrash />
                        </Tooltip>
                    </a>
                </React.Fragment> }
            </div>
        </div>
    );
}


const itemTarget: DropTargetSpec<IProps> = {
    drop(props, monitor) {
        const { id } = props.data;

        if (monitor.didDrop()) {
            return;
        }

        return {
            id
        };
    }
};

const collect: any = (connect: any, monitor: any) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop()
    };
};

export function FolderItem(props: IProps) {
    const { connectDropTarget, onMoveItem, depth } = props;
    const toolbar = getToolbar(props);

    const contextMenu = (
        <React.Fragment>
            <div onClick={ () => props.onCreateItemClick(props.data.id, ProjectItemTypes.File) }>
                <div className={style.icon} >
                    <IconAddFile />
                </div>
                Create File
            </div>
            <div onClick={ () => props.onImportFileClick(props.data.id) }>
                <div className={style.icon} >
                    <IconImportFile />
                </div>
                Import File
            </div>
            <div onClick={ () => props.onCreateItemClick(props.data.id, ProjectItemTypes.Folder) }>
                <div className={style.icon} >
                    <IconAddFolder />
                </div>
                Create Folder
            </div>
            { props.data.mutable &&
                <React.Fragment>
                <div onClick={ () => props.onRenameClick(props.data.id) }>
                    <div className={style.icon}>
                        <IconEdit />
                    </div>
                    Rename
                </div>
                <div onClick={ () => props.onDeleteClick(props.data.id) }>
                    <div className={style.icon}>
                        <IconTrash />
                    </div>
                    Delete
                </div>
                </React.Fragment>
            }
        </React.Fragment>
    );

    return (
        connectDropTarget ? connectDropTarget(
            <div>
                <BaseItem
                    {...props}
                    depth={depth}
                    togglable={true}
                    toolbar={ toolbar }
                    icon={ <IconFolder /> }
                    iconOpen={ <IconFolderOpen /> }
                    contextMenu={ contextMenu }
                    onMoveItem={onMoveItem} />
            </div>
        )
        :
        null
    );
}

export default DropTarget<IProps>('ITEM', itemTarget, collect)(FolderItem);
