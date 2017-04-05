/* @flow */

import React from 'react';
import { Provider } from 'react-redux';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import HomeScreen from './ui/screens/HomeScreen';
import { Store, StoreReyhdrated } from './redux';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <ActionSheetProvider>
          <HomeScreen />
        </ActionSheetProvider>
      </Provider>
    );
  }
}
