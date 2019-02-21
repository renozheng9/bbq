/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Root } from 'native-base';
import { Router, Stack, Scene, Tabs, Actions } from 'react-native-router-flux';
import Login from "./components/Login";
import Home from './components/Home';
import Search from './components/Search';
import Personal from './components/Personal';
import Trend from './components/Trend';
import TrendDetail from './components/TrendDetail';
import Info from './components/Info';
import Blank from './components/Blank';
import Edit from './components/Edit';
import Authentication from './components/Authentication';
import ThemeDetail from './components/ThemeDetail';
import Feedback from './components/Feedback';
import Zone from './components/Zone';
import { observer, inject } from 'mobx-react';
import SplashScreen from 'react-native-splash-screen';
import DeviceStorage from './util/DeviceStorage';
import { Decrypt, Encrypt } from './util/Encrypt';
import { api_user_read } from './global/Api';
import axios from 'axios';
import { getSign, imei } from './global/Param';
import AttendTheme from './components/AttendTheme';
import AttendUser from './components/AttendUser';
import Collection from './components/Collection';
import Fans from './components/Fans';

@inject(["globalStore"])
export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.globalStore;
  }
  componentDidMount() {
    DeviceStorage.getString('status', '0').then(data => {this.store.updateStatus(data)});
    DeviceStorage.getString('role', '0').then(data => {this.store.updateRole(data)});
    DeviceStorage.getString('token', '').then(data => {this.store.updateToken('e9088e251ceb4338e3c4f7fe88bdc40576d9b800bd11c9293c0a061b373b4829334ecadd13e257ff8e31290f983dbe3695856364eaa5c58a26c0e01afcdb15b9724db30970506be288e77036795eeba0')});
    DeviceStorage.getString('time', '').then(data => {this.store.updateTime(data)});
    DeviceStorage.getJsonObject('userInfo', {}).then(data => {
      if(JSON.stringify(data) == '{}') {
        axios({
          url: api_user_read,
          method: 'GET',
          headers: {
            'sign': getSign(),
            'app_type': 'android',
            'did': imei,
            'access_user_token': this.props.globalStore.token
          }
        }).then(res => {
          let info = Decrypt(res.data.data);
          DeviceStorage.saveJsonObject('userInfo', JSON.parse(info)).then(data => {
          }).catch(err => {console.log(err)});
          this.props.globalStore.updateUserInfo(JSON.parse(info));
        }).catch(err => {console.log(err)});
      } else {
        this.props.globalStore.updateUserInfo(data);
      }
    });
    SplashScreen.hide();
  }
  render() {
    if(this.store.status == 0) {
      return (
        <Root>
        <Router style={styles.container}>
          <Stack key="root">
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="authentication" component={Authentication} hideNavBar/>
            <Scene key="home" component={Home} title="主页" hideNavBar initial />
            <Scene key="trend" component={Trend} title="动态" hideNavBar />
            <Scene key="personal" component={Personal} title="我" hideNavBar />
            <Scene key="search" component={Search} title="搜索" hideNavBar />
            <Scene key="trendDetail" component={TrendDetail} title="动态详情" hideNavBar />
            <Scene key="info" component={Info} title="我的个人资料" hideNavBar />
            <Scene key="edit" component={Edit} title="发布动态" hideNavBar />
            <Scene key="themeDetail" component={ThemeDetail} title="主题详情" hideNavBar />
            <Scene key="zone" component={Zone} title="个人主页" hideNavBar />
            <Scene key="feedback" component={Feedback} title="反馈" hideNavBar />
            <Scene key="attendtheme" component={AttendTheme} title="用户关注的主题" hideNavBar />
            <Scene key="attenduser" component={AttendUser} title="用户关注的用户" hideNavBar />
            <Scene key="fans" component={Fans} title="用户的粉丝" hideNavBar />
            <Scene key="collection" component={Collection} title="我的收藏" hideNavBar />
            <Scene key="blank" component={Blank} title="空页" hideNavBar />
          </Stack>
        </Router>
        </Root>
      )
    } else {
      return (
        <Root>
        <Router style={styles.container}>
          <Stack key="root">
            <Scene key="login" component={Login} hideNavBar />
            <Scene key="authentication" component={Authentication} hideNavBar />
            <Scene key="home" component={Home} title="主页" hideNavBar  />
            <Scene key="trend" component={Trend} title="动态" hideNavBar />
            <Scene key="personal" component={Personal} title="我" hideNavBar />
            <Scene key="search" component={Search} title="搜索" hideNavBar />
            <Scene key="trendDetail" component={TrendDetail} title="动态详情" hideNavBar />
            <Scene key="info" component={Info} title="我的个人资料" hideNavBar initial />
            <Scene key="edit" component={Edit} title="发布动态" hideNavBar />
            <Scene key="themeDetail" component={ThemeDetail} title="主题详情" hideNavBar />
            <Scene key="zone" component={Zone} title="个人主页" hideNavBar />
            <Scene key="feedback" component={Feedback} title="反馈" hideNavBar />
            <Scene key="attendtheme" component={AttendTheme} title="用户关注的主题" hideNavBar />
            <Scene key="attenduser" component={AttendUser} title="用户关注的用户" hideNavBar />
            <Scene key="fans" component={Fans} title="用户的粉丝" hideNavBar />
            <Scene key="collection" component={Collection} title="我的收藏" hideNavBar />
            <Scene key="blank" component={Blank} title="空页" hideNavBar />
          </Stack>
        </Router>
        </Root>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
