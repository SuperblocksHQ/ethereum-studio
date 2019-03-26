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
import style from './style.less';
import data from '../../../../../assets/static/json/openzeppelin.json';
import FolderTree from "../../../../folderTree/FolderTree";

const FileFinder = (props) => {

    const {onFileSelected, selectedTitle} = props;

    return (
        <div className={style.container}>
            <FolderTree data={data} onFileSelected={onFileSelected} selectedTitle={selectedTitle}/>
        </div>
    );

};

export default FileFinder;
