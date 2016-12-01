/* @flow */
import * as t from './actionTypes';

const InitialState = {
  'ee8566f4-ea1f-4289-bb5e-75f974611ecf': {
    name: 'Copenhagen',
    items: [
    ],
  },
  'a6328be7-399f-455d-b642-4f20c285a305': {
    name: 'Japan',
    items: [
    ],
  },
};

export default function trips(state: any = InitialState, action: any) {
  switch (action.type) {
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
