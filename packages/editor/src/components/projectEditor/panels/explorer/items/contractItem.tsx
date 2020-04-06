import React from 'react';
import { IconContract, IconConfigure, IconCompile, IconDeploy, IconEdit, IconTrash } from '../../../../icons';
import BaseItem from './baseItem';
import style from './style.less';
import { getToolbar } from './fileItem';
import { IProjectItem } from '../../../../../models';

interface IProps {
    data: IProjectItem;
    depth: number;
    onToggle(id: string): void;
    onClick(data: IProjectItem): void;
    onRenameClick(id: string): void;
    onDeleteClick(id: string): void;
    onMoveItem(sourceId: string, targetId: string): void;
}

export function ContractItem(props: IProps) {
    const toolbar = getToolbar(props);

    function getActionButtonProps(name: string, onClick: (data: IProjectItem) => void) {
        return {
            data: { id: props.data.id, name, opened: false } as IProjectItem,
            onClick: () => onClick(props.data),
            nocaretStyle: style.reduced
        };
    }

    const contextMenu = (
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
    );

    // TODO: Remove all the actions when we move it to config file
    return (
        <BaseItem
            { ...props }
            depth={props.depth}
            togglable={true}
            toolbar={ toolbar }
            contextMenu={ contextMenu }
            icon={ <IconContract /> }
            onMoveItem={props.onMoveItem}>
        </BaseItem>
    );
}
