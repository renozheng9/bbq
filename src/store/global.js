import { observable, action } from 'mobx';

class GlobalStore {
  @observable status;
  @observable role;
  @observable token;
  @observable time;
  @observable userInfo;

  constructor() {
    this.status = 0;
    this.role = 0;
    // this.token = 'e9088e251ceb4338e3c4f7fe88bdc40576d9b800bd11c9293c0a061b373b4829334ecadd13e257ff8e31290f983dbe3695856364eaa5c58a26c0e01afcdb15b9724db30970506be288e77036795eeba0';
    this.token = '';
    this.time = '';
    this.userInfo = {}
  }

  @action.bound updateStatus(status) {
    this.status = status;
  }
  @action.bound updateRole(role) {
    this.role = role;
  }
  @action.bound updateToken(token) {
    this.token = token;
  }
  @action.bound updateTime(time) {
    this.time = time;
  }
  @action.bound updateUserInfo(userInfo) {
    this.userInfo = Object.assign({}, userInfo);
  }
}

const globalStore = new GlobalStore();

export { globalStore };