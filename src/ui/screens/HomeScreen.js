/* @flow */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import TripScreen from './TripScreen';
import WelcomeScreen from './WelcomeScreen';
import NavMenu from '../components/NavMenu';
import { StoreReyhdrated } from '../../redux';
import FadeChild from '../components/FadeChild';
import { Colors } from '../Constants';
import user from '../../redux/user';

class HomeScreen extends React.Component {
  props: {
    selectedTripId: ?string,
    hasDismissedWelcome: boolean,
    dismissWelcome: Function,
  };
  state = {
    rehydrated: false,
    showWelcome: false,
  };

  componentDidMount() {
    StoreReyhdrated.then(() => this.setState({
      rehydrated: true,
      showWelcome: !this.props.hasDismissedWelcome,
    }));
  }

  _onDismissWelcome = () => {
    this.setState({ showWelcome: false });
    this.props.dismissWelcome();
  };

  render() {
    return (
      <View style={Styles.Root}>
        {this.props.selectedTripId &&
          <TripScreen
            tripId={this.props.selectedTripId}
            key={this.props.selectedTripId}
          />}
        {this.state.rehydrated &&
          <NavMenu
            showWelcome={() => this.setState({ showWelcome: true })}
          />}
        {this.state.showWelcome &&
          <WelcomeScreen dismiss={this._onDismissWelcome} />}
        <FadeChild duration={200} fadeOnAppear={false} style={StyleSheet.absoluteFill}>
          {!this.state.rehydrated && <View style={Styles.LoadingOverlay} />}
        </FadeChild>
      </View>
    );
  }
}
HomeScreen = connect(state => ({
  selectedTripId: user.selectors.getSelectedTripId(state),
  hasDismissedWelcome: user.selectors.hasDismissedWelcome(state),
}), (dispatch) => ({
  dismissWelcome: () => dispatch(user.actions.dismissWelcome()),
}))(HomeScreen);
export default HomeScreen;

const Styles = StyleSheet.create({
  Root: {
    backgroundColor: Colors.White,
    flex: 1,
  },
  LoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.Blue,
  },
});
