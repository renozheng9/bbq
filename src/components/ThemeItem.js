import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Alert,
  Image,
  FlatList,
  TouchableHighlight,
  ViewPagerAndroid,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { unitWidth, width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_isUpvote, api_upvote } from '../global/Api';

@inject("globalStore", "themeStore")
export default class ThemeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpvote: 0,
      likes: this.props.item.likes,
      choice: ''
    }
  }
  componentDidMount() {
    axios({
      url: api_isUpvote + this.props.item.article_id,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      }
    })
    .then((response) => {
      this.setState({
        isUpvote: response.data.data.isUpvote
      })
    })
    .catch((error) => {
      Alert.alert(error);
    });
  }
  upvote = () => {
    if(this.state.isUpvote == 1) {
      axios({
        url: api_upvote,
        method: 'DELETE',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        },
        data: {
          'id': this.props.item.article_id
        }
      })
      .then((response) => {
        this.setState({
          isUpvote: !this.state.isUpvote,
          likes: this.state.likes - 1
        })
      })
      .catch((error) => {
        Alert.alert(error);
      });
    } else {
      axios({
        url: api_upvote,
        method: 'POST',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        },
        data: {
          'id': this.props.item.article_id
        }
      })
      .then((response) => {
        this.setState({
          isUpvote: !this.state.isUpvote,
          likes: this.state.likes + 1
        })
      })
      .catch((error) => {
        Alert.alert(error);
      });
    }
  }
  render() {
    return (
      <View style={{padding: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <Thumbnail style={{width: width*0.07, height: width*0.07, marginRight: width*0.01}} source={require("../images/avatar.png")} />
            <View>
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.user_nickname}</Text>
              <Text style={{fontSize: FontSize(11), color: '#888888'}}>{this.props.item.create_time}</Text>
            </View>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Picker
              mode={"dropdown"}
              selectedValue={this.state.choice}
              style={{height: width*0.04, width: width*0.04}}
              onValueChange={(itemValue, itemIndex) => this.setState({choice: itemValue})}>
              <Picker.Item label="加入收藏" value="collect" />
              <Picker.Item label="对该主题不感兴趣" value="dislike" />
              <Picker.Item label="举报" value="report" />
            </Picker>
          </View>
        </View>
        <View style={{marginTop: 5}}>
          <Text style={{fontSize: FontSize(12), color: '#404040'}}>{this.props.item.content}</Text>
        </View>
        <View style={[styles.operations, {marginTop: 5}]}>
          <TouchableWithoutFeedback>
            <View style={styles.operation}>
              <Icon name="md-share" style={{fontSize: FontSize(14), color: '#666666', marginRight: 2}} />
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>转发</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={styles.operation}>
              <Icon name="md-text" style={{fontSize: FontSize(14), color: '#666666', marginRight: 2}} />
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>评论</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.upvote}>
            <View style={styles.operation}>
              <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: (this.state.isUpvote == 0) ? '#666666' : '#53BFA2', marginRight: 2}} />
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.likes}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoWrapper: {
    flexDirection: 'row'
  },
  themeAvatar: {
    width: 60,
    height: 60,
    marginRight: 5,
    borderRadius: 6
  },
  themename: {
    fontSize: 18,
    marginTop: 6,
    color: '#666666'
  },
  date: {
    fontSize: 16,
    color: '#888888'
  },
  btns: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1.8,
    borderColor: '#53BFA2',
    borderRadius: 5
  },
  isShow: {
    display: 'none'
  },
  starText: {
    fontSize: 14,
    color: '#53BFA2'
  },
  contentWrapper: {
    paddingLeft: 62
  },
  content: {
    marginBottom: 8,
    fontSize: 16,
    color: '#404040'
  },
  tipWrapper: {
    marginTop: 6,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  tip: {
    padding: 5,
    borderWidth: 2,
    borderColor: '#53BFA2',
    borderRadius: 8,
    fontSize: 16,
    color: '#53BFA2',
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  origin: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25
  },
  username: {
    fontSize: 16,
    color: '#666666'
  },
  operations: {
    flexDirection: 'row',
  },
  operation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  share: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666'
  },
  sms: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666' 
  },
  like: {
    paddingLeft: 4,
    fontSize: 16,
    color: '#666666'
  }
})