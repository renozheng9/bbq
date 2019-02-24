import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ToastAndroid
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import { Actions } from 'react-native-router-flux';
import { observer, inject } from 'mobx-react';
import { api_accessToken, api_feedback_type, api_feedback_submit, api_advice_read, api_id_article } from '../global/Api';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      article: {} // 相关动态数据集
    }
  }

  componentDidMount() {
    axios({ // 获取相关的该条动态
      url: api_id_article,
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
      if(res.data.status) {
        this.setState({
          article: Object.assign({}, res.data.data[0])
        })
      }
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Actions.push('trendDetail', {'item': this.state.article})}}>
        <View style={styles.wrapper}>
          <Thumbnail source={this.props.item.user_avatar ? {uri: `${domain}image/${this.props.item.user_avatar}-60-100.png`} : require('../images/avatar.png')} style={{width: width*0.1, height: width*0.1, marginRight: 5}} />
          <View style={{flex: 1, marginBottom: 2}}>
            <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.user_nickname}</Text>
              <Text style={{fontSize: FontSize(11), color: '#888888'}}>{this.props.item.create_time}</Text>
              <Text style={{fontSize: FontSize(12), color: '#666666', marginTop: 5}}>{this.props.item.comment_content}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#EBEBEB'}}>
              <Thumbnail square source={this.state.article.article_img ? {uri: `${domain}image/${this.state.article.article_img}-50-100.png`} : require('../images/theme.png')} style={{width: width*0.2, height: width*0.2, marginRight: 2, display: this.state.article.article_img ? 'flex': 'none'}} />
              <View style={{flex: 1, padding: 2}}>
                <Text numberOfLines={3} ellipsizeMode="tail" style={{fontSize: FontSize(12), color: '#666666'}}>{this.state.article.article_content}</Text>
                <Text style={{fontSize: FontSize(11), color: '#888888', position: 'absolute', bottom: 2, right: 2}}>{this.state.article.create_time}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    flex: 1
  }
})