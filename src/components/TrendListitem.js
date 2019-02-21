import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  Modal,
  ToastAndroid
} from 'react-native';
import { Text, Left, Right, Body, Icon, Thumbnail, Picker, ActionSheet, Textarea } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_upvote, api_isUpvote, api_report, api_article_becollection, api_collection_article } from '../global/Api';

const imgWidth = width - width*0.08;

@inject(["globalStore"])
@observer
export default class TrendListitem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choice: '', // 二级菜单选择的内容
      modalVisible: false, // 模态框是否显示
      item: this.props.item,  // 列表数据集
      reason: '', // 举报理由
      options: ["加入收藏", "对该主题不感兴趣", "举报", "取消"]
    }
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('update', (item) => { // 添加全局广播监听,监听是否需要同步自主题详情页修改的数据
      if(this.state.item.article_id == item.article_id) { // 因每个TrendListitem组件均添加了监听,故需要判断该item的article_id是否与主题详情页修改的item一致
        this.setState({
          item: item
        })
      }
    });
    axios({ // 获取当前item是否点赞
      url: api_isUpvote,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      params: {
        'id': this.state.item.article_id
      }
    }).then(res => {
      if(res.data.data.length != 0) {
        let item = this.state.item;
        item.isUpvote = 1;
        this.setState({
          item: item
        })
      }
    }).catch(err => {console.log(err)});
    axios({ // 获取是否被收藏
      url: api_article_becollection,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app_type': 'android',
        'did': imei,
        'access_user_token': this.props.globalStore.token
      },
      params: {
        'id': this.state.item.article_id
      }
    }).then(res => {
      if(res.data.data.isCollection) { // 已收藏,更新状态
        this.setState({
          options: ['取消收藏', '对该主题不感兴趣', '举报', '取消']
        })
      }
    }).catch(err => {console.log(err)});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      item: nextProps.item
    })
  }

  componentWillUnmount() {
    if(this.listener) { // 添加的监听需在该钩子内注销
      DeviceEventEmitter.removeAllListeners();
    }
  }

  upvote = () => { // 点赞
    if(this.state.item.isUpvote == 1) { // 若已点赞,取消点赞
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
          'id': this.state.item.article_id
        }
      }).then(res => {
        if(res.data.status) {
          let item = this.state.item;
          item.likes--;
          item.isUpvote = 0;
          this.setState({
            item: item
          });
          this.props.update(item);
        }
      }).catch(err => {console.log(err)});
    } else { // 若未点赞,则点赞
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
          'id': this.state.item.article_id
        }
      }).then(res => {
        if(res.data.status) {
          let item = this.state.item;
          item.likes++;
          item.isUpvote = 1;
          this.setState({
            item: item
          });
          this.props.update(item);
        }
      }).catch(err => {console.log(err)});
    }
  }

  choose = () => { // 二级菜单选择
    ActionSheet.show(
      {
        options: this.state.options,
        cancelButtonIndex: 3
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0: {
            axios({ // 加入收藏&取消收藏
              url: api_collection_article,
              method: this.state.options[0] == '加入收藏' ? 'POST' : 'DELETE', // 根据options[0]判断该次操作为加入还是取消
              headers: {
                'sign': getSign(),
                'app_type': 'android',
                'did': imei,
                'access_user_token': this.props.globalStore.token
              },
              data: {
                'id': this.state.item.article_id
              }
            }).then(res => {
              if(res.data.status) {
                let options = this.state.options;
                ToastAndroid.show(options[0] + '成功!', ToastAndroid.SHORT);
                options[0] = options[0] == '加入收藏' ? '取消收藏' : '加入收藏';
                this.setState({
                  options: options
                })
              }
            }).catch(err => {console.log(err)});
            break;
          }
          case 1:;break;
          case 2: { // 选择举报选项,弹出举报模态框
            this.setState({
              modalVisible: true
            });
            break;
          }
        }
      }
    )
  }

  submit = () => { // 提交举报理由
    if(this.state.reason == '') { // 举报理由为空提示
      ToastAndroid.show('举报理由不能为空!', ToastAndroid.SHORT);
    } else { // 举报理由不为空,提交举报理由
      axios({
        url: api_report,
        method: 'POST',
        headers: {
          'sign': getSign(),
          'app_type': 'android',
          'did': imei,
          'access_user_token': this.props.globalStore.token
        },
        data: {
          'content': this.state.reason,
          'reported_id': this.state.item.article_id,
          'type': 2
        }
      }).then(res => {
        if(res.data.status) {
          ToastAndroid.show('举报成功!', ToastAndroid.SHORT);
          this.setState({
            modalVisible: false
          })
        }
      }).catch(err => {console.log(err)});
    }
  }

  render() {
    return(
      <View style={styles.item}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{width: width*0.9, borderRadius: 5, alignItems: 'flex-start', backgroundColor: '#fff', padding: 10}}>
              <View style={{width: width*0.9, alignItems: 'center'}}>
                <Text style={{fontSize: FontSize(20), color: '#666666', fontWeight: 'bold'}}>举报</Text>
              </View>
              <Textarea rowSpan={5} maxLength={50} placeholder="在此写下举报理由..." style={{fontSize: FontSize(16), color: '#888888'}} onChangeText={(text) => this.setState({reason: text})}></Textarea>
              <View style={{width: width*0.83, alignItems: 'flex-end'}}>
                <Text style={{fontSize: FontSize(16), color: '#888888'}}>{this.state.reason.length}/50</Text>
              </View>
              <View style={{width: width*0.85, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10}}>
                <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: false})}}>
                  <Text style={{fontSize: FontSize(18), color: '#53BFA2', marginRight: 15}}>取消</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.submit}>
                  <Text style={{fontSize: FontSize(18), color: '#53BFA2'}}>提交</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableWithoutFeedback onPress={() => {
            this.state.item.type == 'theme' ?
            Actions.push('themeDetail', {'themeID': this.props.item.theme_id, 'themeName': this.props.item.theme_name, 'themeIntroduction': this.props.item.theme_introduction})
            :
            Actions.push('zone', {'userID': this.props.item.user_id, 'nickname': this.props.item.user_nickname, 'avatar': this.props.item.user_avatar})
          }}>
            <View style={{flexDirection: 'row'}}>
              <Thumbnail square={this.state.item.type == 'theme' ? true : false} style={{width: width*0.07, height: width*0.07, marginRight: width*0.01}} source={require("../images/person.png")} />
              <View>
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.item.type == 'theme' ? this.state.item.theme_name : this.state.item.user_nickname}</Text>
                <Text style={{fontSize: FontSize(11), color: '#888888'}}>{this.state.item.create_time}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{justifyContent: 'center'}}>
            <TouchableWithoutFeedback onPress={() => this.choose()}>
              <Icon name="md-arrow-dropdown" style={{fontSize: FontSize(30), color: '#666666'}}></Icon>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={{paddingLeft: width*0.08}}>
          <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.item.content}</Text>
          <View>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={[{source: '../images/person.png', key: 'item1'},{source: 'search', key: 'item2'},{source: 'search', key: 'item3'}]}
              renderItem={({item, separators}) => (
                <Image source={require("../images/person.png")} style={{margin: imgWidth*0.005, width: imgWidth*0.3, height: imgWidth*0.3}} />
              )}
            />
          </View>
        </View>
        <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableWithoutFeedback onPress={() => {
            this.state.item.type == 'theme' ?
            Actions.push('zone', {'userID': this.props.item.user_id, 'nickname': this.props.item.user_nickname, 'avatar': this.props.item.user_avatar})
            :
            Actions.push('themeDetail', {'themeID': this.props.item.theme_id, 'themeName': this.props.item.theme_name, 'themeIntroduction': this.props.item.theme_introduction})
          }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Thumbnail square={this.state.item.type == 'theme' ? false : true} style={{width: width*0.06, height: width*0.06, marginRight: width*0.01}} source={require("../images/person.png")} />
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.item.type == 'theme' ? this.state.item.user_nickname : this.state.item.theme_name}</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.operations}>
            <TouchableWithoutFeedback>
              <View style={styles.operation}>
                <Icon name="md-share" style={{fontSize: FontSize(14), color: '#666666', marginRight: 2}} />
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>转发</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {console.warn(this.state.item)}}>
              <View style={styles.operation}>
                <Icon name="md-text" style={{fontSize: FontSize(14), color: '#666666', marginRight: 2}} />
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>评论</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.upvote()}>
              <View style={styles.operation}>
                <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: (this.state.item.isUpvote == 1) ? '#53BFA2' : '#666666', marginRight: 2}} />
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.state.item.likes}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    backgroundColor: '#fff'
  },
  operations: {
    flexDirection: 'row',
  },
  operation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  }
})