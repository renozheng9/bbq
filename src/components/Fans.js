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
import { api_user_beattention_user } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import UserListitem from './UserListitem';

@inject(["globalStore"])
@observer
export default class Fans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fans: [] // 关注用户数据集
    }
  }

  componentDidMount() {
    axios({
      url: api_user_beattention_user,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      params: {
        'id': this.props.userID
      }
    }).then(res => {
      let fans = [];
      for(let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].id = res.data.data[i].user_id;
        fans.push(res.data.data[i]);
      }
      this.setState({
        fans: fans
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
              <Icon name="ios-arrow-back" style={{fontSize: FontSize(40), color: '#fff'}} />
            </TouchableWithoutFeedback>
            <Text style={{color: '#fff', fontSize: FontSize(16), marginLeft: 10}}>{this.props.nickname}的粉丝</Text>
          </View>
        </Header>
        <Content style={{backgroundColor: '#EBEBEB'}}>
          <View>
            <FlatList
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => {return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)}}
              data={this.state.fans}
              keyExtractor={(item, index) => item.user_id.toString()}
              renderItem={({item, separators}) => 
                <UserListitem item={item} />
              }
            />
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})