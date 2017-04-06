/* @flow */

import React from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import Interactable from 'react-native-interactable';

import { Colors, Fonts, Sizes } from '../Constants';
import { UIText } from '../components/Core';
import AnimatedRow from '../components/AnimatedRow';
import EmptyTripPrompt from '../components/EmptyTripPrompt';
import OnboardingPopup from '../components/OnboardingPopup';
import trips from '../../redux/trips';
import user from '../../redux/user';
import Amplitude from '../../Amplitude';

type Item = { id: number, checked?: boolean, text: string };

const WindowWidth = Dimensions.get('window').width;
class ItemRow extends React.Component {
  props: {
    item: Item,
    onPress: Function,
    onDelete: Function,
  };
  _animatedChecked: Animated.Value;
  _interactable: Interactable.View;
  _deltaX = new Animated.Value(0);

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

  _onSnap = ({ nativeEvent: { id } }) => {
    if (id === 'delete') {
      Alert.alert('Delete this item?', null, [
        {
          text: 'Cancel',
          onPress: () => this._interactable.snapTo({ index: 0 }),
        },
        { text: 'Yes', onPress: this.props.onDelete },
      ]);
    }
  };

  render() {
    let { item, onPress } = this.props;
    return (
      <View style={Styles.ItemRow}>
        <View style={Styles.ItemRowDelete}>
          <Icon name="delete" size={24} color={Colors.White} />
        </View>
        <Interactable.View
          boundaries={{ right: 0 }}
          snapPoints={[
            { x: 0, damping: 0.5, tension: 600 },
            { id: 'delete', x: -50, damping: 0.5, tension: 600 },
          ]}
          onSnap={this._onSnap}
          dragToss={0.1}
          horizontalOnly={true}
          animatedValueX={this._deltaX}
          ref={c => this._interactable = c}
          style={Styles.ItemRowInteractable}>
          <TouchableHighlight
            onPress={onPress}
            underlayColor="#fcfcfc"
            activeOpacity={0.9}
            style={Styles.ItemRowTouchable}>
            <View style={Styles.ItemRowTouchableInner}>
              <Animated.View
                style={[
                  Styles.ItemRowChecked,
                  {
                    transform: [
                      {
                        translateX: this._animatedChecked.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-WindowWidth, 0],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <View>
                <UIText size="16">{item.text}</UIText>
              </View>
              <Animated.Image
                source={require('../../../assets/check.png')}
                style={{
                  opacity: this._animatedChecked.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                }}
              />
            </View>
          </TouchableHighlight>
        </Interactable.View>
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
    removeTrip: (tripId: string) => void,
    selectTrip: (tripId: ?string) => void,
    showActionSheetWithOptions: Function,
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
    Amplitude.logEvent('Viewed Trip Screen', {
      tripId: this.props.tripId,
    });
  }

  _onChangeTitleText = text => {
    this.props.setTripTitle(text);
  };

  _onChangeNewItemText = text => {
    this.setState({
      newItemText: text,
    });
  };

  _addItem = () => {
    let nextId = Math.max.apply(null, [
      ...this.props.trip.items.map(item => item.id),
      0,
    ]) + 1;
    let newItem = {
      id: nextId,
      text: this.state.newItemText,
    };
    this.props.setTripItems([newItem, ...this.props.trip.items]);
    this.setState({
      newItemText: '',
    });
    requestAnimationFrame(() => this._addInput.focus());
    Amplitude.logEvent('Trip Item Added');
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
    if (!item.checked) {
      Amplitude.logEvent('Trip Item Checked');
    } else {
      Amplitude.logEvent('Trip Item Unchecked');
    }
  };

  _deleteItem = (item: Item) => {
    this.props.setTripItems(this.props.trip.items.filter(i => i !== item));
    Amplitude.logEvent('Trip Item Deleted');
  };

  _onScroll = e => {
    this._scrollAnim.setValue(e.nativeEvent.contentOffset.y / Sizes.RowHeight);
  };

  _onSettingsPress = () => {
    this.props.showActionSheetWithOptions(
      {
        options: ['Uncheck all items', 'Delete list', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.props.setTripItems(
              this.props.trip.items.map(item => ({
                ...item,
                checked: false,
              }))
            );
            Amplitude.logEvent('Trip Items Unchecked', {
              tripId: this.props.tripId,
              numItems: this.props.trip.items.length,
            });
            break;
          case 1:
            Alert.alert(
              `Are you sure you want to delete ${this.props.trip.name || 'this list'}?`,
              null,
              [
                { text: 'Cancel' },
                {
                  text: 'Yes',
                  onPress: () => {
                    this.props.selectTrip(null);
                    this.props.removeTrip(this.props.tripId);
                    Amplitude.logEvent('Trip Deleted', {
                      tripId: this.props.tripId,
                    });
                  },
                },
              ]
            );
            break;
        }
      }
    );
  };

  render() {
    let emptyTripPrompt;
    if (this.props.trip.items.length === 0) {
      emptyTripPrompt = <EmptyTripPrompt tripId={this.props.tripId} />;
    }

    return (
      <View style={Styles.Root}>
        <View style={Styles.Header}>
          <TextInput
            value={this.props.trip.name}
            onChangeText={this._onChangeTitleText}
            placeholder="Name your list"
            ref={c => this._titleInput = c}
            style={Styles.HeaderInput}
          />
          <TouchableOpacity
            onPress={this._onSettingsPress}
            style={Styles.HeaderMoreButton}>
            <Icon name="more-horiz" size={24} color={Colors.LightGray} />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            Styles.HeaderShadow,
            {
              shadowOpacity: this._scrollAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        <View style={Styles.Root}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={this._onScroll}
            scrollEventThrottle={16}
            style={Styles.Root}
            contentContainerStyle={Styles.ScrollInner}>
            <View
              style={[
                Styles.Body,
                {
                  height: (this.props.trip.items.length + 1) * Sizes.RowHeight,
                },
              ]}>
              <View style={Styles.Row}>
                <View style={[Styles.ItemRow, Styles.AddItemRow]}>
                  <TextInput
                    placeholder="Add item"
                    placeholderTextColor={
                      this.props.trip.items.length === 0
                        ? Colors.Blue
                        : Colors.LightGray
                    }
                    onChangeText={this._onChangeNewItemText}
                    onSubmitEditing={this._addItem}
                    value={this.state.newItemText}
                    returnKeyType="go"
                    enablesReturnKeyAutomatically={true}
                    ref={c => this._addInput = c}
                    style={Styles.AddInput}
                  />
                  {this.state.newItemText
                    ? <TouchableOpacity onPress={this._onCancelAddPress}>
                        <UIText color="lightgray" size="16">Cancel</UIText>
                      </TouchableOpacity>
                    : null}
                </View>
              </View>
              {this.props.trip.items.map((item, i) => {
                let y = (i + 1) * Sizes.RowHeight;
                return (
                  <AnimatedRow y={y} key={item.id}>
                    <ItemRow
                      item={item}
                      onPress={() => this._onItemPress(item)}
                      onDelete={() => this._deleteItem(item)}
                    />
                  </AnimatedRow>
                );
              })}
            </View>
            {emptyTripPrompt}
          </ScrollView>
          <OnboardingPopup />
        </View>
      </View>
    );
  }
}
TripScreen = compose(
  connectActionSheet,
  connect(
    (state, ownProps) => ({
      trip: trips.selectors.getTrip(state, ownProps.tripId),
    }),
    (dispatch, ownProps) => ({
      setTripTitle: title =>
        dispatch(trips.actions.setTripTitle(ownProps.tripId, title)),
      setTripItems: items =>
        dispatch(trips.actions.setTripItems(ownProps.tripId, items)),
      removeTrip: tripId => dispatch(trips.actions.removeTrip(tripId)),
      selectTrip: tripId => dispatch(user.actions.selectTrip(tripId)),
    })
  )
)(TripScreen);
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
  HeaderMoreButton: {
    paddingRight: 16,
    position: 'absolute',
    right: 0,
    top: 49,
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
    backgroundColor: '#ee98aa',
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGrayBorder,
    flex: 1,
  },
  ItemRowChecked: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5F9FD',
  },
  ItemRowInteractable: {
    flex: 1,
  },
  ItemRowTouchable: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  ItemRowTouchableInner: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  ItemRowDelete: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 50,
  },
  AddItemRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingLeft: 30,
    paddingRight: 20,
  },
  AddInput: {
    ...Fonts.Regular,
    color: Colors.Black,
    flex: 1,
    fontSize: 16,
  },
});
