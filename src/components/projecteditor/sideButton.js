import React from 'react';
import classNames from 'classnames';
import style from './style.less';

export function SideButton(props) {
    return(
        <button
            className={classNames([style.sideButton, 'btnNoBg'])}
            onClick={props.onClick}
        >
            <span className={style.icon}>
                {props.icon}
            </span>
            <span className={style.buttonText}>
                {props.name}
            </span>
        </button>
    );
}
