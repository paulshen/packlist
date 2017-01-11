/* @flow */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import thunk from 'redux-thunk';
import trips from './trips';
import user from './user';

const RootReducer = combineReducers(
  {
    [trips.constants.NAME]: trips.reducer,
    [user.constants.NAME]: user.reducer,
  }
);

export const Store = createStore(RootReducer, undefined, compose(
  applyMiddleware(thunk),
  autoRehydrate()
));
persistStore(Store, { storage: AsyncStorage, transforms: [immutableTransform({
  whitelist: [trips.constants.NAME],
})] });
