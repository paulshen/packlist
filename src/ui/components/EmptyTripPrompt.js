/* @flow */
import React from 'react';
import type { OrderedMap } from 'immutable';
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
    trips: OrderedMap<string, Object>,
    style?: any,
  };

  _onTripPress = trip => {
    this.props.setTripItems(
      trip.items.map(item => ({
        ...item,
        checked: false,
      }))
    );
  };

  render() {
    let { trips } = this.props;
    let filteredTrips = trips.filter(
      (trip, tripId) => tripId !== this.props.tripId
    );
    if (filteredTrips.count() === 0) {
      return null;
    }

    return (
      <View style={[Styles.Root, this.props.style]}>
        <UIText color="lightgray" size="12" style={Styles.Prompt}>
          Copy items from another list
        </UIText>
        {filteredTrips
          .map((trip, tripId) => (
            <Row onPress={() => this._onTripPress(trip)} key={tripId}>
              {trip.name || 'Untitled'}
            </Row>
          ))
          .toArray()}
      </View>
    );
  }
}
EmptyTripPrompt = connect(
  (state, ownProps) => ({
    trips: trips.selectors.getTrips(state),
  }),
  (dispatch, ownProps) => ({
    setTripItems: items =>
      dispatch(trips.actions.setTripItems(ownProps.tripId, items)),
  })
)(EmptyTripPrompt);
export default EmptyTripPrompt;

const Styles = StyleSheet.create({
  Root: {},
  Prompt: {
    marginBottom: 10,
    marginLeft: 30,
  },
  Row: {
    borderBottomColor: Colors.LightGrayBorder,
    borderBottomWidth: 1,
    height: Sizes.RowHeight,
    paddingLeft: 30,
  },
  RowTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
});
