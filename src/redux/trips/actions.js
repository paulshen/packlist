/* @flow */
import * as t from './actionTypes';

export function setTripTitle(tripId: string, title: string) {
  return {
    type: t.SET_TRIP_TITLE,
    tripId,
    title,
  };
}

export function setTripItems(tripId: string, items: any) {
  return {
    type: t.SET_TRIP_ITEMS,
    tripId,
    items,
  };
}
