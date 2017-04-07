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
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from '../components/Core';
import Amplitude from '../../Amplitude';

const ItemScrollerImageWidth = 500;
class ItemScroller extends React.Component {
  _anim = new Animated.Value(0);
  _timeout: number;

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
                    outputRange: [0, -ItemScrollerImageWidth],
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

  componentDidMount() {
    Amplitude.logEvent('Viewed Welcome Screen');
  }

  render() {
    return (
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
        <TouchableHighlight
          underlayColor="#FFFFFF08"
          onPress={this.props.dismiss}
          style={Styles.Continue}>
          <View>
            <UIText color="white" size="16" weight="medium">Continue</UIText>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.Blue,
  },
  Top: {
    alignItems: 'center',
    paddingTop: 60,
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
    flex: 1,
    justifyContent: 'center',
    zIndex: -1,
  },
  ItemScrollerStrip: {
    flexDirection: 'row',
    width: 500 * 2,
  },
  Continue: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF10',
    borderColor: '#FFFFFF60',
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
});
