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
  Modal,
  ToastAndroid
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-crop-picker';
import { observer, inject } from 'mobx-react';
import { api_user_update, api_check_nickname, api_accessToken } from '../global/Api';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { getSign, imei } from '../global/Param';
import RNFetchBlob from 'rn-fetch-blob';

const dirs = RNFetchBlob.fs.dirs;

@inject(["globalStore"])
@observer
export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      signature: '',
      avatar: '',
      background: '',
      prompt: '',
      guid_avatar: '',
      guid_background: ''
    }
  }

  componentDidMount() {
  }

  selectAvatar = () => {
    ImagePicker.openPicker({
      width: 50,
      height: 50,
      cropping: true,
      cropperCircleOverlay: true,
      showCropGuidelines: false,
      includeBase64: true
    }).then(image => {
      axios({
        url: api_accessToken,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        }
      }).then(res => {
        let access_token = res.data.data.access_token;
        let nonce = res.data.data.nonce;
        let filename = image.path.split('react-native-image-crop-picker/')[1];
        let format = filename.split('.')[1];
        let upload_url = 'https://static-img-bbq.wutnews.net/upload/' + access_token + '-' + nonce + '.' + format;
        RNFetchBlob.fetch('POST', upload_url, {
          Authorization: 'Bearer access-token...',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data'
        }, [
          {name: 'image', filename: filename, type: image.mime + format, data: image.data}
        ]).then((res) => {
          this.setState({
            avatar: {uri: `data:${image.mime};base64,${image.data}`},
            guid_avatar: JSON.parse(res.data).message
          });
          ToastAndroid.show('上传头像成功!', ToastAndroid.SHORT);
        }).catch((err) => {console.log(err)})
      }).catch(err => {console.log(err)});
    }).catch(err => {console.log(err)});
  }

  selectBackground = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 140,
      cropping: true,
      cropperCircleOverlay: false,
      showCropGuidelines: false,
      includeBase64: true
    }).then(image => {
      axios({
        url: api_accessToken,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        }
      }).then(res => {
        let access_token = res.data.data.access_token;
        let nonce = res.data.data.nonce;
        let filename = image.path.split('react-native-image-crop-picker/')[1];
        let format = filename.split('.')[1];
        let upload_url = 'https://static-img-bbq.wutnews.net/upload/' + access_token + '-' + nonce + '.' + format;
        RNFetchBlob.fetch('POST', upload_url, {
          Authorization: 'Bearer access-token...',
          otherHeader: 'foo',
          'Content-Type': 'multipart/form-data'
        }, [
          {name: 'image', filename: filename, type: image.mime + format, data: image.data}
        ]).then((res) => {
          this.setState({
            background: {uri: `data:${image.mime};base64,${image.data}`},
            guid_background: JSON.parse(res.data).message
          });
          ToastAndroid.show('上传背景成功!', ToastAndroid.SHORT);
        }).catch((err) => {console.log(err)})
      }).catch(err => {console.log(err)});
    }).catch(err => {console.log(err)});
  }

  checkNickname = () => {
    if(isNicknameAvailable(this.state.nickname)) {
      axios({
        url: api_check_nickname + this.props.globalStore.userInfo.id + '?nickname=' + this.state.nickname,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        }
      }).then(res => {
        if(res.data.status == 1) {
          this.setState({
            prompt: ''
          })
        } else {
          this.setState({
            prompt: '昵称已存在!'
          })
        }
      }).catch(err => {console.log(err)});
    } else {
      this.setState({
        prompt: '昵称不合法!'
      })
    }
  }

  save = () => {
    axios({
      url: api_user_update + this.props.globalStore.userInfo.id,
      method: 'PUT',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      data: {
        nickname: this.state.nickname,
        signature: this.state.signature,
        avatar: this.state.guid_avatar,
        background: this.state.guid_background
      }
    }).then(res => {
      if(res.data.status) {
        ToastAndroid.show('修改个人资料成功!', ToastAndroid.SHORT);
      }
    }).catch(err => {console.log(err)});
  }

  isNicknameAvailable = (nickname) => {
    var myreg=/^[\u4e00-\u9fa50-9a-zA-Z_-]+$/;
    if (!myreg.test(nickname.val())) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff'}} />
          </TouchableWithoutFeedback>
          <Text style={{fontSize: FontSize(16), color: '#fff', fontWeight: 'bold'}}>编辑个人资料</Text>
          <TouchableWithoutFeedback onPress={this.save}>
            <Text style={{fontSize: FontSize(14), color: '#fff', fontWeight: 'bold'}}>保存</Text>
          </TouchableWithoutFeedback>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View style={{backgroundColor: '#fff'}}>
            <Form>
              <Item inlineLabel>
                <Label style={{fontSize: FontSize(14), color: '#666666'}}>新昵称</Label>
                <Input style={{fontSize: FontSize(14)}} onEndEditing={this.checkNickname} onChangeText={(text) => {this.setState({nickname: text})}} />
                <Text style={{paddingRight: 10, fontSize: FontSize(14), color: '#FE5952'}}>{this.state.prompt}</Text>
              </Item>
              <Item inlineLabel last>
                <Label style={{fontSize: FontSize(14), color: '#666666'}}>新签名</Label>
                <Input style={{fontSize: FontSize(14)}} onChangeText={(text) => {this.setState({signature: text})}} />
              </Item>
            </Form>
          </View>
          <TouchableNativeFeedback onPress={this.selectAvatar}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 14, marginTop: 20}}>
              <Text style={{fontSize: FontSize(14), color: '#666666'}}>头像</Text>
              <Thumbnail source={this.state.avatar || require('../images/avatar.png')} style={{width: width*0.06, height: width*0.06}} />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.selectBackground}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 14, marginTop: 20}}>
              <Text style={{fontSize: FontSize(14), color: '#666666'}}>背景</Text>
              <Thumbnail square source={this.state.background || require('../images/person.png')} style={{width: width*0.06, height: width*0.06, borderRadius: 5}} />
            </View>
          </TouchableNativeFeedback>
          <View style={{padding: 14}}>
            <Text style={{color: '#888888', fontSize: FontSize(12)}}>昵称只能由汉字,字母,数字,下划线,破折号组成</Text>
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({

})