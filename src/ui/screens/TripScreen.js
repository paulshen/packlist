/* @flow */

import React from 'react';
import { Animated, Button, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors, Fonts } from '../Constants';
import { UIText } from '../components/Core';
import NavMenu from '../components/NavMenu';

type Item = { id: number, checked?: boolean, text: string };

function ItemRow({ item, onPress }: { item: Item, onPress: Function }) {
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

class Row extends React.Component {
  props: {
    children?: any,
    y: number,
  };

  state: {
    prevY: number,
    yAnimation: Animated.Value,
  };

  constructor(props) {
    super();
    this.state = {
      prevY: props.y,
      yAnimation: new Animated.Value(0),
    };
  }

  componentWillReceiveProps(nextProps) {
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

export default class TripScreen extends React.Component {
  state: {
    items: Item[],
    newItemText: string,
  } = {
    items: [
      { id: 10, text: 'Toothbrush' },
      { id: 11, text: 'Toothpaste' },
      { id: 12, text: 'Contacts' },
      { id: 13, text: 'Contact solution' },
    ],
    newItemText: '',
  };

  _onChangeNewItemText = (text) => {
    this.setState({
      newItemText: text,
    });
  };

  _addItem = () => {
    let nextId = Math.max.apply(null, this.state.items.map(item => item.id)) + 1;
    let newItem = {
      id: nextId,
      text: this.state.newItemText,
    };
    this.setState({
      items: [newItem, ...this.state.items],
      newItemText: '',
    });
    Keyboard.dismiss();
  };

  _onCancelAddPress = () => {
    this.setState({
      newItemText: '',
    });
    Keyboard.dismiss();
  };

  _onItemPress = (item: Item) => {
    let unchecked = this.state.items.filter(i => i !== item && !i.checked);
    let checked = this.state.items.filter(i => i !== item && i.checked);

    item.checked = !item.checked;
    this.setState({ items: [...unchecked, item, ...checked] });
  };

  render() {
    let uncheckedItems = this.state.items.filter(i => !i.checked);
    let checkedItems = this.state.items.filter(i => i.checked);

    return (
      <View style={Styles.Root}>
        <View>
          <View style={Styles.Row}>
            <View style={[Styles.ItemRow, Styles.AddItemRow]}>
              <TextInput
                placeholder="Add item"
                onChangeText={this._onChangeNewItemText}
                onSubmitEditing={this._addItem}
                value={this.state.newItemText}
                returnKeyType="go"
                enablesReturnKeyAutomatically={true}
                style={Styles.AddInput}
              />
              {this.state.newItemText ?
                <Button title="Cancel" onPress={this._onCancelAddPress} />
              : null}
            </View>
          </View>
          {this.state.items.map((item, i) => {
            let y;
            if (!item.checked) {
              y = 52 * (uncheckedItems.indexOf(item) + 1);
            } else {
              y = 52 * (uncheckedItems.length + checkedItems.indexOf(item) + 2);
            }
            return (
              <Row y={y} key={item.id}>
                <ItemRow item={item} onPress={() => this._onItemPress(item)} />
              </Row>
            );
          })}
        </View>
        <NavMenu />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  Root: {
    flex: 1,
    paddingTop: 100,
  },
  Row: {
    height: 52,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  ItemRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
    flex: 1,
    flexDirection: 'row',
    marginLeft: 34,
  },
  AddItemRow: {
    paddingRight: 20,
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
