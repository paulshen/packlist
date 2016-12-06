/* @flow */
import * as t from './actionTypes';

const InitialState = {};

export default function user(state: any = InitialState, action: any) {
  switch (action.type) {
  case t.SELECT_TRIP:
    return {
      ...state,
      selectedTripId: action.tripId,
    };
  default:
    return state;
  }
}
