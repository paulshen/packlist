/* @flow */
import React from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '../Constants';
import { UIText } from './Core';

const WindowHeight = Dimensions.get('window').height;
const ButtonPosition = {
  bottom: 38,
  height: 42,
  left: 34,
  width: 140,
};
const AnimateDistance = WindowHeight - ButtonPosition.bottom - ButtonPosition.height;

function MenuRow({ children, onPress }: { children?: any, onPress?: Function }) {
  return (
    <View style={Styles.MenuRow}>
      <TouchableOpacity onPress={onPress} style={Styles.MenuRowTouchable}>
        <UIText size="18">{children}</UIText>
      </TouchableOpacity>
    </View>
  );
}

export default class NavMenu extends React.Component {
  props: {
    onTripChange: (trip: Object) => void,
  };

  state = {
    open: false,
  };

  _openAnim = new Animated.Value(0);

  componentDidUpdate(prevProps: $PropertyType<NavMenu, 'props'>, prevState: $PropertyType<NavMenu, 'state'>) {
    if (this.state.open !== prevState.open) {
      Animated.timing(this._openAnim, {
        toValue: this.state.open ? 1 : 0,
        duration: 200,
      }).start();
    }
  }

  _onButtonPress = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  _onTripPress = (tripName) => {
    this.props.onTripChange({
      name: tripName,
    });
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <View style={Styles.Root} pointerEvents="box-none">
        <Animated.View style={[Styles.Background, {
          bottom: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.bottom, ButtonPosition.bottom - AnimateDistance],
          }),
          left: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.left, ButtonPosition.left - AnimateDistance],
          }),
          height: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.height, ButtonPosition.height + 2 * AnimateDistance],
          }),
          width: this._openAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [ButtonPosition.width, ButtonPosition.width + 2 * AnimateDistance],
          }),
        }]} />
        <TouchableOpacity
          activeOpacity={this.state.open ? 1 : 0.85}
          onPress={this._onButtonPress}
          style={Styles.Button}>
          <View style={Styles.ButtonIcon} />
          <UIText color="white" size="14" weight="medium" style={Styles.ButtonText}>Change trip</UIText>
        </TouchableOpacity>
        <Animated.View style={[Styles.Menu, {
          opacity: this._openAnim,
        }]} pointerEvents={this.state.open ? 'auto' : 'none'}>
          <MenuRow onPress={() => this._onTripPress('Sample camping trip')}>Sample camping trip</MenuRow>
          <MenuRow onPress={() => this._onTripPress('Copenhagen')}>Copenhagen</MenuRow>
          <MenuRow onPress={() => this._onTripPress('Japan')}>Japan</MenuRow>
          <View style={[Styles.MenuRow, Styles.MenuLastRow]}>
            <UIText size="18">New trip</UIText>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  Background: {
    backgroundColor: Colors.Blue,
    borderRadius: WindowHeight / 2,
    position: 'absolute',
  },
  Button: {
    alignItems: 'center',
    borderRadius: ButtonPosition.height / 2,
    bottom: ButtonPosition.bottom,
    flexDirection: 'row',
    height: ButtonPosition.height,
    left: ButtonPosition.left,
    paddingLeft: 6,
    position: 'absolute',
    width: ButtonPosition.width,
  },
  ButtonIcon: {
    backgroundColor: '#FFFFFF80',
    borderRadius: 15,
    height: 30,
    marginRight: 10,
    width: 30,
  },
  ButtonText: {
    backgroundColor: 'transparent'
  },
  Menu: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    bottom: 100,
    left: ButtonPosition.left,
    right: 24,
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  MenuRow: {
    borderBottomColor: Colors.LightGrayBorder,
    borderBottomWidth: 1,
    height: 52,
    justifyContent: 'center',
    marginLeft: 24,
  },
  MenuRowTouchable: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  MenuLastRow: {
    borderBottomWidth: 0,
  },
});
