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
    fadeOnAppear: boolean,
    initialMount: boolean,
    duration: number,
  };
  static defaultProps = {
    fadeOnAppear: true,
    duration: 300,
  };

  constructor(props) {
    super();
    this._anim = new Animated.Value(
      props.initialMount && !props.fadeOnAppear ? 1 : 0
    );
  }

  componentWillAppear(callback) {
    if (!this.props.initialMount || this.props.fadeOnAppear) {
      this._fadeIn(callback);
    } else {
      callback();
    }
  }

  componentWillEnter(callback) {
    this._fadeIn(callback);
  }

  _fadeIn = callback => {
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
      <Animated.View {...props} style={[{ opacity: this._anim }, style]} />
    );
  }
}

export default class FadeChild extends React.Component {
  props: { children?: any };
  state = {
    initialMount: true,
  };

  componentDidMount() {
    this.setState({
      initialMount: false,
    });
  }
  
  render() {
    let { children, ...props } = this.props;
    return (
      <ReactTransitionGroup component={FirstChild}>
        {React.Children.toArray(children).length > 0
          ? <Wrapper {...props} initialMount={this.state.initialMount}>
              {children}
            </Wrapper>
          : null}
      </ReactTransitionGroup>
    );
  }
}
