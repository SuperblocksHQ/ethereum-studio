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

export function ConstructorArgumentsHeader() {
    return (
        <React.Fragment>
            <p><b>Constructor arguments</b></p>
            <p className={style.infoText}>
                When deploying your contract, you need to provide the initial values for the contract's constructor arguments.
                <a
                    href='https://help.superblocks.com/en/articles/3195299-working-with-smart-contracts'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {' '}
                    Learn more
                </a>
                <br />
                <br />
            </p>
        </React.Fragment>
    );
}
