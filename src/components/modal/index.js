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
import classnames from 'classnames';
import style from './style';

export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const stl=this.props.data.style || {};
        if(this.props.data.width) stl["width"]=this.props.data.width+"px";
        return (
            <div class={style.modal} style={stl}>
                <div class={style.title}>{this.props.data.title}</div>
                <div class={style.body}>{this.props.data.body}</div>
            </div>);
    }
}
