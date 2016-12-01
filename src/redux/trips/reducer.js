/* @flow */
import * as t from './actionTypes';

const InitialState = {
  'ee8566f4-ea1f-4289-bb5e-75f974611ecf': {
    name: 'Copenhagen',
    items: [
      { id: 10, text: 'Toothbrush' },
      { id: 11, text: 'Toothpaste' },
      { id: 12, text: 'Contacts' },
      { id: 13, text: 'Contact Solution' },
    ],
  },
  'a6328be7-399f-455d-b642-4f20c285a305': {
    name: 'Japan',
    items: [
      { id: 10, text: 'Kimono' },
      { id: 11, text: 'Ramen bowl' },
    ],
  },
};

export default function trips(state: any = InitialState, action: any) {
  switch (action.type) {
  case t.SET_TRIP_ITEMS:
    return {
      ...state,
      tripId: {
        ...state[action.tripId],
        items: action.items,
      },
    };
  default:
    return state;
  }
}
