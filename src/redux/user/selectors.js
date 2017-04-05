/* @flow */
import { NAME } from './constants';

export const getSelectedTripId = (state: any) => state[NAME].selectedTripId;
export const hasDismissedWelcome = (state: any) => state[NAME].hasDismissedWelcome;
