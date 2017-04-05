/* @flow */

import React from 'react';
import { Animated, Button, Dimensions, Image, Keyboard, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from '../components/Core';
import AnimatedRow from '../components/AnimatedRow';
import EmptyTripPrompt from '../components/EmptyTripPrompt';
import trips from '../../redux/trips';

type Item = { id: number, checked?: boolean, text: string };

const WindowWidth = Dimensions.get('window').width;
class ItemRow extends React.Component {
  props: {
    item: Item,
    onPress: Function,
    onLongPress: Function,
  };
  _animatedChecked: Animated.Value;

  constructor(props) {
    super();
    this._animatedChecked = new Animated.Value(props.item.checked ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.checked !== this.props.item.checked) {
      Animated.timing(this._animatedChecked, {
        toValue: nextProps.item.checked ? 1 : 0,
        duration: 200,
      }).start();
    }
  }

  render() {
    let { item, onPress, onLongPress } = this.props;
    return (
      <View style={Styles.ItemRow}>
        <Animated.View style={[Styles.ItemRowChecked, {
          transform: [
            { translateX: this._animatedChecked.interpolate({
              inputRange: [0, 1],
              outputRange: [-WindowWidth, 0],
            }) },
          ],
        }]} />
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} activeOpacity={0.8} style={Styles.ItemRowTouchable}>
          <View>
            <UIText size="16">{item.text}</UIText>
          </View>
          <Animated.Image source={require('../../../assets/check.png')} style={{
            opacity: this._animatedChecked.interpolate({
              inputRange: [0.5, 1],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          }}/>
        </TouchableOpacity>
      </View>
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
  _scrollAnim = new Animated.Value(0);

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
    let items = [...this.props.trip.items];
    items[items.indexOf(item)] = { ...item, checked: !item.checked };
    this.props.setTripItems(items);
  };

  _onItemLongPress = (item: Item) => {
    this.props.setTripItems(this.props.trip.items.filter(i => i !== item));
  };

  _onScroll = (e) => {
    this._scrollAnim.setValue(e.nativeEvent.contentOffset.y / Sizes.RowHeight);
  };

  render() {
    let emptyTripPrompt;
    if (this.props.trip.items.length === 0) {
      emptyTripPrompt = <EmptyTripPrompt tripId={this.props.tripId} style={Styles.EmptyTripPrompt} />;
    }

    return (
      <View style={Styles.Root}>
        <View style={Styles.Header}>
          <TextInput
            value={this.props.trip.name}
            onChangeText={this._onChangeTitleText}
            placeholder="Name your trip"
            ref={c => this._titleInput = c}
            style={Styles.HeaderInput}
          />
        </View>
        <Animated.View style={[Styles.HeaderShadow, {
          shadowOpacity: this._scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }]} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={this._onScroll}
          scrollEventThrottle={16}
          style={Styles.Root}
          contentContainerStyle={Styles.ScrollInner}>
          <View style={[Styles.Body, {
            height: (this.props.trip.items.length + 2) * Sizes.RowHeight,
          }]}>
            <View style={Styles.Row}>
              <View style={[Styles.ItemRow, Styles.AddItemRow]}>
                <TextInput
                  placeholder="Add item"
                  placeholderTextColor={this.props.trip.items.length === 0 ? Colors.Blue : Colors.LightGray}
                  onChangeText={this._onChangeNewItemText}
                  onSubmitEditing={this._addItem}
                  value={this.state.newItemText}
                  returnKeyType="go"
                  enablesReturnKeyAutomatically={true}
                  ref={c => this._addInput = c}
                  style={Styles.AddInput}
                />
                {this.state.newItemText ?
                  <TouchableOpacity onPress={this._onCancelAddPress}>
                    <UIText color="lightgray" size="16">Cancel</UIText>
                  </TouchableOpacity> : null}
              </View>
            </View>
            {emptyTripPrompt}
            {this.props.trip.items.map((item, i) => {
              let y = (i + 1) * Sizes.RowHeight;
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
      </View>
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
    alignItems: 'stretch',
    backgroundColor: Colors.White,
    paddingTop: 44,
    paddingBottom: 24,
    zIndex: 2,
  },
  HeaderShadow: {
    backgroundColor: Colors.White,
    height: 1,
    marginLeft: 20,
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 6 },
    shadowRadius: 16,
    zIndex: 1,
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
    height: Sizes.RowHeight,
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
    paddingLeft: 30,
  },
  ItemRowChecked: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F9FD',
  },
  ItemRowTouchable: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 30,
  },
  AddItemRow: {
    paddingRight: 20,
  },
  AddInput: {
    ...Fonts.Regular,
    color: Colors.Black,
    flex: 1,
    fontSize: 16,
  },
  EmptyTripPrompt: {
    top: Sizes.RowHeight * 3,
  },
});
