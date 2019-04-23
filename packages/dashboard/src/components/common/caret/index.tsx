import React from 'react';
import style from './style.less';
import { IconAngleRight, IconAngleDown } from '../../icons';
import classNames from 'classnames';

interface IProps {
    expanded: boolean;
    onClick?: () => void;
}
export const Caret = ({ onClick, expanded = false }: IProps) => (
    <div className={classNames(style.caret, expanded ? style.caretExpanded : null)} onClick={onClick}>
        {expanded ? (
            <IconAngleDown height='5' width='8' />
        ) : (
            <IconAngleRight height='8' width='5' />
        )}
    </div>
);
