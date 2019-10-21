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
import { IconGithub, IconTwitter, IconGitter } from '../icons';

export default class ContactContainer extends Component {
    render() {
        let { appVersion } = this.props;
        return (
            <div className={style.container}>
                <div style={{ display: "inline-block" }}>
                    <a href="https://twitter.com/ethdotorg" target="_blank" rel="noopener noreferrer" className={style.contactIcon} title="Ethereum' Twitter">
                        <IconTwitter />
                    </a>
                    <a href="https://github.com/SuperblocksHQ/ethereum-studio" target="_blank" rel="noopener noreferrer" className={style.contactIcon} title="Ethereum Studio Github">
                        <IconGithub />
                    </a>
                    <a href="https://gitter.im/ethereum/documentation" target="_blank" rel="noopener noreferrer" className={style.contactIcon} title="Documentation' Community (Gitter)">
                        <IconGitter />
                    </a>
                </div>
                <div className={style.version}>{appVersion}</div>
            </div>
        );
    }
}
