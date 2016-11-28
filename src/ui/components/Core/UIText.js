/* @flow */
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors, Fonts } from '../../Constants';

const SUPPORTED_COLORS = {
  black: Colors.Black,
  white: Colors.White,
};

const SUPPORTED_FONT_SIZES = {
  '14': 14,
  '18': 18,
};

export default function UIText({ color, size, style, weight, ...props }: {
  color?: $Keys<typeof SUPPORTED_COLORS>,
  size?: $Keys<typeof SUPPORTED_FONT_SIZES>,
  style?: any,
  weight?: 'regular' | 'medium' | 'semibold',
}) {
  let styles = [style];
  switch (weight) {
  case 'medium':
    styles.push(Fonts.Medium);
    break;
  case 'semibold':
    styles.push(Fonts.Semibold);
    break;
  default:
    styles.push(Fonts.Regular);
  }

  if (color) {
    styles.push(Styles[color]);
  }

  if (size) {
    styles.push(Styles[size]);
  }

  return (
    <Text {...props} style={styles} />
  );
}

let colorStyles = {};
Object.keys(SUPPORTED_COLORS).forEach((k) => {
  colorStyles[k] = {
    color: SUPPORTED_COLORS[k],
  };
});

let fontSizeStyles = {};
Object.keys(SUPPORTED_FONT_SIZES).forEach((k) => {
  fontSizeStyles[k] = {
    fontSize: SUPPORTED_FONT_SIZES[k],
  };
});

const Styles = StyleSheet.create({
  ...colorStyles,
  ...fontSizeStyles,
});
