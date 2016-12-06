/* @flow */
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import TripScreen from './TripScreen';
import NavMenu from '../components/NavMenu';
import user from '../../redux/user';

class HomeScreen extends React.Component {
  props: {
    selectedTripId: ?string,
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.selectedTripId && <TripScreen tripId={this.props.selectedTripId} key={this.props.selectedTripId} />}
        <NavMenu />
      </View>
    );
  }
}
HomeScreen = connect((state) => ({
  selectedTripId: user.selectors.getSelectedTripId(state),
}))(HomeScreen);
export default HomeScreen;
