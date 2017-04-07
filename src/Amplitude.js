/* @flow */
import { NativeModules } from 'react-native';

const { RNAmplitude: Amplitude } = NativeModules;

export default {
  logEvent(event: string, properties?: Object) {
    Amplitude.logEvent(event, properties || {});
  }
};
