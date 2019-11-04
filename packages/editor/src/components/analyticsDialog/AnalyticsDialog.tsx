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
import style from './style.less';
import Switch from 'react-switch';


interface IProps {
    advancedPreferences: {
        trackAnalytics: boolean;
    };
    updateAnalyticsTracking: (trackAnalytics: boolean) => void;
}

interface IState {
    trackAnalytics: boolean;
}

export default class AnalyticsDialog extends Component<IProps, IState> {

    state = {
        trackAnalytics: this.props.advancedPreferences.trackAnalytics,
    };

    componentDidUpdate(prevProps: IProps) {
        if (prevProps.advancedPreferences.trackAnalytics !== this.props.advancedPreferences.trackAnalytics) {
            this.setState({
                trackAnalytics: this.props.advancedPreferences.trackAnalytics
            });
        }
    }

    onTrackAnalyticsChange = (value: boolean) => {
        const state = {
            trackAnalytics: value
        };
        this.setState(state);
    }

    onSavePreferences = () => {
        const { trackAnalytics } = this.state;
        this.props.updateAnalyticsTracking(trackAnalytics);
    }

    render() {
        const { trackAnalytics } = this.state;

        return (
            <div className={style.container}>
                <div className={style.content}>
                    <h2>Enable Anonymous Tracking</h2>
                    <div>By allowing us to track (anonymously) how you use Ethereum Studio, we can get valuable insights and better understand what the tool needs in order to make you a happier developer.
                        By leaving the tracking on, you will really help us see what can be improved, iterated or removed.</div>
                    <br/>
                    <div><b>We do not track any personal data, private keys or addresses.</b> Ethereum Studio is Open Source, so you can either check out the <a href='https://github.com/SuperblocksHQ/ethereum-studio' target='_blank' rel='noopener noreferrer' title="Ethereum Studio's Github repository">code</a> for yourself or read more on what we track and why in our <a href='https://help.superblocks.com/en/articles/3195311-what-and-why-are-we-tracking-in-ethereum-studio' target='_blank' rel='noopener noreferrer' title='Tracking article'>Help Center.</a></div>
                    <br/>
                    <div>Thanks for your support and happy building!</div>
                    <div className={style.switchContainer}>
                        <div className={style.title}>Allow tracking (anonymously)</div>
                        <div className={style.description}>
                            <div className={style.text}>You can always change this from the Settings dialog. </div>
                            <Switch
                                checked={trackAnalytics}
                                onChange={this.onTrackAnalyticsChange}
                                id='control-analytics'
                                onColor='#6CFFB8'
                                className={style.switch}
                                checkedIcon={false}
                                uncheckedIcon={false}
                                height={20}
                                width={40}
                            />
                        </div>
                    </div>
                    <button onClick={this.onSavePreferences} className='btn2'>Save</button>
                </div>
            </div>
        );
    }
}
