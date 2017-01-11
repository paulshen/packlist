/* @flow */
import { OrderedMap } from 'immutable';

import * as t from './actionTypes';

const InitialState = OrderedMap();

export default function trips(state: any = InitialState, action: any) {
  switch (action.type) {
  case t.SET_TRIP_TITLE:
    return state.set(action.tripId, {
      ...state.get(action.tripId),
      name: action.title,
    });
  case t.SET_TRIP_ITEMS:
    return state.set(action.tripId, {
      ...state.get(action.tripId),
      items: action.items,
    });
  case t.CREATE_TRIP:
    return state.set(action.tripId, {
      name: '',
      items: [],
    });
  case t.REMOVE_TRIP:
    return state.delete(action.tripId);
  case t.MOVE_TRIP_TO_MOST_RECENT:
    return state.sortBy((trip, tripId) => tripId, (a, b) => {
      if (a === action.tripId) {
        return -1;
      }
      if (b === action.tripId) {
        return 1;
      }
      return 0;
    });
  default:
    return state;
  }
}
