/* @flow */

import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';

import TripScreen from './ui/screens/TripScreen';
import NavMenu from './ui/components/NavMenu';
import { Store } from './redux';

export default class App extends React.Component {
  state = {
    selectedTripId: null,
  };

  _onTripChange = (tripId) => {
    this.setState({
      selectedTripId: tripId,
    });
  };

  render() {
    return (
      <Provider store={Store}>
        <View style={{ flex: 1 }}>
          {this.state.selectedTripId && <TripScreen tripId={this.state.selectedTripId} key={this.state.selectedTripId} />}
          <NavMenu onTripChange={this._onTripChange} />
        </View>
      </Provider>
    );
  }
}
