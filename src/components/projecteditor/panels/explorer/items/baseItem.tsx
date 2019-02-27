import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import { DropdownContainer, Caret } from '../../../../common';
import { IProjectItem } from '../../../../../models';

interface IProps {
    data: IProjectItem;
    icon: JSX.Element;
    iconOpen?: JSX.Element;
    togglable?: boolean;
    contextMenu?: Nullable<JSX.Element>;
    toolbar?: Nullable<JSX.Element>;
    children?: Nullable<JSX.Element> | Nullable<JSX.Element>[];
    nocaretStyle?: any;

    onToggle?: (id: string) => void;
    onClick(data: IProjectItem): void;
}

export function BaseItem(props: IProps) {
    let icon = props.icon;
    let caret;

    function onCaretClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (props.onToggle) {
            props.onToggle(props.data.id);
        }
    }

    if (props.togglable) {
        if (props.data.opened) {
            icon = props.iconOpen || props.icon;
        }
        caret = (
            <Caret
                expanded={ props.data.opened || false }
                onClick={ onCaretClick }
            />
        );
    } else {
        caret = (
            <div className={ classnames(style.nocaret, props.nocaretStyle) } />
        );
    }

    return (
        <div className={ style.item }>
            <DropdownContainer dropdownContent={ props.contextMenu } useRightClick={ true }>
                <div className={ style.header } onClick={ () => props.onClick(props.data) } onContextMenu={ e => e.preventDefault() }>
                    <div className={ style.overlay }></div>
                    <div className={ style.icons }>
                        { caret }
                        <div className={style.icon}>{ icon }</div>
                    </div>
                    <div className={ style.title }><a>{ props.data.name }</a></div>
                    {props.toolbar}
                </div>
            </DropdownContainer>

            <div className={ classnames(style.childrenContainer, { [style.hidden]: !props.data.opened }) }>
                { props.children }
            </div>
        </div>
    );
}
