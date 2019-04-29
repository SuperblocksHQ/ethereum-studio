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

import React from 'react';
import style from './style.less';
import { StyledButton } from '../../common';
import { StyledButtonType } from '../../../models';
import { Link } from 'react-router-dom';

export const SetupBuild = () => (
    <div className={style.setupBuild}>
        <img src='/static/img/illustration-building-blocks.svg' />
        <p>Connect to your favorite repository so we can start building your project</p>
        <p>We'll build your app automatically on commit</p>
        <Link to='builds/connect'>
            <StyledButton type={StyledButtonType.Primary} text={'Setup new build'} />
        </Link>
    </div>
);
