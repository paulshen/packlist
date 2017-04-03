/* @flow */
import React from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from '../components/Core';

class ItemScroller extends React.Component {
  _anim = new Animated.Value(0);

  componentDidMount() {
    this._loop();
  }

  _loop = () => {
    this._anim.setValue(0);
    Animated.timing(this._anim, {
      toValue: 1,
      duration: 6000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
    this._timeout = setTimeout(this._loop, 6000);
  };
  render() {
    return (
      <View style={Styles.ItemScroller}>
        <Animated.View
          style={[
            Styles.ItemScrollerStrip,
            {
              transform: [
                {
                  translateX: this._anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -Dimensions.get('window').width],
                  }),
                },
              ],
            },
          ]}>
          <Image source={require('../../../assets/items.png')} />
          <Image source={require('../../../assets/items.png')} />
        </Animated.View>
      </View>
    );
  }
}

export default class WelcomeScreen extends React.Component {
  props: {
    dismiss: () => void,
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.dismiss}>
        <View style={Styles.Root}>
          <StatusBar barStyle="light-content" />
          <View style={Styles.Top}>
            <UIText color="white" size="28" style={Styles.TopText}>
              Packlist
            </UIText>
            <View style={Styles.TopDivider} />
            <UIText color="white" size="16" style={Styles.TopText}>
              {'A simple checklist\nfor stress-free travels'}
            </UIText>
          </View>
          <ItemScroller />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    backgroundColor: Colors.Blue,
    flex: 1,
  },
  Top: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  TopDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 1,
    marginBottom: 32,
    marginTop: 8,
    width: 30,
  },
  TopText: {
    textAlign: 'center',
  },
  ItemScroller: {
    height: 400,
  },
  ItemScrollerStrip: {
    flexDirection: 'row',
  },
});
