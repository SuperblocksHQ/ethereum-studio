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

export default class AnalyticsDialog extends Component {

    state = {
        trackAnalytics: this.props.advancedPreferences.trackAnalytics,
    }

    onTrackAnalyticsChange = (value) => {
        const state = {
            trackAnalytics: value
        }
        this.setState(state);
    }

    onSavePreferences = () => {

    }

    render() {
        const { trackAnalytics } = this.state;

        return (
            <div className={style.container}>
                <div className={style.content}>
                    <h2>Support Superblocks Lab</h2>
                    <div>Superblocks Lab includes anaytics tracking to simply help us better understand how you use the tool during your normal development practices. Of course, you can always opt-out of this tracking by selecting the option below.</div>
                    <br/>
                    <div>By enabling this feature, you provide the Superblocks team with valuable metrics, allowing us to better analyse usage patterns and add new features and bug fixes faster.</div>
                    <br/>
                    <div>Thank you for your help, and happy coding!</div>
                    <div className={style.switchContainer}>
                        <div className={style.title}>Allow anonymous tracking</div>
                        <div className={style.description}>
                            <div className={style.text}>You can always change this from the Settings dialog. </div>
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
                    <button onClick={this.onSavePreferences} className="btn2">Save</button>
                </div>
            </div>
        )
    }
}

AnalyticsDialog.propTypes = {
    advancedPreferences: PropTypes.object.isRequired
}
