import { observable, action } from 'mobx';
import { globalStore } from './global';
import { getSign, imei } from '../global/Param';
import { Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { api_article_recommend, api_isUpvote } from '../global/Api';

class HomeStore {
  @observable recommendList;

  constructor() {
    this.recommendList = [];
  }

  @action.bound getData(offset) {
    axios({
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      },
      params: {
        'offset': offset
      }
    }).then(res => {
      this.recommendList = [...this.recommendList, ...res.data.data.admin_recommend, ...res.data.data.most_like];
    }).catch(err => {console.log(err)});
  }
}

const homeStore = new HomeStore();

export { homeStore };