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

import { Component } from 'preact';
import style from './style';
import Control from './control.js';
import Panes from './panes.js';

export default class DevkitProjectEditor extends Component {
    constructor(props) {
        super(props);

        // Used to communicate between components, events is probably a bettter way of doing this.
        this.router={
            register: this.register,
        };
        this.router.register("main", this);

        window.addEventListener("resize", (e) =>{
            this._updatePanesWidth();
        });
        // Mute defalt ctrl-s behavior.
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
            }
        }, false);
    }

    componentWillReceiveProps = (props) => {
    };

    componentDidMount() {
        this._updatePanesWidth();
    }

    redraw = (all) => {
        if(this.router.control) {
            this.router.control.redraw();
        }
        if(this.router.panes) {
            this.router.panes.redraw(all);
        }
    };

    register = (name, obj) => {
        this.router[name] = obj;
    };

    _updatePanesWidth=()=>{
        const a=document.getElementById("main_container");
        const b=document.getElementById("main_control");
        const c=document.getElementById("main_panes");
        if(!a) return;
        c.style.width=(a.offsetWidth-b.offsetWidth-3)+"px";
    }

    render() {
        return (
            <div class={style.projecteditor} id="main_container">
                <div key="main_control" id="main_control" class={style.control}>
                    <Control router={this.router} functions={this.props.functions} />
                </div>
                <div key="main_panes" id="main_panes" class={style.panescontainer}>
                    <Panes router={this.router} functions={this.props.functions} />
                </div>
            </div>
        );
    }
}
