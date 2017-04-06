/* @flow */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from './Core';
import user from '../../redux/user';

class OnboardingPopup extends React.Component {
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
    if (!currentTrip || currentTrip.items.length === 0 || hasDismissedOnboardingPopup) {
      return null;
    }

    return (
      <View style={Styles.Root}>
        <UIText color="white" size="10" weight="semibold" style={Styles.Note}>NOTE!</UIText>
        <UIText color="white" size="14" style={Styles.Row}>Tap item to check</UIText>
        <UIText color="white" size="14">Swipe to delete</UIText>
        <TouchableOpacity onPress={this._onClose} activeOpacity={0.6} style={Styles.Close}>
          <Icon name="close" color={Colors.White} size={24} />
        </TouchableOpacity>
      </View>
    );
  }
}
OnboardingPopup = connect((state) => ({
  hasDismissedOnboardingPopup: user.selectors.hasDismissedOnboardingPopup(state),
  currentTrip: user.selectors.getSelectedTrip(state),
}), (dispatch) => ({
  close: () => dispatch(user.actions.dismissOnboardingPopup()),
}))(OnboardingPopup);
export default OnboardingPopup;

const Styles = StyleSheet.create({
  Root: {
    backgroundColor: Colors.Blue,
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
    top: Sizes.RowHeight * 2.5,
    width: 250,
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
