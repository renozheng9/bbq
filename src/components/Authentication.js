import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Thumbnail, Form, Item, Input, Label } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { Encrypt } from '../util/Encrypt';
import { getSign, imei } from '../global/Param';
import { Actions } from 'react-native-router-flux';
import { strEnc } from '../util/Des';
import { api_lgd_index } from '../global/Api';

@inject(["globalStore"])
@observer
export default class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentID: '',
      card: ''
    }
  }
  componentDidMount() {
    // axios({
    //   url: api_lgd_index,
    //   method: 'GET',
    //   headers: {
    //     'sign': getSign(),
    //     'app_type': 'android',
    //     'did': imei
    //   }
    // })
    // .then(function(response) {
    //   Alert.alert(JSON.stringify(response));
    // })
    // .catch(function(error) {
    //   Alert.alert(error);
    // });
  }
  login = () => {
    // axios({
    //   url: api_lgd_index,
    //   method: 'GET',
    //   headers: {
    //     'sign': getSign(),
    //     'app_type': 'android',
    //     'did': imei
    //   }
    // })
    // .then(function(response) {
    //   Alert.alert(JSON.stringify(response));
    // })
    // .catch(function(error) {
    //   Alert.alert(error);
    // });
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
            <Text style={{fontSize: FontSize(24), textAlign: 'center'}}>{'完成理工学子身份认证'+'\n'+'开启全部用户权限'}</Text>
          </View>
          <View style={{paddingLeft: width * 0.1, paddingRight: width * 0.1}}>
            <Form>
              <Item inlineLabel style={{marginBottom: 20}}>
                <Label style={{color: '#7F7F7F'}}>学号</Label>
                <Input onChangeText={(studentID) => {this.setState({studentID: studentID})}} />
              </Item>
              <Item inlineLabel>
                <Label style={{color: '#7F7F7F'}}>身份证后六位</Label>
                <Input onChangeText={(card) => {this.setState({card: card})}}/>
              </Item>
              </Form>
              <Text style={{fontSize: FontSize(14), color: '#DCDCDC', marginTop: 8}}>作为理工大学子，认证之后，您可以使用BBQ所有功能</Text>
          </View>
          <View style={{alignItems: 'center', paddingTop: 40}}>
            <TouchableWithoutFeedback onPress={this.login}>
              <View style={{width: width * 0.8, paddingTop: 10, paddingBottom: 10, backgroundColor: '#53BFA2', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                <Text style={{fontSize: FontSize(20), color: '#fff', letterSpacing: 5}}>认证</Text>
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