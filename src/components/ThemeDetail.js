import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Image,
  Alert,
  FlatList,
  StatusBar,
  ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Toast } from 'native-base';
import { observer, inject } from 'mobx-react';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_theme_beattention_count, api_theme_beattention, api_attention_theme, api_theme_article } from '../global/Api';
import ThemeDetailItem from './ThemeDetailItem';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class ThemeDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 动态列表
      count: '', // 该主题被关注数量
      isAttention: false // 该主题是否被关注
    }
  }

  componentDidMount() {
    axios({ // 获取该主题下动态
      url: api_theme_article,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei
      },
      params: {
        'theme_id': this.props.theme.theme_id
      }
    }).then(res => {
      this.setState({
        list: [...res.data.data]
      })
    }).catch(err => console.log(err));
    axios({ // 获取该主题被关注的数量
      url: api_theme_beattention_count,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei
      },
      params: {
        'id': this.props.theme.theme_id
      }
    }).then(res => {
      this.setState({
        count: res.data.data.count
      })
    }).catch(err => console.log(err));
    axios({ // 获取本用户是否关注该主题
      url: api_theme_beattention + this.props.theme.theme_id,
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

  attend = () => { // 关注
    axios({
      url: api_attention_theme,
      method: this.state.isAttention ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.props.theme.theme_id
      }
    }).then(res => {
      if(res.data.status) {
        let count = this.state.count;
        if(this.state.isAttention) { // 同步该主题被关注数
          count--;
        } else {
          count++;
        }
        this.setState({
          isAttention: !this.state.isAttention,
          count: count
        })
      }
    }).catch(err => console.log(err));
  }

  deleteArticle = (article_id) => {
    let list = this.state.list;
    for(let i = 0; i < list.length; i++) {
      if(list[i].article_id == article_id) {
        list.splice(i, 1);
        this.setState({
          list: list
        });
        break;
      }
    }
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={true} backgroundColor="transparent" />
        <Header
          androidStatusBarColor={'transparent'}
          style={{height: width*0.6, justifyContent:'flex-start', backgroundColor: '#fff', paddingLeft: 0, paddingRight: 0}}
        >
        <ImageBackground blurRadius={5} source={this.props.theme.theme_img ? {uri: `${domain}image/${this.props.theme.theme_img}-500-100.png`} : require('../images/logo.jpg')} imageStyle={{height: width*0.35, resizeMode: 'cover'}} style={{height: width*0.6, width: width, alignItems: 'center'}}>
          <View style={{width: width, alignItems: 'flex-start', marginBottom: width*0.12}}>
            <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
              <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginTop: width*0.05, marginLeft: width*0.02}} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: width, paddingRight: width*0.03}}>
            <Text style={{fontSize: FontSize(12), color: '#fff', marginRight: width*0.05}}>{this.state.count}人关注</Text>
            <TouchableWithoutFeedback onPress={this.attend}>
              <View style={{backgroundColor: '#53BFA2', borderRadius: 4, padding: 3}}>
                <Text style={{fontSize: FontSize(12), color: '#fff'}}>{this.state.isAttention ? '已关注' : '+  关注'}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Thumbnail square source={this.props.theme.theme_img ? {uri: `${domain}image/${this.props.theme.theme_img}-100-100.png`} : require('../images/logo.jpg')} style={{width: width*0.15, height: width*0.15, borderRadius: 5, position: 'absolute', top: width*0.23}} />
          <View style={{alignItems: 'center', paddingTop: width*0.07, paddingLeft: width*0.02, paddingRight: width*0.02}}>
            <Text style={{fontSize: FontSize(14), color: '#404040', fontWeight: 'bold'}}>{this.props.theme.theme_name}</Text>
            <Text style={{fontSize: FontSize(12), color: '#666666'}}>简介: {this.props.theme.theme_introduction ? this.props.theme.theme_introduction : '该主题很懒，什么都没有留下。'}</Text>
            {/* <View style={{flexDirection: 'row', width: width, justifyContent: 'center', paddingTop: width*0.06}}>
              <View style={{width: width*0.4, alignItems: 'center'}}><Text style={{fontSize: FontSize(12), color: '#53BFA2'}}>热门</Text></View>
              <View style={{width: width*0.4, alignItems: 'center'}}><Text style={{fontSize: FontSize(12)}}>最新</Text></View>
            </View> */}
          </View>
        </ImageBackground>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB', paddingTop: 10}}>
          <View style={{flex: 1, paddingTop: 10, backgroundColor: '#fff'}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.list}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <ThemeDetailItem item={item} page="themeDetail" delete={this.deleteArticle} />
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