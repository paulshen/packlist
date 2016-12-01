/* @flow */
import { combineReducers, createStore } from 'redux';
import trips from './trips';

export const RootReducer = combineReducers(
  {
    [trips.constants.NAME]: trips.reducer,
  }
);


export const Store = createStore(RootReducer);
