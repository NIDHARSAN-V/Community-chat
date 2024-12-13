import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import userSlice from './features/userSlice';
import appApi from './services/appApi';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the `persist/PERSIST` action and the path where the non-serializable value exists
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['register'],  // or any other path you suspect to be non-serializable
      },
    }).concat(appApi.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
