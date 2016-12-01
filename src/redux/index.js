/* @flow */
import { combineReducers, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import trips from './trips';

const RootReducer = combineReducers(
  {
    [trips.constants.NAME]: trips.reducer,
  }
);

export const Store = createStore(RootReducer, undefined, autoRehydrate());
persistStore(Store, { storage: AsyncStorage });
