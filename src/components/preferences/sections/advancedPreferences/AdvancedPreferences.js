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
import Switch from "react-switch";

export default class AdvancedPreferences extends Component {

    state = {
        trackAnalytics: this.props.advancedPreferences.trackAnalytics,
    }

    onTrackAnalyticsChange = (value) => {
        const { onChange } = this.props;
        const state = {
            trackAnalytics: value
        }
        this.setState(state);

        // Make sure to notify the parent about the update
        onChange(state);
    }

    render() {
        const { trackAnalytics } = this.state;

        return (
            <div className={style.container}>
                <h2>Advanced Preferences</h2>
                <div>
                    <div className={style.title}>Analytics</div>
                    <div className={style.description}>
                        <div className={style.text}>We use analytics in Lab to gain more insights into how Lab is used. Of course, this tracking is anonymous and we don't track any information about you. <b>We do not track any personal data, private keys or addresses.</b></div>
                        <Switch
                            checked={trackAnalytics}
                            onChange={this.onTrackAnalyticsChange}
                            id="control-analytics"
                            onColor="#8641F2"
                            className={style.switch}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            height={20}
                            width={40}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

AdvancedPreferences.propTypes = {
    onChange: PropTypes.func.isRequired
}


