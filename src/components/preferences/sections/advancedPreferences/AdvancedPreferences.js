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
import PropTypes from 'prop-types';
import style from './style.less';

export default class AdvancedPreferences extends Component {

    state = {
        trackAnalytics: true,
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    getPreferences() {
        return {
            trackAnalytics: this.state.trackAnalytics
        }
    }

    render() {
        const { trackAnalytics } = this.state;

        return (
            <div className={style.container}>
                <h2>General Preferences</h2>
                <div>
                    <div className={style.title}>Analytics</div>
                    <div className={style.description}>We use analytics in Lab to gain more insights into how Lab is used. Of course, this tracking is anonymous and we don't track any information about you. Check out our <a href="https://help.superblocks.com">Help Center</a> to learn more about what exactly are we tracking.</div>
                </div>
            </div>
        )
    }
}

AdvancedPreferences.propTypes = {
    onRef: PropTypes.func.isRequired
}


