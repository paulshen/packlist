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

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function createTrip() {
  return (dispatch: Function) => {
    let newTripId = guid();
    dispatch({
      type: t.CREATE_TRIP,
      tripId: newTripId,
    });
    return Promise.resolve(newTripId);
  };
}

export function removeTrip(tripId: string) {
  return {
    type: t.REMOVE_TRIP,
    tripId,
  };
}

export function moveTripToMostRecent(tripId: string) {
  return {
    type: t.MOVE_TRIP_TO_MOST_RECENT,
    tripId,
  };
}
