import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { FontSize } from '../util/FontSize';
import{ width } from '../util/AdapterUtil';
import Reply from './Reply';
import axios from 'axios';
import { api_upvote_comment, api_accessToken } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import { domain } from '../global/Global';

@inject(["globalStore"])
@observer
export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [], // 回复列表
      modalVisible: false, // 模态框是否显示
      item: {...this.props.item, 'isUpvote': false} // 评论数据集
    }
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('updateComment', (item) => { // 添加全局广播监听,监听是否需要同步自回复item修改的数据
      for(let i = 0; i < this.state.list.length; i++) { // 因每个CommentItem组件均添加了监听,故需要判断该item的id是否与修改的回复item一致
        if(this.state.list[i].article_comment_id == item.article_comment_id) {
          let list = [...this.state.list];
          list[i].likes = item.likes;
          this.setState({
            list: list
          });
          break;
        }
      }
    });
    axios({ // 获取是否点赞
      url: api_upvote_comment,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      params: {
        'id': this.props.item.article_comment_id
      }
    }).then(res => {
      if(res.data.data.length != 0) {
        let item = this.state.item;
        item.isUpvote = true;
        this.setState({
          item: item
        })
      }
    }).catch(err => console.log(err))
    let item = this.props.item; // 按时间整理该评论下所有子评论(回复)
    let list = [];
    findSon = (obj, list) => {
      if(obj.hasOwnProperty('son')) {
        for(let i = 0; i < obj.son.length; i++) {
          obj.son[i].parent_nickname = obj.user_nickname;
          list.push(obj.son[i]);
          findSon(obj.son[i], list);
        }
      }
    }
    findSon(item, list);
    list.sort((a,b) => {
      return a.create_time < b.create_time ? 1 : -1;
    });
    this.setState({
      list: [...list]
    })
  }

  componentWillUnmount() {
    if(this.listener) { // 添加的监听需在该钩子内注销
      DeviceEventEmitter.removeAllListeners();
    }
  }

  upvote = () => { // 点赞
    axios({
      url: api_upvote_comment,
      method: this.state.item.isUpvote ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.props.item.article_comment_id
      }
    }).then(res => {
      if(res.data.status) {
        let item = this.state.item;
        if(this.state.item.isUpvote) {
          item.isUpvote = false;
          item.likes--;
        } else {
          item.isUpvote = true;
          item.likes++;
        }
        this.setState({
          item: item
        })
      }
    }).catch(err => console.log(err));
  }

  updateList = (item) => {
    let list = this.state.list;
    list.unshift(item);
    this.setState({
      list: list
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  render() {
    let reply = [];
    for(let i = 0; i < this.state.list.length; i++) {
      if(i == 2) {
        break;
      } else {
        reply.push(
          <View key={i} style={{flexDirection: 'row', alignItems: 'center', padding: 2}}>
            <Thumbnail source={this.state.list[i].user_avatar ? {uri: `${domain}image/${this.state.list[i].user_avatar}-50-100.png`} : require('../images/avatar.png')} style={{width: width*0.06, height: width*0.06, marginRight: 4}} />
            <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: FontSize(12), color: '#666666'}}>{this.state.list[i].user_nickname}: {this.state.list[i].article_comment_content}</Text>
          </View>
        )
      }
    }
    return (
      <View style={styles.wrapper}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setState({modalVisible: false})}}
        >
          <Reply close={this.closeModal} list={this.state.list} comment={this.props.item} article_id={this.props.article_id} pushList={this.updateList} />
        </Modal>
        <Thumbnail source={this.props.item.user_avatar ? {uri: `${domain}image/${this.props.item.user_avatar}-50-100.png`} : require('../images/avatar.png')} style={{width: width*0.1, height: width*0.1, marginRight: 5}} />
        <View style={{flex: 1}}>
          <View style={styles.info}>
            <Text style={styles.nickname}>{this.props.item.user_nickname}</Text>
            <Text style={styles.createtime}>{this.props.item.create_time}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.comment}>{this.props.item.article_comment_content}</Text>
            <Thumbnail square source={{uri: `${domain}image/${this.props.item.article_comment_img}-60-100.png`}} style={{width: width*0.2, height: width*0.2, marginTop: 5, display: this.props.item.article_comment_img ? 'flex' : 'none'}} />
          </View>
          <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: true})}}>
            <View style={[styles.replys, {display: this.state.list.length == 0 ? 'none' : 'flex'}]}>
              {
                reply.map((item, index) => {
                  return item
                })
              }
              <Text style={styles.more} onPress={() => {this.setState({modalVisible: true})}}>查看全部回复</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.operations}>
            <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: true})}}>
              <Icon name="md-text" style={styles.commentIcon} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.upvote}>
              <View style={styles.upWrapper}>
                <Icon name="md-thumbs-up" style={[styles.upIcon, {color: this.state.item.isUpvote ? '#53BFA2' : '#666666'}]} />
                <Text style={styles.likes}>{this.state.item.likes}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5
  },
  info: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  nickname: {
    fontSize: FontSize(13),
    color: '#666666'
  },
  createtime: {
    fontSize: FontSize(11),
    color: '#888888'
  },
  comment: {
    fontSize: FontSize(12),
    color: '#666666'
  },
  replys: {
    backgroundColor: '#EBEBEB',
    padding: 5,
    marginTop: 10,
    marginBottom: 10
  },
  more: {
    fontSize: FontSize(13),
    color: '#53BFA2'
  },
  operations: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  commentIcon: {
    fontSize: FontSize(14),
    color: '#666666',
    marginRight: 20
  },
  upWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  upIcon: {
    fontSize: FontSize(14),
    marginRight: 5
  },
  likes: {
    fontSize: FontSize(13),
    color: '#666666'
  }
})