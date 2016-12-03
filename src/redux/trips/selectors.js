/* @flow */
import { NAME } from './constants';

export const getTrip = (state: any, tripId: string) => state[NAME][tripId];
export const getTrips = (state: any) => state[NAME];
