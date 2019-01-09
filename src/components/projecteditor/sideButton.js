import React from 'react';
import classNames from 'classnames';
import style from './style.less';

export function SideButton(props) {
    return(
        <div className={style.sideButtonWrapper}>
            <button
                className={classNames([style.sideButton, 'btnNoBg'])}
                onClick={props.onClick}
            >
                {props.icon}
                <span className={style.verticalText}>
                    {props.name}
                </span>
            </button>
        </div>
    );
}
