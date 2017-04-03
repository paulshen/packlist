/* @flow */
import React from 'react';
import type { OrderedMap } from 'immutable';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Colors, Sizes } from '../Constants';
import { UIText } from './Core';
import trips from '../../redux/trips';
import user from '../../redux/user';

const WindowHeight = Dimensions.get('window').height;
const WindowWidth = Dimensions.get('window').width;
const AnimationDuration = 200;
const ButtonPosition = {
  bottom: 38,
  height: 42,
  right: 30,
  width: 42,
};
const AnimateDistance = (WindowHeight - ButtonPosition.bottom - ButtonPosition.height) * 1.1;

class ButtonIcon extends React.Component {
  _anim: Animated.Value;

  constructor(props) {
    super();
    this._anim = new Animated.Value(props.close ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.close !== this.props.close) {
      Animated.timing(this._anim, {
        toValue: nextProps.close ? 1 : 0,
        duration: AnimationDuration,
      }).start();
    }
  }

  render() {
    return (
      <View style={this.props.style}>
        <Animated.View style={[Styles.ButtonIconLine, {
          marginBottom: 3,
          transform: [
            { translateY: this._anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 5],
            }) },
            { rotate: this._anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '135deg'],
            }) },
          ],
        }]} />
        <Animated.View style={[Styles.ButtonIconLine, {
          marginBottom: 3,
          transform: [{
            rotate: this._anim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-135deg'],
            }),
          }],
        }]} />
        <Animated.View style={[Styles.ButtonIconLine, {
          opacity: this._anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        }]} />
      </View>
    );
  }
}

function MenuItem({ trip, onPress, onLongPress }: { trip: Object, onPress?: Function, onLongPress?: Function }) {
  return (
    <View style={Styles.MenuItem}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={Styles.MenuItemTouchable}>
        <UIText size="16" weight="medium">{trip.name || 'Untitled'}</UIText>
        <UIText color="verylightgray" size="48" weight="light">{trip.items ? trip.items.length : '+'}</UIText>
      </TouchableOpacity>
    </View>
  );
}

class NavMenu extends React.Component {
  props: {
    createTrip: () => Promise<string>,
    removeTrip: (tripId: string) => void,
    selectTrip: (tripId: ?string) => void,
    moveTripToMostRecent: (tripId: ?string) => void,
    trips: OrderedMap<string, Object>,
    selectedTripId: ?string,
    getTripName: (tripId: string) => string,
  };

  state = {
    open: false,
  };

  _openAnim = new Animated.Value(0);
  _moveTripTimeout: number;

  componentDidUpdate(prevProps: $PropertyType<NavMenu, 'props'>, prevState: $PropertyType<NavMenu, 'state'>) {
    if (this.state.open !== prevState.open) {
      Animated.timing(this._openAnim, {
        toValue: this.state.open ? 1 : 0,
        duration: AnimationDuration,
      }).start();
    }
  }

  _onButtonPress = () => {
    if (!this.state.open && this._moveTripTimeout) {
      clearTimeout(this._moveTripTimeout);
    }
    this.setState({
      open: !this.state.open,
    });
  };

  _onTripPress = (tripId) => {
    this.props.selectTrip(tripId);
    this._moveTripTimeout = setTimeout(() => this.props.moveTripToMostRecent(tripId), AnimationDuration);
    this.setState({
      open: false,
    });
  };

  _onTripLongPress = (tripId) => {
    Alert.alert(`Are you sure you want to delete ${this.props.getTripName(tripId)}?`, null, [
      { text: 'Yes', onPress: () => {
        if (this.props.selectedTripId === tripId) {
          this.props.selectTrip(null);
        }
        this.props.removeTrip(tripId);
      } },
      { text: 'No' },
    ]);
  }

  _onPressNewTrip = () => {
    this.props.createTrip().then((newTripId) => {
      this.props.selectTrip(newTripId);
      this.props.moveTripToMostRecent(newTripId);
      this.setState({
        open: false,
      });
    });
  };

  render() {
    let { trips } = this.props;
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View style={[Styles.Background, {
          opacity: this._openAnim.interpolate({
            inputRange: [0, 0.0001],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          bottom: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.bottom, ButtonPosition.bottom - AnimateDistance],
          }),
          height: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.height, ButtonPosition.height + 2 * AnimateDistance],
          }),
          right: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.right, ButtonPosition.right - AnimateDistance],
          }),
          width: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.width, ButtonPosition.width + 2 * AnimateDistance],
          }),
        }]}>
          <TouchableOpacity onPress={this._onButtonPress} style={StyleSheet.absoluteFill}>
            <View />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[Styles.Menu, {
          opacity: this._openAnim.interpolate({
            inputRange: [0.6, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }]} pointerEvents={this.state.open ? 'auto' : 'none'}>
          <ScrollView style={Styles.MenuScroll} contentContainerStyle={Styles.MenuScrollInner}>
            {trips.mapEntries(([tripId, trip], i) => ([
              tripId,
              <MenuItem
                trip={trip}
                onPress={() => this._onTripPress(tripId)}
                onLongPress={() => this._onTripLongPress(tripId)}
                key={tripId}
              />,
            ])).toArray()}
            <MenuItem trip={{ name: 'New List' }} onPress={() => this._onPressNewTrip()} />
          </ScrollView>
        </Animated.View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={this._onButtonPress}
          style={Styles.Button}>
          <ButtonIcon close={this.state.open} />
        </TouchableOpacity>
      </View>
    );
  }
}
NavMenu = connect((state) => ({
  selectedTripId: user.selectors.getSelectedTripId(state),
  trips: trips.selectors.getTrips(state),
  getTripName: (tripId) => trips.selectors.getTrip(state, tripId).name,
}), (dispatch) => ({
  createTrip: () => dispatch(trips.actions.createTrip()),
  removeTrip: (tripId) => dispatch(trips.actions.removeTrip(tripId)),
  selectTrip: (tripId) => dispatch(user.actions.selectTrip(tripId)),
  moveTripToMostRecent: (tripId) => dispatch(trips.actions.moveTripToMostRecent(tripId)),
}))(NavMenu);
export default NavMenu;

const Styles = StyleSheet.create({
  Background: {
    backgroundColor: Colors.Blue,
    borderRadius: WindowHeight / 2,
    position: 'absolute',
  },
  Button: {
    alignItems: 'center',
    backgroundColor: Colors.Blue,
    borderRadius: ButtonPosition.height / 2,
    bottom: ButtonPosition.bottom,
    flexDirection: 'row',
    height: ButtonPosition.height,
    paddingHorizontal: 14,
    position: 'absolute',
    right: ButtonPosition.right,
  },
  Menu: {
    ...StyleSheet.absoluteFillObject,
  },
  MenuScroll: {
  },
  MenuScrollInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  MenuInner: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  MenuItem: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    height: 140,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: (WindowWidth - 72) / 2,
  },
  MenuItemTouchable: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 24,
  },
  ButtonIconLine: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 2,
    width: 14,
  },
});
