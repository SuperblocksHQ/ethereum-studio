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

import React from 'react';
import amplitude from 'amplitude-js';
import {
    AmplitudeProvider,
    Amplitude,
    LogOnMount as AmplitudeLogOnMount
} from '@amplitude/react-amplitude';

/**
 * A simple wrapper around the analytic providers to encapsulate them, making sure
 * that in the case that we need to change them, the impact of the required changes will
 * be limited to this file instead
 */

// This variable will injected automatically during the build process
export const AMPLITUDE_KEY = window.ENV.AMPLITUDE_API_KEY;

export function setEnable(enabled) {
    amplitude.getInstance().setOptOut(!enabled);
}

/**
 * Log an event in the app
 * @param {string} eventType - The event type needed to be reported
 * @param {object} eventProperties - An object with string keys and values for the event properties.
 */
export function logEvent(eventType, eventProperties) {
    amplitude.getInstance().logEvent(eventType, eventProperties);
}

export const AnalyticsProvider = ({children}) => (
    <AmplitudeProvider
        amplitudeInstance={amplitude.getInstance()}
        apiKey={AMPLITUDE_KEY}
    >
            {children}
    </AmplitudeProvider>
)

export const Analytics = ({eventProperties, children}) => {
    return (
        <Amplitude
            eventProperties={eventProperties}
        >
            {children}
        </Amplitude>
    );
}

export const LogOnMount = ({eventType}) => (
    <AmplitudeLogOnMount eventType={eventType} />
);


