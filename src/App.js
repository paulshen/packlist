/* @flow */

import React from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

function Item({ text }: { text: string }) {
  return (
    <View style={Styles.Item}>
      <Text style={Styles.ItemText}>{text}</Text>
    </View>
  );
}

export default class App extends React.Component {
  render() {
    return (
      <View style={Styles.Root}>
        <Item text="Toothbrush" />
        <Item text="Toothpaste" />
        <Item text="Contacts" />
        <Item text="Contact Solution" />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    flex: 1,
    paddingTop: 100,
  },
  Item: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    flexDirection: 'row',
    height: 52,
    paddingLeft: 34,
  },
  ItemText: {
    color: '#000000',
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400',
  },
});
