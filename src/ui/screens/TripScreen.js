/* @flow */

import React from 'react';
import { Animated, Button, Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Colors, Fonts } from '../Constants';
import { UIText } from '../components/Core';
import EmptyTripPrompt from '../components/EmptyTripPrompt';
import trips from '../../redux/trips';

type Item = { id: number, checked?: boolean, text: string };

function ItemRow({ item, onPress, onLongPress }: { item: Item, onPress: Function, onLongPress: Function }) {
  let strike;
  if (item.checked) {
    strike = <View style={Styles.Strike} />;
  }

  return (
    <View style={Styles.ItemRow}>
      <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.6} style={Styles.ItemRowTouchable}>
        <View>
          <UIText size="18">{item.text}</UIText>
          {strike}
        </View>
      </TouchableOpacity>
    </View>
  );
}

class AnimatedRow extends React.Component {
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

class TripScreen extends React.Component {
  props: {
    tripId: string,
    trip: Object,
    setTripTitle: (title: string) => void,
    setTripItems: (items: any) => void,
  };

  state = {
    newItemText: '',
  };

  _titleInput: TextInput;
  _addInput: TextInput;

  componentDidMount() {
    if (!this.props.trip.name) {
      this._titleInput.focus();
    }
  }

  _onChangeTitleText = (text) => {
    this.props.setTripTitle(text);
  };

  _onChangeNewItemText = (text) => {
    this.setState({
      newItemText: text,
    });
  };

  _addItem = () => {
    let nextId = Math.max.apply(null, [...this.props.trip.items.map(item => item.id), 0]) + 1;
    let newItem = {
      id: nextId,
      text: this.state.newItemText,
    };
    this.props.setTripItems([newItem, ...this.props.trip.items]);
    this.setState({
      newItemText: '',
    });
    requestAnimationFrame(() => this._addInput.focus());
  };

  _onCancelAddPress = () => {
    this.setState({
      newItemText: '',
    });
    Keyboard.dismiss();
  };

  _onItemPress = (item: Item) => {
    let unchecked = this.props.trip.items.filter(i => i !== item && !i.checked);
    let checked = this.props.trip.items.filter(i => i !== item && i.checked);

    this.props.setTripItems([
      ...unchecked,
      { ...item, checked: !item.checked },
      ...checked,
    ]);
  };

  _onItemLongPress = (item: Item) => {
    this.props.setTripItems(this.props.trip.items.filter(i => i !== item));
  };

  render() {
    let uncheckedItems = this.props.trip.items.filter(i => !i.checked);
    let checkedItems = this.props.trip.items.filter(i => i.checked);

    let emptyTripPrompt;
    if (this.props.trip.items.length === 0) {
      emptyTripPrompt = <EmptyTripPrompt tripId={this.props.tripId} style={Styles.EmptyTripPrompt} />;
    }

    return (
      <ScrollView style={Styles.Root} contentContainerStyle={Styles.ScrollInner}>
        <View style={Styles.Header}>
          <TextInput
            value={this.props.trip.name}
            onChangeText={this._onChangeTitleText}
            placeholder="Name your trip"
            ref={c => this._titleInput = c}
            style={Styles.HeaderInput}
          />
        </View>
        <View style={[Styles.Body, {
          height: (this.props.trip.items.length + 2) * 50,
        }]}>
          <View style={Styles.Row}>
            <View style={[Styles.ItemRow, Styles.AddItemRow]}>
              <TextInput
                placeholder="Add item"
                onChangeText={this._onChangeNewItemText}
                onSubmitEditing={this._addItem}
                value={this.state.newItemText}
                returnKeyType="go"
                enablesReturnKeyAutomatically={true}
                ref={c => this._addInput = c}
                style={Styles.AddInput}
              />
              {this.state.newItemText ?
                <Button title="Cancel" onPress={this._onCancelAddPress} />
              : null}
            </View>
          </View>
          {emptyTripPrompt}
          {this.props.trip.items.map((item, i) => {
            let y;
            if (!item.checked) {
              y = 50 * (uncheckedItems.indexOf(item) + 1);
            } else {
              y = 50 * (uncheckedItems.length + checkedItems.indexOf(item) + 2);
            }
            return (
              <AnimatedRow y={y} key={item.id}>
                <ItemRow
                  item={item}
                  onPress={() => this._onItemPress(item)}
                  onLongPress={() => this._onItemLongPress(item)}
                />
              </AnimatedRow>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}
TripScreen = connect((state, ownProps) => ({
  trip: trips.selectors.getTrip(state, ownProps.tripId),
}), (dispatch, ownProps) => ({
  setTripTitle: (title) => dispatch(trips.actions.setTripTitle(ownProps.tripId, title)),
  setTripItems: (items) => dispatch(trips.actions.setTripItems(ownProps.tripId, items)),
}))(TripScreen);
export default TripScreen;

const Styles = StyleSheet.create({
  Root: {
    flex: 1,
  },
  Header: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 40,
  },
  HeaderInput: {
    ...Fonts.Medium,
    fontSize: 24,
    height: 36,
    textAlign: 'center',
  },
  Body: {
    marginBottom: 120,
  },
  Row: {
    height: 50,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  ItemRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrayBorder,
    flex: 1,
    flexDirection: 'row',
    marginLeft: 34,
  },
  ItemRowTouchable: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
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
  EmptyTripPrompt: {
    top: 50 * 2,
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
