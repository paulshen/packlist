/* @flow */
import { Platform } from 'react-native';

const IosFonts = {
  Light: {
    fontFamily: 'SFUIText-Light',
  },
  Regular: {
    fontFamily: 'SFUIText-Regular',
  },
  Medium: {
    fontFamily: 'SFUIText-Medium',
  },
  Semibold: {
    fontFamily: 'SFUIText-Semibold',
  },
};

const AndroidFonts = {
  Light: {
    fontFamily: 'Roboto',
    fontWeight: '300',
  },
  Regular: {
    fontFamily: 'Roboto',
    fontWeight: '400',
  },
  Medium: {
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  Semibold: {
    fontFamily: 'Roboto',
    fontWeight: '600',
  },
};


export default Platform.OS === 'android' ? AndroidFonts : IosFonts;
