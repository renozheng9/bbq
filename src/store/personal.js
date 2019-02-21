import { observable, action } from 'mobx';
import { globalStore } from './global';
import { getSign, imei } from '../global/Param';
import { Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { api_user_read } from '../global/Api';

class PersonalStore {
  @observable userInfo;

  constructor() {
    this.userInfo = {
      nickname: '',
      signature: ''
    };
  }
  @action.bound getUserInfo() {
    DeviceStorage.getJsonObject('userInfo', {}).then(data => {
      if(JSON.stringify(data) == '{}') {
        axios({
          url: api_user_read,
          method: 'GET',
          headers: {
            'sign': getSign(),
            'app_type': 'android',
            'did': imei,
            'access_user_token': globalStore.token
          }
        }).then(res => {
          let info = Decrypt(res.data.data);
          DeviceStorage.saveJsonObject('userInfo', info).then(data => {
          }).catch(error => {console.log(error)});
          this.updateUserInfo(JSON.parse(info));
        }).catch(err => {console.log(err)});
      } else {
        DeviceStorage.getJsonObject('userInfo').then(data => {
          this.updateUserInfo(JSON.parse(data));
        }).catch(err => {console.log(err)});
      }
    })
  }
  @action.bound updateUserInfo(userInfo) {
    this.userInfo = Object.assign({}, userInfo);
  }
}

const personalStore = new PersonalStore();

export { personalStore };