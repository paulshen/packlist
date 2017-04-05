/* @flow */
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors, Fonts } from '../../Constants';

const SUPPORTED_COLORS = {
  black: Colors.Black,
  white: Colors.White,
  lightgray: Colors.LightGray,
  verylightgray: Colors.VeryLightGray,
};

const SUPPORTED_FONT_SIZES = {
  '12': 12,
  '14': 14,
  '16': 16,
  '18': 18,
  '24': 24,
  '28': 28,
  '48': 48,
};

export default function UIText({ color, size, style, weight, ...props }: {
  color?: $Keys<typeof SUPPORTED_COLORS>,
  size?: $Keys<typeof SUPPORTED_FONT_SIZES>,
  style?: any,
  weight?: 'light' | 'regular' | 'medium' | 'semibold',
}) {
  let styles = [style, Styles.Text];
  switch (weight) {
  case 'light':
    styles.push(Fonts.Light);
    break;
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
  Text: {
    backgroundColor: 'transparent',
  },
  ...colorStyles,
  ...fontSizeStyles,
});
