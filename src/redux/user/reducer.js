/* @flow */
import * as t from './actionTypes';

const InitialState = {
  selectedTripId: null,
  hasDismissedWelcome: false,
  hasDismissedOnboardingPopup: false,
};

export default function user(state: any = InitialState, action: any) {
  switch (action.type) {
  case t.SELECT_TRIP:
    return {
      ...state,
      selectedTripId: action.tripId,
    };
  case t.DISMISS_WELCOME:
    return {
      ...state,
      hasDismissedWelcome: true,
    };
  case t.DISMISS_ONBOARDING_POPUP:
    return {
      ...state,
      hasDismissedOnboardingPopup: true,
    };
  default:
    return state;
  }
}
