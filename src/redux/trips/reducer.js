/* @flow */
import { OrderedMap, List } from 'immutable';

import { guid } from './actions';
import * as t from './actionTypes';

export default function trips(state: any, action: any) {
  if (typeof state === 'undefined') {
    state = OrderedMap({
      [guid()]: {
        name: 'Hiking',
        items: ['Hat', 'Water', 'Snacks', 'Hiking poles', 'Hiking boots'].map((item, i) => ({ id: i + 1, text: item })),
      },
      [guid()]: {
        name: 'Travel',
        items: ['Driver license', 'Phone charger', 'Toothpaste', 'Toothbrush', 'Camera', 'Camera charger', 'Contacts', 'Kindle'].map((item, i) => ({ id: i + 1, text: item })),
      },
    });
  }

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
      return state.sortBy(
        (trip, tripId) => tripId,
        (a, b) => {
          if (a === action.tripId) {
            return -1;
          }
          if (b === action.tripId) {
            return 1;
          }
          return 0;
        }
      );
    default:
      return state;
  }
}
