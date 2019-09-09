import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';
import { IconAngleRight, IconAngleDown } from '../../icons';
import classNames from 'classnames';

export const Caret = ({ onClick, expanded = false } = props) => (
    <div className={classNames(style.caret, expanded ? style.caretExpanded : null)} onClick={onClick}>
        {expanded ? (
            <IconAngleDown height="5" width="8" />
        ) : (
            <IconAngleRight height="8" width="5" />
        )}
    </div>
);

Caret.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
};
