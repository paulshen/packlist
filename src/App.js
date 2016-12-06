/* @flow */

import React from 'react';
import { Provider } from 'react-redux';

import HomeScreen from './ui/screens/HomeScreen';
import { Store } from './redux';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <HomeScreen />
      </Provider>
    );
  }
}
