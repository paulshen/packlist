/* @flow */

import React from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

type Item = { text: string };

function ItemRow({ item }: { item: Item }) {
  return (
    <View style={Styles.ItemRow}>
      <Text style={Styles.ItemText}>{item.text}</Text>
    </View>
  );
}

export default class TripScreen extends React.Component {
  state = {
    items: [
      { text: 'Toothbrush' },
      { text: 'Toothpaste' },
      { text: 'Contacts' },
      { text: 'Contact solution' },
    ],
    newItemText: '',
  };

  _onChangeNewItemText = (text) => {
    this.setState({
      newItemText: text,
    });
  };

  _addItem = () => {
    let newItem = {
      text: this.state.newItemText,
    };
    this.setState({
      items: [newItem, ...this.state.items],
      newItemText: '',
    });
    Keyboard.dismiss();
  };

  render() {
    return (
      <View style={Styles.Root}>
        <View style={Styles.ItemRow}>
          <TextInput
            onChangeText={this._onChangeNewItemText}
            value={this.state.newItemText}
            style={Styles.AddInput}
          />
          <Button title="Add" onPress={this._addItem} />
        </View>
        {this.state.items.map((item, i) => <ItemRow item={item} key={i} />)}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    flex: 1,
    paddingTop: 100,
  },
  ItemRow: {
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
  AddInput: {
    color: '#000000',
    flex: 1,
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400',
    height: 32,
    top: 9,
  },
});
