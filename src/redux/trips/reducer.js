/* @flow */
import * as t from './actionTypes';

const InitialState = {};

export default function trips(state: any = InitialState, action: any) {
  switch (action.type) {
  case t.SET_TRIP_TITLE:
    return {
      ...state,
      [action.tripId]: {
        ...state[action.tripId],
        name: action.title,
      },
    };
  case t.SET_TRIP_ITEMS:
    return {
      ...state,
      [action.tripId]: {
        ...state[action.tripId],
        items: action.items,
      },
    };
  default:
    return state;
  }
}
