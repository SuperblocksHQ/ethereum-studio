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

import React, { Component } from 'react';
import style from './style.less';
import { IconEthereum } from '../../icons';

export default class BottomBar extends Component {

    render() {
        return (
            <div className={style.bottomStatusBar}>
                <div className={style.left}>
                    <a href='https://superblocks.com' target='_blank' rel='noopener noreferrer'>
                        <span>Powered by</span>
                        <img src='/static/img/img-logo-superblocks.svg' alt='Superblocks' />
                    </a>
                </div>
                <div className={style.right}>
                    <a href='https://ethereum.org' target='_blank' rel='noopener noreferrer'>
                        <IconEthereum />
                    </a>
                </div>
            </div>
        );
    }
}
