import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  Picker
} from 'react-native';
import { Left, Right, Body, Icon, Button, Thumbnail, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_theme_beattention, api_attention_theme } from '../global/Api';

@inject(["globalStore"])
@observer
export default class ThemeListitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAttention: 0
    }
  }
  componentDidMount() {
    axios({
      url: api_theme_beattention + this.props.item.id,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      }
    }).then(res => {
      if(res.data.data.isAttention) {
        this.setState({
          isAttention: 1
        })
      }
    }).catch(err => {console.log(err)});
  }

  attend = () => {
    axios({
      url: api_attention_theme,
      method: this.state.isAttention ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      data: {
        'id': this.props.item.id
      }
    }).then(res => {
      if(res.data.status) {
        this.setState({
          isAttention: !this.state.isAttention
        })
      }
    }).catch(err => {console.log(err)});
  }

  render() {
    return(
      <View style={{backgroundColor: '#fff', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Thumbnail style={{width: width*0.1, height: width*0.1}} source={require('../images/person.png')} square />
          <View style={{maxWidth: width*0.7, marginLeft: 4}}>
            <Text style={{fontSize: FontSize(12)}} numberOfLines={1} ellipsizeMode="tail">{this.props.item.theme_name + this.props.item.theme_name}</Text>
            <Text style={{fontSize: FontSize(10)}} note>{this.props.item.theme_introduction}</Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.attend}>
          <View style={{padding: 5, backgroundColor: '#53BFA2', borderRadius: 5, display: this.props.item.id == this.props.globalStore.userInfo.id ? 'none' : 'flex'}}>
            <Text style={{color: '#fff', fontSize: FontSize(11)}}>{this.state.isAttention ? '已关注' : '+  关注'}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
})