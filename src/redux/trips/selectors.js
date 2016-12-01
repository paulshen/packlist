/* @flow */
import { NAME } from './constants';

export const getTrip = (state: any, tripId: string) => state[NAME][tripId];
