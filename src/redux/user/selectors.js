/* @flow */
import { NAME } from './constants';
import trips from '../trips';

export const getSelectedTripId = (state: any) => state[NAME].selectedTripId;
export const hasDismissedWelcome = (state: any) => state[NAME].hasDismissedWelcome;
export const hasDismissedOnboardingPopup = (state: any) => state[NAME].hasDismissedOnboardingPopup;
export const getSelectedTrip = (state: any) => {
  let selectedTripId = getSelectedTripId(state);
  return selectedTripId && trips.selectors.getTrip(state, selectedTripId);
};
