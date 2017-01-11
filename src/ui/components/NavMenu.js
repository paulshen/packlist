/* @flow */
import React from 'react';
import type { OrderedMap } from 'immutable';
import { Alert, Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

import { Colors, Sizes } from '../Constants';
import { UIText } from './Core';
import trips from '../../redux/trips';
import user from '../../redux/user';

const WindowHeight = Dimensions.get('window').height;
const AnimationDuration = 200;
const ButtonPosition = {
  bottom: 38,
  height: 42,
  right: 30,
  width: 140,
};
const AnimateDistance = WindowHeight - ButtonPosition.bottom - ButtonPosition.height;

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

function MenuRow({ children, onPress, onLongPress, isFirstRow }: { children?: any, onPress?: Function, onLongPress?: Function, isFirstRow: boolean }) {
  return (
    <View style={[Styles.MenuRow, isFirstRow && Styles.MenuFirstRow]}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={Styles.MenuRowTouchable}>
        <UIText size="16">{children}</UIText>
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
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={this._onButtonPress}
          style={Styles.Button}>
          <UIText color="white" size="14" weight="medium" style={Styles.ButtonText}>
            {this.state.open ? 'Close' : 'Change trip'}
          </UIText>
          <ButtonIcon style={Styles.ButtonIcon} close={this.state.open} />
        </TouchableOpacity>
        <Animated.View style={[Styles.Menu, {
          opacity: this._openAnim,
        }]} pointerEvents={this.state.open ? 'auto' : 'none'}>
          <View style={Styles.MenuInner}>
            <InvertibleScrollView inverted={true} showsVerticalScrollIndicator={false} style={Styles.MenuScroll}>
              {trips.mapEntries(([tripId, trip], i) => ([
                tripId,
                <MenuRow
                  onPress={() => this._onTripPress(tripId)}
                  onLongPress={() => this._onTripLongPress(tripId)}
                  isFirstRow={i === 0}
                  key={tripId}>
                  {trip.name || 'Untitled'}
                </MenuRow>,
              ])).toArray()}
            </InvertibleScrollView>
            <View style={Styles.MenuRow}>
              <TouchableOpacity onPress={this._onPressNewTrip} style={Styles.MenuRowTouchable}>
                <UIText size="16">New trip</UIText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
  ButtonIcon: {
    marginLeft: 8,
  },
  ButtonText: {
    backgroundColor: 'transparent'
  },
  MenuScroll: {
    maxHeight: 4.5 * (Sizes.RowHeight + 1),
  },
  Menu: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    bottom: 100,
    left: 24,
    position: 'absolute',
    right: ButtonPosition.right,
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  MenuInner: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  MenuRow: {
    borderTopColor: Colors.LightGrayBorder,
    borderTopWidth: 1,
    height: Sizes.RowHeight,
    justifyContent: 'center',
    marginLeft: 20,
  },
  MenuRowTouchable: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  MenuFirstRow: {
    borderTopWidth: 0,
  },
  ButtonIconLine: {
    backgroundColor: '#90E3D2',
    height: 2,
    width: 14,
  },
});
