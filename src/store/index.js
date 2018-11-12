/* global window */
import { createStore, applyMiddleware, compose } from 'redux';
import { createMigrate, persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import reducers from '../reducers';
import settings from './settings';

const migrations = {
    1: (state) => {
        return {
            ...state,
            settings: {
                ...state.settings,
                preferences: {
                    chain: undefined,
                    network: settings.preferences.network
                }
            }
        }
    }
}

// Redux Persist config
const config = {
    key: 'root',
    storage,
    version: 1,
    blacklist: ['app', 'view'],
    migrate: createMigrate(migrations, { debug: true })
};

const reducer = persistCombineReducers(config, reducers);

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
    const store = createStore(
        reducer,
        composeEnhancers(
            applyMiddleware(...middleware)
        )
    );

    const persistor = persistStore(store);

    return { persistor, store };
};

export default configureStore;
