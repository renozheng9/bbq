import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Image,
  Modal,
  FlatList,
  StatusBar,
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
import ThemeDetailItem from './ThemeDetailItem';
import CommentItem from './CommentItem';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';

const dirs = RNFetchBlob.fs.dirs;

@inject(["globalStore"])
@observer
export default class TrendDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 评论列表
      comment: '', // 评论内容
      img: '', // 发布评论的图片
      guid_img: '' // 发布评论的图片的guid
    }
  }

  componentDidMount() {
    axios({ // 获取评论
      url: api_article_comment,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.item.article_id
      }
    }).then(res => {
      res.data.data.sort((a,b)=>{
        return a.create_time < b.create_time ? 1 : -1;
      });
      this.setState({
        list: [...res.data.data]
      })
    }).catch(err => console.log(err));
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
        }).catch(err => console.log(err))
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }

  send = () => {
    if(this.state.comment == '' && this.state.guid_img == '') {
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
          'article_id': this.props.item.article_id,
          'parent_id': 0,
          'content': this.state.comment,
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
              'id': this.props.item.article_id
            }
          }).then(res => {
            res.data.data.sort((a,b)=>{
              return a.create_time < b.create_time ? 1 : -1;
            });
            this.setState({
              list: [...res.data.data]
            })
          }).catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
    }
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="transparent" />
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>动态详情</Text>
        </Header>
        <Content style={styles.content}>
          <View style={styles.themeDetail}>
            <ThemeDetailItem item={this.props.item} page="trendDetail" />
          </View>
          <View style={styles.commentWrapper}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.list}
              keyExtractor={(item, index) => item.user_nickname.toString()}
              renderItem={({item, separators}) => 
                <CommentItem item={item} article_id={this.props.item.article_id} />
              }
            />
          </View>
        </Content>
        <Footer>
          <View style={styles.footer}>
            <TouchableWithoutFeedback onPress={this.selectImg}>
              <Thumbnail square small source={this.state.img || require('../images/picture.png')} />
            </TouchableWithoutFeedback>
            <View style={styles.inputWrapper}>
              <Input style={styles.input} onChangeText={(text) => {this.setState({comment: text})}} />
            </View>
            <TouchableWithoutFeedback onPress={this.send}>
              <Icon name="md-send" style={styles.sendIcon} />
            </TouchableWithoutFeedback>
          </View>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  backIcon: {
    fontSize: FontSize(30),
    color: '#fff',
    marginRight: 10
  },
  title: {
    color: '#fff',
    fontSize: FontSize(16),
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#EBEBEB'
  },
  themeDetail: {
    backgroundColor: '#fff',
    marginBottom: 10
  },
  commentWrapper: {
    padding: 10,
    backgroundColor: '#fff'
  },
  footer: {
    backgroundColor: '#53BFA2',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5
  },
  inputWrapper: {
    flex: 1,
    padding: 10
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: FontSize(12),
    padding: 2
  },
  sendIcon: {
    fontSize: FontSize(30),
    color: '#fff'
  }
})