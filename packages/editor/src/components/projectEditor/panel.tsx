import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { IconClose } from '../icons';
import { OnlyIf } from '../common';

interface IProps {
    dragging: boolean;
    icon?: JSX.Element;
    name: string;
    children: JSX.Element;
    onClose(): void;
}

export function Panel(props: IProps) {
    return (
        <div className={classNames(style.actionContainer, { dragging: props.dragging })}>
            <div className={style.header}>
                <OnlyIf test={props.icon}>
                    <div className={style.panelIcon}>
                        {props.icon}
                    </div>
                </OnlyIf>
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
