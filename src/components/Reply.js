import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  FlatList,
  ToastAndroid,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { api_comment_save, api_article_comment, api_accessToken } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import ReplyItem from './ReplyItem';

const dirs = RNFetchBlob.fs.dirs;

@inject(["globalStore"])
@observer
export default class Reply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reply: '', // 回复内容
      replyName: this.props.comment.user_nickname, // 要回复的用户昵称
      list: this.props.list, // 回复列表
      img: '', // 发布评论的图片
      guid_img: '', // 发布评论的图片的guid
      modalVisible: false, // 模态框是否显示
      parent_id: this.props.comment.article_comment_id // 父评论id
    }
  }

  componentDidMount() {
    
  }

  selectImg = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: false,
      showCropGuidelines: false,
      includeBase64: true
    }).then(image => {
      ToastAndroid.show('正在上传图片',ToastAndroid.SHORT);
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
          let guid_img = [];
          guid_img.push(JSON.parse(res.data).message);
          this.setState({
            img: {uri: `data:${image.mime};base64,${image.data}`},
            guid_img: guid_img
          });
          ToastAndroid.show('上传图片成功!', ToastAndroid.SHORT);
        }).catch((err) => console.log(err))
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  replyComment = (item) => {
    this.setState({
      replyName: item.user_nickname,
      parent_id: item.article_comment_id
    })
  }

  send = () => {
    if(this.state.reply == '' && this.state.guid_img == '') {
      ToastAndroid.show('评论和图片不能同时为空!', ToastAndroid.SHORT);
    } else {
      axios({
        url: api_comment_save,
        method: 'POST',
        headers: {
          'sign': getSign(),
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
        },
        data: {
          'article_id': this.props.article_id,
          'parent_id': this.state.parent_id,
          'content': this.state.reply,
          'img': this.state.guid_img
        }
      }).then(res => {
        if(res.data.status) {
          axios({ // 重新获取评论更新列表
            url: api_article_comment,
            method: 'GET',
            headers: {
              'sign': getSign(),
              'app-type': Platform.OS,
              'did': imei,
              'access-user-token': this.props.globalStore.token
            },
            params: {
              'id': this.props.article_id
            }
          }).then(res => {
            for(let i = 0; i < res.data.data.length; i++) {
              if(res.data.data[i].article_comment_id == this.props.comment.article_comment_id) {
                let item = Object.assign({}, res.data.data[i]);
                let list = [];
                findSon = (obj, list) => {
                  if(obj.hasOwnProperty('son')) {
                    for(let i = 0; i < obj.son.length; i++) {
                      obj.son[i].parent_nickname = obj.user_nickname;
                      list.push(obj.son[i]);
                      findSon(obj.son[i], list);
                    }
                  }
                }
                findSon(item, list);
                list.sort((a,b) => {
                  return a.create_time < b.create_time ? 1 : -1;
                });
                this.setState({
                  list: list
                });
                this.props.pushList(list[0]);
              }
            }
          }).catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#EBEBEB'}}>
        <View style={{backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10}}>
          <TouchableWithoutFeedback onPress={this.props.close}>
            <Icon name="md-close" style={{fontSize: FontSize(20), color: '#666666', marginRight: 10}} />
          </TouchableWithoutFeedback>
          <Text style={{fontSize: FontSize(16), color: '#666666'}}>查看{this.props.list.length}条回复</Text>
        </View>
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
            data={this.state.list}
            keyExtractor={(item, index) => item.user_nickname.toString()}
            renderItem={({item, separators}) => 
              <ReplyItem item={item} reply={this.replyComment} />
            }
            style={{marginBottom: 110}}
          />
        </View>
        <View style={{position: 'absolute', bottom: 0, width: width, height: 55, backgroundColor: '#53BFA2', flexDirection: 'row', alignItems: 'center', paddingLeft: 5, paddingRight: 5}}>
          <TouchableWithoutFeedback onPress={this.selectImg}>
            <Thumbnail square small source={this.state.img || require('../images/picture.png')} />
          </TouchableWithoutFeedback>
          <View style={{flex: 1, padding: 10}}>
            <Input autoFocus={true} style={{backgroundColor: '#fff', borderRadius: 5, fontSize: FontSize(12), padding: 2}} onChangeText={(text) => {this.setState({reply: text})}} placeholder={'回复: ' + this.state.replyName} />
          </View>
          <TouchableWithoutFeedback onPress={this.send}>
            <Icon name="md-send" style={{fontSize: FontSize(30), color: '#fff'}} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
})