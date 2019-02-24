import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ToastAndroid
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import { Actions } from 'react-native-router-flux';
import { observer, inject } from 'mobx-react';
import { api_accessToken, api_feedback_type, api_feedback_submit, api_advice_read } from '../global/Api';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import MessageItem from './MessageItem';

@inject(["globalStore"])
@observer
export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [] // 我的消息列表
    }
  }

  componentDidMount() {
    axios({ // 获取用户消息
      url: api_advice_read,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      }
    }).then(res => {
      let message = this.state.message;
      for(let i = 0; i < res.data.data.user_advices.length; i++) { // 为消息中的user_advices类型添加该类型type字段
        res.data.data.user_advices[i].type = 'user_advices';
        message.push(res.data.data.user_advices[i]);
      }
      for(let i = 0; i < res.data.data.comment_advices.length; i++) { // 为消息中的comment_advices类型提娜佳该类型type字段
        res.data.data.comment_advices[i].type = 'comment_advices';
        message.push(res.data.data.comment_advices[i]);
      }
      message.sort((a,b)=>{ // 按时间排序
        return a.create_time < b.create_time ? 1 : -1;
      });
      this.setState({
        message: [...message]
      })
    }).catch(err => console.log(err));
  }

  _renderSeparator = () => {
    return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)
  }

  _renderListItem = ({item, separators}) => {
    return (<MessageItem item={item} />)
  }

  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>我的消息</Text>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this._renderSeparator}
              data={this.state.message}
              keyExtractor={(item, index) => item.create_time.toString()}
              renderItem={this._renderListItem}
            />
          </View>
        </Content>
      </Container>
    );
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
    fontSize: FontSize(16),
    color: '#fff',
    fontWeight: 'bold'
  }
})