/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
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
import { api_user_read, api_index_init } from './global/Api';
import axios from 'axios';
import { getSign, imei } from './global/Param';
import AttendTheme from './components/AttendTheme';
import AttendUser from './components/AttendUser';
import Collection from './components/Collection';
import Fans from './components/Fans';
import Message from './components/Message';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';

@inject(["globalStore"])
export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.globalStore;
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.requestReadPhoneStatePermission = this.requestReadPhoneStatePermission.bind(this);
    this.requestReadExternalStoragePermission = this.requestReadExternalStoragePermission.bind(this);
    this.requestWriteExternalStoragePermission = this.requestWriteExternalStoragePermission.bind(this);
  }
  componentDidMount() {
    DeviceStorage.getString('status', '0').then(data => {this.store.updateStatus(data)});
    DeviceStorage.getString('role', '0').then(data => {this.store.updateRole(data)});
    DeviceStorage.getString('token', '').then(data => {this.store.updateToken('9ce8d2f7dde4173837b1cd682c3a7ee97dcfda350551132530e065ae047f5af70141d5fc7c6b583cc7fbaaaac285f7c647b3da3080643e995c8672ac640e7b8eb4475e4b9e45d88231d5a0c98b7bfd13')});
    // DeviceStorage.getString('token', '').then(data => {this.store.updateToken(data)});
    DeviceStorage.getString('time', '').then(data => {this.store.updateTime(data)});
    DeviceStorage.getJsonObject('userInfo', {}).then(data => {
      if(JSON.stringify(data) == '{}' && this.props.globalStore.token) {
        axios({
          url: api_user_read,
          method: 'GET',
          headers: {
            'sign': getSign(),
            'app-type': Platform.OS,
            'did': imei,
            'access-user-token': this.props.globalStore.token
          }
        }).then(res => {
          let info = Decrypt(res.data.data);
          DeviceStorage.saveJsonObject('userInfo', JSON.parse(info)).then(data => {
          }).catch(err => console.log(err));
          this.props.globalStore.updateUserInfo(JSON.parse(info));
        }).catch(err => console.log(err));
      } else {
        this.props.globalStore.updateUserInfo(data);
      }
    });
    SplashScreen.hide();
    // CodePush.sync({
    //   updateDialog: {
    //     appendReleaseDescription: true,
    //     descriptionPrefix: '\n更新内容:\n',
    //     title: '更新',
    //     mandatoryUpdateMessage: '',
    //     mandatoryContinueButtonLabel: '更新',
    //     optionalIgnoreButtonLabel: '稍后',
    //     optionalInstallButtonLabel: '更新',
    //     optionalUpdateMessage: ''
    //   },
    //   mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
    //   deploymentKey: '4w0lpUwfTqjcr6uyKGV8jMk6DZrZa069ed48-ff3d-460a-9845-23f4d00b19c4',
    // }, (status) => {
    //   switch(status) {
    //     case CodePush.SyncStatus.UP_TO_DATE: ToastAndroid.show('已更新至最新版本!', ToastAndroid.SHORT);break;
    //     case CodePush.SyncStatus.UNKNOWN_ERROR: ToastAndroid.show('更新失败!', ToastAndroid.SHORT);break;
    //   }
    // });
    axios({
      url: api_index_init,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'model': DeviceInfo.getModel(),
        'version': DeviceInfo.getBuildNumber(),
        'version-code': DeviceInfo.getVersion()
      }
    }).then(res => {
    }).catch(err => console.log(err));
    this.requestCameraPermission();
    this.requestReadPhoneStatePermission();
    this.requestReadExternalStoragePermission();
    this.requestWriteExternalStoragePermission();
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '权限申请',
          message: 'BBQ想获取相机权限',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('已获取相机权限');
      } else {
        console.log('申请相机权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '权限申请',
          message: 'BBQ想获取相机权限',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('已获取相机权限');
      } else {
        console.log('申请相机权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestReadPhoneStatePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: '权限申请',
          message: 'BBQ想获取手机状态',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('申请权限成功');
      } else {
        console.log('申请权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestReadPhoneStatePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        {
          title: '权限申请',
          message: 'BBQ想获取手机状态',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('申请权限成功');
      } else {
        console.log('申请权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestReadExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: '权限申请',
          message: 'BBQ想读取手机外存',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('申请权限成功');
      } else {
        console.log('申请权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async requestWriteExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '权限申请',
          message: 'BBQ想写入手机外存',
          buttonNeutral: '稍后询问',
          buttonNegative: '取消',
          buttonPositive: '允许',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('申请权限成功');
      } else {
        console.log('申请权限失败');
      }
    } catch (err) {
      console.warn(err);
    }
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
            <Scene key="attendTheme" component={AttendTheme} title="用户关注的主题" hideNavBar />
            <Scene key="attendUser" component={AttendUser} title="用户关注的用户" hideNavBar />
            <Scene key="fans" component={Fans} title="用户的粉丝" hideNavBar />
            <Scene key="collection" component={Collection} title="我的收藏" hideNavBar />
            <Scene key="message" component={Message} title="我的消息" hideNavBar />
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
            <Scene key="message" component={Message} title="我的消息" hideNavBar />
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
