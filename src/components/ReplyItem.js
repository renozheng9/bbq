import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { FontSize } from '../util/FontSize';
import{ width } from '../util/AdapterUtil';
import axios from 'axios';
import { api_upvote_comment } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class ReplyItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 回复列表
      modalVisible: false, // 模态框是否显示
      item: {...this.props.item, 'isUpvote': false} // 回复数据集
    }
  }

  componentDidMount() {
    axios({ // 获取是否点赞
      url: api_upvote_comment,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.item.article_comment_id
      }
    }).then(res => {
      if(res.data.data.length != 0) {
        let item = this.state.item;
        item.isUpvote = true;
        this.setState({
          item: item
        })
      }
    }).catch(err => console.log(err))
  }

  upvote = () => { // 点赞
    axios({
      url: api_upvote_comment,
      method: this.state.item.isUpvote ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.props.item.article_comment_id
      }
    }).then(res => {
      if(res.data.status) {
        let item = this.state.item;
        if(this.state.item.isUpvote) {
          item.isUpvote = false;
          item.likes--;
        } else {
          item.isUpvote = true;
          item.likes++;
        }
        DeviceEventEmitter.emit('updateComment', item);
        this.setState({
          item: item
        })
      }
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <View style={{flexDirection: 'row', padding: 10, backgroundColor: '#fff'}}>
        <Thumbnail source={this.props.item.user_avatar ? {uri: `${domain}image/${this.props.item.user_avatar}-50-100.png`} : require('../images/avatar.png')} style={{width: width*0.07, height: width*0.07, marginRight: 10}} />
        <View style={{flex: 1}}>
          <Text style={{fontSize: FontSize(13), color: '#666666', marginTop: 2, marginBottom: 5}}>{this.props.item.user_nickname} 回复 {this.props.item.parent_nickname}</Text>
          <Text style={{fontSize: FontSize(12), color: '#666666'}}>{this.props.item.article_comment_content}</Text>
          <Thumbnail square source={{uri: `${domain}image/${this.props.item.article_comment_img}-60-100.png`}} style={{width: width*0.2, height: width*0.2, marginTop: 10, display: this.props.item.article_comment_img ? 'flex' : 'none'}} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{fontSize: FontSize(12), color: '#888888'}}>{this.props.item.create_time}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableWithoutFeedback onPress={() => {this.props.reply(this.state.item)}}>
                <Icon name="md-text" style={{fontSize: FontSize(14), color: '#666666', marginRight: 20}} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.upvote}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: this.state.item.isUpvote ? '#53BFA2' : '#666666', marginRight: 5}} />
                  <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.item.likes}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
})