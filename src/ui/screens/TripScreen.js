/* @flow */

import React from 'react';
import { Button, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts } from '../Constants';
import { UIText } from '../components/Core';

type Item = { text: string };

function ItemRow({ item, onPress }) {
  let strike;
  if (item.checked) {
    strike = <View style={Styles.Strike} />;
  }

  return (
    <View style={Styles.ItemRow}>
      <View>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <UIText size="18">{item.text}</UIText>
          {strike}
        </TouchableOpacity>
      </View>
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

  _onItemPress = (item) => {
    // hacky
    item.checked = !item.checked;
    this.setState({ items: this.state.items });
  };

  render() {
    return (
      <View style={Styles.Root}>
        <View style={Styles.ItemRow}>
          <TextInput
            placeholder="Add item"
            onChangeText={this._onChangeNewItemText}
            value={this.state.newItemText}
            style={Styles.AddInput}
          />
          {this.state.newItemText ?
            <Button title="Add" onPress={this._addItem} />
          : null}
        </View>
        {this.state.items.map((item, i) => (
          <ItemRow item={item} key={i} onPress={() => this._onItemPress(item)} />
        ))}
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
    marginLeft: 34,
  },
  AddInput: {
    ...Fonts.Regular,
    color: Colors.Black,
    flex: 1,
    fontSize: 18,
    height: 32,
    top: 9,
  },
  Strike: {
    backgroundColor: 'blue',
    left: -20,
    height: 2,
    position: 'absolute',
    right: -40,
    top: 10,
  },
});
