import { Encrypt, Decrypt } from '../util/Encrypt';
import { NativeModules } from 'react-native';
import IMEI from 'react-native-imei';

export function getSign() {
  let date = (new Date()).valueOf();
  let sign = "did=" + imei + "&app_type=android&time=" + date.toString();
  sign = sign + new Array(17 - sign.length % 16).join(' ');
  sign = Encrypt(sign);
  return sign;
}

export const imei = IMEI.getImei();