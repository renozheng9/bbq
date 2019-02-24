import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ToastAndroid
} from 'react-native';
import { Container, Header, Content, Text, Icon, Thumbnail, Form, Item, Label, Input } from 'native-base';
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
import { domain } from '../global/Global';
import { isNicknameAvailable } from '../util/Function';

const dirs = RNFetchBlob.fs.dirs;

@inject(["globalStore"])
@observer
export default class Info extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: this.props.globalStore.userInfo.nickname,
      signature: this.props.globalStore.userInfo.signature,
      avatar: `${domain}image/${this.props.globalStore.userInfo.avatar}-50-100.png`,
      background: `${domain}image/${this.props.globalStore.userInfo.home_img}-50-100.png`,
      prompt: '',
      guid_avatar: this.props.globalStore.userInfo.avatar,
      guid_background: this.props.globalStore.userInfo.home_img
    }
  }

  componentDidMount() {
  }

  selectAvatar = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      showCropGuidelines: false,
      includeBase64: true
    }).then(image => {
      ToastAndroid.show('正在上传头像',ToastAndroid.SHORT);
      axios({
        url: api_accessToken,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
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
            avatar: `data:${image.mime};base64,${image.data}`,
            guid_avatar: JSON.parse(res.data).message
          });
          ToastAndroid.show('上传头像成功!', ToastAndroid.SHORT);
        }).catch(err => console.log(err))
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  selectBackground = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 280,
      cropping: true,
      cropperCircleOverlay: false,
      showCropGuidelines: false,
      includeBase64: true
    }).then(image => {
      ToastAndroid.show('正在上传背景',ToastAndroid.SHORT);
      axios({
        url: api_accessToken,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
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
        ]).then(res => {
          this.setState({
            background: `data:${image.mime};base64,${image.data}`,
            guid_background: JSON.parse(res.data).message
          });
          ToastAndroid.show('上传背景成功!', ToastAndroid.SHORT);
        }).catch(err => console.log(err))
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  checkNickname = () => {
    if(isNicknameAvailable(this.state.nickname)) {
      axios({
        url: api_check_nickname + this.props.globalStore.userInfo.id + '?nickname=' + this.state.nickname,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
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
      }).catch(err => console.log(err));
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
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: `nickname=${this.state.nickname}&signature=${this.state.signature}&avatar=${this.state.guid_avatar}&home_img=${this.state.guid_background}`
    }).then(res => {
      if(res.data.status) {
        ToastAndroid.show('修改个人资料成功!', ToastAndroid.SHORT);
        let userInfo = this.props.globalStore.userInfo;
        userInfo.nickname = this.state.nickname;
        userInfo.signature = this.state.signature;
        userInfo.avatar = this.state.guid_avatar;
        userInfo.home_img = this.state.guid_background;
        DeviceStorage.saveJsonObject('userInfo', userInfo).then(data => {
        }).catch(err => console.log(err));
      }
    }).catch(err => console.log(err));
  }

  updateNickname = (text) => {
    this.setState({nickname: text});
  }

  updateSignature = (text) => {
    this.setState({signature: text});
  }

  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <TouchableWithoutFeedback onPress={() => Actions.pop()}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>编辑个人资料</Text>
          <TouchableWithoutFeedback onPress={this.save}>
            <Text style={styles.saveText}>保存</Text>
          </TouchableWithoutFeedback>
        </Header>
        <Content style={styles.content}>
          <View style={styles.wrapper}>
            <Form>
              <Item inlineLabel>
                <Label style={styles.labelText}>新昵称</Label>
                <Input style={styles.inputText} maxLength={15} onEndEditing={this.checkNickname} defaultValue={this.props.globalStore.userInfo.nickname} onChangeText={this.updateNickname} />
                <Text style={styles.promptText}>{this.state.prompt}</Text>
              </Item>
              <Item inlineLabel last>
                <Label style={styles.labelText}>新签名</Label>
                <Input style={styles.inputText} maxLength={50} defaultValue={this.props.globalStore.userInfo.signature} onChangeText={this.updateSignature} />
              </Item>
            </Form>
          </View>
          <TouchableNativeFeedback onPress={this.selectAvatar}>
            <View style={styles.selectWrapper}>
              <Text style={styles.labelText}>头像</Text>
              <Thumbnail source={this.state.guid_avatar ? {uri: `${domain}image/${this.state.guid_avatar}-50-100.png`} : require('../images/avatar.png')} style={styles.avatar} />
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback onPress={this.selectBackground}>
            <View style={styles.selectWrapper}>
              <Text style={styles.labelText}>背景</Text>
              <Thumbnail square source={this.state.guid_background ? {uri: `${domain}image/${this.state.guid_background}-50-100.png`} : require('../images/theme.png')} style={styles.background} />
            </View>
          </TouchableNativeFeedback>
          <Text style={styles.rule}>昵称只能由汉字,字母,数字,下划线,破折号组成,且昵称不超过15个字,签名不超过50个字</Text>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  title: {
    fontSize: FontSize(16),
    color: '#fff',
    fontWeight: 'bold'
  },
  backIcon: {
    fontSize: FontSize(30),
    color: '#fff'
  },
  saveText: {
    fontSize: FontSize(14),
    color: '#fff',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#EBEBEB'
  },
  wrapper: {
    backgroundColor: '#fff'
  },
  labelText: {
    fontSize: FontSize(14),
    color: '#666666'
  },
  inputText: {
    fontSize: FontSize(14)
  },
  promptText: {
    paddingRight: 10,
    fontSize: FontSize(14),
    color: '#FE5952'
  },
  selectWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginTop: 20
  },
  rule: {
    color: '#888888',
    fontSize: FontSize(12),
    margin: 14
  },
  avatar: {
    width: width*0.06,
    height: width*0.06
  },
  background: {
    width: width*0.06,
    height: width*0.06,
    borderRadius: 5
  }
})