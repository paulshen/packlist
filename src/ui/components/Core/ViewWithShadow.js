/* @flow */
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ViewWithShadow({ style, ...props }: {
  style?: any,
}) {
  return (
    <View {...props} style={[style, Styles.Root]} />
  );
}

const Styles = StyleSheet.create({
  Root: {
    shadowColor: '#000000',
    shadowOffset: { x: 0, y: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
});
