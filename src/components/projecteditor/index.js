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
import Control from './control';
import Panes from './panes.js';
import TopBar from '../topbar';

export default class ProjectEditor extends Component {
    constructor(props) {
        super(props);

        this.props.router.register("main", this);

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
        if(this.props.router.control) {
            this.props.router.control.redraw();
        }
        if(this.props.router.app) {
            this.props.router.app.redraw(all);
        }
        if(this.props.router.panes) {
            this.props.router.panes.redraw(all);
        }
    };

    _updatePanesWidth=()=>{
        const a=document.getElementById("main_container");
        const b=document.getElementById("main_control");
        const c=document.getElementById("main_panes");
        if(!a) return;
        c.style.width=(a.offsetWidth-b.offsetWidth-3)+"px";
    }

    render() {
        var endpoint="";
        var project;
        if (this.props.router && this.props.router.control) {
            project = this.props.router.control && this.props.router.control.getActiveProject();
            if (project) {
                const network = project.props.state.data.env;
                endpoint = (this.props.functions.networks.endpoints[network] || {}).endpoint;
            }
        }
        return (
            <div class={style.projecteditor} id="main_container">
                <TopBar router={this.props.router} />
                <div key="main_control" id="main_control" class={style.control}>
                    <Control router={this.props.router} functions={this.props.functions} />
                </div>
                <div key="main_panes" id="main_panes" class={style.panescontainer}>
                    <Panes router={this.props.router} functions={this.props.functions} />
                </div>
                <div class="bottom-status-bar">
                    <span class="left">
                        <span class="note">Note</span>
                        <span class="note-text">All files are stored in the browser only, download to backup</span>
                    </span>
                    <span class="right">{endpoint}</span>
                </div>
            </div>
        );
    }
}
