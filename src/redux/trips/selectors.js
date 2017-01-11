/* @flow */
import { NAME } from './constants';

export const getTrip = (state: any, tripId: string) => state[NAME].get(tripId);
export const getTrips = (state: any) => state[NAME];
