import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Thumbnail, Form, Item, Input, Label } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import Code from './Code';
import axios from 'axios';
import { Encrypt, Decrypt } from '../util/Encrypt';
import { getSign, imei } from '../global/Param';
import { Actions } from 'react-native-router-flux';
import { api_login } from '../global/Api';

@inject(["globalStore"])
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: ''
    }
  }
  login = () => {
    axios({
      url: api_login,
      method: 'POST',
      data: {
        'phone': this.state.phone,
        'code': this.state.code
      },
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei
      }
    }).then(res => {
      Actions.push('home');
    }).catch(err => {console.log(err)});
  }
  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        {/* <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 80, justifyContent:'flex-start', backgroundColor: '#53BFA2'}}
        >
        </Header> */}
        <Content>
          <View style={{paddingLeft: 10}}>
            <TouchableWithoutFeedback onPress={Actions.home}>
              <Icon name="md-close" style={{color: '#7F7F7F', fontSize: FontSize(30)}} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{alignItems: 'center', paddingTop: 80, paddingBottom: 40}}>
            <Text style={{fontSize: FontSize(24)}}>理工生活从登录BBQ开始</Text>
          </View>
          <View style={{paddingLeft: width * 0.1, paddingRight: width * 0.1}}>
            <Form>
              <Item inlineLabel style={{marginBottom: 20}}>
                <Label style={{color: '#7F7F7F'}}>手机号</Label>
                <Input onChangeText={(phone) => {this.setState({phone: phone})}} />
              </Item>
              <Item inlineLabel last>
                <Label style={{color: '#7F7F7F'}}>验证码</Label>
                <Input onChangeText={(code) => {this.setState({code: code})}}/>
              </Item>
            </Form>
            <Code phone={this.state.phone} phone={this.state.phone} />
            <Text style={{fontSize: FontSize(14), color: '#DCDCDC', marginTop: 8}}>新用户验证后自动注册账号登录，使用手机号登录的用户可进行部分操作</Text>
          </View>
          <View style={{alignItems: 'center', paddingTop: 40}}>
            <TouchableWithoutFeedback onPress={this.login}>
              <View style={{width: width * 0.8, paddingTop: 10, paddingBottom: 10, backgroundColor: '#53BFA2', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                <Text style={{fontSize: FontSize(20), color: '#fff', letterSpacing: 5}}>登录</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

})