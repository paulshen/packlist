/* @flow */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import trips from './trips';

const RootReducer = combineReducers(
  {
    [trips.constants.NAME]: trips.reducer,
  }
);

export const Store = createStore(RootReducer, undefined, compose(
  applyMiddleware(thunk),
  autoRehydrate()
));
persistStore(Store, { storage: AsyncStorage });
