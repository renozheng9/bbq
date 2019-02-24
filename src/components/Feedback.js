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
import { observer, inject } from 'mobx-react';
import { api_accessToken, api_feedback_type, api_feedback_submit } from '../global/Api';
import axios from 'axios';
import { getSign, imei } from '../global/Param';

@inject(["globalStore"])
@observer
export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedbackType: [], // 反馈类型列表
      advice: '', // 反馈意见
      flag: true,
      typeID: '', // 反馈类型id
    }
  }
  componentDidMount() {
    axios({
      url: api_feedback_type,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      }
    }).then(res => {
      res.data.data.map((item, index) => {
        item['isSelect'] = false;
      });
      this.setState({feedbackType: [...res.data.data]});
    }).catch(err => console.log(err));
  }
  select = (index) => {
    let feedbackType = this.state.feedbackType;
    if(this.state.feedbackType[index].isSelect) {
      return;
    } else {
      for(let i = 0; i < this.state.feedbackType.length; i++) {
        if(i == index) {
          feedbackType[i].isSelect = true;
        } else {
          feedbackType[i].isSelect = false;
        }
      }
      this.setState({
        feedbackType: feedbackType
      })
    }
  }
  submit = () => {
    axios({
      url: api_feedback_submit,
      method: 'POST',
      headers: {
        'sign': getSign(),
        'app-type': 'android',
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'content': this.state.advice,
        'feedback_type_id': this.state.typeID
      }
    }).then(res => {
      if(res.data.status) {
        ToastAndroid.show('提交反馈成功!', ToastAndroid.SHORT);
      }
    }).catch(err => console.log(err));
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
          <Text style={styles.title}>意见反馈</Text>
          <TouchableWithoutFeedback onPress={() => (this.state.flag || this.state.advice == '') ? ToastAndroid.show('反馈类型或反馈意见不能为空!', ToastAndroid.SHORT) : this.submit()}>
            <Text style={styles.submit}>提交</Text>
          </TouchableWithoutFeedback>
        </Header>
        <Content style={styles.content}>
          <View style={styles.wrapper}>
            <Text style={styles.typeText}>反馈类型</Text>
            <View style={styles.typeWrapper}>
              {
                this.state.feedbackType.map((item, index) => {
                  return (
                    <TouchableWithoutFeedback key={index} onPress={() => this.select(index)}>
                      <View style={[styles.btn, {backgroundColor: this.state.feedbackType[index].isSelect == true ? '#53BFA2' : '#fff'}]}>
                        <Text style={[styles.btnText, {color: this.state.feedbackType[index].isSelect == true ? '#fff' : '#B2B2B2'}]}>{item.name}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )
                })
              }
            </View>
          </View>
          <View>
            <Text style={styles.feedbackText}>反馈内容</Text>
          <Form>
            <Textarea rowSpan={7} placeholder="在此写下你的意见..." style={styles.textarea} onChangeText={(text) => this.setState({advice: text})}></Textarea>
          </Form>
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
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  backIcon: {
    fontSize: FontSize(24),
    color: '#fff'
  },
  title: {
    fontSize: FontSize(16),
    color: '#fff',
    fontWeight: 'bold'
  },
  submit: {
    fontSize: FontSize(14),
    color: '#fff',
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#fff'
  },
  wrapper: {
    padding: 10
  },
  typeText: {
    fontSize: FontSize(16),
    color: '#898989',
    fontWeight: 'bold'
  },
  typeWrapper: {
    flexDirection: 'row',
    paddingTop: 10
  },
  btn: {
    padding: 5,
    margin: 4,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#53BFA2'
  },
  btnText: {
    fontSize: FontSize(15)
  },
  feedbackText: {
    fontSize: FontSize(16),
    color: '#898989',
    fontWeight: 'bold',
    marginLeft: 10
  },
  textarea: {
    color: '#B2B2B2'
  }
})