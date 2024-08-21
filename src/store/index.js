import { configureStore } from '@reduxjs/toolkit';
import storageSession from 'redux-persist/lib/storage/session';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage: storageSession,
    whitelist: [],
};

const rootReducer = combineReducers({

})

const persistedReducer = persistReducer(persistConfig,rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
})

const persistor = persistStore(store)

export {store, persistor}