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
import {
    IconContract,
} from '../icons';
import style from './style.less';

const TreeFileItem = (props) => {

    const onClickHandler = () => {
        const {name, source, path, dependencies} = props;

        props.onFileSelected(name, source, "/".concat(path), dependencies);
    };

    const { name, level, selectedTitle } = props;

    const levelNumber = `level${level}`;

    return (
        <div>
            <div className={style.treeItem}>
                <div className={`${style.treeItemContainer} ${selectedTitle === name ? style.selected : ''}`} onClick={onClickHandler} >
                    <div className={`${style.header} ${style[levelNumber]}`}>
                        <div className={style.icons}>
                            <div className={style.caret} >
                                &nbsp;
                            </div>
                            <div className={style.icon}>
                                <IconContract/>
                            </div>
                        </div>
                        <div className={style.title}>
                            <a>{name}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TreeFileItem;

