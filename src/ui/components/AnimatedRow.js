/* @flow */
import React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Sizes } from '../Constants';

export default class AnimatedRow extends React.Component {
  props: {
    children?: any,
    y: number,
  };

  state: {
    prevY: number,
    yAnimation: Animated.Value,
  };

  constructor(props: $PropertyType<AnimatedRow, 'props'>) {
    super();
    this.state = {
      prevY: props.y,
      yAnimation: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps: $PropertyType<AnimatedRow, 'props'>) {
    if (nextProps.y !== this.props.y) {
      this.setState({
        prevY: this.props.y,
        yAnimation: new Animated.Value(0),
      }, () => {
        Animated.timing(this.state.yAnimation, {
          toValue: 1,
          duration: 200,
        }).start();
      });
    }
  }

  render() {
    return (
      <Animated.View style={[Styles.Row, {
        top: this.state.yAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [this.state.prevY, this.props.y],
        }),
      }]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const Styles = StyleSheet.create({
  Row: {
    height: Sizes.RowHeight,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
