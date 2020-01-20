import React from 'react';
import style from './style.less';
import classNames from 'classnames';
import { OnlyIf, Tooltip } from '../common';

interface IProps {
    dragging: boolean;
    icon?: JSX.Element;
    name?: string;
    actions?: JSX.Element;
    children: JSX.Element;
}

interface IPanelActionProps {
    tooltipText: string;
    onClick: () => void;
    icon: JSX.Element;
}

export function PanelAction({ tooltipText, onClick, icon }: IPanelActionProps) {
    return (
        <Tooltip title={tooltipText}>
            <button className={classNames([ style.icon, 'btnNoBg'])} onClick={onClick}>
                {icon}
            </button>
        </Tooltip>
    );
}
export function Panel(props: IProps) {
    return (
        <div className={classNames(style.actionContainer, { dragging: props.dragging })}>
            { props.name &&
                <div className={style.header}>
                    <OnlyIf test={props.icon}>
                        <div className={style.panelIcon}>
                            {props.icon}
                        </div>
                    </OnlyIf>
                    <span className={style.title}>
                        {props.name}
                    </span>
                    <OnlyIf test={props.actions}>
                        <div className={style.actions}>
                        { props.actions}
                        </div>
                    </OnlyIf>
                </div>
            }
            {props.children}
        </div>
    );
}
