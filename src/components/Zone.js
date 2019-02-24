import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  FlatList,
  StatusBar,
  ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';
import { FontSize } from '../util/FontSize';
import { getSign, imei } from '../global/Param';
import { Encrypt, Decrypt } from '../util/Encrypt';
import axios from 'axios';
import DeviceStorage from '../util/DeviceStorage';
import { width } from '../util/AdapterUtil';
import { api_user_beattention, api_attention_user, api_article_user, api_user_attention_count, api_user_beattention_count, api_subscription_theme_count } from '../global/Api';
import TrendItem from './TrendItem';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class Zone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 用户发布的动态
      isAttention: false, // 是否关注该用户
      like: '', // 该用户动态获赞总数量
      subscription: '', // 该用户关注的主题数量
      attention: '', // 该用户关注的用户数量
      fans: '' // 该用户被用户关注的数量
    }
  }
  
  componentDidMount() {
    axios({ // 获取用户发布的动态
      url: api_article_user,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.user.user_id
      }
    }).then(res => {
      let like = 0;
      for(let i = 0; i < res.data.data.length; i++) {
        like = like + res.data.data[i].likes;
      }
      this.setState({
        like: like,
        list: res.data.data
      })
    }).catch(err => console.log(err));
    axios({ // 获取用户关注主题的数量
      url: api_subscription_theme_count,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.user.user_id
      }
    }).then(res => {
      this.setState({
        subscription: res.data.data.count
      })
    }).catch(err => console.log(err));
    axios({ // 获取用户关注其他用户的数量
      url: api_user_attention_count,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.user.user_id
      }
    }).then(res => {
      this.setState({
        attention: res.data.data.count
      })
    }).catch(err => console.log(err));
    axios({ // 获取用户被其他用户关注的数量
      url: api_user_beattention_count,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.user.user_id
      }
    }).then(res => {
      this.setState({
        fans: res.data.data.count
      })
    }).catch(err => console.log(err));
    if(this.props.user.user_id != this.props.globalStore.userInfo.id) { // 判断是否进入本用户个人主页
      axios({ // 若进入的不是本用户个人主页,获取是否关注该用户
        url: api_user_beattention + this.props.user.user_id,
        method: 'GET',
        headers: {
          'sign': getSign(),
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
        }
      }).then(res => {
        if(res.data.data.isAttention) {
          this.setState({
            isAttention: 1
          })
        }
      }).catch(err => console.log(err));
    }
  }

  attend = () => {
    axios({
      url: api_attention_user,
      method: this.state.isAttention ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.props.user.user_id
      }
    }).then(res => {
      if(res.data.status) {
        this.setState({
          isAttention: !this.state.isAttention
        })
      }
    }).catch(err => console.log(err));
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={true} backgroundColor="transparent" />
        <Header
          androidStatusBarColor={'transparent'}
          style={{height: width*0.55, backgroundColor: '#fff', paddingLeft: 0, paddingRight: 0}}
        >
        <ImageBackground blurRadius={this.props.user.user_avatar ? 5 : 0} source={this.props.user.user_avatar ? {uri: `${domain}image/${this.props.user.user_avatar}-500-100.png`} : require('../images/theme.png')} imageStyle={{height: width*0.35, resizeMode: 'cover'}} style={{height: width*0.55, width: width, alignItems: 'flex-start'}}>
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginTop: width*0.05, marginLeft: width*0.02, marginBottom: width*0.12}} />
          </TouchableWithoutFeedback>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: width, paddingRight: width*0.03, paddingLeft: width*0.03}}>
            <Thumbnail source={this.props.user.user_avatar ? {uri: `${domain}image/${this.props.user.user_avatar}-100-100.png`} : require('../images/avatar.png')} style={{width: width*0.16, height: width*0.16, borderRadius: width*0.08}} />
            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 10}}>
              <Text style={{fontSize: FontSize(16), color: '#fff', marginBottom: 2}}>{this.props.user.user_nickname}</Text>
              <Text style={{fontSize: FontSize(13), color: '#404040'}}>{this.props.user.user_signature}</Text>
            </View>
            <View style={{position: 'absolute', right: width*0.02}}>
              <TouchableWithoutFeedback onPress={this.attend}>
                <View style={{backgroundColor: '#53BFA2', borderRadius: 4, padding: 3, alignItems: 'center', display: this.props.user.user_id == this.props.globalStore.userInfo.id ? 'none' : 'flex'}}>
                  <Text style={{fontSize: FontSize(12), color: '#fff'}}>{this.state.isAttention ? '已关注' : '+  关注'}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: width, paddingLeft: width*0.02, paddingRight: width*0.02, paddingTop: width*0.02}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: FontSize(13), color: '#404040', fontWeight: 'bold'}}>{this.state.like}</Text>
              <Text style={{fontSize: FontSize(11), color: '#404040'}}>获赞</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {Actions.push('attendTheme', {'userID': this.props.user.user_id, 'nickname': this.props.user.user_nickname})}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: FontSize(13), color: '#404040', fontWeight: 'bold'}}>{this.state.subscription}</Text>
                <Text style={{fontSize: FontSize(11), color: '#404040'}}>订阅</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {Actions.push('attendUser', {'userID': this.props.user.user_id, 'nickname': this.props.user.user_nickname})}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: FontSize(13), color: '#404040', fontWeight: 'bold'}}>{this.state.attention}</Text>
                <Text style={{fontSize: FontSize(11), color: '#404040'}}>关注</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {Actions.push('fans', {'userID': this.props.user.user_id, 'nickname': this.props.user.user_nickname})}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: FontSize(13), color: '#404040', fontWeight: 'bold'}}>{this.state.fans}</Text>
                <Text style={{fontSize: FontSize(11), color: '#404040'}}>粉丝</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ImageBackground>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB', paddingTop: 10}}>
          <View style={{flex: 1, paddingBottom: 10, backgroundColor: '#fff'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{height: 1, backgroundColor: '#AEAEAE'}}></View>)}}
              data={this.state.list}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) =>
                <TrendItem item={{...item, 'type': 'user'}} />
              }
            />
          </View>
        </Content>
      </Container>
    )
  }
}
const styles = StyleSheet.create({

})