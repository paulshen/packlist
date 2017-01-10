/* @flow */
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Colors, Sizes } from '../Constants';
import { UIText } from './Core';
import trips from '../../redux/trips';

function Row({ children, onPress }) {
  return (
    <View style={Styles.Row}>
      <TouchableOpacity onPress={onPress} style={Styles.RowTouchable}>
        <UIText size="16">{children}</UIText>
      </TouchableOpacity>
    </View>
  );
}

class EmptyTripPrompt extends React.Component {
  props: {
    setTripItems: (items: Object[]) => void,
    tripId: string,
    trips: { [tripId: string]: Object },
    style?: any,
  };

  _onTripPress = (trip) => {
    this.props.setTripItems(trip.items.map((item) => ({
      ...item,
      checked: false,
    })));
  };

  render() {
    let items = Object.keys(this.props.trips).map((tripId) => {
      let trip = this.props.trips[tripId];
      if (tripId === this.props.tripId) {
        return null;
      }
      return <Row onPress={() => this._onTripPress(trip)} key={tripId}>{trip.name}</Row>;
    });

    return (
      <View style={[Styles.Root, this.props.style]}>
        <UIText color="lightgray" size="16" weight="semibold" style={Styles.Prompt}>Or copy from another trip</UIText>
        {items}
      </View>
    );
  }
}
EmptyTripPrompt = connect((state, ownProps) => ({
  trips: trips.selectors.getTrips(state),
}), (dispatch, ownProps) => ({
  setTripItems: (items) => dispatch(trips.actions.setTripItems(ownProps.tripId, items)),
}))(EmptyTripPrompt);
export default EmptyTripPrompt;

const Styles = StyleSheet.create({
  Root: {
    paddingLeft: 30,
  },
  Prompt: {
    marginBottom: 10,
  },
  Row: {
    borderBottomColor: Colors.LightGrayBorder,
    borderBottomWidth: 1,
    height: Sizes.RowHeight,
  },
  RowTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
});
