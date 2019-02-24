import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ToastAndroid,
  TouchableWithoutFeedback
} from 'react-native';
import { Text } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { Encrypt } from '../util/Encrypt';
import { getSign, imei } from '../global/Param';
import { api_code } from '../global/Api';
import { isPhoneAvailable } from '../util/Function';

export default class Code extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '获取验证码',
      time: 60
    };
    this.timer = null;
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateText = () => {
    if(this.state.text == '获取验证码') {
      if(isPhoneAvailable(this.props.phone)) {
        axios({
          url: api_code,
          method: 'POST',
          data: {
            'id': this.props.phone
          },
          headers: {
            'sign': getSign(),
            'app-type': Platform.OS,
            'did': imei
          }
        }).then(res => {
          console.log(res);
        }).catch(err => console.log(err));
        let time = this.state.time;
        let text = this.state.text;
        this.setState({
          text: text + '(' + time + 's)',
          time: time
        });
        this.timer = setInterval(() => {
          if(time === 0) {
            clearInterval(this.timer);
            this.setState({
              text: '获取验证码',
              time: 60
            })
          } else {
            time--;
            this.setState({
              text: text + '(' + time + 's)',
              time: time
            });
          }
        }, 1000);
      } else {
        ToastAndroid.show('输入的手机号不合法!', ToastAndroid.SHORT);
      }
    } else {
      return;
    }
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={this.updateText}>
          <Text style={{color: this.state.text == '获取验证码' ? '#75CEB1' : '#D8F1E9'}}>{this.state.text}</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 10
  }
})