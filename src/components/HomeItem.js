import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  DeviceEventEmitter,
  Modal,
  Platform,
  ToastAndroid
} from 'react-native';
import { Text, Left, Right, Body, Icon, Thumbnail, Picker, ActionSheet, Textarea } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { domain } from '../global/Global';
import { api_upvote_article, api_report, api_article_becollection, api_collection_article, api_user_beattention, api_attention_user } from '../global/Api';

const imgWidth = width - width*0.08;

@inject(["globalStore"])
@observer
export default class HomeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAttention: false, // 是否关注该用户
      choice: '', // 二级菜单选择的内容
      modalVisible: false, // 模态框是否显示
      item: {...this.props.item, 'isUpvote': false}, // 列表数据集
      reason: '', // 举报理由
      options: ['加入收藏', '对该主题不感兴趣', '举报', '取消'],
      imgComponents: [] // 图片组件
    }
  }

  componentDidMount() {
    let imgComponents = [];
    for(let i = 0; i < this.props.item.article_img.length; i++) {
      imgComponents.push(<Image key={this.props.item.article_img[i]} source={{uri: `${domain}image/${this.props.item.article_img[i]}-80-100.png`}} style={styles.contentImg} />)
    }
    this.setState({
      imgComponents: imgComponents
    });
    this.listener = DeviceEventEmitter.addListener('updateArticle', (item) => { // 添加全局广播监听,监听是否需要同步自主题详情页修改的数据
      if(this.state.item.article_id == item.article_id) { // 因每个HomeListitem组件均添加了监听,故需要判断该item的article_id是否与主题详情页修改的item一致
        this.setState({
          item: item
        })
      }
    });
    axios({ // 获取当前item是否点赞
      url: api_upvote_article,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
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
    }).catch(err => console.log(err));
    axios({ // 获取是否被收藏
      url: api_article_becollection,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
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
    }).catch(err => console.log(err));
    axios({ // 获取是否关注该用户
      url: api_user_beattention + this.state.item.user_id,
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

  componentWillUnmount() {
    if(this.listener) { // 添加的监听需在该钩子内注销
      DeviceEventEmitter.removeAllListeners();
    }
  }

  upvote = () => { // 点赞
    let item = this.state.item;
    let isUpvote = item.isUpvote;
    if(isUpvote) {
      item.isUpvote = false;
      item.likes--;
    } else {
      item.isUpvote = true;
      item.likes++;
    }
    this.setState({
      item: item
    })
    axios({
      url: api_upvote_article,
      method: isUpvote ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.state.item.article_id
      }
    }).then(res => {
      
    }).catch(err => console.log(err));
  }

  attend = () => {
    let isAttention = this.state.isAttention;
    if(isAttention) {
      this.setState({
        isAttention: false
      })
    } else {
      this.setState({
        isAttention: true
      })
    }
    axios({
      url: api_attention_user,
      method: isAttention ? 'DELETE' : 'POST',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      },
      data: {
        'id': this.state.item.user_id
      }
    }).then(res => {

    }).catch(err => console.log(err));
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
                'app-type': Platform.OS,
                'did': imei,
                'access-user-token': this.props.globalStore.token
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
            }).catch(err => console.log(err));
            break;
          }
          case 1:break;
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
          'app-type': Platform.OS,
          'did': imei,
          'access-user-token': this.props.globalStore.token
        },
        data: {
          'content': this.state.reason,
          'reported_id': this.state.item.article_id,
          'type': 2 // 举报类型,2为动态
        }
      }).then(res => {
        if(res.data.status) {
          ToastAndroid.show('举报成功!', ToastAndroid.SHORT);
          this.setState({
            modalVisible: false
          })
        }
      }).catch(err => console.log(err));
    }
  }

  delete = () => {
    this.props.delete(this.props.item.article_id);
  }

  render() {
    return(
      <View style={styles.wrapper}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setState({modalVisible: false})}}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
            <View style={{width : width*0.9, borderRadius: 5, alignItems: 'flex-start', backgroundColor: '#fff'}}>
              <Textarea rowSpan={5} maxLength={50} placeholder="在此写下举报理由..." style={{fontSize: FontSize(14), color: '#888888'}} onChangeText={(text) => this.setState({reason: text})}></Textarea>
              <View style={{width: width*0.9, alignItems: 'flex-end', marginBottom: 5, paddingRight: 10}}>
                <Text style={{fontSize: FontSize(12), color: '#888888'}}>{this.state.reason.length}/50</Text>
              </View>
              <View style={{width: width*0.9, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 10}}>
                <TouchableWithoutFeedback onPress={() => {this.setState({modalVisible: false})}}>
                  <Text style={{fontSize: FontSize(14), color: '#53BFA2', marginRight: 15}}>取消</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={this.submit}>
                  <Text style={{fontSize: FontSize(14), color: '#53BFA2'}}>提交</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <TouchableWithoutFeedback onPress={() => {Actions.push('zone', {'user': this.props.item})}}>
            <View style={styles.infoWrapper}>
            <Thumbnail style={styles.avatar} source={this.props.item.user_avatar ? {uri: `${domain}image/${this.props.item.user_avatar}-50-100.png`} : require("../images/avatar.png")} />
              <View>
                <Text style={styles.nickname}>{this.props.item.user_nickname}</Text>
                <Text style={styles.createtime}>{this.props.item.create_time}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.attend}>
            <View style={styles.attentionWrapper}>
              <Text style={styles.attentionText}>{this.state.isAttention ? '已关注' : '+ 关注'}</Text>
            </View>
          </TouchableWithoutFeedback>
          {/* <TouchableWithoutFeedback onPress={this.choose}>
            <Icon name="md-arrow-dropdown" style={styles.dropdown}></Icon>
          </TouchableWithoutFeedback> */}
        </View>
        <TouchableWithoutFeedback onPress={() => {Actions.push('trendDetail', {'item': this.state.item})}}>
          <View style={styles.contentWrapper}>
            <Text numberOfLines={8} ellipsizeMode="tail" style={styles.contentText}>{this.props.item.article_content}</Text>
            <View style={styles.imgWrapper}>
              {this.state.imgComponents}
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.themeWrapper}>
          <Text style={styles.themename}>{this.props.item.theme_name}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.operations}>
            <TouchableWithoutFeedback onPress={() => {Actions.push('trendDetail', {'item': this.state.item})}}>
              <View style={styles.operation}>
                <Icon name="md-share" style={styles.operationIcon} />
                <Text style={styles.operationText}>转发</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {Actions.push('trendDetail', {'item': this.state.item})}}>
              <View style={styles.operation}>
                <Icon name="md-text" style={styles.operationIcon} />
                <Text style={styles.operationText}>评论</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.upvote}>
              <View style={styles.operation}>
                <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: this.state.item.isUpvote ? '#53BFA2' : '#666666', marginRight: 5}} />
                <Text style={styles.operationText}>{this.state.item.likes}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={this.choose}>
            <Text style={styles.operationText}>更多</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  operation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  wrapper: {
    padding: 10,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  createtime: {
    fontSize: FontSize(11),
    color: '#888888'
  },
  dropdown: {
    fontSize: FontSize(30),
    color: '#666666'
  },
  contentWrapper: {
    paddingTop: 5,
    paddingBottom: 5
  },
  contentText: {
    fontSize: FontSize(14),
    color: '#666666'
  },
  contentImg: {
    margin: width*0.02,
    width: width*0.25,
    height: width*0.25
  },
  bottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  authorWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: width*0.08,
    height: width*0.08,
    marginRight: 5
  },
  nickname: {
    fontSize: FontSize(13),
    color: '#666666'
  },
  operations: {
    flexDirection: 'row'
  },
  operationIcon: {
    fontSize: FontSize(14),
    color: '#666666',
    marginRight: 5
  },
  operationText: {
    fontSize: FontSize(14),
    color: '#666666'
  },
  attentionWrapper: {
    padding: 4,
    borderColor: '#53BFA2',
    borderWidth: 2,
    borderRadius: 4
  },
  attentionText: {
    fontSize: FontSize(12),
    color: '#53BFA2'
  },
  imgWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  themeWrapper: {
    alignItems: 'flex-start'
  },
  themename: {
    padding: 5,
    borderRadius: 5,
    borderColor: '#53BFA2',
    borderWidth: 2,
    color: '#53BFA2',
    fontSize: FontSize(12)
  }
})