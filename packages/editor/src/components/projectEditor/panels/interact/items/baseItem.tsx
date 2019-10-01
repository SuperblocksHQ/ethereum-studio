import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import { Caret } from '../../../../common';
import { IDeployedContract } from '../../../../../models';
import classNames from 'classnames';

interface IProps {
    data: IDeployedContract;
    icon?: JSX.Element;
    iconOpen?: JSX.Element;
    togglable?: boolean;
    children?: Nullable<JSX.Element> | Nullable<JSX.Element>[];
    nocaretStyle?: any;
    depth: number;
    onToggle?: (id: string) => void;
}

export function BaseItem(props: IProps) {
    let icon = props.icon;
    let caret;
    const { depth } = props;
    const { id, opened } = props.data;

    function onCaretClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (props.onToggle) {
            props.onToggle(id);
        }
    }

    if (props.togglable) {
        if (props.data.opened) {
            icon = props.iconOpen || props.icon;
        }
        caret = (
            <Caret
                expanded={ opened || false }
            />
        );
    } else {
        caret = (
            <div className={ classnames(style.nocaret, props.nocaretStyle) } />
        );
    }

    return (
        <div className={ classNames(style.item)}>
            <div className={style.header} style={{paddingLeft: (depth * 20)}} onClick={ onCaretClick }>
                <div className={ style.icons }>
                    { caret }
                    <div className={style.icon}>{ icon }</div>
                </div>
                <div className={ style.title }>
                    <div className={ style.titleOverflow}>{ props.data.contractName }</div>
                </div>
            </div>

            <div className={ classnames(style.childrenContainer, { [style.hidden]: !props.data.opened}) }>
                { props.children }
            </div>
        </div>
    );
}

export default BaseItem;
