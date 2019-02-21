import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('token_bbq_123789');
const iv = CryptoJS.enc.Utf8.parse('token1234BBQ4321');

export function Encrypt(word) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(encrypted.toString()));
}

export function Decrypt(word) {
  let srcs = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(word.toString()));
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode:CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt);
}