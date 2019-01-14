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

import { createStore, applyMiddleware, compose } from 'redux';
import { createMigrate, persistStore, persistCombineReducers } from 'redux-persist';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import migrations from './migrations';
import reducers from '../reducers';
import { epics } from '../epics';
import Backend from '../components/projecteditor/control/backend';

// Redux Persist config
const config = {
    key: 'root',
    storage,
    version: 5,
    blacklist: ['app', 'sidePanels', 'panes', 'view', 'ipfs', 'explorer', 'toast'],
    migrate: createMigrate(migrations, { debug: true })
};

const reducer = persistCombineReducers(config, reducers);


const configureMiddleware = (router) => {
    const rootEpic = combineEpics(...epics);
    const epicMiddleware = createEpicMiddleware({
        dependencies: {
            backend: new Backend(),
            router: router
        }
    });

    const middleware = [
        thunk,
        epicMiddleware
    ];

    return { middleware, epicMiddleware, rootEpic };
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = (router) => {

    const { middleware, epicMiddleware, rootEpic } = configureMiddleware(router);

    const store = createStore(
        reducer,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    );

    epicMiddleware.run(rootEpic);

    const persistor = persistStore(store);

    return { persistor, store };
};

export default configureStore;
