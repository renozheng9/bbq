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
import { api_login, api_user_read } from '../global/Api';
import DeviceStorage from '../util/DeviceStorage';

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
        'app-type': Platform.OS,
        'did': imei
      }
    }).then(res => {
        DeviceStorage.saveString('token', res.data.data.token).then(data => 
          console.log(data)
        ).catch(err => console.log(err));
        this.setState.props.globalStore.updateToken(res.data.data.token);
        this.setState.props.globalStore.updateRole(1);
        axios({
          url: api_user_read, 
          method: 'GET',
          headers: {
            'sign': getSign(),
            'app-type': Platform.OS,
            'did': imei,
            'access-user-token': res.data.data.token
          }
        }).then(res => {
          let info = Decrypt(res.data.data);
          DeviceStorage.saveJsonObject('userInfo', JSON.parse(info)).then(data => {
          }).catch(err => console.log(err));
          this.props.globalStore.updateUserInfo(JSON.parse(info));
        }).catch(err => console.log(err));
        Actions.push('home');
    }).catch(err => console.log(err));
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
          <View style={styles.closeWrapper}>
            <TouchableWithoutFeedback onPress={Actions.home}>
              <Icon name="md-close" style={styles.closeIcon} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>理工生活从登录BBQ开始</Text>
          </View>
          <View style={styles.formWrapper}>
            <Form>
              <Item inlineLabel style={styles.phoneItem}>
                <Label style={styles.label}>手机号</Label>
                <Input onChangeText={(phone) => {this.setState({phone: phone})}} />
              </Item>
              <Item inlineLabel last>
                <Label style={styles.label}>验证码</Label>
                <Input onChangeText={(code) => {this.setState({code: code})}}/>
              </Item>
            </Form>
            <Code phone={this.state.phone} phone={this.state.phone} />
            <Text style={styles.tip}>新用户验证后自动注册账号登录，使用手机号登录的用户可进行部分操作</Text>
          </View>
          <View style={styles.btnWrapper}>
            <TouchableWithoutFeedback onPress={this.login}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>登录</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  closeWrapper: {
    paddingLeft: 10
  },
  closeIcon: {
    color: '#7F7F7F',
    fontSize: FontSize(30)
  },
  titleWrapper: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40
  },
  title: {
    fontSize: FontSize(24)
  },
  formWrapper: {
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1
  },
  phoneItem: {
    marginBottom: 20
  },
  label: {
    color: '#7F7F7F'
  },
  tip: {
    fontSize: FontSize(14),
    color: '#DCDCDC',
    marginTop: 8
  },
  btnWrapper: {
    alignItems: 'center',
    paddingTop: 40
  },
  btn: {
    width: width * 0.8,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#53BFA2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  btnText: {
    fontSize: FontSize(20),
    color: '#fff',
    letterSpacing: 5
  }
})