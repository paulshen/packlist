/* @flow */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import FadeChild from './FadeChild';
import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from './Core';
import user from '../../redux/user';
import Amplitude from '../../Amplitude';

class OnboardingPopup extends React.Component {
  props: { onClose: Function };

  componentDidMount() {
    Amplitude.logEvent('Onboarding Popup Dismissed');
  }

  render() {
    let { onClose } = this.props;
    return (
      <View style={Styles.Root}>
        <UIText color="white" size="10" weight="semibold" style={Styles.Note}>
          NOTE!
        </UIText>
        <UIText color="white" size="14" style={Styles.Row}>
          Tap item to check
        </UIText>
        <UIText color="white" size="14">Swipe to delete</UIText>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.6}
          style={Styles.Close}>
          <Icon name="close" color={Colors.White} size={24} />
        </TouchableOpacity>
      </View>
    );
  }
}

class OnboardingPopupContainer extends React.Component {
  props: {
    currentTrip: ?Object,
    hasDismissedOnboardingPopup: boolean,
    close: Function,
  };

  _onClose = () => {
    this.props.close();
  };

  render() {
    let { currentTrip, hasDismissedOnboardingPopup } = this.props;
    let showPopup = currentTrip &&
      currentTrip.items.length > 0 &&
      !hasDismissedOnboardingPopup;

    return (
      <FadeChild duration={150} style={Styles.FadeWrapper}>
        {showPopup && <OnboardingPopup onClose={this._onClose} />}
      </FadeChild>
    );
  }
}
OnboardingPopupContainer = connect(
  state => ({
    hasDismissedOnboardingPopup: user.selectors.hasDismissedOnboardingPopup(
      state
    ),
    currentTrip: user.selectors.getSelectedTrip(state),
  }),
  dispatch => ({
    close: () => dispatch(user.actions.dismissOnboardingPopup()),
  })
)(OnboardingPopupContainer);
export default OnboardingPopupContainer;

const Styles = StyleSheet.create({
  FadeWrapper: {
    position: 'absolute',
  },
  Root: {
    backgroundColor: `${Colors.Blue}F8`,
    borderRadius: 8,
    left: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingTop: 16,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    top: Sizes.RowHeight * 3.5,
    width: 260,
  },
  Note: {
    marginBottom: 12,
  },
  Row: {
    marginBottom: 2,
  },
  Close: {
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
