// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Studio.
//
// Superblocks Studio is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Studio is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Studio.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import style from './style-tools';

export default class Explorer extends Component {
    constructor(props) {
        super(props);
        this.id=props.id+"_explorer";;
    }

    redraw = () => {
        this.setState();
    };

    render() {
        return (<div id={this.id} class={style.main}>
                <div class="scrollable-y" id={this.id+"_scrollable"}>
                    <iframe src="/explorer/"></iframe>
                </div>
                </div>);
    }
}
