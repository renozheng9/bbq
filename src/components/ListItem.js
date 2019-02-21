import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Picker
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import { getSign, imei } from '../global/Param';
import { api_upvote } from '../global/Api';

const imgWidth = width - width*0.08;
@inject("globalStore", "listStore")
@observer
export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpvote: 0,
      choice: ''
    }
  }
  componentDidMount() {
  }
  upvote = () => {
    if(this.props.item.isUpvote == 1) {
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
      }).then(response => {
        this.props.listStore.upvote(this.props.item.article_id, 1);
      }).catch(error => {console.log(error)});
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
      }).then(response => {
        this.props.listStore.upvote(this.props.item.article_id, 0);
      }).catch(error => {console.log(error)});
    }
  }
  render() {
    if(this.props.page == 'home') {
    return(
      <View style={styles.item}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableWithoutFeedback onPress={() => {Actions.push('themeDetail', {'themeName': this.props.item.theme_name, 'themeIntroduction': this.props.item.theme_introduction}); this.props.listStore.updateThemeID(this.props.item.theme_id)}}>
              <Thumbnail style={{width: width*0.07, height: width*0.07, marginRight: width*0.01, borderRadius: width*0.01}} source={require("../images/person.png")} />
            </TouchableWithoutFeedback>
            <View>
              <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.theme_name}</Text>
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
        <View style={{paddingLeft: width*0.08}}>
          <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.content}</Text>
          <View style={styles.imageWrapper}>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Thumbnail style={{width: width*0.06, height: width*0.06, marginRight: width*0.01}} source={require("../images/person.png")} />
            <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.user_nickname}</Text>
          </View>
          <View style={styles.operations}>
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
            <TouchableWithoutFeedback onPress={() => this.upvote()}>
              <View style={styles.operation}>
                <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: (this.props.item.isUpvote == 0) ? '#666666' : '#53BFA2', marginRight: 2}} />
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.likes}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
    } else if(this.props.page == 'themeDetail') {
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
            <TouchableWithoutFeedback onPress={() => this.upvote()}>
              <View style={styles.operation}>
                <Icon name="md-thumbs-up" style={{fontSize: FontSize(14), color: (this.props.item.isUpvote == 0) ? '#666666' : '#53BFA2', marginRight: 2}} />
                <Text style={{fontSize: FontSize(13), color: '#666666'}}>{this.props.item.likes}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
      </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  item: {
    paddingTop: 10,
    paddingBottom: 10
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