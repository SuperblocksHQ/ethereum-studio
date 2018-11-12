import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';
import { IconAngleRight, IconAngleDown } from '../icons';

const Caret = ({ onClick, expanded = false } = props) => (
    <div className={style.caret} onClick={onClick}>
        {expanded ? (
            <IconAngleDown height="5" width="8" />
        ) : (
            <IconAngleRight height="8" width="5" />
        )}
    </div>
);

export default Caret;

Caret.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
};
