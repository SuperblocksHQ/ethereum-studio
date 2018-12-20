// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import Proptypes from 'prop-types';
import style from './style.less';
import classNames from 'classnames';
import { IconClose } from '../../icons';

const ModalHeader = ({ title, onCloseClick }) => (
    <div className={style.header}>
        <div className={style.title}>{title}</div>
        <button className={classNames([style.closeIcon, "btnNoBg"])} onClick={onCloseClick}>
            <IconClose className={style.icon}/>
        </button>
    </div>
);

export default ModalHeader;

ModalHeader.propTypes = {
    title: Proptypes.string.isRequired,
    onCloseClick: Proptypes.func.isRequired
};
