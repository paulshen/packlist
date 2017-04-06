/* @flow */
import React from 'react';
import { Animated } from 'react-native';
import ReactTransitionGroup from 'react-addons-transition-group';

function FirstChild(props) {
  return React.Children.toArray(props.children)[0] || null;
}

class Wrapper extends React.Component {
  props: {
    style?: any,
    duration: number,
  };
  static defaultProps = {
    duration: 300,
  };
  _anim = new Animated.Value(0);

  componentWillAppear(callback) {
    this._fadeIn(callback);
  }

  componentWillEnter(callback) {
    this._fadeIn(callback);
  }

  _fadeIn = (callback) => {
    Animated.timing(this._anim, {
      toValue: 1,
      duration: this.props.duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => callback(), this.props.duration);
  };

  componentWillLeave(callback) {
    Animated.timing(this._anim, {
      toValue: 0,
      duration: this.props.duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => callback(), this.props.duration);
  }

  render() {
    let { duration, style, ...props } = this.props;
    return (
      <Animated.View
        {...props}
        style={[{ opacity: this._anim }, style]}
      />
    );
  }
}

export default function FadeChild({ children, style }: { children?: any, style?: any }) {
  return (
    <ReactTransitionGroup component={FirstChild}>
      {React.Children.toArray(children).length > 0 ? <Wrapper style={style}>{children}</Wrapper> : null}
    </ReactTransitionGroup>
  );
}
