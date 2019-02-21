import { NativeModules } from 'react-native';
import IMEI from 'react-native-imei';
// const IMEI = require('react-native-imei');
export const imei = IMEI.getImei();