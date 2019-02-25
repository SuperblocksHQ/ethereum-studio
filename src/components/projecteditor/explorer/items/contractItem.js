import React from 'react';
import { IconContract, IconConfigure, IconCompile, IconDeploy, IconInteract, IconEdit, IconTrash } from '../../../icons';
import { BaseItem } from './baseItem';
import style from './style.less';
import { getToolbar } from './fileItem';

export function ContractItem(props) {
    const toolbar = getToolbar(props);

    function getActionButtonProps(name, onClick) {
        return { 
            data: { id: props.data.id, name, opened: false }, 
            onClick: () => onClick(props.data),
            nocaretStyle: style.reduced
        };
    }

    const contextMenu=(
        <div className={ style.contextMenu }>
            <div onClick={ props.onRenameClick }>
                <div className={style.icon}>
                    <IconEdit />
                </div>
                Rename
            </div>
            <div onClick={ props.onDeleteClick }>
                <div className={style.icon}>
                    <IconTrash />
                </div>
                Delete
            </div>
        </div>
    );

    return (
        <BaseItem
            { ...props }
            togglable={true}
            toolbar={ toolbar }
            contextMenu={ contextMenu }
            icon={ <IconContract /> }>
            <BaseItem icon={ <IconConfigure /> } { ...getActionButtonProps('Configure', props.onConfigureClick) }  />
            <BaseItem icon={ <IconCompile /> } { ...getActionButtonProps('Compile', props.onCompileClick) }  />
            <BaseItem icon={ <IconDeploy /> } { ...getActionButtonProps('Deploy', props.onDeployClick ) }  />
            <BaseItem icon={ <IconInteract /> } { ...getActionButtonProps('Interact', props.onInteractClick) }  />
        </BaseItem>
    );
}
