export function isNicknameAvailable(nickname) {
  var myreg=/^[\u4e00-\u9fa50-9a-zA-Z_-]+$/;
  if (!myreg.test(nickname)) {
    return false;
  } else {
    return true;
  }
}

export function isPhoneAvailable(phone) {
  var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  } else {
    return true;
  }
}