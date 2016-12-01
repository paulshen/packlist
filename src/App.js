/* @flow */

import React from 'react';
import { View } from 'react-native';

import TripScreen from './ui/screens/TripScreen';
import NavMenu from './ui/components/NavMenu';

export default class App extends React.Component {
  state = {
    selectedTrip: {
      name: 'Indonesia',
    },
  };

  _onTripChange = (trip) => {
    this.setState({
      selectedTrip: trip,
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TripScreen trip={this.state.selectedTrip} />
        <NavMenu onTripChange={this._onTripChange} />
      </View>
    );
  }
}
