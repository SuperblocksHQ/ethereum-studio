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
import PropTypes from 'prop-types';
import style from './style';

export default class Welcome extends Component {

    onCreateNewProjectClick = (e) => {
        console.log(this.props);
        this.props.router.control._newDapp(e);
    }

    render() {
        return (
            <div class={style.container}>
                <div class={style.content}>
                    <img src={'/static/img/img-welcome.svg'}/>;
                    <h3>Looks like you don’t have any project created just yet</h3>
                    <p><a href="#" onClick={this.onCreateNewProjectClick}>Create a new project</a> from any of our existing templates to get started</p>
                    <button class="btn2 mt-4" onClick={this.onCreateNewProjectClick}>Create New Project</button>
                </div>
            </div>
        );
    }
}

Welcome.propTypes = {
    router: PropTypes.object.isRequired
}
