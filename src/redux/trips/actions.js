/* @flow */
import * as t from './actionTypes';

export function setTripItems(tripId: string, items: any) {
  return {
    type: t.SET_TRIP_ITEMS,
    tripId,
    items,
  };
}
