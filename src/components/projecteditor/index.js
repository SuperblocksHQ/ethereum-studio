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
import Panes from './panes';
import TopBar from '../topbar';
import ContactContainer from '../contactContainer';

export default class ProjectEditor extends Component {

    state = {
        controlPanelWidth: 310,
        draggin: false
    }

    constructor(props) {
        super(props);

        this.props.router.register("main", this);

        // Mute defalt ctrl-s behavior.
        window.addEventListener("keydown", function(e) {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                e.preventDefault();
            }
        }, false);
    }

    // we could get away with not having this (and just having the listeners on
    // our div), but then the experience would be possibly be janky. If there's
    // anything w/ a higher z-index that gets in the way, then you're toast,
    // etc.
    componentDidUpdate(props, state) {
        if (this.state.dragging && !state.dragging) {
            document.addEventListener('mousemove', this.onMouseMove)
            document.addEventListener('mouseup', this.onMouseUp)
        } else if (!this.state.dragging && state.dragging) {
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        }
    };

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

    changePanelSize = () => {

    }

    onMouseMove = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!this.state.dragging) return;
        this.setState({
            controlPanelWidth: e.pageX
        });
    }

    onMouseUp = (e) => {
        e.stopPropagation();
        e.preventDefault();

        this.setState({ dragging: false });
    }

    onMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // only left mouse button
        if (e.button !== 0) return;
        this.setState({
            dragging: true,
            controlPanelWidth: e.screenX
        });
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
        const { controlPanelWidth } = this.state;
        return (
            <div class={style.projecteditor} id="main_container">
                <TopBar router={this.props.router} />
                <div style="display: flex; height: 100%">
                    <div key="main_control" id="main_control" class={style.control} style={{width: controlPanelWidth}}>
                        <Control router={this.props.router} functions={this.props.functions} />
                        <ContactContainer />
                    </div>
                    <span class="resizer vertical" onMouseDown={this.onMouseDown}></span>
                    <div style="position: relative; width: 100%">
                        <div key="main_panes" id="main_panes" class={style.panescontainer}>
                            <Panes router={this.props.router} functions={this.props.functions} />
                        </div>
                        <div class="bottom-status-bar">
                        <span class="left" onMouseDown={this.changePanelSize}>
                            <span class="note">Note</span>
                            <span class="note-text">All files are stored in the browser only, download to backup</span>
                        </span>
                        <span class="right">{endpoint}</span>
                    </div>

                </div>
                </div>
            </div>
        );
    }
}
