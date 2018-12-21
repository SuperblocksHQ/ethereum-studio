import { createStore, applyMiddleware, compose } from 'redux';
import { createMigrate, persistStore, persistCombineReducers } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';
import { combineEpics } from 'redux-observable';
import storage from 'redux-persist/lib/storage'; // default: localStorage if web
import thunk from 'redux-thunk';
import migrations from './migrations';
import reducers from '../reducers';
import { epics } from '../epics';


// Redux Persist config
const config = {
    key: 'root',
    storage,
    version: 4,
    blacklist: ['app', 'view', 'panes'],
    migrate: createMigrate(migrations, { debug: true })
};

const reducer = persistCombineReducers(config, reducers);
const rootEpic = combineEpics(...epics);
const epicMiddleware = createEpicMiddleware();

const middleware = [
    thunk,
    epicMiddleware
];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
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
