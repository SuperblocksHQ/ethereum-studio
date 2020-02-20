import React from 'react';
import { IconEdit, IconTrash } from '../../../../icons';
import { Tooltip, FileIcon } from '../../../../common';
import BaseItem from './baseItem';
import style from './style.less';
import { IProjectItem } from '../../../../../models';

interface IProps {
    data: IProjectItem;
    depth: number;
    onClick(data: IProjectItem): void;
    onRenameClick(id: string): void;
    onDeleteClick(id: string): void;
    onMoveItem(sourceId: string, targetId: string): void;
}

export function getToolbar(props: IProps) {
    return (
        <div className={style.buttonsWrapper}>
            <div className={style.buttons} onClick={e => e.stopPropagation()}>
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
            </div>
        </div>
    );
}

export function FileItem(props: IProps) {
    const toolbar = props.data.mutable ? getToolbar(props) : null;

    const contextMenu = props.data.mutable ? (
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
    ) : null;

    return (
        <BaseItem
            { ...props }
            disableDrag={!props.data.mutable}
            depth={props.depth}
            togglable={false}
            toolbar={ toolbar }
            contextMenu={ contextMenu }
            icon={ <FileIcon filename={props.data.name} /> }
            onMoveItem={props.onMoveItem} />
    );
}
