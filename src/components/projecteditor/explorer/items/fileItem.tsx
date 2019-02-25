import React from 'react';
import { IconEdit, IconTrash } from '../../../icons';
import { Tooltip, FileIcon } from '../../../common';
import { BaseItem } from './baseItem';
import style from './style.less';
import { IProjectItem } from '../../../../models';

interface IProps {
    data: IProjectItem;
    onClick(data: IProjectItem): void;
    onRenameClick(id: string): void;
    onDeleteClick(id: string): void;
}

export function getToolbar(props: IProps) {
    return (
        <div className={style.buttonsWrapper}>
            <div className={style.buttons} onClick={e => e.stopPropagation()}>
                <a href='#' title='Rename file' onClick={() => props.onRenameClick(props.data.id)}>
                    <Tooltip title='Rename'>
                        <IconEdit />
                    </Tooltip>
                </a>
                <a href='#' title='Delete file' onClick={() => props.onDeleteClick(props.data.id)} >
                    <Tooltip title='Delete'>
                        <IconTrash />
                    </Tooltip>
                </a>
            </div>
        </div>
    );
}

export function FileItem(props: IProps) {
    const toolbar = props.data.mutable ? getToolbar(props) : null;

    const contextMenu = props.data.mutable ? (
        <div className={ style.contextMenu }>
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
        </div>
    ) : null;

    return (
        <BaseItem
            { ...props }
            togglable={false}
            toolbar={ toolbar }
            contextMenu={ contextMenu }
            icon={ <FileIcon filename={props.data.name} /> } />
    );
}
