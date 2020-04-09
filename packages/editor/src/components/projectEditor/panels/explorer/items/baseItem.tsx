import React, { useState } from 'react';
import classnames from 'classnames';
import style from './style.less';
import { DropdownContainer, Caret } from '../../../../common';
import { IProjectItem } from '../../../../../models';
import { DragSource, DragSourceSpec, ConnectDragSource } from 'react-dnd';
import classNames from 'classnames';

interface IProps {
    data: IProjectItem;
    icon: JSX.Element;
    iconOpen?: JSX.Element;
    togglable?: boolean;
    contextMenu?: Nullable<JSX.Element>;
    toolbar?: Nullable<JSX.Element>;
    children?: Nullable<JSX.Element> | Nullable<JSX.Element>[];
    nocaretStyle?: any;
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
    isOver?: boolean;
    depth: number;
    disableDrag?: boolean;

    onToggle?: (id: string) => void;
    onMoveItem?: (sourceId: string, targetId: string) => void;
    onClick(data: IProjectItem): void;
}

const itemSource: DragSourceSpec<IProps, {}> = {
    canDrag(props) {
        if (props.disableDrag) {
            return false;
        }

        // Disallow to move root item (Files folder)
        return !props.data.isRoot;
    },
    beginDrag(props) {
        const { togglable, onToggle } = props;
        const { opened, id } = props.data;

        // Close folder before dragging it
        if (onToggle && togglable && opened) {
            onToggle(id);
        }

        return {
            id
        };
    },
    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }

        const sourceId = props.data.id;
        const targetId = monitor.getDropResult().id;
        const { onMoveItem } = props;

        if (sourceId === targetId) {
            return;
        }

        if (onMoveItem) {
            onMoveItem(sourceId, targetId);
        }
    }
};

const collect: any = (connect: any, monitor: any) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
};

export function BaseItem(props: IProps) {
    const [mousePositionX, setMousePositionX] = useState(0);
    const [mousePositionY, setMousePositionY] = useState(0);
    let icon = props.icon;
    let caret;
    const { connectDragSource, isDragging, isOver, depth } = props;
    const { id, opened } = props.data;
    const cls = [
        isOver ? style.isOver : null,
        isDragging ? style.isDragging : null
    ];

    function onCaretClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (props.onToggle) {
            props.onToggle(id);
        }
    }

    function handleRightClick(e: React.MouseEvent) {
        e.preventDefault();
        setMousePositionX(e.pageX);
        setMousePositionY(e.pageY + 10);
    }

    if (props.togglable && props.data.type === 'FOLDER') {
        if (props.data.opened) {
            icon = props.iconOpen || props.icon;
        }
        caret = (
            <Caret
                expanded={ opened || false }
                onClick={ onCaretClick }
            />
        );
    } else {
        caret = (
            <div className={ classnames(style.nocaret, props.nocaretStyle) } />
        );
    }

    return (
        connectDragSource ? connectDragSource(
            <div className={ classNames(style.item, cls) }>
                <DropdownContainer useRightClick={true} dropdownContent={
                        props.contextMenu &&
                            <div className={style.contextMenu} style={{left: mousePositionX, top: mousePositionY}}>
                                {props.contextMenu}
                            </div>
                        }
                >
                    <div onClick={ () => props.onClick(props.data) } onContextMenu={(e) => handleRightClick(e) }>
                        <div className={style.header} style={{paddingLeft: (depth * 20)}}>
                            <div className={ style.icons }>
                                { caret }
                                <div className={style.icon}>{ icon }</div>
                            </div>
                            <div className={ style.title }>
                                <div className={ style.titleOverflow}>{ props.data.name }</div>
                            </div>
                            {props.toolbar}
                        </div>
                    </div>
                </DropdownContainer>

                <div className={ classnames(style.childrenContainer, { [style.hidden]: !props.data.opened}) }>
                    { props.children }
                </div>
            </div>
        )
        :
        null
    );
}

export default DragSource<IProps>('ITEM', itemSource, collect)(BaseItem);
