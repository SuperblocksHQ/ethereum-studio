import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { IconClose } from '../../icons';


export function BaseSidePanel(props) {
    return (
        <div className={classNames(style.actionContainer, { dragging: props.dragging })}>
            <div className={style.header}>
                <div className={style.panelIcon}>
                    {props.icon}
                </div>
                <span className={style.title}>
                    {props.name}
                </span>
                <button
                    className={classNames([ style.icon, 'btnNoBg', ])}
                    onClick={props.onClose}>
                    <IconClose />
                </button>
            </div>
            {props.children}
        </div>
    );
}
