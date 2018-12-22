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

import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import configureStore from './store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { AnalyticsProvider, Analytics, LogOnMount } from './utils/analytics';

// Load generic CSS
import './style/index.less';

// TODO - Components
// import Loading from './components/Loading';

const { persistor, store } = configureStore();
// persistor.purge(); // Debug to clear persist

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <AnalyticsProvider>
                <LogOnMount eventType="APP_START" />
                <App />
            </AnalyticsProvider>
        </PersistGate>
    </Provider>
), document.getElementById('root'));


