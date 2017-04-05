/* @flow */
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import TripScreen from './TripScreen';
import WelcomeScreen from './WelcomeScreen';
import NavMenu from '../components/NavMenu';
import { StoreReyhdrated } from '../../redux';
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
      <View style={{ flex: 1 }}>
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
