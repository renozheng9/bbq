import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';
import { Text, Left, Right, Body, Icon, Button, Thumbnail, ListItem } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_user_beattention, api_attention_user } from '../global/Api';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class UserItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAttention: 0
    }
  }
  componentDidMount() {
    axios({
      url: api_user_beattention + this.props.item.id,
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

  attend = () => {
    axios({
      url: api_attention_user,
      method: this.state.isAttention ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
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
    }).catch(err => console.log(err));
  }

  render() {
    return(
      <View style={{backgroundColor: '#fff', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Thumbnail style={{width: width*0.1, height: width*0.1}} source={this.props.item.user_avatar ? {uri: `${domain}image/${this.props.item.user_avatar}-60-100.png`} : require('../images/avatar.png')} />
          <View style={{marginLeft: 4}}>
            <Text style={{fontSize: FontSize(12)}}>{this.props.item.user_nickname}</Text>
            <Text style={{fontSize: FontSize(10)}} note>{this.props.item.user_signature}</Text>
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