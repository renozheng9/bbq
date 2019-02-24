import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  ImageBackground,
  Platform,
  TouchableWithoutFeedback,
  ViewPagerAndroid
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Left, Right, Body, Icon, Thumbnail, Form, Item, Label, Input, Textarea } from 'native-base';
import { width } from '../util/AdapterUtil';
import { FontSize } from '../util/FontSize';
import axios from 'axios';
import { api_user_collection } from '../global/Api';
import { getSign, imei } from '../global/Param';
import { inject, observer } from 'mobx-react';
import HomeItem from './HomeItem';

@inject(["globalStore"])
@observer
export default class Collection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [] // 收藏动态数据集
    }
  }

  componentDidMount() {
    axios({ // 获取用户收藏的动态
      url: api_user_collection,
      method: 'GET',
      headers: {
        'sign': getSign(),
        'app-type': Platform.OS,
        'did': imei,
        'access-user-token': this.props.globalStore.token
      }
    }).then(res => {
      this.setState({
        collection: [...res.data.data]
      })
    }).catch(err => console.log(err));
  }

  _renderSeparator = () => {
    return (<View style={{ height: 1, backgroundColor: '#AEAEAE' }}></View>)
  }

  _renderListItem = ({item, separators}) => {
    return (<HomeItem item={item} />)
  }

  render() {
    return (
      <Container>
        {/* {Platform === 'android' && (<StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />)} */}
        <StatusBar barStyle="light-content" hidden={false} translucent={false} backgroundColor="transparent" />
        <Header
          androidStatusBarColor="#53BFA2"
          style={styles.header}
        >
          <TouchableWithoutFeedback onPress={() => {Actions.pop()}}>
            <Icon name="ios-arrow-back" style={styles.backIcon} />
          </TouchableWithoutFeedback>
          <Text style={styles.title}>{this.props.nickname}我的收藏</Text>
        </Header>
        <Content style={styles.content}>
          <FlatList
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this._renderSeparator}
            data={this.state.collection}
            keyExtractor={(item, index) => item.article_id.toString()}
            renderItem={this._renderListItem}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent:'flex-start',
    alignItems: 'center',
    backgroundColor: '#53BFA2'
  },
  backIcon: {
    fontSize: FontSize(30),
    color: '#fff',
    marginRight: 10
  },
  title: {
    color: '#fff',
    fontSize: FontSize(16),
    fontWeight: 'bold'
  },
  content: {
    backgroundColor: '#EBEBEB'
  }
})