import { observable, action } from 'mobx';
import { globalStore } from './global';
import { getSign, imei } from '../global/Param';
import { Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { api_search } from '../global/Api';

class SearchStore {
  @observable userList;
  @observable themeList;
  @observable articleList;

  constructor() {
    this.userList = [];
    this.themeList = [];
    this.articleList = [];
  }

  @action.bound getData(search_str) {
    axios({
      url: api_search,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      },
      params: {
        'search_str': search_str
      }
    }).then(res => {
      this.userList = [...res.data.data.users];
      this.themeList = [...res.data.data.themes];
      this.articleList = [...res.data.data.articles];
    }).catch(err => {console.log(err)});
  }
}

const searchStore = new SearchStore();

export { searchStore };