/* @flow */
import React from 'react';
import type { OrderedMap } from 'immutable';
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
  height: 48,
  right: 30,
  width: 48,
};
const AnimateDistance = (WindowHeight -
  ButtonPosition.bottom -
  ButtonPosition.height) *
  1.1;

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
        <Animated.View
          style={[
            Styles.ButtonIconLine,
            {
              marginBottom: 3,
              transform: [
                {
                  translateY: this._anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 5],
                  }),
                },
                {
                  rotate: this._anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '135deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            Styles.ButtonIconLine,
            {
              marginBottom: 3,
              transform: [
                {
                  rotate: this._anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-135deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            Styles.ButtonIconLine,
            {
              opacity: this._anim.interpolate({
                inputRange: [0, 0.5],
                outputRange: [1, 0],
              }),
            },
          ]}
        />
      </View>
    );
  }
}

function MenuItem(
  {
    trip,
    onPress,
    onLongPress,
  }: { trip: Object, onPress?: Function, onLongPress?: Function }
) {
  return (
    <View style={Styles.MenuItem}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.6}
        style={Styles.MenuItemTouchable}>
        <UIText size="18" weight="medium" style={Styles.MenuItemName}>{trip.name || 'Untitled'}</UIText>
        <View style={Styles.MenuItemBottom}>
          {trip.items
            ? <View style={{alignItems: 'center'}}>
                <UIText color="lightgray" size="12" weight="light">
                  {trip.items.length} item{trip.items.length !== 1 ? 's' : ''}
                </UIText>
                <UIText color="lightgray" size="12" weight="light">
                  {trip.items.filter(i => i.checked).length} checked
                </UIText>
              </View>
            : <UIText color="lightgray" size="48" weight="light" style={Styles.MenuItemPlus}>
                +
              </UIText>}
        </View>
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
    showWelcome: Function,
  };
  state: {
    open: boolean,
  };
  _openAnim: Animated.Value;

  constructor(props) {
    super();
    this.state = {
      open: !props.selectedTripId,
    };
    this._openAnim = new Animated.Value(this.state.open ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.selectedTripId && !!this.props.selectedTripId) {
      this.setState({
        open: true,
      });
    }
  }

  componentDidUpdate(
    prevProps: $PropertyType<NavMenu, 'props'>,
    prevState: $PropertyType<NavMenu, 'state'>
  ) {
    if (this.state.open !== prevState.open) {
      Animated.timing(this._openAnim, {
        toValue: this.state.open ? 1 : 0,
        duration: AnimationDuration,
      }).start();
    }
  }

  _onButtonPress = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  _onTripPress = tripId => {
    this.props.selectTrip(tripId);
    this.setState({
      open: false,
    });
  };

  _onTripLongPress = tripId => {
    Alert.alert(
      `Are you sure you want to delete ${this.props.getTripName(tripId) || 'this list'}?`,
      null,
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: () => {
            if (this.props.selectedTripId === tripId) {
              this.props.selectTrip(null);
            }
            this.props.removeTrip(tripId);
          },
        },
      ]
    );
  };
  _onPressNewTrip = () => {
    this.props.createTrip().then(newTripId => {
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
        <StatusBar barStyle={this.state.open ? 'light-content' : 'default'} animated={true} />
        <Animated.View
          style={[
            Styles.Background,
            {
              opacity: this._openAnim.interpolate({
                inputRange: [0, 0.0001],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
              bottom: this._openAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  ButtonPosition.bottom,
                  ButtonPosition.bottom - AnimateDistance,
                ],
              }),
              height: this._openAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  ButtonPosition.height,
                  ButtonPosition.height + 2 * AnimateDistance,
                ],
              }),
              right: this._openAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  ButtonPosition.right,
                  ButtonPosition.right - AnimateDistance,
                ],
              }),
              width: this._openAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  ButtonPosition.width,
                  ButtonPosition.width + 2 * AnimateDistance,
                ],
              }),
            },
          ]}>
          <TouchableOpacity
            onPress={this._onButtonPress}
            style={StyleSheet.absoluteFill}>
            <View />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            Styles.Menu,
            {
              opacity: this._openAnim.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
          pointerEvents={this.state.open ? 'auto' : 'none'}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={Styles.MenuScroll}
            contentContainerStyle={Styles.MenuScrollInner}>
            <MenuItem
              trip={{ name: 'New List' }}
              onPress={() => this._onPressNewTrip()}
            />
            {trips
              .mapEntries(([tripId, trip], i) => [
                tripId,
                <MenuItem
                  trip={trip}
                  onPress={() => this._onTripPress(tripId)}
                  onLongPress={() => this._onTripLongPress(tripId)}
                  key={tripId}
                />,
              ])
              .toArray()}
            <View style={Styles.AboutSection}>
              <TouchableOpacity activeOpacity={0.6} onPress={this.props.showWelcome}>
                <UIText color="white" size="12">Show me that welcome screen again!</UIText>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} onPress={() => Linking.openURL('https://twitter.com/_paulshen')}>
                <UIText color="white" size="12">Tweet feedback @_paulshen</UIText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
        {!this.state.open || this.props.selectedTripId
          ? <TouchableOpacity
              activeOpacity={0.85}
              onPress={this._onButtonPress}
              style={Styles.Button}>
              <ButtonIcon close={this.state.open} />
            </TouchableOpacity>
          : null}
      </View>
    );
  }
}
NavMenu = connect(
  state => ({
    selectedTripId: user.selectors.getSelectedTripId(state),
    trips: trips.selectors.getTrips(state),
    getTripName: tripId => trips.selectors.getTrip(state, tripId).name,
  }),
  dispatch => ({
    createTrip: () => dispatch(trips.actions.createTrip()),
    removeTrip: tripId => dispatch(trips.actions.removeTrip(tripId)),
    selectTrip: tripId => dispatch(user.actions.selectTrip(tripId)),
    moveTripToMostRecent: tripId =>
      dispatch(trips.actions.moveTripToMostRecent(tripId)),
  })
)(NavMenu);
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
    height: ButtonPosition.height,
    justifyContent: 'center',
    position: 'absolute',
    right: ButtonPosition.right,
    width: ButtonPosition.width,
  },
  Menu: {
    ...StyleSheet.absoluteFillObject,
  },
  MenuScroll: {},
  MenuScrollInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  MenuItem: {
    aspectRatio: 1.1,
    backgroundColor: Colors.White,
    borderRadius: 10,
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
  },
  MenuItemName: {
    paddingHorizontal: 8,
    paddingTop: 24,
    textAlign: 'center',
  },
  MenuItemBottom: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  MenuItemPlus: {
    top: -4,
  },
  AboutSection: {
    alignItems: 'flex-start',
    marginVertical: 40,
    opacity: 0.5,
    width: WindowWidth,
  },
  ButtonIconLine: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 2,
    width: 14,
  },
});
