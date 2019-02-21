import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  ViewPagerAndroid
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { api_user_collection } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import HomeListitem from './HomeListitem';

@inject(["globalStore"])
@observer
export default class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [] // 收藏动态数据集
    }
  }

  componentDidMount() {
    axios({ // 获取用户收藏的动态
      url: api_user_collection,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      }
    }).then(res => {
      this.setState({
        collection: [...res.data.data]
      })
    }).catch(err => {console.log(err)});
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="transparent" />
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
              <Icon name="ios-arrow-back" style={{fontSize: FontSize(30), color: '#fff', marginRight: 10}} />
            </TouchableWithoutFeedback>
            <Text style={{color: '#fff', fontSize: FontSize(16), fontWeight: 'bold'}}>{this.props.nickname}我的收藏</Text>
          </View>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View style={{backgroundColor: '#fff', padding: 10}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.collection}
              keyExtractor={(item, index) => item.article_id.toString()}
              renderItem={({item, separators}) => 
                <HomeListitem item={item} />
              }
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
})