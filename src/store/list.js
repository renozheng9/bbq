import { observable, action } from 'mobx';
import { globalStore } from './global';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_article_recommend, api_theme_article, api_isUpvote } from '../global/Api';

class ListStore {
  @observable themeID; // 主题ID
  @observable recommend; // 首页列表数据集
  @observable singleTheme; // 单个主题列表数据集

  constructor() {
    this.themeID = '';
    this.recommend = [];
    this.singleTheme = [];
  }

  @action.bound updateThemeID(themeID) {
    this.themeID = themeID;
  }
  @action.bound getRecommend(offset) { // 获取首页列表数据集，每次获取30条，offset为偏移值
    axios({
      url: api_article_recommend,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      },
      param: {
        'offset': offset
      }
    }).then(response => {
      let arr = [];
      let res = [...response.data.data.admin_recommend, ...response.data.data.most_like];
      res.map((item, index) => {
        arr.push(item.article_id);
      });
      axios({
        url: api_isUpvote,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': globalStore.token
        },
        params: {
          'id': arr
        }
      }).then(response => {
        let obj = {};
        for(let i of res) {
          i['isUpvote'] = response.data.data.indexOf(i.article_id) > -1 ? 1 : 0;
          obj[i.article_id] = i;
        }
        this.recommend = {...obj};
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {console.log(error)});
  }
  @action.bound getSingleTheme() { // 获取单个主题列表数据集
    axios({
      url: api_theme_article + this.themeID,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      }
    }).then(response => {
      let arr = [];
      let res = [...response.data.data];
      res.map((item, index) => {
        arr.push(item.article_id);
      });
      axios({
        url: api_isUpvote,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': globalStore.token
        },
        params: {
          'id': arr
        }
      }).then(response => {
        let obj = {};
        for(let i of res) {
          i['isUpvote'] = response.data.data.indexOf(i.article_id) > -1 ? 1 : 0;
          obj[i.article_id] = i;
        }
        this.singleTheme= {...obj};
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {console.log(error)});
  }
  @action.bound upvote(articleID, type) { // 点赞(更新点赞数),type为1代表取消点赞，为0代表点赞
    let recommend = this.recommend;
    let singleTheme = this.singleTheme;
    if(recommend.hasOwnProperty(articleID)) { // 判断点赞操作的该条动态是否在首页列表数据集中
      if(type) {
        recommend[articleID].likes--;
        recommend[articleID].isUpvote--;
      } else {
        recommend[articleID].likes++;
        recommend[articleID].isUpvote++;
      }
    }
    if(singleTheme.hasOwnProperty(articleID)) { // 判断点赞操作的该条动态是否在单个主题列表数据集中
      if(type) {
        singleTheme[articleID].likes--;
        singleTheme[articleID].isUpvote--;
      } else {
        singleTheme[articleID].likes++;
        singleTheme[articleID].isUpvote++;
      }
    }
    this.recommend = {...recommend};
    this.singleTheme = {...singleTheme};
  }
}

const listStore = new ListStore();

export { listStore };