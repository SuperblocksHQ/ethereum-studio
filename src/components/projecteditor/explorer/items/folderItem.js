import React from 'react';
import classnames from 'classnames';
import { IconFolder, IconFolderOpen, IconAddFile, IconImportFile, IconAddFolder, IconEdit, IconTrash } from '../../../icons';
import { Tooltip } from '../../../common';
import { BaseItem } from './baseItem';
import style from './style.less';
import { ProjectItemTypes } from '../../../../models';

function getToolbar(props) {
    return (
        <div className={classnames(style.buttonsWrapper, { [style.alwaysOn]: props.data.isRoot })}>
            <div className={style.buttons} onClick={e => e.stopPropagation()}>
                <a href="#" title="New File" onClick={() => props.onCreateItemClick(props.data.id, ProjectItemTypes.File) }>
                    <Tooltip title="New File">
                        <IconAddFile />
                    </Tooltip>
                </a>
                <a href="#" title="New Folder" onClick={() => props.onCreateItemClick(props.data.id, ProjectItemTypes.Folder)}>
                    <Tooltip title="New Folder">
                        <IconAddFolder />
                    </Tooltip>
                </a>
                { props.data.mutable &&
                <React.Fragment>
                    <a href="#" title="Rename" onClick={() => props.onRenameClick(props.data.id)}>
                        <Tooltip title="Rename">
                            <IconEdit />
                        </Tooltip>
                    </a>
                    <a href="#" title="Delete" onClick={() => props.onDeleteClick(props.data.id)} >
                        <Tooltip title="Delete">
                            <IconTrash />
                        </Tooltip>
                    </a>
                </React.Fragment> }
            </div>
        </div>
    );
}

export function FolderItem(props) {
    const toolbar = getToolbar(props);

    const contextMenu=(
        <div className={ style.contextMenu }>
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
        </div>
    );

    return (
        <BaseItem
            { ...props }
            togglable={true}
            toolbar={ toolbar }
            icon={ <IconFolder /> }
            iconOpen={ <IconFolderOpen /> }
            contextMenu={ contextMenu }>
        </BaseItem>
    );
}
