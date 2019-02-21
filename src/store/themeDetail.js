import { observable, action } from 'mobx';
import { globalStore } from './global';
import { getSign, imei } from '../global/Param';
import { Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { api_theme_article } from '../global/Api';

class ThemeDetailStore {
  @observable themeDetailList;

  constructor() {
    this.themeDetailList = [];
  }

  @action.bound getData(themeID) {
    axios({
      url: api_theme_article,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      },
      params: {
        'theme_id': themeID
      }
    }).then(res => {
      this.themeDetailList = [...res.data.data];
    }).catch(err => {console.log(err)});
  }
}

const themeDetailStore = new ThemeDetailStore();

export { themeDetailStore };