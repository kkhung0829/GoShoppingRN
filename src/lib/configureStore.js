'use strict';

import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import Immutable from 'immutable';
import thunk from 'redux-thunk';

import rootReducer, {
    rootInitialState,
    ShoppingItemsInitialState,
    ShoppingItem,
    CouponItemsInitialState,
    CouponItem,
    CouponUsage,
    DropBoxInitialState,
} from '../reducers';

if (__DEV__) {
    var installDevTools = require('immutable-devtools');
    installDevTools(Immutable);
}

export default function createReduxStore() {
    let middlewares = [
        thunk,
    ];

    // ------ redux-logger ------
    if (__DEV__) {
        const logger = createLogger({
            collapsed: true,
            stateTransformer: state => JSON.parse(JSON.stringify(state)),
        });
        middlewares = [...middlewares, logger]
    }

    const persistConfig = {
        transforms: [immutableTransform({
            records: [
                ShoppingItemsInitialState,
                ShoppingItem,
                CouponItemsInitialState,
                CouponItem,
                CouponUsage,
                DropBoxInitialState,
            ]})],
        key: 'shopping',
        storage: storage,
        stateReconciler: autoMergeLevel1,
    };
    const presistedReducer = persistReducer(persistConfig, rootReducer);

    let debuggWrapper = (data) => data;
    if (__DEV__) {
        const composeWithDevTools =
                window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ||  require('remote-redux-devtools').composeWithDevTools;        
        debuggWrapper = composeWithDevTools({ realtime: true });    
    }
    const store = createStore(
        presistedReducer,
        rootInitialState,
        debuggWrapper(
            applyMiddleware(...middlewares),
            // other store enhancers if any
        )
    );
    // const persistor = persistStore(store);
    const persistor = persistStore(store, null, () => {
        // console.log('Persistor Callback: ' + JSON.stringify(store.getState()));
    });

    return { store, persistor };
}