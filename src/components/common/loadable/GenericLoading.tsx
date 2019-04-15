// Copyright 2019 Superblocks AB
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

import React, {Fragment} from 'react';
import style from './style.less';
import classNames from 'classnames';

// To be used as a normal React loader component (not react-loadable)
export class GenericLoading extends React.Component<any> {
    render() {
        return (
            <Fragment>
                <div className={style.centeredLoadingPosition}>
                    <div className={style.skCubeGrid}>
                        <div className={classNames([style.skCube, style.skCube1])}></div>
                        <div className={classNames([style.skCube, style.skCube2])}></div>
                        <div className={classNames([style.skCube, style.skCube3])}></div>
                        <div className={classNames([style.skCube, style.skCube4])}></div>
                        <div className={classNames([style.skCube, style.skCube5])}></div>
                        <div className={classNames([style.skCube, style.skCube6])}></div>
                        <div className={classNames([style.skCube, style.skCube7])}></div>
                        <div className={classNames([style.skCube, style.skCube8])}></div>
                        <div className={classNames([style.skCube, style.skCube9])}></div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
