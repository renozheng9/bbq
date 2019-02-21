import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ToastAndroid
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { FontSize } from '../util/FontSize';
import { width } from '../util/AdapterUtil';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-crop-picker';
import { observer, inject } from 'mobx-react';
import { api_accessToken, api_feedback_type, api_feedback_submit } from '../global/Api';
import axios from 'axios';
import { getSign, imei } from '../global/Param';

@inject("globalStore")
@observer
export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackType: [],
      advice: '',
      flag: true,
      typeID: '',
    }
  }
  componentDidMount() {
    axios({
      url: api_feedback_type,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      }
    }).then(res => {
      res.data.data.map((item, index) => {
        item['isSelect'] = false;
      });
      this.setState({feedbackType: [...res.data.data]});
    }).catch(err => {console.log(err)});
  }
  select = (index) => {
    if(this.state.flag || this.state.feedbackType[index].isSelect) {
      if(!this.state.feedbackType[index].isSelect) {
        this.setState({typeID: index + 1});
      }
      let feedbackType = this.state.feedbackType;
      feedbackType[index].isSelect = !feedbackType[index].isSelect;
      this.setState({feedbackType: feedbackType});
      this.setState({flag: !this.state.flag});
    } else {
      return;
    }
  }
  submit = () => {
    axios({
      url: api_feedback_submit,
      method: 'POST',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      data: {
        'content': this.state.advice,
        'feedback_type_id': this.state.typeID
      }
    }).then(res => {
      Alert.alert('提交成功!');
    }).catch(err => {console.log(err)});
  }
  render() {
    return (
      <Container>
        {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)}
        <Header
          androidStatusBarColor="#53BFA2"
          style={{height: 50, flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', backgroundColor: '#53BFA2'}}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={{fontSize: FontSize(24), color: '#fff'}} />
          </TouchableWithoutFeedback>
          <Text style={{fontSize: FontSize(16), color: '#fff', fontWeight: 'bold'}}>意见反馈</Text>
          <TouchableWithoutFeedback onPress={() => (this.state.flag || this.state.advice == '') ? ToastAndroid.show('反馈类型或反馈意见不能为空!', ToastAndroid.SHORT) : this.submit()}>
            <Text style={{fontSize: FontSize(14), color: '#fff', fontWeight: 'bold'}}>提交</Text>
          </TouchableWithoutFeedback>
        </Header>
        <Content style={{backgroundColor: '#fff'}}>
          <View style={{padding: 10}}>
            <Text style={{fontSize: FontSize(16), color: '#898989', fontWeight: 'bold'}}>反馈类型</Text>
            <View style={{flexDirection: 'row', paddingTop: 10}}>
              {this.state.feedbackType.map((item, index) => {
                return (
                  <TouchableWithoutFeedback key={index} onPress={() => this.select(index)}>
                    <View style={{padding: 5, margin: 4, borderRadius: 5, borderWidth: 2, borderColor: '#53BFA2', backgroundColor: this.state.feedbackType[index].isSelect == true ? '#53BFA2' : '#fff'}}>
                      <Text style={{fontSize: FontSize(15), color: this.state.feedbackType[index].isSelect == true ? '#fff' : '#B2B2B2'}}>{item.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                )
              })}
            </View>
          </View>
          <View>
            <Text style={{fontSize: FontSize(16), color: '#898989', fontWeight: 'bold', marginLeft: 10}}>反馈内容</Text>
          <Form>
            <Textarea rowSpan={7} placeholder="在此写下你的意见..." style={{color: '#B2B2B2'}} onChangeText={(text) => this.setState({advice: text})}></Textarea>
          </Form>
          </View>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({

})