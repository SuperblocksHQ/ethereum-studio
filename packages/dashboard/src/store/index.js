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
import { createMigrate, persistStore, persistReducer } from 'redux-persist';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { loadingBarMiddleware } from 'react-redux-loading-bar'
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import migrations from './migrations';
import reducers from '../reducers';
import { epics } from '../epics';

// Redux Persist config
const config = {
    key: 'root',
    storage,
    version: 1,
    whitelist: [''],
    migrate: createMigrate(migrations, { debug: true })
};

const combineReducers = reducerList => {
    return (state = {}, action) => {

      // Reduce all the keys for reducers from `todos` and `visibilityFilter`
      return Object.keys(reducerList).reduce(
        (nextState, key) => {
          // Call the corresponding reducer function for a given key
          nextState[key] = reducerList[key] (
            state[key],
            action,
            // Let's make the entire state available to all reducers
            state
          );
          return nextState;
        },
        {} // The `reduce` on our keys gradually fills this empty object until it is returned.
      );
    };
  };

const reducer = persistReducer(config, combineReducers(reducers));

const configureMiddleware = () => {
    const rootEpic = combineEpics(...epics);
    const epicMiddleware = createEpicMiddleware({
        dependencies: {
        }
    });
    const loadingBarMid = loadingBarMiddleware({
        promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAIL'],
    });

    const middleware = [
        thunk,
        epicMiddleware,
        loadingBarMid
    ];

    return { middleware, epicMiddleware, rootEpic };
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {

    const { middleware, epicMiddleware, rootEpic } = configureMiddleware();

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
