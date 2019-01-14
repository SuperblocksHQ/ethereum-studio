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
import classNames from 'classnames';
import style from './style.less';

const Note = ({
    title,
    text,
    backgroundColor = "#F8E71C",
    color = "#262E33",
    textClassName = {},
} = props) => (
    <div>
        <span className={style.note} style={{backgroundColor: backgroundColor, color: color }}>{title}</span>
        { text && <span className={classNames([style.noteText, textClassName])}>{text}</span> }
    </div>
);

export default Note;

Note.propTypes = {
    title: Proptypes.string.isRequired,
    text: Proptypes.string,
    backgroundColor: Proptypes.string,
    color: Proptypes.string
}
