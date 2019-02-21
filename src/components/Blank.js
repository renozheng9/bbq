import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  ViewPagerAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  Text,
  Picker
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import axios from 'axios';
import { observer, inject } from 'mobx-react';
import { getSign, imei } from '../global/Param';
import { domain } from '../global/Global';
import DownloadImg from '../util/DownloadImg';
import DeviceStorage from '../util/DeviceStorage';
import RNFetchBlob from 'rn-fetch-blob';

const dirs = RNFetchBlob.fs.dirs;
@inject(["blankStore"])
@observer
export default class Blank extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.blankStore;
    this.state = {
      sign: '',
      imei: '',
      info: '',
      selected: 'key1'
    }
  }
  componentDidMount() {
  }
  onValueChange(value) {
    this.setState({
      selected: value
    });
  }
  render() {
    return (
      <ViewPagerAndroid style={{flex: 1}} initialPage={0}>
      <View style={{padding: 10, backgroundColor: '#fff'}} key="1">
        <Text>weqe</Text>
      </View>
      <View style={{padding: 10, backgroundColor: '#fff'}} key="2">
        <Text>rewew</Text>
      </View>
    </ViewPagerAndroid>
    );
  }
}
const styles = StyleSheet.create({
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80,
    backgroundColor: '#53BFA2'
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  sign: {
    fontSize: 13,
    color: '#fff'
  },
  avatar: {
    width: 30,
    height: 30
  },
  wrapper: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#676767'
  },
  star: {
    marginTop: 15,
    paddingLeft: 25,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  setting: {
    marginTop: 15,
    paddingLeft: 25,
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  settingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#676767'
  },
})