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

import { h, Component } from 'preact';
import style from './style';
import {
    IconGithub,
    IconTwitter,
    IconTelegram
} from '../icons';

export default class ContactContainer extends Component {
    render() {
        let { appVersion } = this.props;
        return (
            <div class={style.container}>
                <div style="display: inline-block">
                    <a href="https://twitter.com/getsuperblocks" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconTwitter />
                    </a>
                    <a href="https://github.com/SuperblocksHQ/superblocks-lab" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconGithub />
                    </a>
                    <a href="https://t.me/GetSuperblocks" target="_blank" rel="noopener noreferrer" class={style.contactIcon}>
                        <IconTelegram />
                    </a>
                </div>
                <div class={style.version}>
                    {appVersion}
                </div>
            </div>
        );
    }
}
